import React, { useState, useRef } from "react"
import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Space } from "antd";
import Highlighter from 'react-highlight-words';

export default function useSearchColumn(title, cusStyle = {}) {

  const [searchText, setSearchText] = useState('')
  const inputRef = useRef()
  const handleClear = (clear) => {
    setSearchText('')
    clear()
  }
  const handleSearch = (v, confirm) => {
    setSearchText(v)
    confirm()
  }


  // return function () {
  return (
    {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`搜索${title}`}
            value={selectedKeys}
            ref={inputRef}
            onChange={e => setSelectedKeys(e.target.value)}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block', ...cusStyle }}
          />
          <Space>

            <Button
              onClick={() => handleClear(clearFilters)}
              size="small"
              style={{ width: 90 }}>重置</Button>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >搜索</Button>

          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => inputRef.current.select())
        }
      },
      render: text => searchText ? (<Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />)
        : text

    })
  // }
}