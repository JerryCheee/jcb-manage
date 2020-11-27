import initialState from "../state/admin";
import {
    UPDATE_ADMIN,
    LOGIN_ERROR,
    LOGGING
} from "../actionTypes";

function reducer(state = initialState, { type, payload }) {
    switch (type) {
        case UPDATE_ADMIN:
            state.info = payload
            state.errMsg = null;
            state.loading = false
            break;
        case LOGIN_ERROR:
            state.errMsg = payload
            state.loading = false
            break;
        case LOGGING:
            state.loading = true
            break
        default:
            return state
    }
    return { ...state }
}

export default reducer;