import req from '../utils/request'

export default {
  getList: (params) => req.get('platform/platformJoin/list',{params}),
  getDetail: (id) => req.get(`platform/platformJoin/${id}`),

  getRecords: (id) => req.get(`platform/platformJoin/${id}/records`),

  addRecord: (data) => req.post('platform/platformJoin/records',data),

  // getOptions: (params) => req.get('platform/platformJoin/options', { params }),
  edit: (data) => req.put('platform/platformJoin', data),
  dele: (ids) => req.delete(`platform/platformJoin?${ids}`),
  add: (data) => req.post('platform/platformJoin', data),
}