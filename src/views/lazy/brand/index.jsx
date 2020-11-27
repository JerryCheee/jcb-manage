import React, { useEffect, useState } from 'react'
import { message, Table } from "antd";
import { AddBtn, ModifyBtn, DangerBtn } from '../../../components/styled/operateBtns'
import api from "../../../api/brand"
import styled from 'styled-components'
import useSearchColumn from '../../../hook/useSearchColumn'
import useParamsCache from '../../../hook/useParamsCache'

const SmallAvatar = styled.img`
    width:25px;
    height:25px;
`
export default function BrandList() {
    const [datas, setDatas] = useState([])
    const cacheRef = useParamsCache()
    const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, total: 0 })

    const deleSome = ids => async () => {
        let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData()
    }
    const getData = async (params) => {
        cacheRef.current = params
        let res = await api.getList(params)
        if (res.code) return message.error(res.msg)

        setDatas(res.data.records)

        setPageInfo(s => ({ ...s, total: res.data.total }))
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
    // const edit = (id, field) => async v => {
    //     let target = datas.find(v => v.id === id)
    //     let value;
    //     switch (field) {
    //         case 'recommandStatus'://0=false;1=true
    //         case 'diable':
    //             value = v ? 1 : 0
    //             break;
    //         default:
    //             message.error('字段名没有对上，请联系开发者')
    //             break;
    //     }

    //     const lastV = target[field]
    //     if (lastV === value) return

    //     target[field] = value
    //     let res = await api.editPart(target.id, { [field]: value })
    //     if (res.code) {
    //         message.error(res.msg)
    //         target[field] = lastV
    //         setDatas([...datas])
    //         return;
    //     }
    //     setDatas([...datas])

    // }
    const handleTableChange = ({ current, pageSize }, filters = {}) => {
        let params = { pageNo: current, pageSize, ...filters }
        getData(params)
        setPageInfo(s => ({ ...s, current }))
    }
    const { name: lastSearchName } = cacheRef.current || {}
    const columns = [

        { title: '图片', dataIndex: 'logo', key: 'logo', render: t => t ? <SmallAvatar src={t} /> : null },
        { title: '名称', dataIndex: 'name', key: 'name', ...useSearchColumn('名称'), filteredValue: lastSearchName ? lastSearchName : undefined },
        { title: '英文名称', dataIndex: 'ename', key: 'ename' },
        // {
        //     title: '推荐', align: 'center', dataIndex: 'recommandStatus', key: 'is_on_sale',
        //     render: (t, data) => <Switch checked={Boolean(t)} onChange={edit(data.id, 'recommandStatus')} />
        // },
        // {
        //     title: '禁用', align: 'center', dataIndex: 'disable', key: 'disable',
        //     render: (t, data) => <Switch checked={Boolean(t)} onChange={edit(data.id, 'disable')} />
        // },
        { title: '排序', dataIndex: 'sort', key: 'sort' },
        {
            title: '操作', dataIndex: 'sort', key: 'operation', render: (_, data) => {
                return (<span>
                    <ModifyBtn carry={{ editData: data, total: pageInfo.total }} />
                    <DangerBtn onConfirm={deleSome([data.id])} />
                </span>)

            }
        },
    ]
    return (
        <div>
            <AddBtn />
            <Table dataSource={datas} columns={columns} rowKey="id" onChange={handleTableChange} pagination={pageInfo} />
        </div>
    )
}
