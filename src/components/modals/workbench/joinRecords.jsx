import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import api from '../../../api/join'
import { Modal, Table } from 'antd'
const MidImg = styled.img`
    width:100px;
    height:100px;
`
const BigImg = styled.img`
    max-width:500px;

`
const getRecords = async (id, next) => {
    let res = await api.getRecords(id)
    if (res.code) return;
    next(res.data)
}
export default function JoinRecords({ id, visible, toggle }) {
    const [datas, setDatas] = useState([])
    const [preview, setPreview] = useState(null)
    useEffect(() => {
        if (!id) return;
        getRecords(id, setDatas)
    }, [id])
    // useEffect(() => {
    //     return () => {
    //         closePreview()
    //     }
    // }, [])
    const showPreview = (url) => () => {
        setPreview(url)
    }
    const closePreview = () => {
        setPreview(null)
    }
    /**@type {import('antd/lib/table').ColumnsType} */
    const columns = [
        { title: "图片", key: "pic", dataIndex: "pic", render: t => t ? <MidImg src={t} onClick={showPreview(t)} /> : null,width:100 },
        { title: "内容", key: "content", dataIndex: "content", width: 500},
        { title: "跟进时间", key: "createTime", dataIndex: "createTime",width:150  },
        { title: "跟进人", key: "followBy", dataIndex: "followBy",width:100 },
    ]

    return (
        <div>

            <Modal
                title="跟进记录"
                visible={visible}
                width={850}
                closable
                onCancel={toggle}
                footer={null}
            >
                <Table
                    dataSource={datas}
                    columns={columns}
                    rowKey="id"
                />

            </Modal>
            <Modal
                visible={!!preview}
                closable
                onCancel={closePreview}
                footer={null}

            >
                <BigImg src={preview} />

            </Modal>
        </div>

    )
}