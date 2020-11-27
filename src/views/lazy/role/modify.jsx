import React from 'react'
import { message, Form, Input, Button, Select } from "antd";
import { useHistory } from "react-router-dom";
import api from "../../../api/role"
import { roleTypes } from "../../../config/enums"
const Item = Form.Item;
const Option = Select.Option;
const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
}

const rules = {
    name: [{ required: true, message: "请输入角色名称" }],
}


export default function ModifyRole(props) {
    const editData = props.location.state?.editData;
    const isEdit = editData !== undefined
    const [form] = Form.useForm()
    const history = useHistory()
    if (isEdit) {
        form.setFieldsValue(editData)
    }
    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;
        let res = isEdit
            ? await api.edit((values.id=editData.id, values))
            : await api.add(values)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        history.replace('index', { modifyed: true })
    }

    return (
        <Form
            {...layout}
            form={form}
            name="role"
        >

            <Item label="角色名称" name="roleName" rules={rules.name}><Input /></Item>
            <Item label="角色类型" name="roleType">
                <Select placeholder="点击选择">
                    {roleTypes.map((v, i) => <Option value={i} key={i}>{v}</Option>)}
                </Select>
            </Item>
            <Item {...tailLayout}><Button type="primary"  onClick={onSubmit}>确认提交</Button></Item>
        </Form>

    )

}

