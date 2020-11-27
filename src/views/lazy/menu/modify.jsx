import React from 'react'
import { message, Form, Input, Switch, InputNumber, Button, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getMenus } from "../../../stores/action/menus";
import SufixTip from "../../../components/styled/sufixTip"
import api from "../../../api/menus"
import baseConfig from "../../../config/base";
const Item = Form.Item;
const Option = Select.Option;


const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
}
const initialValues = { hidden: false }
const rules = {
    name: [{ required: true, message: "请输入路由名称" }],
    path: [{ required: true, message: "请输入访问路径" }],
    sort: [{ required: true, message: "请输入序号" }]

}
const isParent = v => !v.pid;
const isModifyPage = url => /\/modify$/.test(url)

export default function ModifyMenus({ location, history }) {
    const { state = {} } = location;
    const { editData } = state;
    const isEdit = editData !== undefined
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const allMenus = useSelector(s => s.menus.datas)
    const parents = allMenus.filter(isParent)

    if (isEdit) {
        let { parentId: pid, url: path, sortNo: sort, ...rest } = editData
        sort -= baseConfig.MinMenuSort
        let values = { ...rest, pid: pid || undefined, path, sort }
        delete values.children
        form.setFieldsValue(values)
    } else {
        form.setFieldsValue({ sort: parents.length + 1 })
    }

    const handleValuesChange = (ed, all) => {
        if(ed.path){
            if(isModifyPage(ed.path)){
                form.setFieldsValue({hidden:true})
            }
            if(all.path){
                return onPathChange(ed.path)
            }
        }

        if (ed.pid) return onPidChange(ed.pid)
        
    }
    const onPathChange = value => {
        value = value[0] === '/' ? value.substring(1) : value
        // if (/:|\?/.test(value)) {
        //     if (value[value.length - 2] !== '/') return;
        //     value = value.slice(0, -2)
        // };
        form.setFieldsValue({ component: value })
    }
    const onPidChange = value => {
        let target = allMenus.find(v => v.id === value)
        let sort = Array.isArray(target.children) ? target.children.length + 1 : 1
        form.setFieldsValue({ sort })
    }
    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;
        const { pid, component, hidden } = values
        values.hidden = Number(hidden)
        if (!pid && !component) {
            values.component = ''
        }
        if (values.sort < baseConfig.MinMenuSort) {
            values.sort += baseConfig.MinMenuSort
        }
        let res = isEdit
            ? await api.editMenu(editData.id, values)
            : await api.addMenu(values)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        dispatch(getMenus())
        history.goBack()
    }
    return (
        <Form
            {...layout}
            form={form}
            name="menu"
            initialValues={initialValues}
            onValuesChange={handleValuesChange}>
            <Item label="父级" name="pid">
                <Select placeholder="不选并且<组件>留空，表示添加一个父级菜单">
                    {parents.map(v => <Option value={v.id} key={v.id}>{v.name}</Option>)}
                </Select>
            </Item>
            <Item label="名称" name="name" rules={rules.name}><Input /></Item>
            <Item label="路径" name="path" rules={rules.path}><Input /></Item>
            <Item label="组件" name="component"><Input addonBefore={<span>/ lazy /</span>} /></Item>
            <Item label="排序" >
                <Item name="sort" rules={rules.sort} noStyle><InputNumber min={1} /></Item>
                <SufixTip>默认自动生成</SufixTip>
            </Item>
            <Item label="隐藏" name="hidden" valuePropName="checked"><Switch /></Item>
            <Item {...tailLayout}><Button type="primary"  onClick={onSubmit}>确认提交</Button></Item>
        </Form>

    )

}

