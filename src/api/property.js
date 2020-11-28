import req from '../utils/request'

export default {
    getList: (params) => req.get('product/property/list', { params }),
    getOptions: (params) => req.get('product/property/options', { params }),
    edit: (id, data) => req.put(`product/property/${id}`, data),
    dele: (ids) => req.delete(`product/property?${ids}`),
    add: (data) => req.post('product/property', data),
}