import React from 'react'
import { PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from 'antd'
import { Link } from "react-router-dom"
import styled from 'styled-components'
const BlockLink = styled(Link)`
    display:inline-block;
    .ant-btn{
      margin-bottom: 20px;
    }
    &+a{
      margin-left:16px;
    }
`
const mr = { marginRight: 16 }
const RedA = styled.a`
  color:red;
  &+a{
      margin-left:16px;
    }
`
function AddBtn() {
  return (
    <BlockLink to="modify"  >
      <Button type='primary' icon={<PlusOutlined />}>添加</Button>
    </BlockLink>
  )
}

/**
 * @param {object} props
 * @param {string} [props.pathname = modify] 跳转目标页面
 * @param {object} props.carry 跳转页面时携带的数据
 * @param {string|import('react').ReactElement} [props.children=编辑] 子元素｜react组件
 */
function ModifyBtn({ pathname = 'modify', carry, children = '编辑', style = mr }) {
  return <Link to={{ pathname, state: carry }} style={style} >{children}</Link>
}


/**
 * @param {object} props
 * @param {()=>void} props.onComfirm 弹窗确认回调函数 
 */
function DangerBtn({ onConfirm, title = "确定要删除吗", text = "删除" }) {

  return (
    <Popconfirm title={title} okText="确定" cancelText="取消" onConfirm={onConfirm}>
      <RedA>{text}</RedA>
    </Popconfirm>
  )
}
export { AddBtn, ModifyBtn, DangerBtn }
