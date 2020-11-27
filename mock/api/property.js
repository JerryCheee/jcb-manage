

var proxy = require('../proxyCRUD')
const staticResBody = {
    "success": true, "message": "操作成功！", "code": 200, "result": [
        { "name": "型号", "id": "1321366747707277322" },
        { "name": "电压", "id": "1321366747707277323" },
        { "name": "颜色", "id": "13217707277324" }], "timestamp": 1605012623740000
}
module.exports = {

    'get /product/property/list': proxy.get,
    'get /product/property/options': proxy.get,
    // 'get /product/property/options': function (req, res, next) {
    //     console.log(staticResBody)
    //     res.json(staticResBody)
    // },
    'post /product/property': proxy.post,
    'put /product/property': proxy.put,
    'delete /product/property': proxy.dele,



}
