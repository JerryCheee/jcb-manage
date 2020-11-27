import React, { forwardRef, useEffect } from 'react'
import { Form, Radio, Input, message } from 'antd'
import { verifyStatus } from '../../config/enums'
import api from '../../api/work'
const Item = Form.Item;

function VerifyForm({ id }, ref) {
    const [form] = Form.useForm()

    useEffect(() => {
        const onSubmit = async () => {
            let values = form.getFieldsValue()
            values.id = id;
            let res = await api.verify(values)
            if (res.code) {
                message.error(res.msg)
                return false;
            }
            message.success(res.msg)
            return true;
        }
        ref.current = onSubmit;
    }, [])
    return (
        <Form
            form={form}
            name="verify"
        >
            <Item label="审核状态" name="status" initialValue={0}>
                <Radio.Group>
                    {verifyStatus.map((v, i) => <Radio key={i} value={i}>{v}</Radio>)}
                </Radio.Group>
            </Item>
            <Item noStyle shouldUpdate={(pre, cur) => pre.status !== cur.status}>
                {({ getFieldValue }) => {
                    let status = getFieldValue('status')
                    return status === 2
                        ? <Item label="驳回理由" name="verifyNote" >
                            <Input.TextArea />
                        </Item>
                        : null
                }}
            </Item>
        </Form>
    )
}
export default forwardRef(VerifyForm)