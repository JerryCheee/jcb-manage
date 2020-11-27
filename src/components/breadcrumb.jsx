import React, { useEffect, useState } from 'react'
import { Breadcrumb } from "antd";
import { useLocation, Link } from "react-router-dom";
const Item = Breadcrumb.Item
const extraBreadcrumb = v => {
  return (
    <Item key={v.id}>
      <Link to={v.url}>{v.name}</Link>
    </Item>
  )
}



const MyBreadcrumb = ({ menus, first = { url: '/', name: '首页' } }) => {
  let location = useLocation()
  // console.log(location);

  const [links, setLinks] = useState([])
  const [lastPath, setLastPath] = useState(first.url)

  useEffect(() => {
    const { pathname } = location;
    if (lastPath === pathname) return
    if (pathname === first.url) {
      setLinks([])
      setLastPath(pathname)
      return
    }

    const before = links.findIndex(v => v.url === pathname)
    if (before > -1) {
      setLinks(links.splice(0, before))
      return;
    }

    if (!menus.length) return
    let link = menus.find(v => v.url === pathname)
    if (!link) return

    const { state } = location
    let { id, url, name } = link;
    if (/\/modify$/.test(link.url)) {
      if (!state || !state.editData) {
        name = name.replace('编辑', '添加')
      }
    }
    if (state) {
      const { withTitle } = state
      if (withTitle) {
        name = withTitle
      }
    }
    link = { id, url, name }

    const cur = link.url.split('/')[1]
    const last = lastPath.split('/')[1]
    if (last !== cur && links.length > 0) {
      let pure = links.filter(v => v.url.split('/')[1] !== last)
      setLinks([...pure, link])
    } else {
      setLinks([...links, link])
    }

    setLastPath(link.url)

  }, [location, menus, links, first, lastPath])

  const breadcrumbItems = [
    <Item key="home">
      <Link to='/'>首页</Link>
    </Item>,
  ].concat(links.map(extraBreadcrumb))

  return (
    <Breadcrumb style={{ flexGrow: 1, textAlign: 'center' }}>
      {breadcrumbItems}
    </Breadcrumb>
  )
}

export default MyBreadcrumb