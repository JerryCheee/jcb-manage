import React, { useEffect, useState, useRef, useMemo } from "react";
import {
    message,
    Table,
    Button,
    Modal,
    Input,
    Form,
    Select,
    Row,
    Col,
    DatePicker,
} from "antd";
import styled from "styled-components";
import {
    ModifyBtn,
    DangerBtn,
} from "../../../../components/styled/operateBtns";
import api from "../../../../api/order";
import useSearchColumn from "../../../../hook/useSearchColumn";
import FilterableSelect from "../../../../components/formItem/FilterableSelect";
import { LinkOutlined } from "@ant-design/icons";
import { payTypes, orderStatus } from "../../../../config/enums";
import { defoPage, defoPageInfo, simplify } from "../../../../utils/handy";
import useParamsCache from "../../../../hook/useParamsCache";
import OrderDetail from "../../../../components/order/detail";
import { useSelector } from "react-redux";
import moment from "moment";
const Item = Form.Item;
const { RangePicker } = DatePicker;
const ProductImg = styled.img`
    height: 70px;
`;

const deliveryOptions = [
    { value: 1, label: "买家自提" },
    { value: 2, label: "快递配送" },
    { value: 3, label: "物流到付" },
];
const payTypeOptions = [
    { value: 1, label: "微信支付" },
    { value: 2, label: "支付宝支付" },
    { value: 3, label: "集采分支付" },
    { value: 4, label: "线下支付" },
];
const orderStatusOptions = [
    { value: 0, label: "已取消 " },
    { value: 1, label: "待付款 " },
    { value: 2, label: "待发货" },
    { value: 3, label: "待收货" },
    { value: 4, label: "待评价" },
    { value: 5, label: "售后/退款" },
    { value: 6, label: "已完成" },
    { value: 7, label: "待自提" },
    { value: 8, label: "退款中" },
];
export default function MallOrders() {
    const [datas, setDatas] = useState([]);
    const [pageInfo, setPageInfo] = useState(defoPageInfo);
    const cacheRef = useParamsCache();
    const [curId, setCurId] = useState(null);
    const [deliverId, setDeliverId] = useState(null);
    const curUser = useSelector((s) => s.admin.info);
    const [form] = Form.useForm();
    const cleanCurId = () => {
        setCurId(null);
        getData(cacheRef.current || pageInfo);
    };
    const cleanDeliverId = () => {
        setDeliverId(null);
        getData(cacheRef.current || pageInfo);
    };
    const showDetail = (id) => () => {
        setCurId(id);
    };
    const showDeliver = (id) => () => {
        setDeliverId(id);
    };
    const getData = async (params) => {
        params.orderType = 1;
        params.type = 1;
        let res = await api.getList(simplify(params));
        cacheRef.current = params;
        if (res.code) return message.error(res.msg);
        setDatas(res.data.records);
        let { current, pageSize } = params;
        setPageInfo({ current, pageSize, total: res.data.total });
    };
    const values2data = (values) => {
        let {
            rangeTime: [start, end],
        } = values;
        values.strStartTime = start.format("YYYY-MM-DD");
        values.strEndTime = end.format("YYYY-MM-DD");
        values.rangeTime = undefined;
        return values;
    };
    useEffect(() => {
        if (cacheRef.current) {
            getData(cacheRef.current);
        } else {
            getData({ ...defoPage });
        }
    }, []);
    const handleTableChange = (
        { current, pageSize },
        filters = {},
        sorts = {}
    ) => {
        let obj = Object.entries(filters).reduce((pre, [k, v]) => {
            if (Array.isArray(v)) {
                pre[k] = v[0];
            } else {
                pre[k] = v;
            }
            return pre;
        }, {});
        getData({ current, pageSize, ...obj });
    };
    const submitSearch = () => {
        let values = form.getFieldsValue();
        values = values2data(values);
        getData(values);
    };

    const cleanSearch = () => {
        form.resetFields();
        getData(defoPage);
    };
    // 发货
    const orderExpress = async (data) => {
        let res = await api.orderExpress(data);
        if (res.code) return message.error(res.msg);
        message.success("发货成功！");
        cleanDeliverId();
    };

    const Deliver = ({ visible, id, toggle }) => {
        const onOk = () => {
            form.submit();
        };
        const onFinish = (v) => {
            v.orderId = id;
            orderExpress(v);
        };
        return (
            <Modal
                title="发货"
                visible={visible}
                onOk={onOk}
                onCancel={toggle}
                okText="确认"
                cancelText="取消"
            >
                <Form form={form} name="DeliverForm" onFinish={onFinish}>
                    <Form.Item
                        label="物流名称"
                        name="receiveName"
                        rules={[
                            {
                                required: true,
                                message: "请输入物流名称",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="物流单号"
                        name="receiveCode"
                        rules={[
                            {
                                required: true,
                                message: "请输入物流单号",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const expandedRowRender = (v) => {
        var productList = v.productList || [];
        var length = productList.length;
        const columns = [
            {
                title: "图片",
                align: "center",
                dataIndex: "productPic",
                key: "productPic",
                width: 150,
                render: (t) => <ProductImg src={t} />,
            },
            {
                title: "商品",
                align: "center",
                width: 400,
                render: (t) => {
                    return (
                        <div style={{ textAlign: "left" }}>
                            <div>{t.productName}</div>
                            <div>{t.propertyName}</div>
                        </div>
                    );
                },
            },
            {
                title: "单价",
                align: "center",
                dataIndex: "skuPrice",
                key: "skuPrice",
            },
            {
                title: "数量",
                align: "center",
                dataIndex: "number",
                key: "number",
            },
            {
                title: "订单状态",
                align: "center",
                render: (value, row, index) => {
                    var obj = {
                        children: orderStatus[v.status],
                        props: {},
                    };
                    if (index == 0) {
                        obj.props.rowSpan = length;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "订单金额",
                align: "center",
                render: (value, row, index) => {
                    var obj = {
                        children: v.totalAmount,
                        props: {},
                    };
                    if (index == 0) {
                        obj.props.rowSpan = length;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: "操作",
                dataIndex: "operation",
                key: "operation",
                render: (value, row, index) => {
                    var obj = {
                        children: (
                            <span>
                                <Button
                                    onClick={showDetail(v.id)}
                                    type="primary"
                                >
                                    详情
                                </Button>
                                &emsp;
                                {v.status == 2 ? (
                                    <Button danger onClick={showDeliver(v.id)}>
                                        发货
                                    </Button>
                                ) : null}
                            </span>
                        ),
                        props: {},
                    };
                    if (index == 0) {
                        obj.props.rowSpan = length;
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={productList}
                pagination={false}
                rowKey="productId"
                bordered
            />
        );
    };

    const columns = [
        {
            title: "订单编号",
            align: "center",
            dataIndex: "orderCode",
            key: "orderCode",
        },
        {
            title: "下单时间",
            align: "center",
            dataIndex: "commitTime",
            key: "commitTime",
        },
        {
            title: "下单用户",
            align: "center",
            dataIndex: "createByName",
            key: "createByName",
        },
        {
            title: "门店",
            align: "center",
            render: (t) => t.getApiVo?.name,
        },
        {
            title: "支付方式",
            align: "center",
            dataIndex: "paymentMethods",
            key: "paymentMethods",
            render: (t) => payTypes[t],
        },
    ];

    return (
        <div>
            <Form layout="inline" form={form}>
                <Row
                    className="grow"
                    gutter={20}
                    style={{ width: "100%", marginBottom: 20 }}
                >
                    <Col span={6}>
                        <Item name="keyword" label="关键字">
                            <Input
                                placeholder="请输入订单编号、下单人、手机号"
                                allowClear
                            />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item label="订单状态" name="status">
                            <Select
                                placeholder="点击选择"
                                options={orderStatusOptions}
                                allowClear
                            />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item label="配送方式" name="selfCarry">
                            <Select
                                placeholder="点击选择"
                                options={deliveryOptions}
                                allowClear
                            />
                        </Item>
                    </Col>
                </Row>
                <Row
                    className="grow"
                    gutter={20}
                    style={{ width: "100%", marginBottom: 20 }}
                >
                    <Col span={5}>
                        <Item label="支付方式" name="paymentMethods">
                            <Select
                                placeholder="点击选择"
                                options={payTypeOptions}
                                allowClear
                            />
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="时间" name="rangeTime">
                            <RangePicker />
                        </Item>
                    </Col>
                    <Col>
                        <Item>
                            <Button onClick={cleanSearch}>重置</Button>
                        </Item>
                    </Col>
                    <Col>
                        <Item>
                            <Button
                                htmlType="submit"
                                type="primary"
                                onClick={submitSearch}
                            >
                                搜索
                            </Button>
                        </Item>
                    </Col>
                </Row>
            </Form>
            {datas && datas.length ? (
                <Table
                    dataSource={datas}
                    columns={columns}
                    rowKey="id"
                    pagination={pageInfo}
                    bordered
                    expandable={{
                        expandedRowRender,
                        expandedRowKeys: datas.map((a) => a.id),
                        // defaultExpandAllRows: true,
                        // expandRowByClick: true,
                        // expandIcon: (v) => console.log(v),
                        expandIconColumnIndex: -1,
                    }}
                    onChange={handleTableChange}
                />
            ) : (
                "暂无数据"
            )}
            <OrderDetail
                visible={curId !== null}
                id={curId}
                toggle={cleanCurId}
            />
            <Deliver
                visible={deliverId !== null}
                id={deliverId}
                toggle={cleanDeliverId}
            />
        </div>
    );
}
