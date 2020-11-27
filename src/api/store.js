import req from '../utils/request'

export default {
  getList: (params) => req.get('store/list', { params }),
  getDetail: (id) => req.get(`store/${id}`),
  getOptions: (params) => req.get('store/options', { params }),
  dele:(params)=>req.delete('store',{params}),
  edit: (id,data) => req.put(`store/${id}`, data),
  add: (data) => req.post('store', data),
}