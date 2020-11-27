import req from '../utils/request'

export default {
    getAll: () => req.get('sensitiveWord/all'),
    edit: (data) => req.put('sensitiveWord', data),
    dele: (id) => req.delete(`sensitiveWord/${id}`),
    add: (data) => req.post('sensitiveWord', data),
}