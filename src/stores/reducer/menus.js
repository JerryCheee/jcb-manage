import initialState from '../state/menus'
import { UPDATE_MENUS, UPDATE_ROLE_TYPE, RESET_MENUS } from "../actionTypes";
import baseConfig from '../../config/base'

function reducer(state = initialState, { type, payload }) {
    switch (type) {
        case RESET_MENUS:
            return payload
        case UPDATE_ROLE_TYPE:
            return { ...state, roleType: payload }
        case UPDATE_MENUS:
            payload = payload.filter(v => v.sortNo > baseConfig.MinMenuSort)
            const isParent = v => !v.parentId && !v.component,
                isChild = v => v.parentId,//!=""&&!=null
                isSingle = v => !v.parentId && v.component.length > 0,
                isMyChild = p => c => c.parentId === p.id,
                ascending = (a, b) => a.sortNo - b.sortNo;
            let parents = payload.filter(isParent)
            let singles = payload.filter(isSingle)
            let children = payload.filter(isChild)
            parents = [...parents, ...singles].sort(ascending)
            if (state.roleType > -1) {//减掉角色前缀
                parents.filter(v => v.name.includes('-')).forEach(p => {
                    p.name = p.name.split('-')[1]
                })
            }

            parents.forEach(p => {
                p.children = children.filter(isMyChild(p)).sort(ascending)
            })

            return { ...state, datas: parents }
        default:
            return state
    }
}
export default reducer;