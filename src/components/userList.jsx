import React, { useEffect, useState } from 'react'
import { message, Table, Tag } from "antd";
import styled from "styled-components";
import api from "../api/user"
import useSearchColumn from "../hook/useSearchColumn";
import useLoading from "../hook/useLoading"
const Avatar = styled.img`
    height:60px;
    width:60px;
`
const BigTag = styled(Tag)`
    line-height: 22px;
    min-width: 79px;
    margin: 0;
`


const roleEnum = ['', '普通会员', '业务员', '仓管员']
const defoPagin = { current: 1, pageSize: 7, total: 0 }
export default function UserList({ onSelect, selectType }) {
  const [datas, setDatas] = useState([])
  const [pagination, setPagenation] = useState(defoPagin)
  const [loading, setLoading] = useLoading(false, pagination.total)
  const [defoFilters, setdefoFilters] = useState({
    user_rank: undefined
  })

  const getData = async (params) => {
    setLoading(true)
    let res = await api.getList({ ...params, location: selectType })
    if (res.code) {
      setLoading(false)
      return message.error(res.msg)
    }
    setDatas(res.data)
    if (params.page === 1) {
      setPagenation(s => ({ ...s, total: res.count }))
    }
    setLoading(false)
  }


  const handleTableChange = (pagin, filters = {}, sorts = {}) => {
    const { current, pageSize } = pagin
    let { userRank } = filters;
    if (userRank) {
      filters.userRank = userRank.map(v => roleEnum.indexOf(v)).join(',')
    }
    let params = { page: current, limit: pageSize, ...filters },
      { field, order } = sorts;
      
    if (field) {
      params[field] = order
    }
    getData(params)
    setPagenation(pagin)
  }


  useEffect(() => {
    let params = { page: pagination.current, limit: pagination.pageSize }
    if (selectType === 3) {//选择业务员
      params.userRank = '2'
      setdefoFilters({ user_rank: [roleEnum[2]] })
    }
    if (selectType === 4) {//选择仓管员
      params.userRank = '3'
      setdefoFilters({ user_rank: [roleEnum[3]] })
    }
    getData(params)
  }, [])

  const columns = [
    {
      title: '头像', align: 'center', dataIndex: 'headimgurl', key: 'headimgurl',
      render: text => <Avatar src={text} />
    },
    {
      title: '昵称', align: 'center', dataIndex: 'nickname', key: 'nickName',
      ...useSearchColumn('昵称')
    },
    {
      title: '真实姓名', align: 'center', dataIndex: 'real_name', key: 'realName',
      ...useSearchColumn('真实姓名')
    },
    {
      title: '手机号', align: 'center', dataIndex: 'user_name', key: 'userName',
      ...useSearchColumn('手机号')
    },
    {
      title: '角色', align: 'center', dataIndex: 'user_rank', key: 'userRank',
      filters: [
        { text: '普通会员', value: '普通会员' },
        { text: '业务员', value: '业务员' },
        { text: '仓管员', value: '仓管员' }
      ],
      filteredValue: defoFilters.user_rank,
      render: t => <BigTag>{t}</BigTag>
    },
    {
      title: '积分', align: 'center', dataIndex: 'points', key: 'points',
      sorter: true
    },
    {
      title: '注册时间', align: 'center', dataIndex: 'reg_time', key: 'reg_time',
      render: t => new Date(t * 1000).toLocaleDateString()
    }
  ]
  // if (!onSelect) {//非选择使用时，角色是可以修改的
  //   let roleName = columns.find(c => c.dataIndex === 'user_rank')
  //   roleName.render = renderTagOrSelect
  // }
  const rowSelection = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      onSelect(selectedRows[0])
    },
  };

  return <Table
    rowSelection={onSelect ? rowSelection : undefined}
    onChange={handleTableChange}
    pagination={pagination}
    loading={loading}
    dataSource={datas}
    columns={columns}
    rowKey="user_id" />


}