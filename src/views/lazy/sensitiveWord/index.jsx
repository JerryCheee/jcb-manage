import React, { useEffect, useState } from 'react'
import { message, Popover, Button, Popconfirm, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Link } from "react-router-dom"
import api from "../../../api/sensitiveWord"

const Content = styled.div`
    margin-top:15px;
    .ant-tag {
        margin-left: 10px;
        margin-bottom: 0;
        line-height: 25px;
        min-width: 50px;
        text-align: center;
    }
    &>div{
        box-shadow: 0px 3px 2px 0px rgba(0,0,0,0.10), 
            0px 0px 1px 0px rgba(0,0,0,0.10);
        padding: 20px 0;
    }
    &>div+div{
        margin-top:20px;
    }
`

const PopMenu = styled.div`
    width: 80px;
    display: flex;
    justify-content: space-around;
`

export default function SensitiveWord() {
    const [datas, setDatas] = useState([])
    const dele = id => async () => {
        let res = await api.dele({ id})
        // let res = await api.dele({id:9}) //删除父级
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData()
    }

    const getData = async () => {
        let res = await api.getAll()
        if (res.code) return message.error(res.msg)
        let all = res.data || []
      
        setDatas(all)
    }

    useEffect(() => { getData() }, [])

    const buildCard = v => (
        <Popover
            key={v.id}
            content={
                <PopMenu>
                    <Link to={{ pathname: 'modify', state: { editData: v, datas } }} >编辑</Link>
                    <Popconfirm title="确定要删除吗" okText="确定" cancelText="取消" onConfirm={dele(v.id)}>
                        <a style={{ color: 'red' }}>删除</a>
                    </Popconfirm>
                </PopMenu>
            }
        >
            <Tag key={v.id} >{v.name}</Tag>
        </Popover>

    )
    return (
        <>
            <Link to={{ pathname: 'modify', state: { datas } }}   >
                <Button type='primary' icon={<PlusOutlined />}>添加</Button>
            </Link>
            <Content>
                {datas.map(buildCard)}
            </Content>

        </>
    )

}
