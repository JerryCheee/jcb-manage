import React from 'react'
import { message, Form, Input, Button, Modal } from "antd";
import api from "../../api/admin"
import tokenHolder from "../../utils/tokenHolder";
import { useHistory } from "react-router-dom"
const Item = Form.Item;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 8 },
}

const confirmPwdValidator = ({ getFieldValue }) => ({
    validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
        }
        return Promise.reject('两次输入密码不一致');
    },
})
const rules = {
    oldPassword: [{ required: true, message: "请输入旧密码" }],
    password: [{ required: true, message: "请输入密码" }],
    confirm: [{ required: true, message: "请再次输入密码" }, confirmPwdValidator],

}


export default function Edit({ visible, toggle, info: { id } }) {

    const [form] = Form.useForm()
    const history = useHistory()


    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;
        let res = await api.editPassword(id, values)
        if (res.code) return message.error(res.msg)
        message.success(res.msg, () => {
            tokenHolder.remove()
            history.replace('/login')
        })
        toggle()
    }
    return (
        <Modal
            title="修改密码"
            visible={visible}
            closable
            onCancel={toggle}
            footer={null}
        >
            <Form
                {...layout}
                form={form}
            >
                <Item label="当前密码" name="oldPassword" rules={rules.password} hasFeedback><Input.Password /></Item>
                <Item label="新密码" name="password" rules={rules.password} hasFeedback><Input.Password /></Item>
                <Form.Item
                    name="confirm"
                    label="确认新密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={rules.confirm}
                >
                    <Input.Password />
                </Form.Item>
                <Item {...tailLayout}><Button type="primary" htmlType="submit" onClick={onSubmit}>确认提交</Button></Item>
            </Form>
        </Modal>
    )

}

