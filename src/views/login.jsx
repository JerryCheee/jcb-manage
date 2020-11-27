import React, { useEffect, useState } from 'react'

import { Form, Input, Button, message, Checkbox } from 'antd';
import styled from 'styled-components'
import tokenHolder from '../utils/tokenHolder'
import { useDispatch, useSelector } from "react-redux";
import { login } from '../stores/action/admin'
import api from '../api/admin'
import bg from "../assest/imgs/login.svg"
import baseConfig from '../config/base'
const CenterBox = styled.div`
 display:flex;
 flex-direction:column;
 background-image:url(${props => props.bg});
 height: 100vh;
 background-size: 100% 100%;
 align-items:center;
 justify-content: center;
 &>div{
    width: 360px;
    background: inherit;
    height: 500px;
    background-size: cover;
    padding: 0 20px;
    padding-top:150px;
    background-position-x: center;
    box-shadow: 0px 1px 6px 1px rgba(20, 83, 100, 0.85);
 }
`
const MyBtn = styled(Button)`
    background: #0ea0bc;
    border-color: #0e9fbc;
    width:100%;
    &:hover, &:focus{
        background: #0ea0bc;
        border-color: #0e9fbc;
    }
`
const FormItem = styled(Form.Item)`
    & label{
        color: rgb(16, 80, 95);
    }
    & input,
    & .ant-input-affix-wrapper{
        background-color: transparent;
        background-image: none;
        border: 1px solid #32aecb;

    }
  
`
const InlineImg = styled.img`
    width:30%;
    margin-left:18px;
    height:35px;
`
const MyCheckBox = styled(Checkbox)`
.ant-checkbox-checked .ant-checkbox-inner {
    background-color: #0e9fbc;
    border-color: #0e9fbc;
}
`
// const layout = {
//     labelCol: { span: 3 },
//     wrapperCol: { span: 8 },
// };
const { basePath } = baseConfig

const tryParseRedirectUrl = (location) => {
    let redirect = new URLSearchParams(location.search).get('redirect')
    if (!redirect) return '/';
    const urlParams = new URL(window.location.href);
    const { origin, pathname } = new URL(redirect);
    if (origin !== urlParams.origin) return '/';
    redirect = pathname
    // if (hash) {
    //     redirect = hash
    // }
    if (/index.html$/.test(redirect)) return '/'
    if (basePath) { //如果有基础路由，把它去掉
        let regSame = new RegExp(`^${basePath}(/?)$`)
        if (regSame.test(redirect)) {
            return '/'
        }
        let regContain = new RegExp(`^${basePath}(/+)`)
        if(regContain.test(redirect)){
            return redirect.replace(basePath,'')
        }
    }

    return redirect
}
const rules = {
    username: [{ required: true, message: '请输入账号', }],
    password: [{ required: true, message: '请输入密码', }],
    captcha: [{ required: true, message: '请输入验证码', }],

}
/** 参数由react route自动传入 */
const Login = ({ history, location }) => {
    const dispatch = useDispatch()
    const { loading, errMsg } = useSelector(s => s.admin);
    const [form] = Form.useForm()
    const [codeImg, setCodeImg] = useState('')
    const getCodeImg = async () => {
        let res = await api.getLoginCaptcha()
        if (res.code) return message.error(res.msg)
        setCodeImg(res.data)
    }
    useEffect(() => {
        getCodeImg()
        //eslint-disable-next-line
    }, [])
    useEffect(() => {
        if (loading) return;
        if (errMsg) { message.error(errMsg); return; }
        let token = tokenHolder.get()
        if (!token) return;
        let redirectUrl = tryParseRedirectUrl(location)
        history.replace(redirectUrl);//登录成功就去首页先


        //eslint-disable-next-line
    }, [loading])



    const onSubmit = async () => {
        if (loading) return;
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;

        values.checkKey = 1603788233902

        dispatch(login(values))

    };

    const tailLayout = {
        wrapperCol: {
            offset: 6,
            span: 12,
        },
    };
    return (
        <CenterBox bg={bg}>
            <div>
                <Form
                    name="basic"
                    form={form}
                // layout={layout}
                >
                    <FormItem
                        label="账号"
                        name="username"
                        labelCol={{ span: 5 }}
                        rules={rules.username}
                    >
                        <Input />
                    </FormItem>

                    <FormItem
                        label="密码"
                        name="password"
                        labelCol={{ span: 5 }}
                        rules={rules.password}
                    >
                        <Input.Password />
                    </FormItem>

                    <FormItem label="验证码" required style={{ marginBottom: '8px' }}>
                        <FormItem
                            name="captcha"
                            noStyle
                            rules={rules.captcha}
                        >
                            <Input style={{ width: '60%' }} />
                        </FormItem>
                        <InlineImg src={codeImg} alt="验证码图片" onClick={getCodeImg} />
                    </FormItem>
                    <Form.Item wrapperCol={{ offset: 4 }} name="remember_me" valuePropName="checked">
                        <MyCheckBox>记住登录</MyCheckBox>
                    </Form.Item>
                    <FormItem {...tailLayout}>
                        <MyBtn type="primary" htmlType="submit" onClick={onSubmit}>
                            登录
                        </MyBtn>
                    </FormItem>
                </Form>
            </div>

        </CenterBox>

    )
}

export default Login