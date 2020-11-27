var axios = require('axios')
var instans = axios.create({
  baseURL: 'http://192.168.2.173:8080/',
  timeout: 60000 // 请求超时时间
});
instans.interceptors.response.use(response => {
  return Promise.resolve(response)
}, e => {
  console.log(e)
  let res = {
    message: "连接无响应，请检查请求地址",
    code: -1
  };
  if(e.response.data){
    res=e.response.data
  }
  return Promise.resolve({ data: res })
})


module.exports = { instans };