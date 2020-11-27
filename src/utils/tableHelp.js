import React from "react";
import { Button, Space, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment"
const buildFilter = (buildChild) => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Space>
        <Button
          onClick={() => { setSelectedKeys([]); clearFilters(); }}
          size="small"
          style={{ width: 90 }}>重置</Button>
        <Button
          type="primary"
          onClick={confirm}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >搜索</Button>
      </Space>
      <div style={{ marginTop: 8 }}>
        {buildChild(selectedKeys, setSelectedKeys)}
      </div>
    </div>
  ),
})
const timeRange = (values, setValues) => (
  <DatePicker.RangePicker
    defaultPickerValue={moment.now()}
    value={values.map(v => v ? moment.unix(v) : undefined)}
    onChange={(moments) => setValues((moments ? moments : []).map(v => v.unix()))} />

)
const buildTimeRangeFilter = () => buildFilter(timeRange);

export { buildFilter, buildTimeRangeFilter };
