import React, { useEffect } from 'react'
import { message, Form, Input, Button, Radio } from "antd";
import api from "../../../api/notice"
import { showTypes, sourceTypes, } from '../../../config/enums';

const Item = Form.Item;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 2 },
}

const rules = {
  content: [{ required: true, message: "请输入内容" }]
}

export default function ModifyNotice({ location, history }) {
  const { state = {} } = location;
  const { editData } = state;
  const isEdit = editData !== undefined
  const [form] = Form.useForm()


  useEffect(() => {
    if (isEdit) {
      let values = { ...editData }
      form.setFieldsValue(values)
    } else {
      form.setFieldsValue({
        type: 1,
        source: 1
      })
    }
    // eslint-disable-next-line
  }, [])

  const onSubmit = async () => {
    let hasErr = false
    let values = await form.validateFields().catch(e => hasErr = true)
    if (hasErr) return;

    let res = isEdit
      ? await api.edit((values.id = editData.id, values))
      : await api.add(values)
    if (res.code) return message.error(res.msg)
    message.success(res.msg, history.goBack)
  }

  return (
    <Form
      {...layout}
      form={form}
      name="notice"
    >

      <Item label="内容" name="content" rules={rules.content}><Input.TextArea /></Item>

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

      <Item {...tailLayout}><Button type="primary" onClick={onSubmit}>确认提交</Button></Item>
    </Form>

  )

}

