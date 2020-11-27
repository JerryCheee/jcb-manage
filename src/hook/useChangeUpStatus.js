import { message } from "antd";
import { useCallback, useState } from "react";
import api from '../api/product'
/**
 * @typedef {object}  RowConfg
 * @property {string[]} selectedRowKeys 已选择的id
 * @property {(values:string[],datas:object[])=>void} onChange 监听表格行 选择事件
 * 
 * @typedef {[boolean,boolean]} Loadings 上架 下架的loading
 * @typedef {RowConfg} SelectConfig 给table组件 rowSelection属性的值
 * @typedef {(operation:1|2)=>()=>void} BenchTrigger 批量修改 上架｜下架 
 * @typedef {(id:string)=>()=>void} Trigger 修改单个 上下架 
 */
/**
 *<Button onClick={benchEditUpStatus(1)} style={ml16} loading={upStatusLoading[0]}>批量上架</Button>
 *<Button onClick={benchEditUpStatus(2)} style={ml16} loading={upStatusLoading[1]}>批量下架</Button>
 */
/**
 * 修改上下架 包括单个和 批量上下架 需要自备antd按钮

 * @returns {[Loadings,SelectConfig,BenchTrigger,Trigger,object[],(object[])=>void]}
 */
export function useChangeUpStatus() {
    const [datas, setDatas] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [upStatusLoading, setUpStatusLoading] = useState([false, false])
    const handleSelect = (idArray, dataList) => {
        setSelectedIds(idArray)
    }
    const selectRowConfig = { selectedRowKeys: selectedIds, onChange: handleSelect }
    /**
     * 批量上架｜下架
     * @param {1|2} operation //1上架 2-下架
     */
    const benchEditUpStatus = (operation) => async () => {
        let idList = selectedIds || [];
        if (!idList.length) return message.warn('请先选择商品')
        if (upStatusLoading.some(v => v)) return message.warn('请稍后再试')
        setUpStatusLoading(s => {
            s[operation - 1] = true
            return [...s]
        })
        let params = { id: idList.join(','), operation }
        let res = await api.move(params)
        setUpStatusLoading(s => {
            s[operation - 1] = false
            return [...s]
        })
        if (res.code) return message.error(res.msg)
        message.success(res.msg)

        let curUpStatus = operation === 1 ? true : false
        for (let i = 0; i < datas.length; i++) {
            const d = datas[i];
            if (!idList.includes(d.id)) continue;
            d.upStatus = curUpStatus
        }
        setDatas([...datas])

        setSelectedIds([])
    }
    //这里由于是在cloumns里就调用，需要传递datas否则会丢失
    const changeUpStatus = (id, datas) => async v => {
        //1上架 2-下架
        let params = { id, operation: v ? 1 : 2 }
        let res = await api.move(params)
        if (res.code) return message.error(res.msg)
        message.success(res.msg)
        let i = datas.findIndex(v => v.id === id)
        datas[i].upStatus = Number(v)
        setDatas([...datas])
    }

    return [upStatusLoading, selectRowConfig, benchEditUpStatus, changeUpStatus, datas, setDatas]
}