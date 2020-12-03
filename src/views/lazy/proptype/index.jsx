import React, { useEffect, useState } from 'react'
import { message, Popover, Button, Popconfirm,Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Link } from "react-router-dom"
import api from "../../../api/proptype"

const Row = styled.div`
    display:flex;
    flex-wrap:wrap;
`
const BigTag = styled(Tag)`
    line-height: 30px;
    min-width: 90px;
    text-align: center;
    font-size: 17px;
    margin-top: 20px;
    margin-right: 13px;
`
const PopMenu = styled.div`
    width: 120px;
    display: flex;
    justify-content: space-around;
`
export default function Proptypes() {
    const [datas, setDatas] = useState([])

    const deleSome = ids => async () => {
        let res = await api.dele(ids.map(v => `ids=${v}`).join(','))
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData()
    }

    const getData = async () => {
        let res = await api.getAll()
        if (res.code) {
            return message.error(res.msg)
        }
        setDatas(res.data)

    }

    useEffect(() => {
        getData()
    }, [])

    const buildCard = v => (
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

            <BigTag key={v.id} color={'red'}>{v.name}</BigTag>

        </Popover>

    )
    return (
        <>
            <Link to={{ pathname: 'modify'} }  >
                <Button type='primary' icon={<PlusOutlined />}>添加</Button>
            </Link>
            <Row>
                {datas.map(buildCard)}
            </Row>
        </>
    )

}
