import req from '../utils/request'
export default {
  getList: (params) => req.get('supplier/list', { params }),
  getDetail: (id) => req.get(`supplier/${id}`),
  edit: (id, data) => req.put(`supplier/${id}`, data),
  dele: (ids) => req.delete(`supplier?${ids}`),
  add: (data) => req.post('supplier', data),
  resetPwd: (id) => req.put(`supplier/${id}/restPwd`),
  getOptions: (params) => req.get('supplier/options', { params })
}