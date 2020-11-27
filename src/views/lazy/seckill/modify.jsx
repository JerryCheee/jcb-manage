import React,{useMemo,useEffect} from 'react'
import SearchSelect from '../../../components/formItem/searchSelect'

import { Form, Input, DatePicker, InputNumber, message, Radio, Button } from "antd";
import api from '../../../api/seckill'
import productApi from '../../../api/product'
import styled from 'styled-components'
import SufixTip from '../../../components/styled/sufixTip'
import moment from 'moment'
const Item = Form.Item
const RangePicker = DatePicker.RangePicker

const MultLineRow = styled.div`
  display:flex;
  flex-wrap:wrap;
  margin-left:8%;
`

const SkuCard = styled.div`
  display:flex;
  flex-direction:column;
  width:200px;
  margin-right:20px;
  margin-bottom:20px;
  padding: 10px;
  padding-top:15px;
  box-shadow: 0 0 2px rgb(0 0 0 / 24%);
  img{
   width: 80px;
   height: 80px;
   margin:auto
  }
  &>*:not(.ant-row){
    margin-bottom:15px;
    text-align:center;
  }
  
`

const StaticImg = ({ value, onChange }) => <img src={value} alt="规格图片" />
const StaticInput = ({ value, onChange, prefix = '' }) => <div>{`${prefix + value}`}</div>

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 6 },
}

const priceLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const rules = {
  name: [{ required: true, message: "请输入活动名称" }],
  rangeTime: [{ required: true, message: "请指定活动时间" }],
  product_id: [{ required: true, message: "请绑定一个商品" }],
  spike_price: [{ required: true, message: "请输入秒杀" }],
  limited_quantity: [{ required: true, message: "请输入限购数量" }],

}

const getProductSkuList = async (id, form) => {
  let res = await productApi.getDetail(id)
  if (res.code) return message.error(res.msg)
  let skuList = res.data.product_sku_list || []
  //eslint-disable-next-line
  skuList = skuList.map(v => (v.spike_price = undefined, v))
  form.setFieldsValue({ sku_list: skuList })
}



const buildDynamicFields = (field, index) => (
  <SkuCard key={field.key} >
    <Item
      noStyle
      name={[field.name, 'image_url']}
    >
      <StaticImg />
    </Item>
    <Item noStyle name={[field.name, "name"]} >
      <StaticInput />
    </Item>
    <Item noStyle name={[field.name, "price"]}>
      <StaticInput prefix="¥ " />
    </Item>
    <Item name={[field.name, "sku_id"]} hidden>
      <StaticInput />
    </Item>
    <Item label="秒杀价" {...priceLayout} required>
      <Item noStyle name={[field.name, "spike_price"]} rules={rules.spike_price}  >
        <InputNumber min={0.1} />
      </Item>
      <SufixTip>元</SufixTip>
    </Item>

  </SkuCard>
)

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}
const values2Data = values => {
  const { rangeTime: [start, end], product_id } = values;
  values.start_time = start.format('YYYY-MM-DD HH:mm:ss')
  values.end_time = end.format('YYYY-MM-DD HH:mm:ss')

  const takeNeed = v => ({ sku_id: v.sku_id, product_id, spike_price: v.spike_price })
  values.activities_sku_list = values.sku_list.map(takeNeed)

  const ignoreKeys = ['rangeTime', 'sku_list']
  ignoreKeys.forEach(k => values[k] = undefined)

  return values;
}

export default function ModifySeckill({ location, history }) {
  const { state = {} } = location;
  const { editData } = state;
  const isEdit = editData !== undefined
  const [form] = Form.useForm()

  const defaultOptions = useMemo(() => {
    if (!editData) return []
    const {product_id:id,product_name:name}=editData
    return [{id,name}]
  }, [editData])

  useEffect(() => {
    if (!isEdit) return;
    let {  start_time, end_time } = editData
    let rangeTime = [moment(start_time), moment(end_time)]
    let sku_list=editData.activities_sku_list
    form.setFieldsValue({ ...editData, rangeTime ,sku_list})
  //eslint-disable-next-line
  }, [])

  const handleValueChange = (ed) => {
    if (ed.product_id) return getProductSkuList(ed.product_id, form)
  }

  const onSubmit = async () => {
    let hasErr = false
    let values = await form.validateFields().catch(e => hasErr = true)
    if (hasErr) return;
    values = values2Data(values)
    let res = isEdit
      ? await api.edit((values.id = editData.id, values))
      : await api.add(values)

    if (res.code) return message.error(res.msg)
    message.success(res.msg)
    history.replace('index', { modifyed: true })
  }

  return (
    <Form
      {...layout}
      form={form}
      name='activity'
      onValuesChange={handleValueChange}
    >
      <Item label="活动名称" name="name" rules={rules.title}><Input /></Item>
      
      <Item label="限购数量" name="limited_quantity" rules={rules.limited_quantity} >
        <InputNumber min={0} style={{ width: 'min(200px,50%)' }} />
      </Item>
      <Item label="活动时间" name="rangeTime" rules={rules.rangeTime}>
        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} />
      </Item>
      <Item label="绑定商品" name="product_id" rules={rules.product_id} >
        <SearchSelect
          placeholder="输入商品名称搜索 然后选择"
          defaultOptions={defaultOptions}
          searchReq={productApi.getOptions}
        />
      </Item>
      <Form.List name="sku_list">
        {
          (fields, { add, remove }) => (
            <MultLineRow>
              {fields.map(buildDynamicFields)}
            </MultLineRow>
          )}
      </Form.List>

      <Item {...tailLayout}><Button type="primary"  onClick={onSubmit}>确认提交</Button></Item>

    </Form>

  )
}
