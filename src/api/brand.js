import req from '../utils/request'

export default {
    getList: (params) => req.get('product/brand/list', { params }),
    edit: (id,data) => req.put(`product/brand/${id}`, data),
    editPart: (data) => req.put('product/brand', data),
    dele: (ids) => req.delete(`product/brand?${ids}`),
    add: (data) => req.post('product/brand', data),
    getOptions: (params) => req.get('product/brand/options', { params })
}