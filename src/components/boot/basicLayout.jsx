import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Breadcrumb, message } from 'antd';
import styled from 'styled-components'
import { Route, Redirect, Switch, useHistory, Link, useLocation } from 'react-router-dom'
import MenuNav from "./menuNav";
import { useSelector, useDispatch } from "react-redux";
import { initByToken, setLoginErr } from "../../stores/action/admin";
import { getMenus } from "../../stores/action/menus";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import UserActions from "../userActions"
import calcLinks from '../../utils/breadcrumb'

// import Breadcrumb from "../breadcrumb"
const { Header, Footer, Sider, Content } = Layout;
const Unfold = styled(MenuUnfoldOutlined)`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover{
    color: #1890ff;

  }
`
const Fold = Unfold.withComponent(MenuFoldOutlined)
const SpaceBetweenHeader = styled(Header)`
    background: #fff;
    padding: 0;
    display:flex;
    justify-content:space-between;
    align-items:center;
`

const Logo = styled.div`
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
`

const isShow = m => !m.hidden;
const buildFirst = v => <Redirect key="redirect-1" exact from="/" to={v.url} />

const extraNavs = (menus) => {
    const coverChildren = m => m.children.filter(isShow)
    const ignoreHidden = m => ({
        ...m,
        children: coverChildren(m)
    })
    return menus.filter(isShow).map(ignoreHidden).sort()
}
const extraValid = (menus) => {
    const notComponent = v => v.component === '',
        isComponent = v => v.component !== '',
        validRoutes = menus.filter(notComponent).map(v => v.children).flat()
    return [...menus.filter(isComponent), ...validRoutes]
}
const extraRoutes = (validMenus) => {
    const home = validMenus.find(v => !/modify/.test(v.url) && v.component !== '')
    const homeRoute = <Redirect key="home" exact from="/" to={home.url} />
    const buildRoute = v => (<Route key={v.id} path={v.url}
        component={React.lazy(() => import(`../../views/lazy/${v.component}`))} />)
    const routers = validMenus.map(buildRoute)
    routers.push(homeRoute)
    return routers;
}

const centerText = { textAlign: 'center' }
const extraBreadcrumb = v => {
    return (
        <Breadcrumb.Item key={v.id}>
            <Link to={v.url}>{v.name}</Link>
        </Breadcrumb.Item>
    )
}
const BacisLayout = () => {
    const history = useHistory()
    const location = useLocation()
    let [collapsed, setCollapsed] = useState(false)
    let [validMenus, setvalidMenus] = useState([])
    const [links, setLinks] = useState([])
    const dispatch = useDispatch();
    const [adminInfo, errMsg] = useSelector(s => [s.admin.info, s.admin.errMsg])
    const menus = useSelector(s => s.menus.datas)

    useEffect(() => {
        if (!errMsg) return
        message.error(errMsg)
        dispatch(setLoginErr(null))
        //eslint-disable-next-line
    }, [errMsg])

   
    useEffect(() => {

        if (adminInfo.id === 0) {
            dispatch(initByToken())
            return;
        }

        if (menus.length === 0) {
            dispatch(getMenus())
            return;
        }
        const updateLinks = (location) => {
            let n = calcLinks(location, validMenus, links)
            setLinks(n)
        }
        const unListen = history.listen(updateLinks)
        updateLinks(location)
        return unListen
        //eslint-disable-next-line
    }, [menus, adminInfo.id])


    const ToggleMemo = useMemo(() => {
        return React.createElement(collapsed ? Unfold : Fold, {
            onClick: () => setCollapsed(!collapsed),
        })
    }, [collapsed])

    const UserActionsMemo = useMemo(() => <UserActions info={adminInfo} />, [adminInfo])

    const [MenuMemo, MainMemo] = useMemo(() => {
        if (!menus.length) return [null, null]
        let navs = extraNavs(menus)
        let validMenus = extraValid(menus)
        let routes = extraRoutes(validMenus)
        let first = validMenus.find(isShow)
        routes.push(buildFirst(first));
        routes.push(<Redirect key="notfound" to="/404" />)
        setLinks([first])
        setvalidMenus(validMenus)
        return [
            <MenuNav routes={navs} />,
            <Content style={{ margin: '24px 16px 0' }} >
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>

                    <React.Suspense fallback={<p>loading...</p>}>
                        <Switch>
                            {routes}
                        </Switch>
                    </React.Suspense>

                </div>
            </Content>
        ]
    }, [menus])

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider
                collapsible
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null}
                collapsed={collapsed}
            >
                <Logo />
                {MenuMemo}
            </Sider>
            <Layout>
                <SpaceBetweenHeader>
                    {ToggleMemo}
                    <Breadcrumb style={{ flexGrow: 1, textAlign: 'center' }}>
                        {links.map(extraBreadcrumb)}
                    </Breadcrumb>
                    {UserActionsMemo}
                </SpaceBetweenHeader>
                {MainMemo}
                <Footer style={centerText}>React | Ant Design | StyledComponent | Redux </Footer>
            </Layout>
        </Layout>

    );
}

export default BacisLayout;
