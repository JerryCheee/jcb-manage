import req from '../utils/request'

export default {
    getList: (params) => req.get('member/list', { params }),
    edit: (data) => req.put('member', data),
    dele: (id) => req.delete(`member/${id}`),
    add: (data) => req.post('member', data),
}