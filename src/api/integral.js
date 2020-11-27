import req from '../utils/request'

export default {
  put: (data) => req.put('integralRule', data),
  get: () => req.get('integralRule/all')
}