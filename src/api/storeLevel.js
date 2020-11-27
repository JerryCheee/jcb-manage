import req from '../utils/request'

export default {
  getList: (params) => req.get('store/level/list', { params }),
  getOptions:()=>req.get('store/level/options'),
  dele: (ids) => req.delete(`store/level?${ids}`),
  edit: (id, data) => req.put(`store/level/${id}`, data),
  add: (data) => req.post('store/level', data),
}