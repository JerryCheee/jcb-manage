import React, { useState, useEffect } from 'react'
import { Table, Tag, message } from 'antd'
import api from "../../../../api/store";
import useParamsCache from '../../../../hook/useParamsCache';
import { verifyStatus } from '../../../../config/enums'
import VerifyStore from '../../../../components/modals/workbench/store/verify';
import styled from 'styled-components';
import { defoPageInfo, simplify } from '../../../../utils/handy'


const ProductImg = styled.img`
    width:100px;
    height:100px;
`
const mr16 = { marginRight: 16 }

export default function SotreConfirm() {
    const [datas, setDatas] = useState()
    const [curId, setCurId] = useState(null)
    const [pageInfo, setPageInfo] = useState(defoPageInfo)
    const cacheRef = useParamsCache()


    const getData = async (params) => {
        params.status = 0;
        let res = await api.getList(simplify(params))
        cacheRef.current = params
        if (res.code) return message.error(res.msg)
        setDatas(res.data.records)
        let { current, pageSize } = params
        setPageInfo({ current, pageSize, total: res.data.total })

    }
    const cleanCurId = () => {
        setCurId(null)
        getData(cacheRef.current || pageInfo)
    }
    const showDetail = (id) => () => {
        setCurId(id)
    }
    const handleTableChange = (pagin, filters = {}, sorts = {}) => {
        getData(pagin)
    }
    useEffect(() => {
        getData(cacheRef.current || pageInfo)
        //eslint-disable-next-line
    }, [])


    /**@type {import('antd/lib/table').ColumnsType} */
    const columns = [
        { title: "门店logo", key: "head", dataIndex: "head", render: t => <ProductImg src={t} /> },
        { title: "门店名称", key: "name", dataIndex: "name", },
        { title: "门店等级", key: "levelName", dataIndex: "levelName", },
        { title: "推荐人", key: "sourceName", dataIndex: "sourceName", },
        { title: "联系人", key: "nickName", dataIndex: "nickName", },
        { title: "联系电话", key: "phone", dataIndex: "phone", },
        {
            title: "审核状态", key: "status", dataIndex: "status"
            , render: t => <Tag>{verifyStatus[t]}</Tag>
        },
        {
            title: "操作", key: "operation", dataIndex: "operation", render: (t, data) => {
                return <a onClick={showDetail(data.id)} style={mr16}>审核信息</a>
            }
        },
    ]

    return (
        <div>
            <Table
                dataSource={datas}
                pagination={pageInfo}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
            />
            <VerifyStore visible={curId !== null} id={curId} toggle={cleanCurId} />
        </div>

    )
}