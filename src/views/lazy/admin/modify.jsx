import React, { useEffect, useState } from "react";
import { message, Form, Input, Button, Select } from "antd";
import api from "../../../api/admin";
import roleApi from "../../../api/role";

import {
    confirmPwd,
    accountValidator,
    makeUploadDefaultValue,
} from "../../../utils/formHelp";
import ImgUpload from "../../../components/formItem/imgUpload";

const Item = Form.Item;
const Option = Select.Option;

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
};

const rules = {
    account: [{ required: true, message: "请输入登录账号" }, accountValidator],
    username: [{ required: true, message: "请输入用户名称" }],
    roleId: [{ required: true, message: "请指定角色" }],
    password: [{ required: true, message: "请输入密码" }],
    confirm: [{ required: true, message: "请再次输入密码" }, confirmPwd],
};

const accountItems = (
    <>
        <Item
            label="密码"
            name="oldPassword"
            rules={rules.password}
            hasFeedback
        >
            <Input.Password />
        </Item>
        <Item
            name="password"
            label="确认密码"
            dependencies={["password"]}
            hasFeedback
            rules={rules.confirm}
        >
            <Input.Password />
        </Item>
    </>
);

export default function Admin({ location, history }) {
    const { state = {} } = location;
    const { editData } = state;
    const isEdit = editData !== undefined;
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [PwdItems, setPwdItems] = useState(null);

    useEffect(() => {
        const initRoles = async () => {
            let res = await roleApi.getOptions();
            if (res.code) {
                message.error(res.msg);
                return;
            }
            setRoles(res.data);
        };

        initRoles();
        if (isEdit) {
            let { id } = editData;
            api.getDetail(id).then((res) => {
                if (res.code) {
                    message.error(res.msg);
                    return;
                }
                let detail = res.data || {};
                let { avatar } = detail;
                avatar = avatar ? makeUploadDefaultValue([avatar]) : undefined;
                form.setFieldsValue({ ...detail, avatar });
            });
        } else {
            setPwdItems(accountItems);
        }
        //eslint-disable-next-line
    }, []);

    const onSubmit = async () => {
        let hasErr = false;
        let values = await form.validateFields().catch((e) => (hasErr = true));
        values.avatar =
            values.avatar &&
            values.avatar.length &&
            values.avatar[0]?.response?.message;
        if (hasErr) return;
        let res = isEdit
            ? await api.edit(editData.id, values)
            : await api.add(values);
        if (res.code) return message.error(res.msg);
        message.success(res.msg);
        history.goBack();
    };

    return (
        <Form {...layout} form={form} name="admin">
            <Item label="头像" name="avatar" valuePropName="fileList">
                <ImgUpload />
            </Item>
            <Item label="角色" name="roleId">
                <Select placeholder="点击选择">
                    {roles.map((v) => (
                        <Option value={v.id} key={v.id}>
                            {v.name}
                        </Option>
                    ))}
                </Select>
            </Item>
            <Item label="账号" name="username" rules={rules.username}>
                <Input />
            </Item>

            {/* <Item label="手机" name="phone" rules={rules.phone} ><Input addonBefore={<span>+86</span>} /></Item> */}
            {PwdItems}
            <Item {...tailLayout}>
                <Button type="primary" onClick={onSubmit}>
                    确认提交
                </Button>
            </Item>
        </Form>
    );
}
