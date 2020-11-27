import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Select } from "antd";
const defoHandle = (v) => [true, {}]

function debounce(time, fn) {
  var timeout;
  return function (...rest) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(fn, time, ...rest)
  }
}
const defOpt =[]
/**
 * 
 * @param {Object} props
 * @param {(value:string)=>void} props.onChange 回调函数，antd Form自动处理 
 * @param {(value:string)=>[boolean,object]} props.beforeSearch  回调函数，搜索前打断或加其他参数
 * @param {Function} props.searchReq  api请求函数
 * @param {[{id:string|number,name:string}]} props.defaultOptions 默认value的选项
 */
export default function SearchSelect({ value,
  onChange,
  beforeSearch = defoHandle,
  searchReq,
  placeholder,
  defaultOptions = defOpt,
  ...rest }) {
  const [searchOptions, setSearchOptions] = useState(defaultOptions)
  useEffect(() => {
    setSearchOptions(defaultOptions)
  }, [defaultOptions])


  const lastRef = useRef()
  const getOptions = useCallback(debounce(
    300,
    async (value, otherParams = {}) => {
      lastRef.current = value
      otherParams.name = value
      const res = await searchReq(otherParams)
      if (lastRef.current !== value) return
      setSearchOptions(res.data||[])
    }
    //eslint-disable-next-line
  ), [searchReq])
  const handleSearch = (value) => {
    let [isOk, otherParams] = beforeSearch(value)
    if (!isOk) return;
    if (!value) {
      return setSearchOptions([])
    }
    getOptions(value, otherParams)
  }

  return (
    <Select placeholder={placeholder}
      showSearch
      onSearch={handleSearch}
      value={value}
      onChange={onChange}
      filterOption={false}
      showArrow={false}
      notFoundContent={null}
      {...rest}
    >
      {searchOptions.map(v => <Select.Option value={v.id} key={v.id}>{v.name}</Select.Option>)}
    </Select>
  )
}