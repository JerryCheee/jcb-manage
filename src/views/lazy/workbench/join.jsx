import React, { useState, useEffect } from 'react'
import { Table, Tag, message, Select } from 'antd'
import api from "../../../api/join";
import useParamsCache from '../../../hook/useParamsCache';
import { joinStateEnums, joinTypeEnums } from '../../../config/enums'
import JoinDetail from '../../../components/modals/workbench/joinDetail'
import SubmitRecord from '../../../components/modals/workbench/submitRecord'
import JoinRecords from '../../../components/modals/workbench/joinRecords';

const Option = Select.Option

const mr16 = { marginRight: 16 }


export default function JoinConfirm() {
    const [datas, setDatas] = useState()
    const [curId, setCurId] = useState(null)
    const [detail, setDetail] = useState({})
    const [isDetailShowing, setDetailShowing] = useState(false)
    const [isAddRecordShowing, setAddRecordShowing] = useState(false)
    const [isRecordShowing, setRecordShowing] = useState(false)
    const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, total: 0 })
    const cacheRef = useParamsCache()

    /**
     * 删除 一个或多个 现在不需要
     * @param {string[]} ids 
     */
    // const deleSome = ids => async () => {
    //     let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
    //     if (res.code) return message.error(res.msg)
    //     message.success(res.msg || '删除成功')
    //     getData(cacheRef.current)
    // }
    const getData = async (params) => {
        let res = await api.getList(params)
        cacheRef.current = params
        if (res.code) {
            return message.error(res.msg)
        }
        setDatas(res.data.records)
        setPageInfo(s => ({ ...s, total: res.data.total }))

    }
    const cleanCurId = () => {
        setCurId(null)
        setAddRecordShowing(false)
        setRecordShowing(false)
    }
    const closeDetail = () => {
        setDetail({})
        setDetailShowing(false)
    }
    const showDetail = (id) => async () => {
        let res = await api.getDetail(id)
        if (res.code) return message.error(res.msg)
        setDetail(res.data)
        setDetailShowing(true)
    }
    const addRecord = id => () => {
        setCurId(id)
        setAddRecordShowing(true)
    }
    const showRecord = id => () => {
        setCurId(id)
        setRecordShowing(true)
    }
    const handleTableChange = (pagin, filters = {}, sorts = {}) => {
        const { current, pageSize } = pagin

        getData({ pageNo: current, pageSize })
        setPageInfo(pagin)
    }
    useEffect(() => {
        let params;
        if (cacheRef.current) {
            const { pageSize, pageNo: current } = cacheRef.current;
            setPageInfo({ pageSize, current, total: 0 })
            params = cacheRef.current
        } else {
            const { pageSize, current: pageNo } = pageInfo
            params = { pageSize, pageNo }
        }
        getData(params)
        //eslint-disable-next-line
    }, [])

    const editState = data =>async v => {
        let res= await api.edit({id:data.id,handlingState:v})
        if(res.code) return message.error(res.msg)
        message.success(res.msg)
        data.handlingState=v;
        let i =datas.findIndex(v=>v.id===data.id)
        datas.splice(i,1,data)
        setDatas([...datas])
    }
    /**@type {import('antd/lib/table').ColumnsType} */
    const columns = [
        { title: "公司名称", key: "companyName", dataIndex: "companyName", },

        { title: "联系人", key: "contacts", dataIndex: "contacts", },
        { title: "类型", key: "joinType", dataIndex: "joinType", render: t => <Tag>{joinTypeEnums[t]}</Tag> },
        { title: "申请时间", key: "createTime", dataIndex: "createTime", },
        {
            title: "跟进状态", key: "handlingState", dataIndex: "handlingState"
            , render: (t, data) => (<Select value={t} onChange={editState(data)}>
                {joinStateEnums.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
            </Select>)
        },
        {
            title: "操作", key: "operation", dataIndex: "operation", render: (t, data) => {
                return (<>
                    <a onClick={showDetail(data.id)} style={mr16}>详情</a>
                    <a onClick={addRecord(data.id)} style={mr16}>添加记录</a>
                    <a onClick={showRecord(data.id)} style={mr16}>查看记录</a>
                </>)
            }
        },
    ]

    return (
        <div>
            <Table
                dataSource={datas}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
            />
            <JoinDetail info={detail} visible={isDetailShowing} toggle={closeDetail} />
            <SubmitRecord id={curId} visible={isAddRecordShowing} toggle={cleanCurId} />
            <JoinRecords id={curId} visible={isRecordShowing} toggle={cleanCurId}/>
        </div>

    )
}