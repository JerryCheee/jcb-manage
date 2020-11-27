import req from "../utils/request";
export default {
    login: (params) => req.post('sys/login', params),
    getLoginCaptcha: () => req.get('sys/randomImage/1603788233902'),

    getByToken: () => req.get('sys/admin'),
    getDetail: (id) => req.get(`sys/admin/${id}`),
    getList: (params = { page: 1, limit: 10 }) => req.get(`sys/admin/list`, { params }),

    add: (data) => req.post('sys/admin', data),
    edit: (id,data) => req.put(`sys/admin/${id}`, data),
    editPassword: (id, data) => req.put(`sys/admin/changePassword/${id}`, data),
    dele: (ids) => req.delete(`sys/admin?${ids}`),

}