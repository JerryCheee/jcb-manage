import req from '../utils/request'
export default {
  getList: (params) => req.get('activities/list', { params }),
  edit: (data) => req.put('activities', data),
  dele: (id) => req.delete(`activities/${id}`),
  add: (data) => req.post('activities', data),
}