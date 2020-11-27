import React, { useEffect, useState } from 'react'
import { message, Table } from "antd";
import styled from "styled-components";

import api from "../../../api/user"
import useSearchColumn from "../../../hook/useSearchColumn"
import { defoPage, defoPageInfo, simplify } from '../../../utils/handy';
import useParamsCache from '../../../hook/useParamsCache';

const AvatarImg = styled.img`
    width:50px;
    height:50px;
`


export default function Users() {
    const [datas, setDatas] = useState([])
    const [pageInfo, setPageInfo] = useState(defoPageInfo)
    const cacheRef = useParamsCache()
    const [showDetail, setShowDetail] = useState(false)
    const getData = async (params) => {
        let res = await api.getList(simplify(params))
        cacheRef.current = params
        if (res.code) return message.error(res.msg)
        setDatas(res.data.records)
        let { current, pageSize } = params
        setPageInfo({ current, pageSize, total: res.data.total })
    }

    useEffect(() => {
        if (cacheRef.current) {
            getData(cacheRef.current)
        } else {
            getData(defoPage)
        }
    }, [])
    const showDetailModal = (data) => () => {
        setShowDetail(true)
    }
    const handleTableChange = ({ current, pageSize }, filters = {}, sorts = {}) => {

        // let obj = Object.entries(filters).reduce((pre, [k, v]) => {
        //   if (Array.isArray(v)) {
        //     pre[k] = v[0]
        //   } else {
        //     pre[k] = v
        //   }
        //   return pre;
        // }, {})
        getData({ current, pageSize })

    }

    const columns = [
        {
            title: '编号', align: 'center', dataIndex: 'id', key: 'id',
        },
        {
            title: '头像', align: 'center', dataIndex: 'headPortrait', key: 'headPortrait',
            render: t => <AvatarImg src={t} />

        },
        {
            title: '昵称', align: 'center', dataIndex: 'nickname', key: 'nickname',

        },
        {
            title: '手机号', align: 'center', dataIndex: 'phone', key: 'phone',

        },
        {
            title: '推荐人', align: 'center', dataIndex: 'sourceName', key: 'sourceName',

        },
        {
            title: '累计消费', align: 'center', dataIndex: 'totalAmount', key: 'totalAmount',

        },
        {
            title: '累计收益', align: 'center', dataIndex: 'commission', key: 'commission',

        },
        {
            title: '累计提现', align: 'center', dataIndex: 'totalWithdrawal', key: 'totalWithdrawal',

        },
        {
            title: '注册时间', align: 'center', dataIndex: 'registerTime', key: 'registerTime'
        },
        {
            title: '操作', dataIndex: 'operation', key: 'operation', render: (_, data) => {
                return <a onClick={showDetailModal(data)}>详情</a>
            }
        },
    ]
    return (
        <div>
            <Table
                dataSource={datas}
                columns={columns}
                rowKey="id"
                pagination={pageInfo}
                onChange={handleTableChange} />
        </div>
    )
}
