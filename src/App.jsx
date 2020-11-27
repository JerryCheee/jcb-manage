import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from "redux-thunk";
import { Provider } from 'react-redux'
import rootReducer from './stores/reducer'
import { composeWithDevTools } from 'redux-devtools-extension';
import { ConfigProvider } from "antd"
import zhCN from 'antd/es/locale/zh_CN'
import Login from './views/login';
import NotMatch from './views/404'
import Security from './components/boot/security';
import { hot } from "react-hot-loader";
import moment from 'moment';
import 'moment/locale/zh-cn';
import baseConfig from './config/base'
const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )

)
moment.locale('zh-cn');
const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router basename={baseConfig.basePath}>
          <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/404" component={NotMatch} />
            <Route path="/" component={Security} />
          </Switch>
        </Router>
      </ConfigProvider>

    </Provider>
  );
}

export default hot(module)(App);
