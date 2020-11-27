import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Cascader, Checkbox, Row, Col, InputNumber } from 'antd';

import { phoneValidator } from '../../../utils/formHelp'
import api from '../../../api/supplier'
import geoApi from '../../../api/geographic'
import { deliveryTypes } from '../../../config/enums';
import SufixTip from '../../../components/styled/sufixTip';

const Item = Form.Item
const textRight = { textAlign: 'right', paddingRight: 15 }
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 6 },
}
/**@type {Object.<string,import('antd/lib/form').Rule[]>} */
const rules = {
    account: [{ required: true, message: '请输入供应商账号!' }],
    password: [{ required: true, message: '请输入密码!' }],
    supplierName: [{ required: true, message: '请输入供应商名称!' }],
    content: [{ required: true, message: '请输入简介!' }],
    delTypes: [{ required: true, message: '请选择配送类型' }],
    //以下字段---放入address
    name: [{ required: true, message: '请输入联系人!' }],
    phone: [{ required: true, message: '请输入手机号!', }, phoneValidator],
    addrIds: [{ required: true, message: '请选择地址!', }],//省市区地址，提交前拆分
    addrDetail: [{ required: true, message: '请输入详细地址!', }]
}
const convert2submit = function (values) {
    let { name, phone,
        addrIds: [provinceCode, cityCode, districtCode],
        addrDetail: address,
        supplierName,
        delTypes = [],
        ...rest } = values
    let supplierAddress = { name, phone, provinceCode, cityCode, districtCode, address };
    delTypes.forEach(c => {
        rest[c] = 1
    })
    return { ...rest, supplierAddress, name: supplierName }
}
const convert2values = function (entity) {
    let { supplierAddress, name: supplierName, ...rest } = entity;
    let { name, phone, provinceCode, cityCode, districtCode, address: addrDetail } = supplierAddress;
    let addrIds = [provinceCode, cityCode, districtCode];
    return { ...rest, supplierName, name, phone, addrIds, addrDetail }
}
const convert2option = v => ({ label: v.name, value: v.code, id: v.id, isLeaf: v.hasChild !== "1" })
const getAddrOptions = async (next, parentId) => {
    let res = await geoApi.getOptions({ parentId })
    if (res.code) return message.error(res.msg)
    next(res.data.map(convert2option))
}
const makeCasecaderDefoValue = async (addrIds) => {
    let ids = addrIds.slice()
    let parents = [undefined, ...ids.slice(0, -1)]
    let results = await Promise.all(parents.map(parentId => geoApi.getOptions(parentId ? { parentId } : undefined)))

    results = results.map(v => v.data).map(s => s.map(convert2option))
    let lv3 = results.pop()
    let revs = results.reverse()
    ids.pop()
    let pids = ids.reverse()


    //[省市区]->[区市省]->[省]
    let options = revs.reduce((pre, cur, i) => {
        let t = cur.find(v => v.id === pids[i])
        if (!t) return pre;
        t.children = pre;
        return cur;
    }, lv3)
    return options
}

const pwdItems = (

    <Item
        name="password"
        label="密码"
        rules={rules.password}
    >
        <Input />
    </Item>
)

export default function SupplierModify({ location, history }) {
    const { state = {} } = location;
    const { editData } = state;
    const isEdit = editData !== undefined
    const [form] = Form.useForm();
    const [addrOptions, setAddrOptions] = useState([])
    useEffect(() => {

        if (!isEdit) {
            getAddrOptions(setAddrOptions)
            return;
        };
        const getDetail = async (id) => {
            let res = await api.getDetail(id)
            if (res.code) return message.error(res.msg)
            let d = res.data;
            let addrIds = d.geographicIds.split(' ').slice(1)
            let opts = await makeCasecaderDefoValue(addrIds)
            setAddrOptions(opts)
            let values = convert2values(d)
            // values.addrIds = addrIds
            // setTimeout( form.setFieldsValue,500,values)
            form.setFieldsValue(values)

        }
        getDetail(editData.id)


        //eslint-disable-next-line
    }, [])

    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;

        values = convert2submit(values)
        let { bankAccountList: bal } = values;
        const isEmptyObj=b => Object.values(b).every(v => v !== undefined)
        //eslint-disable-next-line
        values.bankAccountList = bal.filter(isEmptyObj).map((v, i) => (v.type = i, v))
        // return console.log(values);
        let res = isEdit
            ? await api.edit(values.id = editData.id, values)
            : await api.add(values)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        history.replace('index', { modifyed: true })
    }


    const getOptionsByPid = (selectedOptions) => {
        const last = selectedOptions.length - 1
        if (last < 0) return;
        const targetOption = selectedOptions[last];
        targetOption.loading = true;
        getAddrOptions((datas) => {
            targetOption.loading = false;
            targetOption.children = datas;
            setAddrOptions(s => [...s])
        }, targetOption.id)
    }
    return (
        <Form {...layout} form={form} name="supplier" scrollToFirstError >
            <Item name="account" label="账号" rules={rules.account}>
                <Input />
            </Item>

            {isEdit ? null : pwdItems}

            <Item name="supplierName" label="供应商名称" rules={rules.supplierName}>
                <Input />
            </Item>
            <Item name="name" label="联系人名称" rules={rules.name}>
                <Input />
            </Item>

            <Item name="phone" label="手机号" rules={rules.phone}>
                <Input />
            </Item>
            <Item name="addrIds" label="地址" rules={rules.addrIds}>
                <Cascader
                    options={addrOptions}
                    loadData={getOptionsByPid}
                />
            </Item>

            <Item name="addrDetail" label="详细地址" rules={rules.addrDetail}>
                <Input />
            </Item>

            <Item name="content" label="供应商介绍" rules={rules.content}>
                <Input.TextArea />
            </Item>
            <Item name="settlementCycleUnit" hidden initialValue={1}>
                <Input />
            </Item>
            <Item label="帐期">

                <Item name="settlementCycle" noStyle>
                    <InputNumber style={{ width: 120 }} />
                </Item>
                <SufixTip>天</SufixTip>
            </Item>
            <Row>
                <Col span={layout.labelCol.span}>
                    <h4 style={textRight}>对公账号</h4>
                </Col>
            </Row>
            <Item label="银行账号" name={["bankAccountList", 0, "bankNo"]} ><Input /></Item>
            <Item label="银行户名" name={["bankAccountList", 0, "bankName"]} ><Input /></Item>
            <Item label="开户行" name={["bankAccountList", 0, "bankAddress"]} ><Input /></Item>

            <Row>
                <Col span={layout.labelCol.span}>
                    <h4 style={textRight}>对私账号</h4>
                </Col>
            </Row>
            <Item label="银行账号" name={["bankAccountList", 1, "bankNo"]} ><Input /></Item>
            <Item label="银行户名" name={["bankAccountList", 1, "bankName"]} ><Input /></Item>
            <Item label="开户行" name={["bankAccountList", 1, "bankAddress"]} ><Input /></Item>


            <Item name="delTypes" label="配送类型" wrapperCol={{ span: 20 }} rules={rules.delTypes}>
                <Checkbox.Group>
                    {deliveryTypes.map(([key, label]) => <Checkbox value={key} key={key}>{label}</Checkbox>)}
                </Checkbox.Group>
            </Item>
            <Item {...tailLayout}>
                <Button type="primary" onClick={onSubmit}>确认提交 </Button>
            </Item>
        </Form>
    );
};

