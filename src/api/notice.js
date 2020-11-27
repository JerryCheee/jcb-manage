import req from '../utils/request'

export default {
  getList: (params) => req.get('system/homeNotice/list', { params }),
  edit: (data) => req.put('system/homeNotice', data),
  dele: (ids) => req.delete(`system/homeNotice?${ids}`),
  add: (data) => req.post('system/homeNotice', data),
}