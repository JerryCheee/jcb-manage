import React, { useEffect, useState } from 'react'
import { message, Form, Input, InputNumber, Button, Cascader } from "antd";
import SufixTip from "../../../components/styled/sufixTip"
import api from "../../../api/classify"
import ImgUpload from '../../../components/formItem/imgUpload';
import { makeUploadDefaultValue } from "../../../utils/formHelp";

const Item = Form.Item;



const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { span: 8, offset: 2 },
}

const rules = {
  name: [{ required: true, message: "请输入分类名称" }],

  sort: [{ required: true, message: "请输入序号" }]

}
const cover2opt = pid => v => {
  return {
    value: v.id,
    label: v.name,
    pid,
    children: v.children ? v.children.map(cover2opt(v.id)) : []
  }
}
const getOptions = async (next) => {
  let res = await api.getOptions()
  if (res.code) return;
  let options = res.data.map(cover2opt(0))
  next(options)
}
/**
 * 根据当前id 尝试获取所有父级id
 * @param {Object} form form实例
 * @param {Array} datas 全部options 数据
 * @param {string|number} cur 当前id
 */
const makeCascaderDefoValue = (form, datas, id) => {
  const plans = datas.reduce((pre, cur) => pre.concat(cur, cur.children), [])
  const one = plans.find(c => c.value === id)
  if (!one) return;
  let curId = one.pid
  let ed = [id]
  while (curId > 0) {
    // eslint-disable-next-line
    const parent = plans.find(c => c.value === curId)
    if (parent == null) return curId = 0
    ed.unshift(parent.value)
    curId = parent.pid
  }
  form.setFieldsValue({ pid: ed })
}
export default function ModifyClassify({ location, history }) {
  const { state = {} } = location;
  const { editData } = state;
  const isEdit = editData !== undefined
  const [form] = Form.useForm()
  const [allDatas, setAllDatas] = useState([]);
  useEffect(() => {
    if (isEdit) {
      let icon = editData.icon ? makeUploadDefaultValue([editData.icon]) : undefined;
      let values = { ...editData, pid: undefined, icon }
      values.children = undefined;
      form.setFieldsValue(values)
    }
    getOptions(setAllDatas)
    //eslint-disable-next-line
  }, [])
  useEffect(() => {
    if (!allDatas.length) return;
    if (isEdit) { makeCascaderDefoValue(form, allDatas, editData.pid);return;}
    form.setFieldsValue({ sort: allDatas.length + 1 })
    //eslint-disable-next-line
  }, [allDatas])



  function filter(inputValue, path) {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  function onParentChange(values, selectedOptions) {
    let len = values.length
    if (len > 2) {
      message.warn('父级最多选择两级，已自动裁剪')
      form.setFieldsValue({ pid: values.slice(0, 2), sort: selectedOptions[1].children.length + 1 })
      return false;
    }
    form.setFieldsValue({ sort: selectedOptions[len - 1].children.length + 1 })
  }

  const onSubmit = async () => {
    let hasErr = false
    let values = await form.validateFields().catch(e => hasErr = true)
    if (hasErr) return;

    let { icon, pid } = values
    values.pid = pid ? pid.slice(-1)[0] : "0"
    values.icon = icon ? icon[0].response.message : icon;

    let res = isEdit
      ? await api.edit((values.id = editData.id, values))
      : await api.add(values)
    if (res.code) return message.error(res.msg)
    message.success(res.msg)

    history.goBack()
  }
  return (
    <Form
      {...layout}
      form={form}
      name="classify"
    >
      <Item label="父级" name="pid">
        <Cascader
          options={allDatas}
          onChange={onParentChange}
          placeholder="点击选择或输入搜索"
          changeOnSelect
          showSearch={{ filter }}
        />
      </Item>
      <Item label="图标" name="icon" valuePropName="fileList">
        <ImgUpload />
      </Item>
      <Item label="名称" name="name" rules={rules.name}><Input /></Item>

      <Item label="排序" >
        <Item name="sort" rules={rules.sort} noStyle><InputNumber min={1} /></Item>
        <SufixTip>默认自动生成</SufixTip>
      </Item>

      <Item {...tailLayout}><Button type="primary" onClick={onSubmit}>确认提交</Button></Item>
    </Form>

  )

}

