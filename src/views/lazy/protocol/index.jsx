import { Button, message } from 'antd'
import React,{ useRef, useState, useEffect } from 'react'
import RichTextEditor from '../../../components/richTextEditor'
import api from '../../../api/protocol'

const btnSty = {
    display: 'block',
    margin: '24px auto 0 auto',

}
const typeNames = ['门店加盟协议', '用户协议', '师傅加盟协议']
/**只能通过路由打开，地址后面一定有数字作为type */
export default function Protocol({ history, location }) {
    const editorRef = useRef()
    const [defoValue, setDefoValue] = useState()
    const type = location.pathname.split('/').pop()
    useEffect(() => {
        api.getDetail(type).then(res => {
            if (res.code) return;
            setDefoValue(res.data.content)
        })
        // eslint-disable-next-line
    }, [])
    const onSubmit = async () => {
        let content = editorRef.current.getValue().toHTML()
        let res = await api.modify({ content, type })
        if (res.code) return message.error(res.msg)
        message.success(res.msg, history.goBack)
    }
    return (
        <div>
            <h3>{typeNames[type]}</h3>
            <RichTextEditor ref={editorRef} value={defoValue} />
            <Button type="primary" onClick={onSubmit} style={btnSty}>确认提交</Button>
        </div>
    )
}