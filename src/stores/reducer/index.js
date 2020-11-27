import { combineReducers } from 'redux'

//自动注册当前目录下所有 reducer

const allReducer = importAll(require.context('./', false, /\.js$/))

function importAll(r) {
    let modules = {}
    r.keys().forEach(key => {
        let m = r(key).default
        let n = key.replace(/\.\/|\.js/g, '');
        if (n === 'index') return;
        modules[n] = m
    });
    return modules
}
export default combineReducers(allReducer)


