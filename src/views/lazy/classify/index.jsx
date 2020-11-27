import React, { useEffect, useState } from 'react'
import { message, Table } from "antd";
import { AddBtn, ModifyBtn, DangerBtn } from '../../../components/styled/operateBtns'
import api from "../../../api/classify"
import styled from 'styled-components'
import useSearchColumn from '../../../hook/useSearchColumn'
import useParamsCache from '../../../hook/useParamsCache'

const SmallAvatar = styled.img`
    width:25px;
    height:25px;
`
/**将空数组赋值为undefind */
const clearEmptyChildren = v => {
  if (v.children.length) {
    v.children.forEach(clearEmptyChildren)
  } else {
    v.children = undefined
  }
}
const handleSearch = (name, dataSource, next) => {
  const byName = v => {
    let has = v.name.includes(name);
    if (has) return has;
    if (v.children) {
      has = v.children.some(byName)
    }
    return has;
  }
  const deepFilter = v => {
    v.children = v.children.filter(byName);
    v.children.forEach(filterChild)
    return v
  }
  const filterChild = v => (v.children
    ? deepFilter(v)
    : v);

  let ed = dataSource.filter(byName)
  ed = ed.map(v => ({ ...v })).map(filterChild)
  next(ed)
}
export default function ClassifyList() {
  const [datas, setDatas] = useState([])
  const [showing, setShowing] = useState([])
  const cacheRef = useParamsCache()
  const [pageInfo, setPageInfo] = useState({ current: 1, pageSize: 10, total: 0 })

  const deleSome = ids => async () => {
    let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
    if (res.code) return message.error(res.msg)
    message.success(res.msg || '删除成功')
    getData()
  }
  const getData = async () => {
    let res = await api.getAll()
    if (res.code) return message.error(res.msg)
    res.data.forEach(clearEmptyChildren)
    setDatas(res.data)
    setShowing(res.data)
    setPageInfo(s => ({ ...s, total: res.data.length }))
  }

  useEffect(() => {
    if (cacheRef.current) {
      const { pageSize, current } = cacheRef.current;
      setPageInfo({ pageSize, current, total: 0 })
    }
    getData()
    //eslint-disable-next-line
  }, [])

  const handleTableChange = ({ current, pageSize }, filters = {}) => {

    setPageInfo(s => ({ ...s, current }))
    cacheRef.current = { current, pageSize }
    let { name } = filters
    if (name === null) {
      setShowing(datas)
      return;
    }
    handleSearch(name, datas, setShowing)

  }
  const columns = [

    { title: '图片', dataIndex: 'icon', key: 'icon', render: t => t ? <SmallAvatar src={t} /> : null },
    { title: '名称', dataIndex: 'name', key: 'name', ...useSearchColumn('名称') },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
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
      <Table dataSource={showing} columns={columns} rowKey="id" onChange={handleTableChange} pagination={pageInfo} />
    </div>
  )
}
