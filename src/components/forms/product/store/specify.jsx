import React, { useState, useEffect, useCallback, useMemo, forwardRef } from 'react'
import { Form, Input, Checkbox, message, Button, Modal } from "antd";
import propertyApi from "../../../../api/property"
import styled from "styled-components"
import SkuForm from './sku';
import baseConfig from "../../../../config/base";
import FilterableSelect from '../../../formItem/FilterableSelect';
import { unionBy } from '../../../../utils/tool';

const Item = Form.Item;
const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
};
const noLabelLayout = {
    wrapperCol: { offset: 2, span: 22 },

}
const MAX_SPEC_LEN = baseConfig.maxSpecifyNum - 1;//Form.List从零开始，故减1

const Desk = styled.div`
    box-shadow: 0px 0px 5px 0px #AFAFB1;
    border-radius: 2px;
    padding:14px;
    &>.sb{
        display:flex;
        justify-content:space-between;
        &>div:nth-child(1){
            width: 40%;
        }
        .dele{
            color: #1890ff;
            cursor: pointer;
        }
    }
    .spes{
        display:flex;
        flex-wrap:wrap;
    }
    .spes>input{
        width:160px;
        margin:0 8px;
    }
    .spes>.one{
        width: 30%;
        display: flex;
        align-items: center;
         margin-left:14px;
        &:nth-child(n+4){
            margin-top:14px;
        }
        &>label{
            margin-right:8px;
        }
    }
`

const getPropertyOptions = async (next) => {
    let res = await propertyApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
function getNamePath(obj) {
    let arr = []
    function work(obj, arr) {
        let key = Object.keys(obj)[0]
        if (key == null) return arr;
        arr.push(key)
        if (typeof obj[key] !== 'object') return arr;
        return work(obj[key], arr)
    }
    return work(obj, arr)

}
/**判断是否有重复的值*/
function deDuplication(form, next) {
    return function (skuI, i) {
        return function () {
            let all = form.getFieldsValue()
            let arr = ['spec', skuI, 'values'].reduce((pre, cur) => pre[cur], all)
            if (arr.length < 2) return;
            let unionLen = new Set(arr.map(v => v.value)).size;
            let isLast = i === arr.length - 1;
            if (unionLen !== arr.length) {
                message.warning('规格值不能重复')
                if (isLast) {
                    arr[i].value = undefined
                } else {
                    arr.splice(i, 1)
                }

                form.setFieldsValue({ ...all })
                return;
            }
            next(form.getFieldValue('spec'))
        }
    }
}

function onSpeisifiesChange({ spec }, all, form, next) {
    let keys = getNamePath(spec)
    let len = keys.length;
    if (len !== 4) return
    //now keys like [0,values,0,value]
    let v = keys.reduce((pre, cur) => pre[cur], spec)
    let [curI, curK] = keys.splice(2)
    curI = curI * 1;
    let arr = keys.reduce((pre, cur) => pre[cur], all.spec)
    let lastI = arr.length - 1
    //是否最后一个 
    let isLast = curI === lastI;
    switch (curK) {
        case 'value':
            if (!v) return;

            //如果最后一个有值，自动添加一个
            if (arr[lastI].value) {
                arr[curI].isUsed = true;
                arr.push({ isUsed: false, value: undefined })
                form.setFieldsValue({ ...all })
            }
            break;
        case 'isUsed':
            let isEmpty = !arr[curI].value
            if (v && isLast && isEmpty) {
                arr[curI].isUsed = false
                form.setFieldsValue({ ...all })
                return
            }
            // if (isLast) {} 默认如此
            if (!isLast) {
                arr.splice(curI, 1)
                form.setFieldsValue({ ...all })
                //从表格移除
            }
            next(all.spec)
            break;
        default:
            console.error('未处理字段')
            break;
    }
}

/**回填表单值  */
const backfill = (defo, propertyOptions) => {
    let { productSkus } = defo;
    let skus = productSkus || [];
    let properties = skus.map(s => s.skuPropertyModels).filter(p => !!p).flat();
    let ids = properties.map(p => p.propertyId);
    let unioned = Array.from(new Set(ids));
    
    let eds = propertyOptions.filter(d => unioned.includes(d.id));

    let unionedProperties = unioned.map(id => properties.find(p => p.propertyId === id))
    let spec = unionedProperties.map(v => {
        let all = properties.filter(p => p.propertyId === v.propertyId && p.optionName !== v.optionName);
        all = unionBy(v => v.optionName, all)
        all.unshift(v)
        return {
            propertyId: v.propertyId,
            values: all.map((a, i) => ({
                isUsed: true,
                value: a.optionName,
                id: a.id || `_${i}`//草稿箱没id
            }))
        };
    });
    spec.forEach(s => {
        s.values.push({ isUsed: false, value: undefined, id: undefined });
    });
    return { spec, eds };
}


function Sku({ defo }, ref) {
    const [propertyOptions, setPropertyOptions] = useState([])
    const [form] = Form.useForm()
    const [formValues, setSpecValues] = useState([])
    //下面两个state为了符合直觉 已经被选中的不会出现在规格的选项中
    const [selecteds, setSelecteds] = useState([])
    const [validOpts, setValidOpts] = useState([])
    useEffect(() => {
        getPropertyOptions((datas) => {
            setPropertyOptions(datas)
            setValidOpts(Array(baseConfig.maxSpecifyNum).fill(datas))
        })
    }, [])
    useEffect(() => {
        if (!defo || !propertyOptions.length) return;
        let { spec, eds } = backfill(defo, propertyOptions);
        setSelecteds(eds)
        setSpecValues(spec)
        let ids = eds.map(v => v.id)
        let valids = spec.map(s => {
            let otherSelected = ids.filter(v => v !== s.propertyId)
            let ex = propertyOptions.filter(v => !otherSelected.includes(v.id))
            return ex;
        })
        if (valids.length) {
            setValidOpts(valids)
        }
        form.setFieldsValue({ spec })

    }, [defo, propertyOptions])
    const deleOneSpec = (remove, { name }) => () => {
        remove(name)
        let { id } = selecteds.splice(name, 1)
        let valids = validOpts.map(v => propertyOptions.filter(s => s.id !== id))
        setSelecteds([...selecteds])
        setSpecValues(form.getFieldValue('spec'))
        setValidOpts(valids)
    }

    const addOneSpesify = (add, index) => () => {
        add({
            propertyId: undefined,
            values: [{ isUsed: false, value: undefined }]
        })
        let ids = selecteds.map(v => v.id)
        validOpts[index] = validOpts[index].filter(v => !ids.includes(v.id))
        setValidOpts([...validOpts])
    }
    const onPropertyChange = index => (value, option) => {
        let one = { id: value, name: option.children }
        selecteds.splice(index, 1, one)
        let valids = validOpts.map(v => v.filter(s => s.id !== value))
        valids[index].push(one)
        setSelecteds([...selecteds])
        setValidOpts(valids)
    }

    const buildSpecifies = (skuIndex, onValueChange) => (fields, { add, remove }) => (
        fields.map((field, i) => (
            <div key={i} className="one">
                <Item name={[field.name, "isUsed"]} noStyle valuePropName="checked" ><Checkbox tabIndex={-1} /></Item>
                <Item name={[field.name, "value"]} noStyle ><Input onBlur={onValueChange(skuIndex, i)} /></Item>
                <Item name={[field.name, "id"]} hidden noStyle ><Input /></Item>
            </div>
        )
        )
    )
    const buildSpec = (onValueChange) => (fields, { add, remove }) => {
        const dynmicFields = fields.map((field, i) => (
            <Item
                {...(i > 0 ? noLabelLayout : layout)}
                label={i > 0 ? '' : '商品规格'}
                required={false}
                key={field.key}
            >
                <Desk>
                    <div className="sb">
                        <Item name={[field.name, 'propertyId']} >
                            <FilterableSelect
                                placeholder={`规格${i + 1}`}
                                onChange={onPropertyChange(i)}
                                options={validOpts[i]} />

                        </Item>
                        <div className="dele" onClick={deleOneSpec(remove, field)}>删除规格</div>
                    </div>

                    <div className="spes">
                        <Form.List name={[field.name, 'values']} >
                            {buildSpecifies(i, onValueChange)}
                        </Form.List>
                    </div>
                </Desk>
            </Item>
        ))
        return (
            <>
                {dynmicFields}
                {fields.length > MAX_SPEC_LEN
                    ? null

                    : (<Item
                        wrapperCol={fields.length > 0 ? noLabelLayout.wrapperCol : undefined}
                        label={!fields.length ? '商品规格' : ''}
                        labelCol={{ span: 2 }}
                    >
                        <Button onClick={addOneSpesify(add, fields.length)}>添加规格</Button>
                    </Item>)
                }
            </>
        )
    }
    const handleFieldsChange = useCallback((edited, all) => {
        onSpeisifiesChange(edited, all, form, setSpecValues)
    }, [])
    const onValueChange = useCallback(deDuplication(form, setSpecValues), [])

    const tableForm = useMemo(() => <SkuForm options={selecteds} spec={formValues} defo={defo} ref={ref} />, [selecteds, formValues])

    return (
        <>
            <Form
                form={form}
                onValuesChange={handleFieldsChange}
                name="specsifies">
                <Form.List name="spec">
                    {buildSpec(onValueChange)}
                </Form.List>
            </Form>
            {tableForm}
        </>
    )
}
export default forwardRef(Sku)
