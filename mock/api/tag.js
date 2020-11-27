const datas = [
    { id: 1, pid: 0, name: "电压", sort: 1 },
    { id: 5, pid: 1, name: "110V", sort: 1 },
    { id: 6, pid: 1, name: "220V", sort: 2 },
    { id: 7, pid: 1, name: "330V", sort: 3 },
    { id: 2, pid: 0, name: "功率", sort: 2 },
    { id: 10, pid: 2, name: "200W", sort: 1 },
    { id: 11, pid: 2, name: "300W", sort: 2 },
    { id: 12, pid: 2, name: "400W", sort: 3 },


]
var proxy = require('../proxyCRUD')
module.exports = {
    'get /product/tags/list': proxy.get,
    'get /product/tags/:brandId/all': proxy.get,
    'get /product/tags/options': proxy.get,
    'delete /product/tags/:id': proxy.dele,
    'put /product/tags/:id': proxy.put,
    'post /product/tags': proxy.post
}
