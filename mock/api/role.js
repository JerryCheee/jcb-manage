const roles = [
    { id: 1, name: '超级管理员', addTime: '2020-06-29 09:56:33', departId: 0, menuIds: [] },
    { id: 2, name: '普通管理员', addTime: '2020-06-29 09:59:33', departId: 0, menuIds: [1, 2, 3, 4, 5, 6] },
]
var proxy = require('../proxyCRUD')
module.exports = {
    'get /sys/role/list': proxy.get,
    'get /sys/role/options': proxy.get,
    'delete /sys/role': proxy.dele,
    'put /sys/role': proxy.put,
    'post /sys/role': proxy.post,
    'put /sys/role/menus': proxy.put
}
