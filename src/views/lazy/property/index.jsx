import React, { useEffect, useState } from 'react'
import { message, Popover, Popconfirm, Tag, Card, Pagination } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom"
import api from "../../../api/property"
import { AddBtn } from "../../../components/styled/operateBtns"
import { defoPage, defoPageInfo, simplify } from '../../../utils/handy';
import useParamsCache from '../../../hook/useParamsCache';

const BigTag = styled(Tag)`
    line-height: 30px;
    min-width: 90px;
    text-align: center;
    font-size: 17px;
    margin-right: 14px;
    margin-bottom: 14px;
`
const PopMenu = styled.div`
    width: 120px;
    display: flex;
    justify-content: space-around;
`
const ColWrapper = styled.div`
   position:relative;
   min-height:360px;
   padding-bottom:80px;
    .ant-pagination{
        position:absolute;
        left:50%;
        bottom:5%;
        transform:translateX(-50%);
        width: max-content;
    }
    
`

const initPageInfo = { ...defoPageInfo, pageSize: 50 }

export default function Propertis() {
    const [datas, setDatas] = useState([])
    const [pageInfo, setPageInfo] = useState(initPageInfo)
    const cache = useParamsCache()

    const deleSome = ids => async () => {
        let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData(cache.current)
    }
    const getData = async (params) => {
        let res = await api.getList(simplify(params))
        if (res.code) return message.error(res.msg)
        cache.current = params
        let datas = res.data.records || []
        setDatas(datas)
        let { pageSize, current } = params
        setPageInfo({ pageSize, current, total: res.data.total })
    }
    //eslint-disable-next-line
    useEffect(() => {
        if (cache.current) {
            getData(cache.current)

        } else {
            getData(defoPage)
        }
    }, [])

    const changePage = (current, pageSize) => {
        getData({ current, pageSize })
    }
    const buildTag = v => (
        <Popover
            key={v.id}
            content={
                <PopMenu >
                    <Link to={{ pathname: 'modify', state: { editData: v } }} >编辑</Link>
                    <Popconfirm title="确定要删除吗" okText="确定" cancelText="取消" onConfirm={deleSome([v.id])}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </PopMenu>
            }
        >

            <BigTag key={v.id}>{v.name}</BigTag>

        </Popover>

    )
    return (
        <ColWrapper>
            <AddBtn />
            <div>
                {datas.map(buildTag)}
            </div>

            <Pagination {...pageInfo} onChange={changePage} />

        </ColWrapper>
    )

}
