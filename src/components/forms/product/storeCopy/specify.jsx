import React, { useState, useEffect, useMemo, forwardRef } from 'react'
import { Form, Input, Checkbox, message, Button } from "antd";
import propertyApi from "../../../../api/property"
import styled from "styled-components"
import SkuForm from './sku';
import baseConfig from "../.././../../config/base";
import FilterableSelect from '../../../formItem/FilterableSelect';

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
        all.unshift(v)
        return {
            propertyId: v.propertyId,
            values: all.map(a => ({
                isUsed: true,
                value: a.optionName,
                id: a.id
            }))
        };
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
        //eslint-disable-next-line
    }, [defo, propertyOptions])


    const addOneSpesify = (add, index) => () => {
        add({
            propertyId: undefined,
            values: [{ isUsed: false, value: undefined }]
        })
        let ids = selecteds.map(v => v.id)
        validOpts[index] = validOpts[index].filter(v => !ids.includes(v.id))
        setValidOpts([...validOpts])
    }


    const buildSpecifies = () => (fields, { add, remove }) => (
        fields.map((field, i) => (
            <div key={i} className="one">
                <Item name={[field.name, "isUsed"]} noStyle valuePropName="checked" ><Checkbox tabIndex={-1} disabled/></Item>
                <Item name={[field.name, "value"]} noStyle ><Input disabled/></Item>
                <Item name={[field.name, "id"]} hidden noStyle ><Input disabled/></Item>
            </div>
        )
        )
    )
    const buildSpec = () => (fields, { add, remove }) => {
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
                                disabled
                                placeholder={`规格${i + 1}`}
                                options={validOpts[i]} />

                        </Item>

                    </div>

                    <div className="spes">
                        <Form.List name={[field.name, 'values']} disabled >
                            {buildSpecifies()}
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
                        {/* <Button onClick={addOneSpesify(add, fields.length)}>添加规格</Button> */}
                    </Item>)
                }
            </>
        )
    }

    //eslint-disable-next-line
    const tableForm = useMemo(() => <SkuForm options={selecteds} spec={formValues} defo={defo} ref={ref} />, [selecteds, formValues])

    return (
        <>
            <Form
                form={form}
                name="specsifies">
                <Form.List name="spec">
                    {buildSpec()}
                </Form.List>
            </Form>
            {tableForm}
        </>
    )
}
export default forwardRef(Sku)
