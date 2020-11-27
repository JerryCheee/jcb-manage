import React, { useEffect } from 'react'
import { message, Form, Input, InputNumber, Button } from "antd";
import api from "../../../api/tag"

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
    sort: [{ required: true, message: "请输入序号" }]
}


export default function ModifyTag({ location, history }) {
    const { state = {} } = location;
    const { editData, parent = {}, total = 0 } = state;
    const isEdit = editData !== undefined
    const [form] = Form.useForm()



    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue(editData)
            return;
        }
        form.setFieldsValue({ sort: total + 1 })
    }, [])


    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;
        values.parentId = parent.id
        let res = isEdit
            ? await api.edit(editData.id, values)
            : await api.add(values)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        history.replace('index', { modifyed: true })
    }


    return (
        <Form
            {...layout}
            form={form}
            name="tag"
        >
            {parent.id ? <h3>父级: {parent.name}</h3> : null}
            <Item label="标签名称" name="name" rules={rules.name}><Input /></Item>

            <Item label="排序" name="sort" ><InputNumber min={0} /></Item>

            <Item {...tailLayout}><Button type="primary" onClick={onSubmit}>确认提交</Button></Item>
        </Form>

    )

}

