import React, { useEffect, useState } from 'react'
import { message, Table } from "antd";
import styled from "styled-components";
import { AddBtn, ModifyBtn, DangerBtn } from '../../../components/styled/operateBtns'
import api from "../../../api/notice"
import useSearchColumn from "../../../hook/useSearchColumn"

import {showTypes, sourceTypes } from '../../../config/enums';
import { defoPage, defoPageInfo, simplify } from '../../../utils/handy';
import useParamsCache from '../../../hook/useParamsCache';



export default function Notice() {
  const [datas, setDatas] = useState([])
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
    cacheRef.current=params
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

  const handleTableChange = ({ current, pageSize }, filters = {}, sorts = {}) => {

    let obj = Object.entries(filters).reduce((pre, [k, v]) => {
      if (Array.isArray(v)) {
        pre[k] = v[0]
      } else {
        pre[k] = v
      }
      return pre;
    }, {})
    getData({ current, pageSize, ...obj })

  }

  const columns = [
    // {
    //   title: '图片', align: 'center', dataIndex: 'pic', key: 'pic',
    //   render: t => <ProductImg src={t} />
    // },
    {
      title: '内容', align: 'center', dataIndex: 'content', key: 'content',
      ...useSearchColumn('内容')
    },
    
    {
      title: '添加时间', align: 'center', dataIndex: 'createTime', key: 'createTime'
    },
    {
      title: '软件端', align: 'center', dataIndex: 'source', key: 'source',
      filters: sourceTypes, render: t => sourceTypes.find(v => v.value === t).text
    },
    {
      title: '展示端', align: 'center', dataIndex: 'type', key: 'type',
      filters: showTypes, render: t => showTypes.find(v => v.value === t).text
    },
   
    {
      title: '操作', dataIndex: 'operation', key: 'operation', render: (_, data) => {
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
      <Table
        dataSource={datas}
        columns={columns}
        rowKey="id"
        pagination={pageInfo}
        onChange={handleTableChange} />
    </div>
  )
}
