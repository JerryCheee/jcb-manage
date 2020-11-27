

var proxy = require('../proxyCRUD')
const staticResBody={"success":true,"message":"操作成功！","code":200,"result":[{"name":"东成东成电动工具","id":"1321366747707277316"},{"name":"测试","id":"1323450705664212994"},{"name":"舒适空间","id":"1327443192091160577"},{"name":"联塑","id":"1327443192103743490"},{"name":"广东电缆","id":"1327443192112132098"},{"name":"东成","id":"1327443192112132099"},{"name":"DCA","id":"1327443192120520705"},{"name":"博世","id":"1327443192120520706"},{"name":"美辉","id":"1327443192120520707"},{"name":"松本","id":"1327443192128909314"},{"name":"迪欧安普","id":"1327443192128909315"},{"name":"高壹","id":"1327443192137297922"},{"name":"巨蜥","id":"1327443192137297923"},{"name":"金鼎","id":"1327443192137297924"},{"name":"南盛","id":"1327443192137297925"},{"name":"奥突斯","id":"1327443192137297926"},{"name":"汉舍卫浴","id":"1327443192145686529"},{"name":"金联宇","id":"1327443192145686530"},{"name":"峻泰木业","id":"1327443192145686531"},{"name":"雪玉","id":"1327443192145686532"},{"name":"康缘木业","id":"1327443192154075138"},{"name":"水中王","id":"1327443192154075139"},{"name":"百得","id":"1327443192154075140"},{"name":"东龙力冠","id":"1327443192154075141"},{"name":"金万宇","id":"1327443192154075142"},{"name":"松崎","id":"1327443192154075145"}],"timestamp":1605619045849}
module.exports = {

    'get /product/brand/list': proxy.get,
    'get /product/brand/options': proxy.get,
    // 'get /product/brand/options': function (req,res,next) {
    //     res.json(staticResBody)
    // },
    'post /product/brand': proxy.post,
    'put /product/brand/:id': proxy.put,
    'delete /product/brand': proxy.dele,



}
