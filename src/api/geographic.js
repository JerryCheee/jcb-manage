import req from '../utils/request'

export default {

  getOptions: (params) => req.get('system/geographic/options',{params}),
 
}