import React from 'react'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { logout } from "../../stores/action/admin"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"

export default function Logout({ visible, toggle }) {
    const history = useHistory()
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout())
        history.replace('/login')
    }
    return (
        <Modal
            title={<div><ExclamationCircleOutlined style={{ color: '#faad14' }} />操作提醒</div>}
            visible={visible}
            onOk={handleLogout}
            onCancel={toggle}
            okText="确认"
            cancelText="取消"
        >
            <p>确定要退出登录 ？</p>

        </Modal>

    )

}   