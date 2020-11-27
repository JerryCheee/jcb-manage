

var proxy = require('../proxyCRUD')
const staticResBody={"success":true,"message":"操作成功！","code":200,"result":[{"name":"型号","id":"1321366747707277322"},{"name":"电压","id":"1321366747707277323"}, { "name": "颜色", "id": "13217707277324" }],"timestamp":1605012623740}
module.exports = {

    'get /product/info': proxy.get,
    'get /product/info/:id': proxy.get,
    'get /product/info/options': proxy.get,

    // 'get /product/property/options': function (req,res,next){
    //     res.json(staticResBody)
    // },
    'post  /product/info': proxy.post,
    'post  /product/info/saveDraft': proxy.post,
    'put  /product/info/:id': proxy.put,
    'put /product/info/moveRecycleBin': proxy.put,





}
