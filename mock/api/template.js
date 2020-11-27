
var proxy = require('../proxyCRUD')
const staticResBody={"success":true,"message":"操作成功！","code":200,"result":[{"id":"1323928543366426626","name":"测试3.0","updateTime":"2020-11-05 08:58:03","type":1}],"timestamp":1605619045848}
module.exports = {
    'get /system/template/all':proxy.get,
    // 'get /system/template/all':function (req,res,next) {
    //     res.json(staticResBody)
    // },
    'get /system/template/options': proxy.get,
    'get /system/template/:id': proxy.get,
    'delete /system/template': proxy.dele,
    'put /system/template/:id': proxy.put,
    'post /system/template': proxy.post,
}
