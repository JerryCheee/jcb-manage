import req from '../utils/request'

export default {
  getAll: () => req.get('product/classify/all'),
  getOptions: () => req.get('product/classify/options'),
  edit: (data) => req.put('product/classify', data),
  dele: (ids) => req.delete(`product/classify?${ids}`),
  add: (data) => req.post('product/classify', data),
}