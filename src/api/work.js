import req from '../utils/request'

export default {
 /** @param {VerifyData} data*/
  verify: (data) => req.put('/work/workTask/verify', data),

  /** @param {1|2|3} type 1=商品审核 2=门店审核 3=供应商审核 */
  getList: (type, params) => req.get(`/work/workTask/list/${type}`, { params }),

  /** @param {string} id 主键id */
  getDetail: (id) => req.get(`/work/workTask/${id}`)
}
 /**
   * @typedef {object} VerifyData
   * @property {string} id 主键id 
   * @property {1|2} status 审核结果(1-通过 2-拒绝)
   * @property {string} verifyNote 审核备注
   */