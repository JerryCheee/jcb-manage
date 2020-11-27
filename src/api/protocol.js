import req from '../utils/request'
export default {
    getDetail: (id) => req.get(`system/protocol/${id}`),
    modify: (data) => req.put('system/protocol', data),
}