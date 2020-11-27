import req from '../utils/request'
export default {
  getList: (params) => req.get('coupons/list', { params }),
  edit: (data) => req.put('coupons', data),
  dele: (id) => req.delete(`coupons/${id}`),
  add: (data) => req.post('coupons', data),
  getDetail:(id)=>req.get(`coupons/${id}`)
}

