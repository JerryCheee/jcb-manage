import React, { useEffect, useState } from 'react'
import { message, Table } from "antd";
import api from "../../../api/seckill"
import useParamsCache from '../../../hook/useParamsCache'
import useSearchColumn from "../../../hook/useSearchColumn"
import { AddBtn, ModifyBtn, DangerBtn } from '../../../components/styled/operateBtns'


const defoPage = { current: 1, pageSize: 10, total: 0, showTotal: (t) => `总条数${t}` }
export default function Seckill() {
  const [datas, setDatas] = useState([])
  const [pageInfo, setPageInfo] = useState(defoPage)
  const cacheRef = useParamsCache()

  const dele = id => async () => {
    let res = await api.dele(id)
    if (res.code) return message.error(res.msg)
    message.success(res.msg || '删除成功')
    getData(cacheRef.current)
  }

  const getData = async (params) => {
    // let { name } = params;
    // if (name === "") {
    //   delete params.name
    // }
    cacheRef.current = params;

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
      title: '活动名称', align: 'center', dataIndex: 'name', key: 'keyword', width: '250px',
      filteredValue: name ? name : undefined,
      ...useSearchColumn('活动名称')

    },

    { title: '限购数量', align: 'center', dataIndex: 'limited_quantity', key: 'limited_quantity' },

    {
      title: '开始时间', align: 'center', dataIndex: 'start_time', key: 'start_time'
    },
    {
      title: '结束时间', align: 'center', dataIndex: 'end_time', key: 'end_time'
    },

    { title: '关联产品', align: 'center', dataIndex: 'product_name', key: 'product_name' },

    {
      title: '操作', dataIndex: 'operation', key: 'operation', render: (_, data) => {
        return (<div>
          <ModifyBtn carry={{ editData: data }} />
          <DangerBtn onConfirm={dele(data.id)} />
        </div>)

      }
    },
  ]
  const childTable = (record) => {
    const columns = [
      { title: '规格名称', align: 'center', dataIndex: 'name', key: 'name' },
      { title: '库存', align: 'center', dataIndex: 'stock', key: 'stock' },
      { title: '原价', align: 'center', dataIndex: 'price', key: 'price' },
      { title: '秒杀价', align: 'center', dataIndex: 'spike_price', key: 'spike_price' },
    ]
    return <Table columns={columns} dataSource={record.activities_sku_list} rowKey="sku_id" pagination={false} />
  }
  return (
    <div>
      <AddBtn />
      <Table
        dataSource={datas}
        columns={columns}
        rowKey="id"
        pagination={pageInfo}
        expandedRowRender={childTable}
        onChange={handleTableChange} />
    </div>
  )
}
