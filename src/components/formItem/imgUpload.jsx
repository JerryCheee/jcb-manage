import React, { useState, useCallback, useEffect, useMemo } from "react";
import baseConfig from "../../config/base"
import { Upload } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import tokenHolder from '../../utils/tokenHolder'
/** 外层Form.Item 一定要写 valuePropName="fileList" */
export default function ImgUpload({ fileList = [], onChange, multiple = false, listType = "picture-card", max = 10 }) {
  const [uploading, setUploading] = useState(false)
  const [showUploadBtn, setShowUploadBtn] = useState(true)
  if (fileList === null) {
    fileList = []
  }
  useEffect(() => {
    if (multiple) return;
    setShowUploadBtn(!fileList.length)
  }, [multiple, fileList])

  const handleChange = useCallback((info) => {

    switch (info.file.status) {
      case 'uploading':
        setUploading(true)
        return info.fileList
      case 'done':
        setUploading(false)
        let { uid } = info.file
        let target = info.fileList.find(v => v.uid === uid)
        //点击预览就会打开上传后的图片 //默认是base64编码
        target.url = target.response.message
        return info.fileList.slice()
      case 'error':
      case 'removed':
        const validStates = ['done', 'uploading']
        const valid = f => validStates.includes(f.status)
        const list = info.fileList.filter(valid)
        return list
      default:
        console.error('未知的上传状态');
        break;
    }

  }, [])
  const invokeHanlder = (event) => {
    handleChange(event)
    onChange(event.fileList)// 等同于 <Form.Item  valuePropName="fileList" >
  }
  const uploadProps = useMemo(() => {
    return {
      name: 'file',
      action: baseConfig.uploadUrl,
      accept: 'image/*',
      data: { biz: 'temp' },//业务参数
      headers: { 'X-Access-Token': tokenHolder.get() },
      listType,
      multiple,
    }
    //eslint-disable-next-line
  }, []);
  return (
    <Upload {...uploadProps} beforeUpload={() => !uploading} onChange={invokeHanlder} fileList={fileList}>
      {showUploadBtn ? (
        <div>
          {uploading ? <LoadingOutlined /> : <PlusOutlined />}
          {fileList.length >= max ? null : <div className="ant-upload-text">上传</div>}
        </div>
      ) : null}
    </Upload>)
}