import React,{useEffect} from 'react'
import { message, Form, Input, Button, Modal } from "antd";
import api from "../../../api/join"
import ImgUpload from '../../formItem/imgUpload';

const Item = Form.Item;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 8 },
}


export default function SubmitRecord({ visible, toggle, id }) {

    const [form] = Form.useForm()
    useEffect(()=>{
        return ()=>{

            form.resetFields()
        }
    })


    const onSubmit = async () => {
        let values = form.getFieldsValue()

        if (Object.values(values).every(v => !v)) {
            message.error('请输入记录内容或上传照片')
            return;
        }
        if (values.pic) {
            values.pic = values.pic.map(v => v.response.message)[0]
        }
        values.joinId = id;
        let res = await api.addRecord(values)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        toggle()
    }
    return (
        <Modal
            title="添加跟进记录"
            visible={visible}
            closable
            onCancel={toggle}
            footer={null}
        >
            <Form
                {...layout}
                form={form}
            >
                <Item name="pic" label="图片" valuePropName="fileList">
                    <ImgUpload />
                </Item>
                <Item name="content" label="跟进内容">
                    <Input.TextArea />
                </Item>
                <Item {...tailLayout}><Button type="primary" htmlType="submit" onClick={onSubmit}>确认提交</Button></Item>
            </Form>
        </Modal>
    )

}

