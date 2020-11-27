import React, { useMemo } from 'react'
import { Menu } from 'antd';
import { Link } from "react-router-dom"
const { SubMenu, Item } = Menu;
const hasChild = v => !v.pid && !v.component;
const buildItem = v => <Item key={v.id} style={{ height: '38px' }}><Link to={v.url}> {v.name}</Link></Item>
  , buildSubItem = v => <SubMenu key={v.id} title={v.name}>{v.children.map(buildItem)}</SubMenu>
  , buildAll = v => hasChild(v) ? buildSubItem(v) : buildItem(v);

const MenuNav = ({ routes }) => {
  const rootSubmenuKeys = routes.map(a => a.id);
  const [openKeys, setOpenKeys] = React.useState(['']);
  const navItems = useMemo(() => routes.map(buildAll), [routes])
  const onOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['0']}
      theme="dark"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
    >
      {navItems}
    </Menu>
  );
}

export default MenuNav