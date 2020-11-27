import React from 'react'
import { Modal, Tag } from 'antd';
import styled from 'styled-components'
import { roleTypes } from '../../config/enums'
const Row = styled.div`
    display:flex;
    height:30px;
    &>div:first-of-type{
        color:#7d7d7d;
    }
`
export default function Profile({ info: {
    roleType,
    realname,
    username,
    phone,
    createTime,
}, visible, toggle }) {
    return (
        <Modal
            title="个人资料"
            visible={visible}
            closable
            onCancel={toggle}
            footer={null}
        >
            <Row>
                <div>角色：</div>
                <div><Tag>{roleType === -1 ? '超级管理员' : roleTypes[roleType]}</Tag></div>
            </Row>
            <Row>
                <div>账号：</div>
                <div>{username}</div>
            </Row>
            <Row>
                <div>用户名：</div>
                <div>{realname}</div>
            </Row>
            <Row>
                <div>手机：</div>
                <div>{phone}</div>
            </Row>
            {/* <Row>
                <div>上次登录时间：</div>
                <div>{lasttime}</div>
            </Row>
            <Row>
                <div>上次登录IP：</div>
                <div>{lastIP}</div>
            </Row> */}
            <Row>
                <div>添加时间：</div>
                <div>{createTime}</div>
            </Row>
        </Modal>
    )

}   