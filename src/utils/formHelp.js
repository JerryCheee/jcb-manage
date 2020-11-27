export function genImgUid(index) {
  return `rc-upload-${new Date() * 1 + index}`
}
/** 模仿上传时自动生成的uid  格式*/
function genOffcialUid(len) {
  let ids = []
  for (let i = 0; i < len; i++) {
    ids.push(genImgUid(i))
  }
  return ids
}
/**
 * 制作 antd upload 组件接受的初始值
 * 
 * @param {string[]} imgUrls 线上图片链接 
 * @param {string|number[]} ids 线上图片链接 
 */
export function makeUploadDefaultValue(imgUrls, ids = []) {
  if (!ids.length) {
    ids = genOffcialUid(imgUrls.length)
  }
  return imgUrls.map((u, i) => ({
    uid: ids[i],
    status: 'done',
    url: u,
    name: 'image.png',
    response: {
      code: 0,
      message: u,
      success: true,
    }
  }))
}
/**
 * 表单验证函数-验证两次密码输入是否一致
 * @param {Object} antdFormIns 表单对象，自动传递
 */
export function confirmPwd({ getFieldValue }) {
  return ({
    validator(rule, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject('两次输入密码不一致');
    },
  })
}
/**
 * @typedef {Object} Uploaded
 * @property {Number} uid - TimeSpan
 * @property {String} status - done
 * @property {String}  name  - image.png
 */
/**
 * 构建 antd upload组件上传文件时 的处理函数
 * @param {Function} setUploading load状态管理函数
 * @returns {Function} onChange 函数
 */
export function makeUploadHandler(setUploading) {
  return function (info) {
    switch (info.file.status) {
      case 'uploading':
        setUploading(true)
        return info.fileList
      case 'done':
        setUploading(false)
        return info.fileList
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
  }
}
/**
 * 表单验证函数-验证中国大陆手机号
 * @param {Object} antdFormIns 表单对象，自动传递
 */
export function phoneValidator({ getFieldValue }) {
  return {
    validator(rule, value) {
      if (/^1\d{10}/.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject('手机号格式不正确');
    },
  }
}
/**
 * 验证账号无特殊字符
 * @param {Object} antdFormIns 表单对象，自动传递
 */
export const accountValidator = ({ getFieldValue }) => ({
  validator(rule, value) {
    if (/^[a-zA-Z0-9]+$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject('账号只允许存在字母和数字');
  },
})


/**
 * 通过缩略图地址 转换得出 原图地址
 * @param {[String]} thumbs
 */
