import React from 'react'
import { Modal } from 'antd';
import UserList from '../userList'

export default function SelectUser({ visible, toggle, onSelect,selectType}) {
  return (
    <Modal
      title="选择用户"
      visible={visible}
      closable
      onCancel={toggle}
      width='max(70%,800px)'
    >
      <UserList onSelect={onSelect} selectType={selectType}/>
    </Modal>
  )

}   