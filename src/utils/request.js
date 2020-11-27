import axios from 'axios'
import tokenHolder from './tokenHolder'
import baseConfig from '../config/base'
import { message } from 'antd'
const request = axios.create({
    baseURL: `${baseConfig.ApiDomain}/jcb-collect`,
    timeout: 60000 // 请求超时时间
});;

request.interceptors.request.use(config => {
    let token = tokenHolder.get()
    if (token) {
        config.headers["X-Access-Token"] = token;
    }
    return config
}, err)

request.interceptors.response.use(response => {
    // if (response.data.code) console.warn(`${response.config.url}-->${response.data.msg}`)

    // console.log(response.data)
    let { message: msg, result: data, success, code } = response.data;
    let simplify = { code: success ? 0 : code, data, msg }

    if (code === 401) {//token 失效
        message.error('token 失效，请重新登录', () => {
            tokenHolder.remove()
            window.location.replace('/')
        })
    }
    return Promise.resolve(simplify)
}, err)

function err(error) {
    let { message: msg, response } = error
    let code = -1;
    if (response) {
        let { data, status } = response
        code = status
        if (code === 401) {//token 失效
            message.error('token 失效，请重新登录', () => {
                tokenHolder.remove()
                window.location.replace('/')
            })
            return Promise.reject(error);
        }
       
    }
    return Promise.resolve({ code, msg });
};
export default request
