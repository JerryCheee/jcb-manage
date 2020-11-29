import req from '../utils/request'
export default {

    getList: (params) => req.get('product/info', { params }),
    getDraftList: (params) => req.get('product/info/listDraft', { params }),
    getDraftDetail: (id) => req.get(`product/info/listDraft/${id}`),
    getDetail: (id) => req.get(`product/info/${id}`),
    getOptions: (params) => req.get('product/info/options', { params }),
    save: (data) => req.post('product/info/saveDraft', data),
    edit: (id, data) => req.put(`product/info/${id}`, data),
    /**移动回收站或者恢复 */
    move: (data) => req.put('product/info/moveRecycleBinBatch', data),
    add: (data) => req.post('product/info', data),
    submitDraft: (data) => req.post('product/info/submitDraft', data),
}