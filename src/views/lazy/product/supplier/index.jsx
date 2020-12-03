import React, { useEffect, useState, useMemo } from "react";
import {
    message,
    Table,
    Switch,
    Form,
    Select,
    Row,
    Col,
    Cascader,
    Input,
    Button,
} from "antd";
import api from "../../../../api/product";
import clasApi from "../../../../api/classify";
import brandApi from "../../../../api/brand";
import {
    AddBtn,
    DangerBtn,
    ModifyBtn,
} from "../../../../components/styled/operateBtns";
import useParamsCache from "../../../../hook/useParamsCache";
import styled from "styled-components";
import { defoPage, defoPageInfo, simplify } from "../../../../utils/handy";
import { useChangeUpStatus } from "../../../../hook/useChangeUpStatus";

const Item = Form.Item;
const Option = Select.Option;

const ml10 = { marginLeft: 10 };
const ProductImg = styled.img`
    width: 100px;
    height: 100px;
`;
const Wrapper = styled.div`
    form {
        margin: 14px 0;
        .grow {
            flex-grow: 1;
        }
        .ant-form-item {
            margin-right: 0;
        }
    }
`;
const statusOptions = [
    { value: 0, label: "待审核" },
    { value: 1, label: "审核拒绝" },
    { value: 2, label: "已下架" },
    { value: 3, label: "草稿箱" },
    { value: 4, label: "回收站" },
];
const optKey = { label: "name", value: "id" };

const getClassifyOptions = async (next) => {
    let res = await clasApi.getOptions();
    if (res.code) return message.error(res.msg);
    next(res.data);
};
const classifyFilter = (inputValue, path) => {
    return path.some(
        (option) =>
            option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
};
const getBrandOptions = async (next) => {
    let res = await brandApi.getOptions();
    if (res.code) return message.error(res.msg);
    next(res.data);
};
/**获取 离开页面前显示的数据 */
function getLastTimeData(cacheRef, form, getData) {
    const { pageSize, current, queryType, ...rest } = cacheRef.current;
    let { classId } = rest || {};
    if (classId) {
        rest.classId = classId.split(",");
    }
    form.setFieldsValue(rest);
    getData(cacheRef.current);
}
const enhancedSimplify = (params) => {
    let { status } = params;
    params.status = status === 3 ? undefined : status;
    return simplify(params);
};
export default function ProductList() {
    const [pageInfo, setPageInfo] = useState(defoPageInfo);
    const cacheRef = useParamsCache();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [clasOptions, setClasOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [
        upStatusLoading,
        selectRowConfig,
        benchEditUpStatus,
        changeUpStatus,
        datas,
        setDatas,
    ] = useChangeUpStatus();

    const moveIt = (data) => async () => {
        let { id } = data;
        let { status = -1 } = cacheRef.current || {};
        let params = { id };

        switch (status[0]) {
            case 4:
                params.operation = 1;
                break;
            default:
                params.operation = 0;
                break;
        }

        let res = await api.move(params);
        if (res.code) return message.error(res.msg);
        message.success(res.msg || "删除成功");
        getData(cacheRef.current);
    };
    const getData = async (params) => {
        params.queryType = 2;
        setLoading(true);
        let res = await api.getList(simplify(params));
        setLoading(false);
        cacheRef.current = params;
        if (res.code) {
            return message.error(res.msg);
        }
        setDatas(res.data.records);
        let { current, pageSize } = params;
        setPageInfo((s) => ({ current, pageSize, total: res.data.total }));
    };

    const handleTableChange = (
        { current, pageSize },
        filters = {},
        sorts = {}
    ) => {
        let lastParams = cacheRef.current || {};
        getData({ ...lastParams, current, pageSize });
    };
    useEffect(() => {
        getClassifyOptions(setClasOptions);
        getBrandOptions(setBrandOptions);

        if (!cacheRef.current) {
            getData(defoPage);
            return;
        }
        getLastTimeData(cacheRef, form, getData);
        //eslint-disable-next-line
    }, []);

    const submitSearch = () => {
        let values = form.getFieldsValue();
        let { classId } = values;
        if (classId) {
            values.classId = classId.join(",");
        }
        getData(values);
    };

    const cleanSearch = () => {
        form.resetFields();
        getData(defoPage);
    };

    let btnProps =
        cacheRef.current?.status === 4
            ? { text: "恢复", title: "确定要恢复这个商品？" }
            : {};
    const columns = useMemo(() => {
        const cols = [
            {
                title: "商品图片",
                dataIndex: "pic",
                key: "pic",
                render: (t) => <ProductImg src={t} />,
            },
            {
                title: "商品信息",
                dataIndex: "brandName",
                key: "brandName",
                render: (t, data) => (
                    <div>
                        <div>{data.name}</div>
                        <div>价格:{data.minPrice}</div>
                        <div>分类:{data.className}</div>
                        <div>品牌:{t}</div>
                    </div>
                ),
            },
            {
                title: "指导价",
                dataIndex: "maxAdvicePrice",
                key: "maxAdvicePrice",
            },
            { title: "供货价", dataIndex: "supplyPrice", key: "supplyPrice" },
            { title: "库存", dataIndex: "stock", key: "stock" },
            { title: "销量", dataIndex: "salesCount", key: "salesCount" },
            { title: "排序", dataIndex: "sort", key: "sort" },
            {
                title: "上架",
                dataIndex: "upStatus",
                key: "upStatus",
                render: (t, data) => (
                    <Switch
                        checked={Boolean(t)}
                        onChange={changeUpStatus(data.id, datas)}
                    />
                ),
            },

            {
                title: "操作",
                dataIndex: "sort",
                key: "operation",
                width: 80,
                render: (_, data) => {
                    let isDraft = [0, 1, 3].includes(cacheRef.current?.status);
                    let newData = data;
                    if (!data.id) {
                        newData = { ...data, id: data.workId };
                    }
                    return (
                        <span>
                            <ModifyBtn carry={{ editData: newData, isDraft }} />
                            <DangerBtn onConfirm={moveIt(data)} {...btnProps} />
                        </span>
                    );
                },
            },
        ];

        if (cacheRef.current?.status !== undefined) {
            cols.splice(7, 1);
        }

        return cols;
    }, [cacheRef.current?.status]);

    return (
        <Wrapper>
            <Form layout="inline" form={form}>
                <Row className="grow" gutter={10}>
                    <Col span={6}>
                        <Item label="分类" name="classId">
                            <Cascader
                                options={clasOptions}
                                fieldNames={optKey}
                                placeholder="点击选择或输入搜索"
                                showSearch={{ classifyFilter }}
                                allowClear
                            />
                        </Item>
                    </Col>
                    <Col span={5}>
                        <Item label="品牌" name="brandId">
                            <Select placeholder="点击选择" allowClear>
                                {brandOptions.map((v) => (
                                    <Option key={v.id} value={v.id}>
                                        {v.name}
                                    </Option>
                                ))}
                            </Select>
                        </Item>
                    </Col>
                    <Col span={5}>
                        <Item label="状态" name="status">
                            <Select
                                placeholder="点击选择"
                                options={statusOptions}
                                allowClear
                            />
                        </Item>
                    </Col>
                    <Col md={6} lg={8}>
                        <Item name="queryContent" label="关键字">
                            <Input
                                placeholder="请输入标题、ID、型号、名称"
                                allowClear
                            />
                        </Item>
                    </Col>

                    <Item hidden>
                        {/* <Button htmlType="submit" /> 调用 web 原生提交逻辑。*/}
                        <Button
                            htmlType="submit"
                            onClick={submitSearch}
                        ></Button>
                    </Item>
                </Row>
            </Form>

            <Row justify="space-between">
                <div>
                    <AddBtn />
                    <Button
                        onClick={benchEditUpStatus(1)}
                        style={ml10}
                        loading={upStatusLoading[0]}
                    >
                        批量上架
                    </Button>
                    <Button
                        onClick={benchEditUpStatus(2)}
                        style={ml10}
                        loading={upStatusLoading[1]}
                    >
                        批量下架
                    </Button>
                </div>

                <Row gutter={10}>
                    {/* <Col>
                        <Item>
                            <Button>导出</Button>
                        </Item>
                    </Col> */}
                    <Col>
                        <Item>
                            <Button onClick={cleanSearch}>重置</Button>
                        </Item>
                    </Col>
                    <Col>
                        <Item>
                            <Button htmlType="submit" onClick={submitSearch}>
                                搜索
                            </Button>
                        </Item>
                    </Col>
                </Row>
            </Row>

            <Table
                rowSelection={selectRowConfig}
                dataSource={datas}
                onChange={handleTableChange}
                pagination={pageInfo}
                columns={columns}
                loading={loading}
                rowKey={(data) => data.id || data.workId}
            />
        </Wrapper>
    );
}
