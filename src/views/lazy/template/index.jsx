
import React, { useEffect, useState } from 'react'
import { message, Table } from "antd";
import { AddBtn, ModifyBtn, DangerBtn } from '../../../components/styled/operateBtns'
import api from "../../../api/template"
import { calcType } from '../../../config/enums';

const ml16= {marginLeft:16}
const getData = async (next) => {
    let res = await api.getAll()
    if (res.code) return message.error(res.msg)
    next(res.data)
}

export default function LogisticsTemplate() {
    const [datas, setDatas] = useState([])
    const [showProducts, setShowProducts] = useState(false)
    const toggleShowProducts = () => {
        setShowProducts(s => !s)
    }
    const deleSome = ids => async () => {
        let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData(setDatas)
    }
   
    useEffect(() => {
      
        getData(setDatas)
        //eslint-disable-next-line
    }, [])
  
   

    const columns = [

        { title: '模板名称', dataIndex: 'name', key: 'name' },

        { title: '计费方式', dataIndex: 'type', key: 'type', render: t => calcType[t] },

        { title: '最后编辑时间', dataIndex: 'updateTime', key: 'updateTime' },
        {
            title: '操作', dataIndex: 'sort', key: 'operation', render: (_, data) => {
                return (<span>
                    <ModifyBtn carry={{ editData: data }} />
                    <DangerBtn onConfirm={deleSome([data.id])} />
                    <a style={ml16} onClick={toggleShowProducts}>使用情况</a>
                </span>)

            }
        },
    ]
    return (
        <div>
            <AddBtn />
            <Table dataSource={datas} columns={columns} rowKey="id"  />
        </div>
    )
}
