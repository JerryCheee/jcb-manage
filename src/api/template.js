import req from '../utils/request'

export default {
    getAll: () => req.get('system/template/all'),
    getDetail: (id) => req.get(`system/template/${id}`),
    edit: (id,data) => req.put(`system/template/${id}`, data),
    dele: (ids) => req.delete(`system/template?${ids}`),
    add: (data) => req.post('system/template', data),
    getOptions: (params) => req.get('system/template/options', { params })
}