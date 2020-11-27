import React, { useEffect, useState, useReducer, useMemo, useRef } from 'react'
import { message, Table, Switch, Form, Input, Select, Cascader, Button, Row, Col, Radio, Checkbox } from "antd";
import api from "../../../api/product"
import clasApi from "../../../api/classify"
import brandApi from "../../../api/brand"
import supplierApi from "../../../api/supplier"
import storeApi from "../../../api/store"
import { DangerBtn, ModifyBtn } from '../../../components/styled/operateBtns';
import useParamsCache from '../../../hook/useParamsCache';
import styled from 'styled-components'
import { defoPage, defoPageInfo, simplify } from '../../../utils/handy'
import { Link } from 'react-router-dom';
import { PlusOutlined } from "@ant-design/icons";
import FilterableSelect from '../../../components/formItem/FilterableSelect';
import { useChangeUpStatus } from '../../../hook/useChangeUpStatus';

const Item = Form.Item;
const Option = Select.Option;
const ml16 = { marginLeft: 10 }
const ProductImg = styled.img`
    width:100px;
    height:100px;
`
const Wrapper = styled.div`
    form{
        margin:14px 0;
        .grow{
            flex-grow:1
        }
        .ant-form-item{
            margin-right:0;
        }
    }
`
const optKey = { label: 'name', value: 'id' }

const getClassifyOptions = async (next) => {
    let res = await clasApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const classifyFilter = (inputValue, path) => {
    return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}
const getBrandOptions = async (next) => {
    let res = await brandApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const getSupplierOptions = async (next) => {
    let res = await supplierApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const getStoreOptions = async (next) => {
    let res = await storeApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
/**变更会 立刻执行请求的 状态 
 * @type {VariousState}
*/
const initialState = { queryType: 2, status: [] }
/**
 * 
 * @param {VariousState} state 
 * @param {UpdateAction} action 
 */
function reducer(state, { type, payload }) {
    switch (type) {
        case 'queryType':
            return { ...state, queryType: payload }
        case 'status':
            return { ...state, status: payload }
        case 'both':
            return payload
        default:
            console.warn('未定义响应')
            return state;
    }
}
/**获取 离开页面前显示的数据 */
function getLastTimeData(cacheRef, form, dispatch, getData) {
    const { pageSize, current, queryType, status, ...rest } = cacheRef.current;
    let { classId } = rest || {};
    if (classId) {
        rest.classId = classId.split(',');
    }
    form.setFieldsValue(rest);

    let action = {};
    if (queryType) {
        if (status) {
            action = { type: 'both', payload: { queryType, status: [status] } };
            return dispatch(action);
        }
        action.type = 'queryType';
        action.payload = queryType;
    }
    if (status) {
        action.type = 'status';
        action.payload = status;
    }
    if (action.type) return dispatch(action);

    getData(cacheRef.current);
}
const getSource = (data, type) => {
    switch (type) {
        case 1:
            return <div>门店:{data.storeName}</div>
        case 2:
            return <div>供应商:{data.supplierName}</div>
        default:
            break;
    }
}
const typeNames = ['', '(门店)', '(供应商)']
const priceCol = [
    undefined,//凑数
    { title: '售价', dataIndex: 'minPaymentPrice', key: 'minPaymentPrice' },
    { title: '供货价', dataIndex: 'supplyPrice', key: 'supplyPrice' }
]
const enhancedSimplify = params => {
    let { status } = params
    params.status = status === 3 ? undefined : status
    return simplify(params)
}
export default function ProductList() {
    const [pageInfo, setPageInfo] = useState(defoPageInfo)
    const cacheRef = useParamsCache()
    const [clasOptions, setClasOptions] = useState([])
    const [brandOptions, setBrandOptions] = useState([])
    const [supplierOptions, setSupplierOptions] = useState([])
    const [storeOptions, setStoreOptions] = useState([])
    const [form] = Form.useForm()
    /** @type {[VariousState,(action:UpdateAction)=>void]} 两个状态用一个管理函数，此处的好处是避免重复请求接口*/
    const [typeAndStatus, dispatch] = useReducer(reducer, initialState)
    const [loading, setLoading] = useState(false)
    const [upStatusLoading, selectRowConfig, benchEditUpStatus, changeUpStatus, datas, setDatas] = useChangeUpStatus()

    const moveIt = data => async () => {
        let { id } = data;
        let { status } = typeAndStatus;
        let params = { id }

        switch (status[0]) {
            case 4:
                params.operation = 1
                break;
            default:
                params.operation = 0
                break;
        }

        let res = await api.move(params)
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData(cacheRef.current)
    }
    /**
     * 
     * @param {ReqParams} params 
     */
    const getData = async (params) => {
        setLoading(true)
        params.queryType = typeAndStatus.queryType
        let res = params.status === 3
            ? await api.getDraftList(enhancedSimplify(params))
            : await api.getList(enhancedSimplify(params))
        cacheRef.current = params
        setLoading(false)
        if (res.code) {
            message.error(res.msg)
            return;
        }
        setDatas(res.data.records)
        let { current, pageSize } = params
        setPageInfo(s => ({ current, pageSize, total: res.data.total }))

    }

    const handleTableChange = ({ current, pageSize }, filters = {}, sorts = {}) => {
        let lastParams = cacheRef.current || {}
        getData({ ...lastParams, current, pageSize })
    }
    useEffect(() => {
        getClassifyOptions(setClasOptions)
        getBrandOptions(setBrandOptions)
        getSupplierOptions(setSupplierOptions)
        getStoreOptions(setStoreOptions)

        if (!cacheRef.current) { getData(defoPage); return; }

        getLastTimeData(cacheRef, form, dispatch, getData);
        //eslint-disable-next-line
    }, [])

    const submitSearch = () => {
        let values = form.getFieldsValue()
        let { classId } = values
        if (classId) {
            values.classId = classId.join(',')
        }
        getData(values)
    }

    const cleanSearch = () => {
        form.resetFields()
        dispatch({ type: 'status', payload: [] })
        getData(defoPage)
    }

    const changeQueryType = (e) => {
        dispatch({ type: 'queryType', payload: e.target.value })
    }
    const changeStauts = (e) => {
        let payload = e.slice(-1)
        dispatch({ type: 'status', payload })
    }

    useEffect(() => {
        if (initialState === typeAndStatus) return;
        let last = cacheRef.current || {}
        let { queryType, status } = typeAndStatus;
        status = status[0]
        getData({ ...last, queryType, status })
        // eslint-disable-next-line
    }, [typeAndStatus])



    let targetName = typeNames[typeAndStatus.queryType]
    let btnProps = typeAndStatus.status[0] === 4 ? { text: '恢复', title: '确定要恢复这个商品？' } : {}

    const columns = [
        { title: '商品图片', dataIndex: 'pic', key: 'pic', render: t => <ProductImg src={t} /> },
        {
            title: '商品信息', dataIndex: 'brandName', key: 'brandName', render: (t, data) => (
                <div>
                    <div>{data.name}</div>
                    <div>分类:{data.className}</div>
                    <div>品牌:{t}</div>
                    {getSource(data, typeAndStatus.queryType)}

                </div>
            )
        },
        { title: '指导价', dataIndex: 'maxAdvicePrice', key: 'maxAdvicePrice' },
        priceCol[typeAndStatus.queryType],
        // { title: '供货价', dataIndex: 'maxPurchasePrice', key: 'maxPurchasePrice' },
        // { title: '售价', dataIndex: 'minPaymentPrice', key: 'minPaymentPrice' },
        { title: '库存', dataIndex: 'stock', key: 'stock' },
        { title: '销量', dataIndex: 'salesCount', key: 'salesCount' },
        { title: '排序', dataIndex: 'sort', key: 'sort' },
        { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },
        {
            title: '上架', dataIndex: 'upStatus', key: 'upStatus',
            render: (t, data) => <Switch checked={Boolean(t==1?true:false)} onChange={changeUpStatus(data.id, datas)} />
        },


        {
            title: '操作', dataIndex: 'sort', width: 80, key: 'operation', render: (_, data) => {
                let { queryType, status: [sta] } = typeAndStatus
                let editData = { id: data.id }
                /**@type {import('./modify').baseData} */
                let baseData = { target: queryType, isDraft: sta === 3 }
                return (<span>
                    <ModifyBtn carry={{ editData, baseData }} />
                    <DangerBtn onConfirm={moveIt(data)} {...btnProps} />
                </span>)

            }
        },
    ]


    const targetItem = useMemo(() => {
        let items = [
            null,
            <Item label="门店" name="storeId" >
                <FilterableSelect
                    options={storeOptions}
                    placeholder="点击选择或输入"
                />
            </Item>,
            <Item label="供应商" name="supplierId">
                <FilterableSelect
                    options={supplierOptions}
                    placeholder="点击选择或输入"
                />
            </Item>
        ]

        return items[typeAndStatus.queryType]
    }, [typeAndStatus.queryType, supplierOptions, storeOptions])
    return (
        <Wrapper>
            <Row align="middle" >

                <Col offset={8}>
                    <Radio.Group value={typeAndStatus.queryType} onChange={changeQueryType}>
                        <Radio.Button value={1}>门店在售</Radio.Button>
                        <Radio.Button value={2}>供应商在售</Radio.Button>
                        {/* <Radio.Button value={3}>回收站</Radio.Button> */}
                    </Radio.Group>
                </Col>
                <Col offset={1}>
                    <Checkbox.Group value={typeAndStatus.status} onChange={changeStauts}>
                        <Checkbox value={3}>{targetName}草稿箱</Checkbox>
                        <Checkbox value={4}>{targetName}回收站</Checkbox>
                    </Checkbox.Group>
                </Col>
            </Row>



            <Form layout="inline" form={form}>
                <Row className="grow" gutter={10}>
                    <Col span={6}>
                        <Item label="分类" name="classId">
                            <Cascader
                                options={clasOptions}
                                fieldNames={optKey}
                                placeholder="点击选择或输入搜索"
                                showSearch={{ classifyFilter }}
                                allowClear
                            />
                        </Item>
                    </Col>
                    <Col span={5}>
                        <Item label="品牌" name="brandId">
                            <Select placeholder="点击选择" allowClear>
                                {brandOptions.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={5}>
                        {targetItem}
                    </Col>
                    <Col md={6} lg={8}>

                        <Item name="queryContent" label="关键字" >
                            <Input placeholder="请输入标题、ID、型号、名称" allowClear />
                        </Item>
                    </Col>
                    <Item hidden>
                        {/* <Button htmlType="submit" /> 调用 web 原生提交逻辑。*/}
                        <Button htmlType="submit" onClick={submitSearch} ></Button>
                    </Item>

                </Row>
            </Form>

            <Row justify="space-between">
                <div>
                    <Link to={{ pathname: 'modify', state: { baseData: { target: typeAndStatus.queryType } } }}>
                        <Button type='primary' icon={<PlusOutlined />}>添加商品{targetName}</Button>
                    </Link>
                    <Button onClick={benchEditUpStatus(1)} style={ml16} loading={upStatusLoading[0]}>批量上架</Button>
                    <Button onClick={benchEditUpStatus(2)} style={ml16} loading={upStatusLoading[1]}>批量下架</Button>
                </div>
                <Row gutter={10}>
                    {/* <Col>
                        <Item>
                            <Button>导出</Button>
                        </Item>
                    </Col> */}
                    <Col>
                        <Item>
                            <Button onClick={cleanSearch}>重置</Button>
                        </Item>
                    </Col>
                    <Col>
                        <Item>
                            <Button htmlType="submit" onClick={submitSearch}>搜索</Button>
                        </Item>
                    </Col>
                </Row>
            </Row>


            <Table
                rowSelection={selectRowConfig}
                dataSource={datas}
                loading={loading}
                onChange={handleTableChange}
                pagination={pageInfo}
                columns={columns}
                rowKey="id" />
        </Wrapper>
    )
}

/**
 * @typedef {object} ReqParams
 * @property {number} [status] =3时 请求 草稿箱
 * @property {number} queryType 1=门店，2=供应商
 */
/**
 * @typedef {object} VariousState
 * @property {number} queryType 1=门店，2=供应商
 * @property  {[3|4]|[]} status [3]草稿箱 [4]回收站
 */
/**
 * @typedef {object} ChangeType
 * @property {'queryType'} type
 * @property {1|2} payload
 */
/**
 * @typedef {object} ChangeStatus
 * @property {'status'} type
 * @property {[3|4]|[]} payload [3]草稿箱 [4]回收站
 */
/**
 * @typedef {object} ChangeBoth
 * @property {'both'} type
 * @property {VariousState} payload
 */
/**
 * @typedef {ChangeType | ChangeStatus | ChangeBoth} UpdateAction
 */