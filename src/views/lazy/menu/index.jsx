import React from 'react'
import { message, Table } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux'
import styled from "styled-components";
import { AddBtn, ModifyBtn, DangerBtn } from '../../../components/styled/operateBtns'
import api from "../../../api/menus";
import { getMenus } from "../../../stores/action/menus"
const IconHide = styled(StopOutlined)`
    font-size:18px;
`
const IconShow = styled(CheckCircleOutlined)`
    color:green;
`

function Menus() {
    const menus = useSelector(s => s.menus.datas)

    const dispatch = useDispatch()
    const deleRole = id => async () => {
        let res = await api.deleMenu(id)
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        dispatch(getMenus())
    }
    const columns = [
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '路径', align: 'center', dataIndex: 'url', key: 'path' },
        {
            title: '显示', align: 'center', dataIndex: 'hidden', key: 'hidden',
            render: text => !text ? <IconHide as={IconShow} /> : <IconHide />
        },
        { title: '序号', align: 'center', dataIndex: 'sort', key: 'num' },
        {
            title: '操作', dataIndex: 'sort', key: 'operation', render: (_, data) => {
                let isChildOrNoChildren = data.pid || (!data.pid && !data.children)
                if (isChildOrNoChildren) {
                    return (<span>
                        <ModifyBtn carry={{ editData: data }} />
                        <DangerBtn onConfirm={deleRole(data.id)} />
                    </span>)
                }
                return <ModifyBtn carry={{ editData: data }} />
            }
        },
    ]

    const dataSource = menus.map(v => {
        if (!v.children.length) {
            return { ...v, children: null }
        }
        return v
    })
    return (
        <div>
            <AddBtn />
            <Table dataSource={dataSource} columns={columns} rowKey="id" />
        </div>
    )
}

export default Menus;