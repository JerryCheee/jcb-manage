import req from '../utils/request'

export default {
  getList: (params) => req.get('market/marketCarousel/list', { params }),
  edit: (data) => req.put('market/marketCarousel', data),
  dele: (ids) => req.delete(`market/marketCarousel?${ids}`),
  add: (data) => req.post('market/marketCarousel', data),
}