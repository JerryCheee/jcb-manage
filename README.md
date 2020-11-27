### 基本命令

```yarn dev-mock``` 开发模式 使用本地mock数据

```yarn dev```  开发模式

```yarn build```    编译

### 项目结构
 - `mock`   本地接口假数据 目录内文件使用 commonJS 模块化风格
   - `api`   mock api目录
   - `index.js` express 启动入口
 - `public` 编译后文件
 - `src` 源代码 
   - `api` 接口定义
     - `xx.js` 建议一个控制器对应一个.js
   - `assest` 资源文件目录
   - `components`非页面级 自定义组件 
     - `boot` 项目运行最开始执行的文件
     - `madals` 弹窗组件目录
   - `stores` 全局状态
     - `action` 动作定义 配合redux thunk 实现异步数据处理
     - `reducer` 状态变更的细节
     - `state` 每个state的初始状态定义
     - `actoinTypes` 统一定义所有操作类型
   - `utils` 通用工具函数
   - `views` 页面级组件
     - `lazy` 动态懒加载页面 全部放在这里（动态路由核心之一）
       - `xxx` 基于要操作的实体(entity) 分目录
         - `index.jsx` 固定命名，展示当前entity的列表数据
         - `modify.jsx` 固定命名，添加，修改 都用这个文件，根据route 参数有无区分要添加还是修改
     - `xx.jsx` 通用无权限页面。login，404等
   - `.eslintrc.js` 自定义eslint 规则，前提是 .env内的 EXTEND_ESLINT=true
   - `App.jsx` 组件顶层，主要初始化全局redux 等全局数据
   - `App.test.js` 测试用，暂时没用
   - `index.css` 全局css
   - `index.js` 入口文件
   - `serviceWorker.js` 不清楚，不用管，不要改
   - `setupTest.js` 初始化测试配置
 - `.env` 全局变量 定义，通过process.env.xx 获取
 - `config-overrides.js` 实现代码热更新为局部刷新 hot reloat -> hot module replace
 - `nodemon.json`配置-> mock 目录下文件更改后 express 自动刷新

### 亮点

 1. 开发时 可同时启动 mock 服务器，并且服务器端支持热更新

 2. 开发时 实现局部热更新。（默认的热更新会刷新整个页面的组件）

 3. 使用React.lazy 无依赖实现：代码分割，路由懒加载，动态路由

 4. 完整的 权限管理 (角色=>admin=>路由)
###  基本约定 & 代码风格
 1. 动态路由组件统一放在 *scr/views/lazy* 目录下

 2. 路由即文件，
    > 如：当前url为 *domai.com/role/index* ； 那么文件最终路径就应该为 *role/index*。(vscode中，ctrl+p快速打开该文件)

 3. 列表页 到 编辑页，通过 history state 传递当前编辑的对象，state属性名固定为 editData。
    > 这样 面包屑组件 就能区分进入 modify 是编辑还是添加
    ```
    /* /views/lazy/role/index.jsx */

     <Link to={{ pathname: 'modify', state: { editData: data } }}  >编辑</Link>

    /* /components/breadcrumb.jsx */

    if (/\/modify$/.test(link.path)) {
      let { state = {} } = location
      if (!state.editData) {
        let { id, path, name } = link;
        name = name.replace('编辑', '添加')
        link = { id, path, name }
      }
    }

    ```
 4. API 接口统一格式
    - 增 `POST entity`  参数 entity
    - 删 `DELETE entity/:id` 参数 id
    - 改 `PATCH  entity`  参数 entity
    - 查 `GET entity/list?page=1&limit=10` *分页查询* 

    - 查 `GET entity/all` *无条件获取全部 适用明显不会有大数据量的表*
    - 查 `GET entity/list/only/:id?page=1&limit=10` *分页获取指定id的数据*
    - 查 `GET entity/all/only/:id` *无条件获取指定id 关联的全部数据*
    **总结**
     动词：`POST` 新增，`DELETE` 删除，`PATCH` 修改，`GET` 查询。
     名词：`/list` 列表操作，`/all` 操作全部，`/only/:id` 特定对象操作。`only`可组合其他两个名词
     扩展组合：`POST entity/list` 批量添加，`PATCH entity/list` 批量修改
 4. 零散组件定义在import语句下面
    ```
    import {Form} from "antd"
    const FormItem = Form.Item;
    ```
 5. 当参数为函数时，尽量将函数先定义成变量，再传入，增加可读性
     ```
       const isComponent = v => v.component !== ''
       const components=menus.filter(isComponent)
       
       const byId = v => v.id === id
       const target = menus.find(byId) //像读文章一样，优雅
     ```
  6. 复杂的if判断，需要将判断定义为语义明确的变量。省去注释，增加可读性
      ```
       const isHomeRedirect = !links.length && link.path === first.path

       if (isHomeRedirect) return

      ```
### 技术栈
[React]('https://zh-hans.reactjs.org/')

[Redux]('https://redux.js.org/introduction/core-concepts') 状态管理

[ReduxThunk]('https://github.com/reduxjs/redux-thunk') 异步状态管理

[ReactRouter]('https://reacttraining.com/react-router/web/api/Hooks') 路由

[StyledComponent]('https://styled-components.com/docs/api#primary')  css-in-js  

[Ant Design]('https://ant.design/components/overview-cn/') UI组件库

 #### Node Express 搭建本地api

> [express req api]('https://www.expressjs.com.cn/4x/api.html#res')

> [express res api]('https://www.expressjs.com.cn/4x/api.html#req')

