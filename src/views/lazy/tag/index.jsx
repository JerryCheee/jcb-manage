import React, { useEffect, useState } from 'react'
import { message, Popover, Button, Popconfirm, Tag, Pagination, Form, Input, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Link } from "react-router-dom"
import api from "../../../api/tag"
import useParamsCache from '../../../hook/useParamsCache';
import { defoPageInfo, simplify, defoPage } from '../../../utils/handy';

const Item = Form.Item;
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
const IndentBox = styled.div`
    padding-left:20px;
    &>.ant-tag{
        margin-top:10px;
    }
`
const PopMenu = styled.div`
    width: 80px;
    display: flex;
    justify-content: space-around;
`
const PageBar = styled(Pagination)`
    position:fixed;
    right: 3%;
    top: 40%;
    transform: translateY(-50%);
    &>li{
        display: block;
        margin-right: 0;
        margin-bottom: 8px;
    }
`
const beAscend = (a, b) => a.sort - b.sort

const makeRouteParams = (state) => ({ pathname: 'modify', state })

const buildActions = (v, parent, total, dele) => (
    <PopMenu>
        <Link to={makeRouteParams({ editData: v, total, parent, })} >编辑</Link>
        <Popconfirm title="确定要删除吗" okText="确定" cancelText="取消" onConfirm={dele(v.id)}>
            <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
    </PopMenu>
)

const buildChildTags = (v, buildTag) => (
    <IndentBox>
        {v.options.sort(beAscend).map(c => buildTag(c, v))}
        <Link to={makeRouteParams({ total: v.options.length, parent: v })} >
            <Tag><PlusOutlined /></Tag>
        </Link>
    </IndentBox>
)

const buildTags = buildTag => v => (
    <div key={v.id}>
        {buildTag(v)}
        {v.options.length
            ? buildChildTags(v, buildTag)
            : <IndentBox>
                <div style={{ height: 8 }}></div>
                <Link to={makeRouteParams({ total: v.options.length, parent: v })} >
                    <Tag><PlusOutlined /></Tag>
                </Link>
            </IndentBox>
        }
    </div>
)

export default function Tags() {
    const [datas, setDatas] = useState([])
    const [pageInfo, setPageInfo] = useState(defoPageInfo)
    const cache = useParamsCache()
    const [form] = Form.useForm()

    const changePage = (current, pageSize) => {
        let last = cache.current || {}
        getData({ ...last, current, pageSize })
    }
    const submitSearch = () => {
        let values = form.getFieldsValue()
        getData({ ...defoPage, ...values })
    }
    const cleanSearch = () => {
        form.resetFields()
        getData(defoPage)
    }
    const dele = id => async () => {
        let res = await api.dele(id)
        // let res = await api.dele({id:9}) //删除父级
        if (res.code) return message.error(res.msg)
        message.success(res.msg || '删除成功')
        getData(pageInfo)
    }

    const getData = async params => {
        cache.current = params
        let res = await api.getList(simplify(params))
        if (res.code) return message.error(res.msg)
        let datas = res.data.records || []
        setDatas(datas)
        let { pageSize, current } = params
        setPageInfo({ pageSize, current, total: res.data.total })
    }
    //eslint-disable-next-line
    useEffect(() => {
        let params = cache.current
        if (params) {
            form.setFieldsValue(params)
            getData(params)
        } else {
            getData(pageInfo)
        }
        //eslint-disable-next-line
    }, [])

    const buildTag = (v, p) => (
        <Popover
            key={v.id}
            content={buildActions(v, p, pageInfo.total, dele)}
        >
            <Tag key={v.id} color={v.options ? 'blue' : undefined} >{v.name}</Tag>
        </Popover>

    )

    return (
        <div>
            <Row>
                <Col>
                    <Link to={{ pathname: 'modify', state: { datas } }}   >
                        <Button type='primary' icon={<PlusOutlined />}>添加一级标签</Button>
                    </Link>

                </Col>
                <Col offset={4}>
                    <Form layout="inline" form={form}>
                        <Row className="grow">
                            <Col>

                                <Item name="name" label="名称">
                                    <Input placeholder="请输入名称" allowClear />
                                </Item>
                            </Col>

                            <Col>
                                <Item>
                                    <Button htmlType="submit" onClick={submitSearch}>搜索</Button>
                                </Item>
                            </Col>
                            <Col>
                                <Item>
                                    <Button onClick={cleanSearch}>重置</Button>
                                </Item>
                            </Col>
                        </Row>



                    </Form>
                </Col>
            </Row>
            <Content>
                {datas.map(buildTags(buildTag))}
            </Content>
            <PageBar {...pageInfo} onChange={changePage} />

        </div>

    )

}


