import React, { useEffect, useState } from 'react'
import { message, Table, Tag } from "antd";
import api from "../../../api/role"
import { AddBtn, DangerBtn, ModifyBtn } from '../../../components/styled/operateBtns';
import { roleTypes } from "../../../config/enums"



export default function Roles() {
    const [roles, setRoles] = useState([])
    const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, total: 0 })
    const deleSome = ids => async () => {
        let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData()
    }
    const getData = async (params) => {
        let res = await api.getList(params)
        if (res.code) {
            return message.error(res.msg)
        }
        setRoles(res.data.records)

        setPageInfo(s => ({ ...s, total: res.data.total }))

    }

    const handleTableChange = (pagin, filters = {}, sorts = {}) => {
        const { current, pageSize } = pagin

        getData({ pageNo: current, pageSize })
        setPageInfo(pagin)
    }
    useEffect(() => {
        const { pageSize, current: pageNo } = pageInfo
        getData({ pageNo, pageSize })
    }, [])
    const columns = [
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '角色类型', dataIndex: 'roleType', key: 'roleType', render: t => <Tag>{roleTypes[t]}</Tag> },
        {
            title: '拥有权限', align: 'center', dataIndex: 'menuIds', key: 'menuIds',
            render: (_, data) => data.roleType === -1 ? '全部' : data.menuIds.length
        },
        { title: '添加时间', align: 'center', dataIndex: 'createTime', key: 'createTime' },
        {
            title: '操作', dataIndex: 'sort', key: 'operation', render: (_, data) => {
                if (data.superAdmin) return <ModifyBtn carry={{ editData: data }} />
                return (<span>
                    <ModifyBtn carry={{ editData: data }} />
                    <ModifyBtn pathname="assign" carry={{ data }}>分配权限</ModifyBtn>
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
                onChange={handleTableChange}
                pagination={pageInfo}
                columns={columns}
                rowKey="id" />
        </div>
    )
}
// function shouldUpdate(pre, next) {
//     let modifyed = next.location.state?.modifyed;
//     console.log(modifyed);
//     return !!modifyed
// }
// const RolesMemo = React.memo(Roles, shouldUpdate)
// export default RolesMemo