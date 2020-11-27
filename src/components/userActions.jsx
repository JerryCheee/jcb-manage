import React, { useState } from "react";
import { Menu, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Profile from "./modals/profile";
import EditPassword from "./modals/editPassword";
import Logout from "./modals/logout";
const Item = Menu.Item
const UserIcon = styled(UserOutlined)`
      font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    margin-right:10px;
    cursor: pointer;
`
const SmallAvatar = styled.img`
    width:32px;
    height:32px;
    margin-right:24px;
`

export default function Actions({ info }) {
    const [showProfile, setShowProfile] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showLogout, setShowLogout] = useState(false)
    const toggleProfile = () => setShowProfile(s => !s)
    const toggleEdit = () => setShowEdit(s => !s)
    const toggleLogout = () => setShowLogout(s => !s)
    return (
        <div>
            <Dropdown
                overlay={
                    <Menu>
                        <Item onClick={toggleProfile} >个人资料</Item>
                        <Item onClick={toggleEdit} >修改密码</Item>
                        <Item onClick={toggleLogout} >退出登录</Item>
                    </Menu>}
                placement="bottomLeft">

                {info.avatar ? <SmallAvatar src={info.avatar} /> : <UserIcon />}
            </Dropdown>
            <Profile visible={showProfile} toggle={toggleProfile} info={info} />
            <EditPassword visible={showEdit} toggle={toggleEdit} info={info} />
            <Logout visible={showLogout} toggle={toggleLogout} />

        </div>

    )
}