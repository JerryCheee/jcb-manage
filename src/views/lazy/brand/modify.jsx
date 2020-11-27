import React, { useState, useEffect } from 'react'
import { message, Form, Input, Button, Select, InputNumber, Cascader } from "antd";
import api from "../../../api/brand"
import tagApi from "../../../api/tag"
import SufixTip from "../../../components/styled/sufixTip"
import { makeUploadDefaultValue } from "../../../utils/formHelp";
import ImgUpload from "../../../components/formItem/imgUpload";
import SearchSelect from '../../../components/formItem/searchSelect'

const Item = Form.Item;
const Option = Select.Option
const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
}

const rules = {
    tag: [{ required: true, message: "请选择筛选标签" }],
    sort: [{ required: true, message: "请输入序号" }],
    name: [{ required: true, message: "请输入品牌名称" }],
    logo: [{ required: true, message: "请输入上传品牌图片" }],
}

// const cover2opt = pid => v => {
//     return {
//         value: v.id,
//         label: v.name,
//         pid,
//         children: v.children ? v.children.map(cover2opt(v.id)) : []
//     }
// }


const initTagOptions = async (brandId, next) => {
    let res = await tagApi.getAllByBrandId(brandId)
    if (res.code) return message.error(res.msg)
    next(res.data)
}

export default function ModifyBrand({ location, history }) {
    const { state = {} } = location;
    const { editData, total = 0 } = state;
    const isEdit = editData !== undefined
    const [form] = Form.useForm()
    const [defoTagOptions, setDefoTagOptions] = useState([])



    useEffect(() => {

        if (isEdit) {
            let { logo, id } = editData

            let values = { ...editData }//classId在options有数据后再赋值
            values.logo = logo ? makeUploadDefaultValue([logo]) : [];
            form.setFieldsValue(values)
            initTagOptions(id, setDefoTagOptions)
        } else {
            form.setFieldsValue({ sort: total + 1 })
            tagApi.searchParent().then(res=>{
                setDefoTagOptions(res.data)
            })
        }
    }, [])

    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;
        const { logo } = values
        values.logo = logo ? logo[0].response.message : undefined
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
            name="brand"
        >
            <Item label="图片"
                name="logo"
                rules={rules.logo}
                valuePropName="fileList"
                wrapperCol={{ span: 20 }}>
                <ImgUpload />
            </Item>
            <Item label="名称" name="name" rules={rules.name}><Input /></Item>
            <Item label="英文名称" name="ename" ><Input /></Item>
          
            <Item label="筛选标签" name="tags">
                <SearchSelect
                    mode="multiple"
                    defaultOptions={defoTagOptions}
                    placeholder="搜索标签"
                    searchReq={tagApi.searchParent}
                />

            </Item>
            <Item label="品牌简介" name="description" ><Input.TextArea /></Item>

            <Item label="排序" >
                <Item name="sort" rules={rules.sort} noStyle><InputNumber min={1} /></Item>
                <SufixTip>默认自动生成</SufixTip>
            </Item>
            <Item {...tailLayout}><Button type="primary" onClick={onSubmit}>确认提交</Button></Item>
        </Form>

    )

}

