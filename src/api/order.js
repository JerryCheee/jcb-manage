import req from '../utils/request'

export default {
    getList: (params) => req.get('order/list', { params }),
    getRefundTableData: (params) => req.get('order/refundlist', { params }),
    getDelievery: (params) => req.get('order/delivery', { params }),
    getDetail: (id) => req.get(`order/${id}`),
    deliver: (data) => req.put('order/delivery', data),
    refund: (data) => req.put('order/refund', data),
    orderExpress: (data) => req.post('/order/OrderExpress', data),
}