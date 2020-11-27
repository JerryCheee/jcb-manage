import React, { useEffect } from 'react'
import { message, Form, Input, Button, Radio, InputNumber, Switch } from "antd";
import api from "../../../api/banner"

import { makeUploadDefaultValue } from "../../../utils/formHelp";

import ImgUpload from '../../../components/formItem/imgUpload'
import { jumpTypes, showTypes, sourceTypes, positionTypes, } from '../../../config/enums';

const Item = Form.Item;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 2 },
}

const rules = {
  img: [{ required: true, message: "请上传图片" }],
  title: [{ required: true, message: "请输入标题" }],
  link: [{ required: true, message: "请输入链接地址" }]
}

const tipText = ['', '商品id', '门店id', '链接地址']
export default function ModifyBanner({ location, history }) {
  const { state = {} } = location;
  const { editData, total = 0 } = state;
  const isEdit = editData !== undefined
  const [form] = Form.useForm()


  useEffect(() => {
    if (isEdit) {
      let values = { ...editData }
      values.pic = makeUploadDefaultValue([values.pic])
      values.status = values.status > 0
      form.setFieldsValue(values)
    } else {
      form.setFieldsValue({
        sort: total + 1,
        type: 1,
        source: 1,
        field: 1,
        urlType: 1,
      })
    }
    // eslint-disable-next-line
  }, [])

  const onSubmit = async () => {
    let hasErr = false
    let values = await form.validateFields().catch(e => hasErr = true)
    if (hasErr) return;

    values.pic = values.pic[0].response.message
    values.status = values.status ? 1 : 0
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
      name="banner"
    >
      <Item
        label="图片"
        name="pic"
        valuePropName="fileList"
        wrapperCol={{ span: 20 }}>
        <ImgUpload />
      </Item>
      <Item label="标题" name="title" rules={rules.title}><Input /></Item>
      <Item label="跳转类型" name="urlType" >
        <Radio.Group>
          {jumpTypes.map(v => <Radio key={v.value} value={v.value}>{v.text}</Radio>)}
        </Radio.Group>
      </Item>
      <Item label="链接" shouldUpdate={(pre, cur) => pre.urlType !== cur.urlType}>
        {({ getFieldValue }) => {
          let tip = tipText[getFieldValue('urlType')]
          return <Item noStyle name="url" rules={rules.link}><Input placeholder={`请输入${tip}`} /></Item>
        }}

      </Item>
      <Item label="排序" name="sort" ><InputNumber style={{ width: 'min(200px,50%)' }} min={0} /></Item>

      <Item label="软件端" name="source" >
        <Radio.Group>
          {sourceTypes.map(v => <Radio key={v.value} value={v.value}>{v.text}</Radio>)}
        </Radio.Group>
      </Item>
      <Item label="展示端" name="type" >
        <Radio.Group>
          {showTypes.map(v => <Radio key={v.value} value={v.value}>{v.text}</Radio>)}
        </Radio.Group>
      </Item>
      <Item label="展示位" name="field" >
        <Radio.Group>
          {positionTypes.map(v => <Radio key={v.value} value={v.value}>{v.text}</Radio>)}
        </Radio.Group>
      </Item>

      <Item label="是否启用" name="status" valuePropName="checked" initialValue={true}>
        <Switch />
      </Item>
      <Item {...tailLayout}><Button type="primary" onClick={onSubmit}>确认提交</Button></Item>
    </Form>

  )

}

