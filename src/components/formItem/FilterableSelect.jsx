import React from 'react'
import { Select } from "antd";

/** 直接搜索选项 */
const filterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

/**
 * 已配置可筛选已有选项的选择器
 * @param {FilterableProps} props
 */
export default function FilterableSelect({ options, ...rest }) {

  return (
    <Select
      showSearch
      filterOption={filterOption}
      {...rest}
    >
      {options.map(v => <Select.Option value={v.id} key={v.id}>{v.name}</Select.Option>)}

    </Select>
  )
}
/**
 *
 * @typedef {Object} Option
 * @property {string|number} id
 * @property {string} name
 *
 * @typedef {Object} CustomOptionProp
 * @property {Option[]} options
 *
 * @typedef {CustomOptionProp & import('antd/lib/select').SelectProps} FilterableProps
 */