import React, { useEffect, useState } from "react";
import { message, Modal, Descriptions, Table, Button } from "antd";
import api from "../../api/order";
import { payTypes, orderStatus, deliveryTypes } from "../../config/enums";
import styled from "styled-components";
const ProductImg = styled.img`
    height: 70px;
`;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 8 },
};

const getDetail = async (id, next) => {
    let res = await api.getDetail(id);
    if (res.code) return message.error(res.msg);
    next(res.data);
};

/**
 *
 * @param {ModalProps} props
 */
export default function OrderDetail({ visible, toggle, id }) {
    const [detail, setDetail] = useState();

    useEffect(() => {
        if (!id) return;
        getDetail(id, (data) => {
            setDetail(data);
        });
    }, [id]);
    const columns = [
        {
            title: "商品名称",
            align: "left",
            dataIndex: "productName",
            key: "productName",
            width: 250,
        },
        {
            title: "商品图片",
            align: "center",
            dataIndex: "productPic",
            key: "productPic",
            width: 150,
            render: (t) => <ProductImg src={t} />,
        },
        {
            title: "价格",
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
            title: "商品编码",
            align: "center",
            dataIndex: "skuId",
            key: "skuId",
        },
        {
            title: "优惠金额",
            align: "center",
            // dataIndex: "paymentMethods",
            // key: "paymentMethods",
            render: (t) => 0,
        },
        {
            title: "实付",
            align: "center",
            // dataIndex: "paymentMethods",
            // key: "paymentMethods",
            render: (t, data) => data.skuPrice * data.number,
        },
        {
            title: "退款记录",
            align: "center",
            // dataIndex: "paymentMethods",
            // key: "paymentMethods",
            render: () => "无",
        },
    ];
    return (
        <Modal
            title="订单详情"
            visible={visible}
            closable
            onCancel={toggle}
            footer={null}
            width={1000}
        >
            {detail ? (
                <div>
                    <Descriptions title="基本信息">
                        <Descriptions.Item label="订单状态">
                            {orderStatus[detail.status]}
                        </Descriptions.Item>
                        <Descriptions.Item label="配送方式">
                            {deliveryTypes[detail.selfCarry - 1][1]}
                        </Descriptions.Item>
                        <Descriptions.Item label="订单号">
                            {detail.orderCode}
                        </Descriptions.Item>
                        <Descriptions.Item label="收货人">
                            {detail.receiveBy}
                        </Descriptions.Item>
                        <Descriptions.Item label="电话">
                            {detail.receivePhone}
                        </Descriptions.Item>
                        <Descriptions.Item label="地址">
                            {detail.receiveAddress}
                        </Descriptions.Item>
                        <Descriptions.Item label="订单备注">
                            {detail.note}
                        </Descriptions.Item>
                        <Descriptions.Item label="订单金额">
                            {detail.totalAmount}
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="下单信息">
                        <Descriptions.Item label="用户">
                            {orderStatus[detail.status]}
                        </Descriptions.Item>
                        <Descriptions.Item label="支付方式">
                            {payTypes[detail.paymentMethods]}
                        </Descriptions.Item>
                        <Descriptions.Item label="订单来源">
                            微信公众号
                        </Descriptions.Item>
                        <Descriptions.Item label="下单时间">
                            {detail.commitTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="付款时间">
                            {detail.paymentTime}
                        </Descriptions.Item>
                    </Descriptions>
                    <Table
                        dataSource={detail.productList}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        bordered
                    />
                    <div
                        style={{
                            margin: "20px 0",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            {/* <Button type="primary">发货</Button>
                            &emsp;
                            <Button danger>退款</Button> */}
                        </div>
                        <div style={{ marginRight: "30px" }}>
                            合计：{detail.totalAmount}
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
