import React, { useEffect, useState } from 'react'

import api from '../../../../api/storeLevel'
import { message, Table } from 'antd'
import { AddBtn, DangerBtn, ModifyBtn } from '../../../../components/styled/operateBtns'


const getData = async (next) => {
    let res = await api.getList()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
export default function StoreLevel() {
    const [datas, setDatas] = useState([])

    const deleSome = ids => async () => {
        let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData(setDatas)
    }
    useEffect(() => {
        getData(setDatas)
    }, [])


    /**@type {import('antd/lib/table').ColumnsType} */
    const columns = [
        { title: "等级名称", key: "name", dataIndex: "name" },
        { title: "入驻费用", key: "enterPrice", dataIndex: "enterPrice" },
        { title: "不含税进货价(%)", key: "discount", dataIndex: "discount" },
        { title: "含税进货价(%)", key: "taxDiscount", dataIndex: "taxDiscount" },
        {
            title: '操作', dataIndex: 'operation', key: 'operation', render: (_, data) => {
                return (<span>
                    <ModifyBtn carry={{ editData: data }} />
                    <DangerBtn onConfirm={deleSome([data.id])} />
                </span>)

            }
        },
    ]

    return (
        <div>
            <AddBtn/>
            <Table
                dataSource={datas}
                columns={columns}
                rowKey="id"
            />
        </div>

    )
}