import React, { useState, forwardRef, useEffect } from 'react'
import { message, Form, Select, InputNumber, Checkbox, Switch, DatePicker } from "antd";
import { serveciCommitment } from '../../../config/enums';
import api from "../../../api/product"
import SearchSelect from "../../../components/formItem/searchSelect"
import templateApi from "../../../api/template"
import moment from 'moment'
import SufixTip from '../../../components/styled/sufixTip'
const Item = Form.Item;
const Option = Select.Option
const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
};
const getTemplateOptions = async (next) => {
    let res = await templateApi.getAll()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const extraFormValues = form => () => {
    // let hasErr = false
    // let values = await form.validateFields().catch(e => hasErr = true)
    // if (hasErr) return false;
    let values = form.getFieldsValue()
    let { commitment = [], isPreSale = false, isShelve = false, preSaleTime } = values
    commitment.forEach(c => {
        values[c] = 1
    })
    values.commitment = undefined
    values.isPreSale = isPreSale ? 1 : 0
    values.isShelve = isShelve ? 1 : 0
    values.preSaleTime = preSaleTime ? preSaleTime.format('YYYY-MM-DD HH:mm:ss') : undefined
    return values
}
const backfill = (defo) => {
    let { productShelveService: values, productSkus: skus } = defo
    if (!values) return undefined;
    let commitment = serveciCommitment.map(([k]) => values[k] ? k : undefined).filter(k => k !== undefined)
    let serviceFee, preSaleTime;
    let isPreSale = values.isPreSale ? true : false;
    let isShelve = values.isShelve ? true : false;
    if (isPreSale) {
        preSaleTime = moment(values.preSaleTime)
    }

    if (skus) {
        serviceFee = (skus[0]||{}).serviceFee
    }
    //todo relatedProductIds 需要还原
    return {
        commitment,
        serviceFee,
        isPreSale,
        isShelve,
        preSaleTime,
        templateId: values.templateId || undefined
    }
}
function ProductOther({ defo }, ref) {
    const [form] = Form.useForm()//服务承诺相关

    const [templateOptions, setTemplateOptions] = useState([])
    const [defoRelatedOptions, setDefoRelatedOptions] = useState([])

    useEffect(() => {
        getTemplateOptions(setTemplateOptions)
        ref.current.push(extraFormValues(form))
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!defo) return;
        let initValue = backfill(defo)
        form.setFieldsValue(initValue)
        //eslint-disable-next-line
    }, [defo])

    return <Form
        form={form}
        {...layout}
    >
        <Item name="commitment" label="服务承诺" wrapperCol={{ span: 20 }}>
            <Checkbox.Group>
                {serveciCommitment.map(([key, label]) => <Checkbox value={key} key={key}>{label}</Checkbox>)}
            </Checkbox.Group>
        </Item>
        <Item name="templateId" label="运费模版">
            <Select placeholder="点击选择">
                {templateOptions.map(v => <Option value={v.id} key={v.id}>{v.name}</Option>)}
            </Select>
        </Item>
        <Item label="关联产品" name="relatedProductIds">
            <SearchSelect
                disabled
                mode="multiple"
                defaultOptions={defoRelatedOptions}
                placeholder="搜索产品名称 (开发中..)"
                searchReq={api.getOptions} />

        </Item>
        <Item label="服务费率" >
            <Item name="serviceFee" initialValue={3} noStyle>
                <InputNumber style={{ width: '80%' }} min={0} max={5} />
            </Item>
            <SufixTip>%</SufixTip>
        </Item>
        <Item name="isPreSale" label="是否预售" valuePropName="checked"><Switch /></Item>
        <Item noStyle shouldUpdate={(pre, cur) => pre.isPreSale !== cur.isPreSale}>
            {({ getFieldValue }) => {
                let isPreSale = getFieldValue('isPreSale')
                if (!isPreSale) return null
                return (
                    <Item name="preSaleTime" label="预售时间" >
                        <DatePicker style={{ width: '100%' }} />
                    </Item>
                )
            }
            }
        </Item>
        <Item name="isShelve" label="是否上架" valuePropName="checked"><Switch /></Item>
    </Form>;
}

export default forwardRef(ProductOther)