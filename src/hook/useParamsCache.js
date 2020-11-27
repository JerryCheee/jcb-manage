import { useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom'
/**
 * 获取路由上代表业务主体的那部分 如/product/index 主体为product
 * @param {String} url 路径
 */
// const getScope = (url = '') => url.split('/').slice(1, -1).join('/')
const getScope = (url = '') => url.split('/')[1]

export default function () {

  const history = useHistory()
  const cacheRef = useRef()

  useEffect(() => {
    const { pathname } = history.location
    let before = sessionStorage.getItem(pathname)
    cacheRef.current = before ? JSON.parse(before) : null
    const scope = getScope(pathname)

    const unListen = history.listen((destination, type) => {
      if (type === "PUSH") {
        // console.log('add', cacheRef.current)
        sessionStorage.setItem(pathname, JSON.stringify(cacheRef.current))
      }
    })

    return () => {
      unListen();
      let curscope = getScope(history.location.pathname)
      if (curscope === scope) return;
      sessionStorage.removeItem(pathname)
      // console.log('remove', cacheRef.current)
    }
    //eslint-disable-next-line
  }, [])
  return cacheRef;
}