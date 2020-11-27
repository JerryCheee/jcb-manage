import React, { forwardRef, useCallback, useEffect } from 'react';
import { Input, Switch, Form, Button, Select, message } from "antd";
import ImgUpload from '../../formItem/imgUpload';
import styled from "styled-components"
import { debounce } from '../../../utils/tool';
import { makeUploadDefaultValue } from '../../../utils/formHelp';


const Item = Form.Item
const Option = Select.Option
const TableBox = styled.div`
    background-color:rgba(0,0,0,.02);
    font-size:12px;
    padding:14px 24px;
    .shortcut{
        display:flex;
        margin:14px 0;
        &>input {
            max-width: 90px;
        }
        &>.ant-select {
            max-width: 160px;
        }
        &>*{
            margin-left:6px;
        }
    }
    &>.tip{
        .warn{
           color:#FF9800;
           margin-bottom:8px;
       }
       .row{
           display: flex;
           line-height:28px;
         &>.grey{
             color:grey;
             margin-left:20px;
         }
       }
       .sb{
            justify-content:space-between;
       }
       
    }
    .t-box{
        overflow: hidden;
        border-top: 1px solid #ebebeb;
        border-left: 1px solid #ebebeb;
        border-radius: 3px;
        width: max-content;
        
    }
    table{
        overflow-x:auto;
        tbody>tr{
            background-color:white;
        }
        th{
            color: rgba(0, 0, 0, 0.6);
            padding: 9px 12px;
            position: relative;
            font-weight: 400;
            text-align:center;
        }
        th,td{
            border-right: 1px solid #ebebeb;
            border-bottom: 1px solid #ebebeb;
        }
        td{
            text-align:center;
            .ant-upload-list-picture-card-container{
                margin:0
            }
        }
        tr>td:last-of-type {
            text-align: center;
        }
        input{
            border: none;
            padding: 20px 0;
            text-align:center;
        }
        .ant-upload-select-picture-card{
            width:40px;
            height:40px;
            display:block;
            margin:0 auto;
            .ant-upload-list-picture-card-container {
                width: 50px;
                height: 50px;
                display: block;
                margin: 0 auto;
            }       
            .ant-upload-list-item-info::before {
                left: 0;
            }
            .ant-upload-list-item-list-type-picture-card {
                padding: 0 !important;
            }
            .ant-upload-text{
                display:none
            }
            img{
                width: 80px;
                height: 80px;
            }
        }
}

`

const defoOption = <Option key={-1} value={-1}>全部</Option>
const inputCols = [
    { key: 'number', name: '库存' },
    { key: 'advicePrice', name: '市场价' },
    { key: 'discount', name: '折扣%' },
    { key: 'factoryPrice', name: '供货价' },
    { key: 'weight', name: '重量' },
    { key: 'volume', name: '体积' },
    { key: 'skuCode', name: '编号' }
];
const shortcutCols = [
    { key: 'number', name: '库存' },
    { key: 'advicePrice', name: '市场价' },
    { key: 'discount', name: '折扣%' },
    { key: 'weight', name: '重量' },
    { key: 'volume', name: '体积' }
]
const defoValuesKv = [['isShelve', true]]
/**
 * 生成一个只有规格和默认值的sku
 * @param {SpecValue} v
 * @param {number} j 
 * @returns {Spec} 
*/
const genSku = (v, j) => ({
    optionName: v.value,
    id: v.id || '_' + j,//下划线开头表示新增 提交前通过判断把它干掉
    propertyId: v.propertyId
})


/**
 * 将规格值 去重后生成快捷设置内的选项
 * @param {SpecValue[]} specs 
 * @returns {SelectOption[]}
 */
function buildOptions(specs = []) {
    let specValues = specs.map(v => v.value)
    specValues = Array.from(new Set(specValues))
    let opts = specValues.map(s => <Option key={s}>{s}</Option>)
    return [defoOption, ...opts]
}

/**
 * 动态生成 规格的 快捷设置 
 * @param {Option[]} options 
 * @param {SpecValue[][]} values 
 * @param {{key:string,name:string}[]} inputs 
 */
function buildShortcuts(options, values, inputs) {
    let selects = options.map((v, i) => <Item key={i} noStyle name={['shortcut', 'optionNames', i]} initialValue={-1}><Select>{buildOptions(values[i])}</Select></Item>)
    let start = options.length
    let items = inputs.map((v, i) => <Item key={i + start} noStyle name={['shortcut', v.key]} ><Input placeholder={v.name} /></Item>)
    return selects.concat(items)
}
/**
 * 
 * @param {SpecValue[]} specs 
 * @param {number} i 
 */
function buildSpecItem(specs, i) {
    return specs.map((v, j) => (
        <React.Fragment key={j}>
            <Item hidden name={['skus', i, 'skuPropertyModels', j, 'optionName']} ><Input /></Item>
            <Item hidden name={['skus', i, 'skuPropertyModels', j, 'propertyId']}><Input /></Item>
            <Item hidden name={['skus', i, 'skuPropertyModels', j, 'id']}><Input /></Item>
        </React.Fragment>
    ))
}
/**
 * 获取对象的第一个key，对于嵌套对象 返回数组key
 * 如{a:{b:{c:'value'}}}
 * 返回 ['a','b','c']
 * @param {object} obj 
 * @returns {string[]}
 */
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
/**表格内 值同步变更 [key,calcFn] */
const valueSyncMap = new Map([
    ['advicePrice', function (sku) {
        let { discount = 1, advicePrice } = sku
        sku.factoryPrice = advicePrice * discount / 100
    }],
    ['discount', function (sku) {
        let { discount, advicePrice = 1 } = sku
        sku.factoryPrice = advicePrice * discount / 100
    }],
    ['factoryPrice', function (sku) {
        let { advicePrice = 1, factoryPrice = 1 } = sku
        sku.discount = factoryPrice / advicePrice * 100
    }]])
/**快捷设置内 值同步变更 [key,calcFn] 只同步 供货价 */
const shortcutSyncMap = new Map([
    ['advicePrice', function (sku, shortcut) {
        let { advicePrice } = shortcut
        let { discount = 100 } = sku
        let factoryPrice = advicePrice * discount / 100
        return { discount, advicePrice, factoryPrice }

    }],
    ['discount', function (sku, shortcut) {
        let { discount } = shortcut
        let { advicePrice = 1 } = sku
        let factoryPrice = advicePrice * discount / 100
        return { discount, advicePrice, factoryPrice }

    }],
    //两个都有
    ['advicePrice-discount', function (sku, shortcut) {
        let { discount, advicePrice } = shortcut
        let factoryPrice = advicePrice * discount / 100
        return { discount, advicePrice, factoryPrice }
    }]])
/**跟 shortcutSyncMap 保存一致*/
const needCalcKeys = ['advicePrice', 'discount']

/**
 * 监听表单值
 * @param {FormInstance} form
 * @returns {(ed:object,all:object)=>void}
 */
const valueChangeHandler = form => (ed, all) => {
    let keys = getNamePath(ed)
    let lastK = keys.pop()

    switch (keys[0]) {
        case 'skus':
            if (!valueSyncMap.has(lastK)) return;
            //值同步，比如修改折扣会同时修改出货价
            let sku = keys.reduce((pre, cur) => pre[cur], all)
            valueSyncMap.get(lastK)(sku)
            form.setFieldsValue({ ...all })
            break;
        case 'shortcut'://快捷操作中
            let isSpec = /\d/.test(lastK)
            if (!isSpec) break;
            //如果规格发生变化，清空输入框内容，避免误操作
            let shortcut = all.shortcut
            shortcutCols.forEach(v => shortcut[v.key] = undefined)
            form.setFieldsValue({ ...all })
            break;
        default:
            break;
    }


}
/**
 * 分步比较 用于判断快捷设置内的选项
 * @param {string|-1} first
 * @returns {(second:string|-1)=>boolean}
 */
function stepCompare(first = -1) {
    let isPass = first === -1;
    return function (second = -1) {
        return isPass ? true : second === first
    }
}

const isFakeId = id => /^_\d+/.test(id);//like '_0'


/**
 * 将快捷设置值 填充到 适配的规格
 * @param {FormInstance} form 
 */
const autoSet = form => {
    let { shortcut, skus } = form.getFieldsValue()
    let { optionNames, ...rest } = shortcut;
    let kvs = Object.entries(rest).filter(([k, v]) => v !== undefined)
    if (!kvs.length) return message.warn('请输入要填充的值');
    let values = Object.fromEntries(kvs)
    let compareFns = optionNames.map(stepCompare)

    skus = skus.map(s => {
        let isSame = s.skuPropertyModels.every((m, i) => compareFns[i](m.optionName))
        if (!isSame) return s;

        let syncKeys = needCalcKeys.filter(k => !!values[k])
        if (!syncKeys.length) return { ...s, ...values }

        let fn = shortcutSyncMap.get(syncKeys.join('-'))
        let updated = fn(s, values)
        return { ...s, ...values, ...updated }

    })
    form.setFieldsValue({ skus })
}
/**
 * 从表单提取并转换 sku值 
 * @param {FormInstance} form 
 */
const extraFormValues = form => () => {
    // let hasErr = false
    // let { skus } = await form.validateFields().catch(e => hasErr = true)
    // if (hasErr) return false;
    /**@type {FormValues} */
    let { skus = [] } = form.getFieldsValue()
    /**@type {SkuOrigin[]} */
    let converted = skus.map(v => {
        let { preview , isShelve } = v;
        preview = preview || []

        v.skuPropertyModels.forEach(s => {
            if (isFakeId(s.id)) {
                s.id = undefined
            }
        })
        if (preview.length) {
            v.preview = preview[0].response.message
        }
        v.isShelve = isShelve ? 1 : 0;
        return v

    })
    return converted
}

/**回填 表单值 
 * @param {{productSkus:SkuOrigin[]}} defo
 * @returns {{skus:SkuInForm[]}}
*/
const backfill = (defo) => {
    let { productSkus } = defo;
    let skus = productSkus || []
    if (!skus.length) return undefined;

    /**
     * 处理null 和 需要格式转换的值
     * @param {SkuOrigin} s 
     */
    const valueConver = s => {
        // keys.forEach(k => {
        //     if (s[k] === null) {
        //         s[k] = undefined
        //     };
        // })
        if (s.preview) {
            s.preview = makeUploadDefaultValue([s.preview])
        }
        s.isShelve = s.isShelve ? true : false
    }

    skus.forEach(valueConver)
    return { skus }
}
const defoSpes = [];
/**
 * 
 * @param {Props} props 
 * @param {React.RefObject<{()=>object}[]>} ref 
 */
function SkuForm({ options, spec = defoSpes, defo }, ref) {
    const [form] = Form.useForm()
    const hanleValueChange = useCallback(debounce(valueChangeHandler(form), 300), [])

    /**@type {SpecValue[][]}*/
    let validSpecs = spec.map(v => v.values.filter(a => a.isUsed));
    validSpecs.forEach((arr, i) => arr.forEach(v => v.propertyId = spec[i].propertyId))
    let [first = [], ...rest] = validSpecs;

    /**@type {SpecValue[][]}*/
    let items = rest.length
        ? rest.reduce((pre, cur, i) => {
            return pre.map(p => cur.map(c => i > 0 ? p.concat(c) : [p, c])).flat()
        }, first)
        : first.map(f => [f])



    /**@type {React.ReactNode[]} tr表格行 行内单元格td 为表单项*/
    let contents = items.map((s, i) => (
        <tr key={i}>
            {/* {rows[i]} */}
            {s.map((v, j) => <td key={j}>{v.value}</td>)}
            {inputCols.map((n, ni) => <td key={ni}><Item noStyle name={['skus', i, n.key]}><Input /></Item></td>)}
            <td>
                {buildSpecItem(s, i)}
                <Item noStyle name={['skus', i, 'preview']} valuePropName="fileList"><ImgUpload /></Item>
                <Item hidden name={['skus', i, 'id']}><Input /></Item>
            </td>
            <td><Item noStyle name={['skus', i, 'isShelve']} valuePropName="checked" initialValue={true}><Switch /></Item></td>
        </tr>)
    )

    useEffect(() => {//这个副作用只会执行一次
        ref.current.push(extraFormValues(form))
    }, [])

    useEffect(() => {//这个副作用没有指定依赖数组，会在每次更新执行
        /**@type {FormValues} */
        let preValues = form.getFieldsValue()
        let specArr = items.map(arr => arr.map(genSku))
        let skus = specArr.length && preValues.skus
            ? specArr.map((cur, i) => {
                /**@type {SkuInForm} */
                let pre = preValues.skus[i] || Object.fromEntries(defoValuesKv);
                pre.skuPropertyModels = specArr[i]
                return pre
            })
            : []
        let { shortcut } = preValues;
        if (!shortcut) {
            form.setFieldsValue({ skus })
            return;
        }
        shortcut.optionNames.fill(-1)
        form.setFieldsValue({ shortcut, skus })
    })


    useEffect(() => {
        if (!defo) return;
        let initValues = backfill(defo)
        form.setFieldsValue(initValues)
    }, [defo])

    const autoSetCallBack = useCallback(() => autoSet(form), [])

    return (
        <Form
            form={form}
            name="skutable"
            onValuesChange={hanleValueChange}
        >
            <Item label="价格和库存" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                <TableBox>
                    <div className="tip">
                        <div className="warn">请如实填写库存信息，以确保商品可以在承诺发货时间内发出，避免可能的物流违规</div>
                        <div className="row sb">
                            <div className="row">
                                <h6>批量设置</h6>
                                <div className="grey">在下方栏中选择内容进行批量填充</div>
                            </div>
                            <Button onClick={autoSetCallBack}>立即设置</Button>
                        </div>
                        <div className="shortcut">
                            {contents.length ? buildShortcuts(options, validSpecs, shortcutCols) : null}
                        </div>
                    </div>
                    <div className="t-box">
                        <table>
                            <colgroup>
                                <col span={options.length + inputCols.length + 2} style={{ width: 90 }}></col>
                            </colgroup>
                            <thead>
                                <tr>
                                    {contents.length ? options.map(v => <th key={v.id}>{v.name}</th>) : null}
                                    {inputCols.map((n, i) => <th key={i}>{n.name}</th>)}
                                    {contents.length ? (<>
                                        <th>图片</th>
                                        <th>是否上架</th>
                                    </>) : null}

                                </tr>
                            </thead>
                            <tbody>
                                {contents.length > 0
                                    ? [...contents]
                                    : (<tr key={-1}>
                                        {inputCols.map((n, i) => <td key={i}> <div><input type="text" /> </div></td>)}
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                </TableBox>
            </Item>
        </Form>
    );
}
export default forwardRef(SkuForm)

/**
 * @typedef {import('antd/lib/form').FormInstance} FormInstance
 * @typedef {import('rc-select/lib/Option').OptionFC} SelectOption
 **/

/**
 * @typedef {Object} SpecValue 转换前的规格元数据
 * @property {Boolean} isUsed
 * @property {String} value
 * @property {String} propertyId
 * @property {String} id
 */

/**
 * @typedef {Object} Specification 来自specify组件的表单数据
 * @property {SpecValue[]} values
 * @property {String} propertyId
 */

/**
 * @typedef {Object} Props
 * @property {Option[]} options 属性集合，用于生成shortcut内的选择器
 * @property {Specification[]} spec 从specify 组件传过了的规格集合
 * @property {{productSkus:SkuOrigin[]}} [defo]  编辑时有值
 */

/**
 * @typedef {Object} Option
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {object} Spec
 * @property {string}  optionName 规格名称
 * @property {string}  propertyId 属性id
 * @property {string}  id 规格id
 */

/**
 * @typedef {object} UploadResponse
 * @property {string} message 上传图片后返回的图片地址
 */

/**
 * @typedef {object} UploadValue
 * @property {string} uid
 * @property {UploadResponse} response
 */

/**
 *@typedef {object} BeforeCovner
 * @property {boolean} isShelve
 * @property {UploadValue[]} preview
 */

/**
 *@typedef {object} AfterCovner
 * @property {number} isShelve 1=true，0=false
 * @property {string} preview
 */

/**
 * @typedef {object} SkuBase 计算量最大的就这两个属性
 * @property {number} factoryPrice 供货价
 * @property {Spec[]} skuPropertyModels 规格属性集合
 */

/**
 * @typedef {object} SkuCore 快捷设置也用这个类型
 * @property {number}  number 库存
 * @property {number} advicePrice 市场价
 * @property {number} discount 折扣
 * @property {number} weight 重量
 * @property {number} volume 体积
 * @property {number} skuCode 编号
 */

/**
 * @typedef {BeforeCovner & SkuCore & SkuBase } SkuInForm 在表单内的存留的结构
 */

/**
 * @typedef {object} ShortcutSelectValues
 * @property {string[]|-1[]} optionNames 选中的规格值 -1表示全部
 */

/**
 * @typedef {Object} FormValues
 * @property {SkuCore & ShortcutSelectValues} shortcut
 * @property {SkuInForm[]} skus
 */

/**
 * @typedef {AfterCovner & SkuCore & SkuBase } SkuOrigin 从detail接口获取到的原始结构
 */
