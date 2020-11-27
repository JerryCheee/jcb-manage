import req from '../utils/request'

export default {
    getList: (params) => req.get('product/tags/list', { params }),
    searchParent: (params) => req.get('product/tags/options', { params }),
    edit: (id,data) => req.put(`product/tags/${id}`, data),
    dele: (id) => req.delete(`product/tags/${id}`),
    add: (data) => req.post('product/tags', data),
    getAllByBrandId: (brandId) => req.get(`product/tags/${brandId}/all`)
}