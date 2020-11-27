import React, { forwardRef, useEffect } from 'react'
import baseConfig from '../config/base'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import Table from 'braft-extensions/dist/table'
import 'braft-extensions/dist/table.css'
import tokenHolder from '../utils/tokenHolder'

const options = {
  defaultColumns: 2, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: false, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: 'width="100%" cellspacing="0" cellpadding="0" border="0"', // 指定输出HTML时附加到table标签上的属性字符串
  // includeEditors: ['editor-id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['editor-id-2']  // 指定该模块对哪些BraftEditor无效
}

BraftEditor.use(Table(options))

const getInitialValue = () => ({
  editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
  outputHTML: '<p></p>'
})
/** 
 * 专用给富文本编辑器 Braft Editor 控制上传文件
 * 
 */
const myUploadFn = (param) => {
  const serverURL = baseConfig.uploadUrl
  const xhr = new XMLHttpRequest()
  const fd = new FormData()
  const successFn = (response) => {
    // 假设服务端直接返回文件上传后的地址
    // 上传成功后调用param.success并传入上传后的文件地址
    let res = JSON.parse(xhr.response)
    let obj = { url: res.message, }
    param.success(obj)
  }

  const progressFn = (event) => {
    // 上传进度发生变化时调用param.progress
    param.progress(event.loaded / event.total * 100)
  }

  const errorFn = (response) => {
    // 上传发生错误时调用param.error
    param.error({
      msg: 'unable to upload.'
    })
  }

  xhr.upload.addEventListener("progress", progressFn, false)
  xhr.addEventListener("load", successFn, false)
  xhr.addEventListener("error", errorFn, false)
  xhr.addEventListener("abort", errorFn, false)

  fd.append('file', param.file)
  fd.append('biz', 'temp')// 业务参数，跟imgUpload.jsx 同步
  xhr.open('POST', serverURL, true)
  xhr.setRequestHeader('X-Access-Token', tokenHolder.get())
  xhr.send(fd)

}

const media = { uploadFn: myUploadFn };

/**已配置好table，文件上传功能的富文本编辑器 */
function RichTextEditor({ value = getInitialValue(), onChange }, editorRef) {
  useEffect(() => {
    if (typeof value !== "string") return;//只处理纯文本value
    editorRef.current.setValue(BraftEditor.createEditorState(value))

  }, [editorRef, value])
  return (
    <BraftEditor
      value={value}
      ref={editorRef}
      onChange={onChange}
      media={media}
    />
  )
}

export default forwardRef(RichTextEditor)


/*
param.success()参数
 {
      url:
      meta: {
        id: 'xxx',
        title: 'xxx',
        alt: 'xxx',
        loop: true, // 指定音视频是否循环播放
        autoPlay: false, // 指定音视频是否自动播放
        controls: true, // 指定音视频是否显示控制栏
        poster: 'http://xxx/xx.png', // 指定视频播放器的封面
      }
    }
 */