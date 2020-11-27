//实现开发时 热更新表现为局部刷新
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
module.exports=function override(config,env) {
    config = rewireReactHotLoader(config,env)
    config.resolve.alias={
        ...config.resolve.alias,
        'react-dom':'@hot-loader/react-dom'
    }
    return config
}