import React, { useEffect } from 'react'
import { message, Form, Input, Button } from "antd";
import api from "../../../api/sensitiveWord"
const Item = Form.Item;


const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
}

const rules = {
    name: [{ required: true, message: "请输入标签名称" }],
}


export default function ModifySensitiveWord({ location, history }) {
    const { state = {} } =location;
    const { editData } = state;
    const isEdit = editData !== undefined
    const [form] = Form.useForm()



    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue(editData)
        } 
    }, [])
   
    
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
            name="sensitiveWord">
           
            <Item label="标签名称" name="name" rules={rules.name}><Input /></Item>
           
            <Item {...tailLayout}><Button type="primary"  onClick={onSubmit}>确认提交</Button></Item>
        </Form>

    )

}

