import { UPDATE_MENUS,UPDATE_ROLE_TYPE,RESET_MENUS } from "../actionTypes";
import api from "../../api/menus";

export const getMenus = () => async (dispatch) => {
    let res = await api.getAllMenus()
    if (res.code) throw Error('请求菜单时出错，原因:' + res.msg)
    dispatch(updateMenus(res.data))
}
/** @param {Array} payload */
export const updateMenus=(payload)=>({type:UPDATE_MENUS,payload})
/** @param {Number} payload */
export const passRoleType=(payload)=>({type:UPDATE_ROLE_TYPE,payload})
/** @param {Object} payload */
export const resetMenus=(payload)=>({type:RESET_MENUS,payload})