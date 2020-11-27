import React, { forwardRef, useEffect } from 'react'
import { Form, InputNumber, DatePicker, Tooltip } from "antd";
import moment from "moment";
import styled from "styled-components";
import { QuestionCircleOutlined } from '@ant-design/icons';
import SufixTip from '../../styled/sufixTip'
const Item = Form.Item;

const Number = styled(InputNumber)`
        width:min(200px,50%);
`
const TipLabel = (
  <span>
    结束时间&nbsp;
    <Tooltip title="此拼团活动的结束时间">
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 12 },
};

const rules = {
  market_price: [{ required: true, message: "请输入市场价" }],
  price: [{ required: true, message: "请输入单买价" }],
  group_price: [{ required: true, message: "请输入拼团价" }],
  group_number: [{ required: true, message: "请输入成团人数" }],
  limited_quantity: [{ required: true, message: "请输入减免金额" }],
  end_time: [{ required: true, message: "请指定有效时间" }],
  stock: [{ required: true, message: "请输入库存" }],
  weight: [{ required: true, message: "请输入重量" }],

}
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().add(1, 'day').endOf('day');
}
const extraFormValues = form => async () => {
  let hasErr = false
  let values = await form.validateFields().catch(e => hasErr = true)
  if (hasErr) return false;
  values.end_time = values.end_time.unix()
  return values
}

function GroupBuyModel({ defaultValues = {} }, ref) {
  const [form] = Form.useForm()

  useEffect(() => {
    ref.current.push(extraFormValues(form))
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    let { end_time } = defaultValues
    if (!end_time) {//一些默认值
      form.setFieldsValue(defaultValues)
      return;
    };
    defaultValues.end_time = moment.unix(end_time)
    form.setFieldsValue(defaultValues)
    //eslint-disable-next-line
  }, [defaultValues])

  return (
    <Form
      {...layout}
      form={form}
      name='groupBuyOnly'
    >
       <Item label="市场价" required>
        <Item name="market_price" rules={rules.market_price} noStyle>
          <Number min={0} />
        </Item>
        <SufixTip>元</SufixTip>
      </Item>
       <Item label="单买价" required>
        <Item name="price" rules={rules.price} noStyle>
          <Number min={0} />
        </Item>
        <SufixTip>元</SufixTip>
      </Item>
       <Item label="拼团价" required>
        <Item name="group_price" rules={rules.group_price} noStyle>
          <Number min={0} />
        </Item>
        <SufixTip>元</SufixTip>
      </Item>      
      <Item label="成团人数" name="group_number" rules={rules.group_number}>
        <Number min={1} />
      </Item>
      <Item label="限购数量" name="limited_quantity" rules={rules.limited_quantity}>
        <Number min={0} />
      </Item>
      <Item label="库存" name="stock" rules={rules.stock}>
        <Number min={0} />
      </Item>
      <Item label="重量" required>
        <Item name="weight" rules={rules.weight} noStyle>
          <Number min={0.1} />
        </Item>
        <SufixTip>kg</SufixTip>
      </Item>
      <Item label={TipLabel} name="end_time" rules={rules.end_time} >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} />
      </Item>
    </Form>
  )
}

export default forwardRef(GroupBuyModel)