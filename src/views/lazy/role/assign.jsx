import React, { useState, useMemo } from 'react'
import { useSelector } from "react-redux";
import { Checkbox, Button, message } from 'antd';
import styled from "styled-components"
import api from "../../../api/role"

const CheckboxGroup = styled(Checkbox.Group)`
    padding-left: 23px;
    &>label{
        margin-right:20px;
        margin-top:5px
    }
`;
const Column = styled.div`
    display:flex;
    flex-direction:column;
    min-height: inherit;
   
`
const Expand = styled.div`
    flex:1;
    &>div+div{
        margin-top:15px;
    }
`
const Center = styled.div`
    margin-top:24px;
    display: flex;
    justify-content: center;
`
const extraDefalutValue = (ids = [], menus = []) => {
    let checked = new Map()
    const extra = m => {
        if (!ids.includes(m.id)) return
        let checkList = []
        m.children.forEach(c => {
            if (!ids.includes(c.id)) return
            checkList.push(c.name)
        })
        let curLen = checkList.length,
            allLen = m.children.length,
            indeterminate = curLen < allLen,
            checkedAll = curLen === allLen,
            cur = { checkedAll, checkList, indeterminate };
        checked.set(m.id, cur)
    }
    menus.forEach(extra)
    return checked;
}
export default function Assign({ location, history }) {
    const { state = {} } = location;
    const role = state.data
    const menus = useSelector(s => s.menus.datas)

    //以id为key check状态为value {id:{checkedAll:false,checkList:[]}}
    const defaulState = useMemo(() => extraDefalutValue(role.menuIds, menus), [role.menuIds, menus])
    const [checkStateMap, setCheckState] = useState(defaulState)
    const allCheck = (menu) => ({ target: { checked } }) => {
        let cur = checked
            ? {
                checkedAll: true,
                checkList: menu.children.map(c => c.name),
                indeterminate: false
            }
            : { checkedAll: false, checkList: [], indeterminate: false };

        checkStateMap.set(menu.id, cur)
        setCheckState(new Map(checkStateMap))

    }
    const singleCheck = (menu) => (values) => {
        let checkList = values,
            curLen = checkList.length,
            allLen = menu.children.length,
            indeterminate = curLen < allLen,
            checkedAll = curLen === allLen,
            cur = { checkedAll, checkList, indeterminate };
        checkStateMap.set(menu.id, cur)
        setCheckState(new Map(checkStateMap))
    }
    const buildCheckbox = menu => {
        let {
            checkedAll = false,
            checkList = [],
            indeterminate = false
        } = checkStateMap.get(menu.id) || {}
        if (!menu.children.length) {
            return (
                <div key={menu.id} >
                    <Checkbox
                        indeterminate={indeterminate}
                        onChange={allCheck(menu)}
                        checked={checkedAll}
                    >{menu.name}</Checkbox>
                </div>
            )
        }
        return (
            <div key={menu.id} >
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={allCheck(menu)}
                    checked={checkedAll}
                >{menu.name}</Checkbox>
                <div></div>
                <CheckboxGroup
                    options={menu.children.map(c => c.name)}
                    value={checkList}
                    onChange={singleCheck(menu)}
                ></CheckboxGroup>
            </div>
        )
    }
    const submit = async () => {
        let menuIds = [];
        checkStateMap.forEach(({ checkList }, id) => {
            if (!checkList.length) return
            menuIds.push(id)
            let children = menus.find(m => m.id === id).children
            let ids = checkList.map(v => children.find(c => c.name === v).id)
            menuIds.push.apply(menuIds, ids)
        })
        let params = { roleId: role.id, menuIds }
        let res = await api.assignMenus(params)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        history.replace('index', { modifyed: true })
    }
    return (

        <Column>
            <Expand>
                {menus.map(buildCheckbox)}
            </Expand>
            <Center>
                <Button type="primary" onClick={submit}>确认提交</Button>
            </Center>
        </Column>

    )
}