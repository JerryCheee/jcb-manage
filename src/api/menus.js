import req from '../utils/request'
export default {
    getAllMenus: () => req.get(`sys/menu/all`),
    editMenu: (id,data) => req.put(`sys/menu/${id}`, data),
    deleMenu: (id) => req.delete(`sys/menu/${id}`),
    addMenu: (data) => req.post('sys/menu', data)
}