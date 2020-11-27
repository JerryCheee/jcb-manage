import req from '../utils/request'

export default {
    getList: (params) => req.get('sys/role/list', { params }),
    getOptions: () => req.get('sys/role/options'),
    edit: (data) => req.put('sys/role', data),
    dele: (ids) => req.delete(`sys/role${ids}`),
    add: (data) => req.post('sys/role', data),
    assignMenus: (data) => req.put('sys/role/menus', data)
}