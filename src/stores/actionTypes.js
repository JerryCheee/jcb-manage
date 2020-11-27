/** 所有state action都写在这里，保证唯一。
 * 并且任何人通过这个文件可以看到整个app会做哪些操作 
 * 使用jsdoc 注释，在其他文件引用时才能看到智能提示 
 * 不同的state action 用两个空行隔开 
 * */

/** 更新管理员信息 payload = Object */
export const UPDATE_ADMIN = 'UPDATE_ADMIN'
/** 登录出错 payload = String */
export const LOGIN_ERROR = 'LOGIN_ERROR'
/** 正在登录 */
export const LOGGING = 'LOGGING'


/** 更新路由菜单 payload = Array */
export const UPDATE_MENUS = 'UPDATE_MENUS'
/**将角色类型赋值给菜单state，用于后续显示处理 payload = number */
export const UPDATE_ROLE_TYPE = 'UPDATE_ROLE_TYPE'
/**还原初始值 payload = object */
export const RESET_MENUS = 'RESET_MENUS'
