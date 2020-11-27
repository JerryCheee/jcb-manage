import req from '../utils/request'

export default {
    getList: (params) => req.get('comment/list', { params }),
    edit: (data) => req.put('comment', data),
    dele: (id) => req.delete(`comment/${id}`),
}