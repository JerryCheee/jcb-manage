import { UPDATE_ADMIN, LOGIN_ERROR, LOGGING } from "../actionTypes";
import api from "../../api/admin";
import tokenHolder from "../../utils/tokenHolder";
import { passRoleType, resetMenus } from "./menus"
import initialAdmin from "../state/admin"
import initialMenus from "../state/menus"

export const updateAdmin = adminInfo => ({ type: UPDATE_ADMIN, payload: adminInfo })
export const setLoginErr = msg => ({ type: LOGIN_ERROR, payload: msg })
export const setLogging = () => ({ type: LOGGING })

export const login = params => async (dispatch) => {
    dispatch(setLogging())
    let res = await api.login(params)
    if (!res) return dispatch(setLoginErr('请求登录接口发生错误，详情看控制台'))
    if (res.code) return dispatch(setLoginErr(res.msg))
    let { token, userInfo } = res.data

    dispatch(updateAdmin(userInfo))
    dispatch(passRoleType(userInfo.roleType))
    tokenHolder.set(token, params.remember_me)

}
export const logout = () => (dispatch) => {
    tokenHolder.remove()
    dispatch(updateAdmin(initialAdmin))
    dispatch(resetMenus(initialMenus))

}
export const initByToken = () => async (dispatch) => {
    let res = await api.getByToken()
    if (res.code) return dispatch(setLoginErr(res.msg))
    let { token, userInfo } = res.data
    dispatch(updateAdmin(userInfo))
    dispatch(passRoleType(userInfo.roleType))
    tokenHolder.set(token,true)
}