import React, { useEffect, useState } from 'react'
import { message, Table, Tag } from "antd";
import { AddBtn, ModifyBtn, DangerBtn } from '../../../components/styled/operateBtns'
import api from "../../../api/admin"
import styled from 'styled-components'
import { adminStatus } from '../../../config/enums';
import useParamsCache from '../../../hook/useParamsCache';
import {defoPage, defoPageInfo,simplify } from '../../../utils/handy';

const SmallAvatar = styled.img`
    width:32px;
    height:32px;
`

export default function Admins() {
    const [roles, setRoles] = useState([])
    const [pageInfo, setPageInfo] = useState(defoPageInfo)
    const cacheRef = useParamsCache()

    const deleSome = ids => async () => {
        let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData(cacheRef.current)
    }
    const getData = async (params) => {
        let res = await api.getList(simplify(params))
        cacheRef.current = params
        if (res.code) return message.error(res.msg)
        setRoles(res.data.records)
        let { pageSize, current } = params
        setPageInfo({ pageSize, current, total: res.data.total })
    }
    const handleTableChange = (pagin, filters = {}, sorts = {}) => {
        let lastParams = cacheRef.current || {}
        getData({ ...lastParams,...pagin })
    }
    useEffect(() => {
        let params = cacheRef.current
            ? cacheRef.current
            : defoPage
        getData(params)
    }, [])

    const columns = [

        { title: '头像', dataIndex: 'avatar', key: 'avatar', render: t => <SmallAvatar src={t} /> },
        { title: '账号', dataIndex: 'account', key: 'account' },
        { title: '用户名', dataIndex: 'username', key: 'username' },
        {
            title: '角色类型', align: 'center', dataIndex: 'roleName', key: 'roleName',
            render: v => <Tag>{v}</Tag>
        },
        // { title: '部门', align: 'center', dataIndex: 'adminType', key: 'adminType' },
        { title: '状态', align: 'center', dataIndex: 'status', key: 'status', render: t => adminStatus[t - 1] },

        { title: '添加时间', align: 'center', dataIndex: 'createTime', key: 'createTime' },
        {
            title: '操作', dataIndex: 'sort', key: 'operation', render: (_, data) => {
                return (<span>
                    <ModifyBtn carry={{ editData: data }} />
                    <DangerBtn onConfirm={deleSome([data.id])} />
                </span>)

            }
        },
    ]
    return (
        <div>
            <AddBtn />
            <Table
                dataSource={roles}
                columns={columns}
                rowKey="id"
                pagination={pageInfo}
                onChange={handleTableChange}
            />
        </div>
    )
}
