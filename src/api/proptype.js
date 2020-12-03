import req from '../utils/request'

export default {
  getAll: () => req.get('product/proptype/all'),
  edit: (data) => req.put('product/proptype', data),
  dele: (ids) => req.delete(`product/proptype?${ids}`),
  add: (data) => req.post('product/proptype', data),
}