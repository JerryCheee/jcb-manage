
import React, { useEffect, useState } from 'react'
import { message, Form, Input, InputNumber, Button, Cascader, Checkbox, Row, Col, Radio, Card, Spin } from "antd";
import { MinusCircleOutlined } from '@ant-design/icons';
import api from "../../../api/template"
import geoApi from "../../../api/geographic"
import { calcType, reasonCodes } from '../../../config/enums';
import styled from 'styled-components'

const Item = Form.Item;

const InputCard = styled.div`
    display:flex;
    align-items:center;
    height: 100px;
    border: 1px solid #f0f0f0;
    padding: 0 12px;
    &>div:first-of-type{
        width: 80px;
        text-align: center;
        margin-right: 10px;
        color: #2196F3;
    }
    &>.row{
        display:inherit;
        align-items:baseline;
    }
    &>div:not([class]){
        margin:0 8px;
        flex-shrink:0;
    }
    .anticon-minus-circle{
        color:red;
    }
`

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
}
const formItemLayout = {
    labelCol: {
        sm: { span: 3 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {

        sm: { span: 16, offset: 3 },
    },
};
const h32 = { height: 32 }
const rules = {
    name: [{ required: true, message: "请输入分类名称" }],
    sendFromAddressId: [{ required: true, message: "请选择发货地址" }],


}
const convert2option = v => ({ label: v.name, value: v.id, isLeaf: v.hasChild !== "1" })
const getAddrOptions = async (next, parentId) => {
    let res = await geoApi.getOptions({ parentId })
    if (res.code) return message.error(res.msg)
    next(res.data.map(convert2option))
}
/**
 * 还原已选择的地址
 * @param {Function} next 
 * @param {String} parentId 
 */
const makeCasecaderDefoValue = async (ids) => {
    let parents = [undefined, ...ids.slice(0, -1)]
    let results = await Promise.all(parents.map(parentId => geoApi.getOptions({ parentId })))
    let revs = results.map(v => v.data).map(s => s.map(convert2option)).reverse()
    let pids = ids.slice().reverse()
    //[省市区]->[区市省]->[省]
    let options = revs.reduce((pre, cur, i) => {
        let t = cur.find(v => v.value === pids[i])
        t.children = pre;
        return cur;
    })
    return options
}
const handleAddrIdSelect = (freeAddrIds, options) => {
    let len = freeAddrIds.length;
    let v = freeAddrIds[len - 1]
    let hasNotAll = freeAddrIds.includes('notAll')
    if (v === 'all') {
        if (len < options.length || hasNotAll) {
            return [...options.map(v => v.value), 'all']

        }

        if (len === options.length || len > options.length) {
            let after = freeAddrIds.slice(0, -1)
            after.push('notAll')
            return after
        }

        return freeAddrIds;
    }

    if (hasNotAll) {
        if (len === options.length + 1) {
            return [...options.map(v => v.value), 'all']
        }

    }
    if (len === options.length) {
        return []
    }
    let index = freeAddrIds.indexOf('all')
    if (index > -1) {
        freeAddrIds.splice(index, 1)
        return [...freeAddrIds]
    }
    return freeAddrIds;
}

const type2Text = [['件内', '件，增加运费'], ['kg内', 'kg，增加运费'], ['m³ 内', 'm³，增加运费']]
const FakerInput = ({ value }) => <div>{value}</div>
const FakerText = ({ value, place }) => <div>{type2Text[value][place]}</div>

const data2values = (data, options) => {
    let { customerPayRules, areaList, type } = data;
    /**添加用与显示的字段 */
    const addLabelField = v => ({
        ...v,
        pname: options.find(p => p.value === v.provinceId).label,
        type,
    })

    customerPayRules = customerPayRules.map(addLabelField)
    //eslint-disable-next-line
    let freeAddrIds = areaList.filter(v => v.reasonCode == null).map(v => v.provinceId)
    areaList = areaList.filter(v => v.reasonCode != null).map(addLabelField)

    return {
        ...data,
        customerPayRules,
        freeAddrIds,
        areaList
    }
}
const values2data = values => {
    let { freeAddrIds, areaList, customerPayRules, sendFromAddressId } = values
    freeAddrIds = freeAddrIds.filter(v => /^\d/.test(v))
    //eslint-disable-next-line
    areaList = areaList.map(v => (v.pname = undefined, v))//不配送
    areaList = [...areaList, ...freeAddrIds.map(v => ({ provinceId: v }))]//包邮也放进这个参数，只有id
    //eslint-disable-next-line
    customerPayRules = customerPayRules.map(v => (v.pname = undefined, v.type = undefined, v))
    sendFromAddressId = sendFromAddressId.join(',')
    return {
        ...values,
        sendFromAddressId,
        areaList,
        customerPayRules,
    }
}
/**默认其他 */
const defoResonCode = reasonCodes.length-1
export default function ModifyLogisticsTemplate({ location, history }) {
    const { state = {} } = location;
    const { editData } = state;
    const isEdit = editData !== undefined
    const [form] = Form.useForm()
    const [addrOptions, setAddrOptions] = useState([])
    const [isChangeAll, setIsChangeAll] = useState(false)

    useEffect(() => {

        if (isEdit) {
            const getDetail = async () => {
                let res = await api.getDetail(editData.id)
                if (res.code) return message.error(res.msg)
                let detail = res.data
                detail.sendFromAddressId = detail.sendFromAddressId.split(',')
                let options = await makeCasecaderDefoValue(detail.sendFromAddressId)

                setAddrOptions(options)
                form.setFieldsValue(data2values(detail, options))


            }
            getDetail()

        } else {
            getAddrOptions((options) => {
                setAddrOptions(options)

                let freeAddrIds = options.map(v => v.value).slice(0, -4)
                let areaList = options.slice(-4).map(v => ({
                    provinceId: v.value,
                    pname: v.label,
                    reasonCode: defoResonCode
                }))
                form.setFieldsValue({ freeAddrIds, areaList })
            })
            form.setFieldsValue({
                type: 0,
                areaList: [],
                customerPayRules: []
            })
        }
        //eslint-disable-next-line
    }, [])
    // useEffect(()=>{
    //     if(!isChangeAll) return;
    //     setIsChangeAll(false)
    // },[isChangeAll])



    const getOptionsByPid = selectedOptions => {

        const last = selectedOptions.length - 1
        if (last < 0) return;
        const targetOption = selectedOptions[last];
        targetOption.loading = true;
        getAddrOptions((datas) => {
            targetOption.loading = false;
            targetOption.children = datas;
            setAddrOptions(s => [...s])
        }, targetOption.value)
    }
    const updateOtherAddrOptions = (cur, all) => {
        let { type } = all;
        if (!cur.length) {//全不选
            setIsChangeAll(true)

            let values = {
                areaList: [],
                customerPayRules: addrOptions.map(v => ({ pname: v.label, provinceId: v.value, type })),
            }
            form.setFieldsValue(values)
            setTimeout(setIsChangeAll, 0, false)
            return;
        };
        let ids = cur.filter(v => /^\d/.test(v))
        if (ids.length === addrOptions.length) {//全选

            form.setFieldsValue({
                areaList: [],
                customerPayRules: [],
            })
            return
        }
        let { customerPayRules, areaList } = all;

        ids = ids.concat(areaList.map(v => v.provinceId))


        customerPayRules = addrOptions
            .filter(v => !ids.includes(v.value))
            .map(v => ({ pname: v.label, provinceId: v.value, type }))

        form.setFieldsValue({ customerPayRules })


    }

    const handleValueChange = (ed, all) => {
        if (ed.type !== undefined) {
            let {
                customerPayRules,

            } = all;
            // eslint-disable-next-line
            customerPayRules = customerPayRules.map(v => (v.type = ed.type, v))

            form.setFieldsValue({
                customerPayRules,

            })
            return;
        }
        if (ed.freeAddrIds) {
            let after = handleAddrIdSelect(ed.freeAddrIds, addrOptions)
            updateOtherAddrOptions(after, all)
            form.setFieldsValue({ freeAddrIds: after })
        }

    }
    const move2needPay = (remove, i) => () => {
        let values = form.getFieldsValue()
        let notSends = values.areaList
        let needPays = values.customerPayRules
        const { provinceId, pname } = notSends[i]
        let one = {
            provinceId,
            pname,
            type: values.type

        }

        form.setFieldsValue({ customerPayRules: [...needPays, one] })
        remove(i)
    }
    const move2notSend = (remove, i) => () => {
        let values = form.getFieldsValue()
        let notSends = values.areaList
        let needPays = values.customerPayRules
        const { provinceId, pname } = needPays[i]
        let one = {
            provinceId,
            reasonCode: defoResonCode,
            pname,
            type: values.type
        }

        form.setFieldsValue({ areaList: [...notSends, one] })
        remove(i)
    }
    const onSubmit = async () => {
        let hasErr = false
        let values = await form.validateFields().catch(e => hasErr = true)
        if (hasErr) return;

        values = values2data(values)

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
            name="template"
            onValuesChange={handleValueChange}
        >

            <Item label="模版名称" name="name" rules={rules.name}><Input /></Item>
            <Item label="模版类型" name="type" >
                <Radio.Group>
                    {calcType.map((v, i) => <Radio key={i} value={i}>{v}</Radio>)}
                </Radio.Group>
            </Item>
            <Item label="发货地址" name="sendFromAddressId" rules={rules.sendFromAddressId} wrapperCol={{ span: 8 }}>
                <Cascader
                    options={addrOptions}
                    loadData={getOptionsByPid}
                />
            </Item>
            <Item
                label="包邮地区"
                name="freeAddrIds"
                tooltip="没选的地区会自动 移到 不配送区域"
            >
                <Checkbox.Group>
                    <Spin spinning={isChangeAll}>

                        <Row>
                            <Col span={6}><Checkbox value="all">[全选]</Checkbox></Col>
                            <Checkbox value="notAll" style={{ display: 'none' }}></Checkbox>
                            {addrOptions.map(v => <Col key={v.value} span={6}><Checkbox value={v.value}>{v.label}</Checkbox></Col>)}

                        </Row>
                    </Spin>

                </Checkbox.Group>
            </Item>
            <Form.List name="customerPayRules">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, i) => (
                            <Item
                                {...(i === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={i === 0 ? '买家付邮费区域' : ''}
                                required={false}
                                key={field.key}
                            >
                                <InputCard>
                                    <Form.Item noStyle name={[field.name, 'pname']}>
                                        <FakerInput />
                                    </Form.Item>

                                    <Form.Item

                                        noStyle
                                        name={[field.name, 'base']}
                                        fieldKey={[field.fieldKey, 'base']}
                                        rules={[{ required: true, message: '请输入' }]}
                                    >
                                        <InputNumber min={1} />

                                    </Form.Item>
                                    <Item noStyle name={[field.name, 'type']}><FakerText place={0} /></Item>


                                    <Form.Item

                                        noStyle
                                        name={[field.name, 'basePrice']}
                                        fieldKey={[field.fieldKey, 'basePrice']}
                                        rules={[{ required: true, message: '请输入' }]}
                                    >
                                        <InputNumber min={0} />
                                    </Form.Item>
                                    <div>元，&nbsp; &nbsp;每增加</div>
                                    <Form.Item

                                        noStyle
                                        name={[field.name, 'addition']}
                                        fieldKey={[field.fieldKey, 'addition']}
                                        rules={[{ required: true, message: '请输入' }]}
                                    >
                                        <InputNumber min={0} />
                                    </Form.Item>
                                    <Item noStyle name={[field.name, 'type']}><FakerText place={1} /></Item>
                                    <Form.Item

                                        noStyle
                                        name={[field.name, 'additionPrice']}
                                        fieldKey={[field.fieldKey, 'additionPrice']}
                                        rules={[{ required: true, message: '请输入' }]}
                                    >
                                        <InputNumber min={0} />
                                    </Form.Item>
                                    <div>元</div>
                                    <MinusCircleOutlined onClick={move2notSend(remove, field.name)} />

                                </InputCard>
                            </Item>
                        ))}
                    </>
                )}
            </Form.List>
            <Form.List name="areaList">
                {(fields, { add, remove }) => (

                    <>
                        {fields.map((field, i) => (
                            <Item
                                {...(i === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={i === 0 ? '不配送区域' : ''}
                                required={false}
                                key={field.key}
                                tooltip="删除后自动 移到 买家付邮费区域"
                            >
                                <Card
                                    size="small"
                                    title={
                                        <Item name={[field.name, 'pname']} noStyle><FakerInput /></Item>
                                    }
                                    extra={<a onClick={move2needPay(remove, field.name)}>删除</a>}>
                                    <Form.Item

                                        name={[field.name, 'provinceId']}
                                        fieldKey={[field.fieldKey, 'provinceId']}
                                        hidden
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item

                                        name={[field.name, 'reasonCode']}
                                        fieldKey={[field.fieldKey, 'reasonCode']}
                                    >
                                        <Radio.Group>
                                            {reasonCodes.map((v, i) => <Radio style={h32} value={i} key={i}>{v}</Radio>)}
                                        </Radio.Group>
                                    </Form.Item>

                                </Card>
                            </Item>
                        ))}
                    </>
                )}
            </Form.List>


            <Item {...tailLayout}><Button type="primary" onClick={onSubmit}>确认提交</Button></Item>
        </Form>

    )

}