import React, { useEffect, useState } from 'react'
import { message, Table, Tag, Select } from "antd";
import api from "../../../api/coupon"
import useParamsCache from '../../../hook/useParamsCache'
import useSearchColumn from "../../../hook/useSearchColumn"
import { AddBtn, DangerBtn, ModifyBtn } from '../../../components/styled/operateBtns'
import { buildFilter } from '../../../utils/tableHelp'
import styled from 'styled-components';
import { couponScopes, couponTypes } from '../../../config/enums';

const typeColors = [
  'magenta',
  'red',
  'volcano'
]

const TypeTag = styled(Tag)`
  min-width:64px;

`
const typeFilterSelect = (value, setValue) => (
  <Select
    style={{ width: '100%' }}
    value={value}
    onChange={setValue}
    changeOnSelect
  >
    {couponTypes.map((v, i) => (<Select.Option key={i}>{v}</Select.Option>))}
  </Select>
)
const defoPage = { current: 1, pageSize: 10, total: 0, showTotal: (t) => `总条数${t}` }
export default function Coupons() {
  const [datas, setDatas] = useState([])
  const [pageInfo, setPageInfo] = useState(defoPage)
  const cacheRef = useParamsCache()

  const dele = id => async () => {
    let res = await api.dele(id)
    if (res.code) return message.error(res.msg)
    message.success(res.msg || '删除成功')
    init()
  }

  const getData = async (params) => {
    let { name } = params;
    if (name === "") {
      delete params.name
    }
    cacheRef.current = { ...params };

    let res = await api.getList(params)

    if (res.code) return message.error(res.msg)
    setDatas(res.data)
    setPageInfo(s => ({ ...s, total: res.count }))
  }




  useEffect(() => {
    let params;
    if (cacheRef.current) {
      const { limit: pageSize, page: current } = cacheRef.current;
      setPageInfo(s => ({ ...s, pageSize, current, total: 0 }))
      params = cacheRef.current
    } else {
      const { pageSize: limit, current: page } = pageInfo
      params = { page, limit }
    }
    getData(params)
  }, [])

  const handleTableChange = ({ current, pageSize }, filters = {}) => {
    let params = { page: current, limit: pageSize, ...filters }
    getData({ ...params })
    setPageInfo(s => ({ ...s, current, pageSize }))
  }



  const { name } = cacheRef.current || {}
  const columns = [

    {
      title: '优惠卷名称', align: 'center', dataIndex: 'name', key: 'name', width: '250px',
      filteredValue: name ? name : undefined,
      ...useSearchColumn('活动名称')

    },
    {
      title: '优惠方式', align: 'center', dataIndex: 'typeNum', key: 'type',
      render: t => <TypeTag color={typeColors[t]}>{couponTypes[t]}</TypeTag>,
      ...buildFilter(typeFilterSelect)
    },

    {
      title: '使用范围', align: 'center', dataIndex: 'scope', key: 'scope',
      render: t => <Tag>{couponScopes[t]}</Tag>,
    },
    { title: '总数', align: 'center', dataIndex: 'total', key: 'total' },
    { title: '剩余', align: 'center', dataIndex: 'stock', key: 'stock' },

    {title: '开始时间', align: 'center', dataIndex: 'start_time', key: 'start_time'},
    {title: '结束时间', align: 'center', dataIndex: 'end_time', key: 'end_time'},


    {
      title: '操作', dataIndex: 'operation', key: 'operation', render: (_, data) => {
        return (<div>
          <ModifyBtn carry={{ editData: data }} />
          <DangerBtn onConfirm={dele(data.id)}/>
        </div>)

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
