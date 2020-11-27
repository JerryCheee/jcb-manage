import req from '../utils/request'

export default {
  getFee: () => req.get('sys/parameter/getWithdrawalFee'),
  getDeduction: () => req.get('sys/parameter/getDeduction'),
  getDistribution: () => req.get('sys/parameter/getDistribution'),
  editFee: (data) => req.post('sys/parameter/updateWithdrawalFee', data),
  editDeduction: (data) => req.post('sys/parameter/updateDeduction', data),
  editDistribution: (data) => req.post('sys/parameter/updateDistribution', data)
}