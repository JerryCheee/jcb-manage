import React, { useEffect } from 'react'
import { message, Form, Input, Button, InputNumber } from "antd";
import api from "../../../../api/storeLevel"
import styled from 'styled-components'
import SufixTip from '../../../../components/styled/sufixTip';

const Number = styled(InputNumber)`
        width:min(200px,50%);
`
const Item = Form.Item;
const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
}

const rules = {
    name: [{ required: true, message: "请输入等级名称" }],
    enterPrice: [{ required: true, message: "请输入入驻费用" }],
    discount: [{ required: true, message: "请输入不含税进货价" }],
    taxDiscount: [{ required: true, message: "请输入含税进货价" }],

}

export default function ModifyStoreLevel({ location, history }) {
    const { state = {} } = location;
    const { editData } = state;
    const isEdit = editData !== undefined
    const [form] = Form.useForm()

    useEffect(() => {
        if (!isEdit) return;
        form.setFieldsValue(editData)
    }, [])

    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;
        let res = isEdit
            ? await api.edit(editData.id, values)
            : await api.add(values)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        history.goBack()
    }

    return (


        <Form
            {...layout}
            form={form}
            name="level"
        >
            <Item label="等级名称" name="name" rules={rules.name}><Input /></Item>
            <Item label="入驻费用"><Item noStyle name="enterPrice" rules={rules.enterPrice}><Number min={0}/></Item><SufixTip>元</SufixTip></Item>
            <Item label="不含税进货价"><Item noStyle name="discount" rules={rules.discount}><Number min={0}/></Item><SufixTip>%</SufixTip></Item>
            <Item label="含税进货价"><Item noStyle name="taxDiscount" rules={rules.taxDiscount}><Number min={0}/></Item><SufixTip>%</SufixTip></Item>
            <Item {...tailLayout}><Button type="primary" onClick={onSubmit}>确认提交</Button></Item>
        </Form>


    )

}

