import React from 'react'
import { message, Form, Input, Button } from "antd";
import api from "../../../api/proptype"

import { useEffect } from 'react';


const Item = Form.Item;
const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
}

const rules = {
    name: [{ required: true, message: "请输入属性名称" }],
}


export default function ModifyProptypes({location,history}) {
    const { state = {} } =location;
    const { editData } = state;
    const isEdit = editData !== undefined
    const [form] = Form.useForm()


    const init = () => {
    
        if (isEdit) {
         
            form.setFieldsValue(editData)
        } 
    }
    useEffect(init, [])

  

    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;
      
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
            name="proptype"
        >
            <Item label="名称" name="name" rules={rules.name}><Input /></Item>
            <Item {...tailLayout}><Button type="primary"  onClick={onSubmit}>确认提交</Button></Item>
        </Form>

    )

}

