import React, { useState, useEffect, useReducer } from "react";
import { message, Table, Tag } from "antd";
import { verifyStatus } from "../../../../config/enums";
import { Link } from "react-router-dom";
import { defoPageInfo, simplify } from "../../../../utils/handy";
import api from "../../../../api/work";
import useParamsCache from "../../../../hook/useParamsCache";
import styled from "styled-components";
import { DangerBtn } from "../../../../components/styled/operateBtns";

const ProductImg = styled.img`
    width: 100px;
    height: 100px;
`;
const getSource = (data, type) => {
    switch (type) {
        case 1:
            return <div>门店:{data.storeName}</div>;
        case 2:
            return <div>供应商:{data.supplierName}</div>;
        default:
            break;
    }
};
/**变更会 立刻执行请求的 状态
 * @type {VariousState}
 */
const initialState = { queryType: 1, status: [] };
function reducer(state, { type, payload }) {
    switch (type) {
        case "queryType":
            return { ...state, queryType: payload };
        case "status":
            return { ...state, status: payload };
        case "both":
            return payload;
        default:
            console.warn("未定义响应");
            return state;
    }
}
export default function StoreProductConfirm() {
    const [datas, setDatas] = useState([]);
    const [pageInfo, setPageInfo] = useState(defoPageInfo);
    const cacheRef = useParamsCache();
    const [typeAndStatus, dispatch] = useReducer(reducer, initialState);
    const getData = async (params) => {
        params.queryType = 1;
        params.status = 0;
        let res = await api.getList(1, simplify(params));
        if (res.code) return message.error(res.msg);
        cacheRef.current = params;
        setDatas(res.data.records);
        let { current, pageSize } = params;
        setPageInfo({ current, pageSize, total: res.data.total });
    };

    const moveIt = (data) => async () => {
        let { id } = data;
        let { status } = typeAndStatus;
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
    const handleTableChange = (pagin, filters = {}) => {
        getData({ ...pagin, ...filters });
    };

    useEffect(() => {
        getData(cacheRef.current || defoPageInfo);
    }, []);

    const columns = [
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
                    <div>分类:{data.className}</div>
                    <div>品牌:{t}</div>
                    {getSource(data, typeAndStatus.queryType)}
                </div>
            ),
        },
        { title: "售价", dataIndex: "minPaymentPrice", key: "minPaymentPrice" },
        { title: "服务费", dataIndex: "serviceFee", key: "serviceFee" },
        { title: "提交时间", dataIndex: "updateTime", key: "updateTime" },
        // { title: "库存", dataIndex: "stock", key: "stock" },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (t) => <Tag>{verifyStatus[t]}</Tag>,
        },
        {
            title: "操作",
            key: "operation",
            dataIndex: "operation",
            render: (t, data) => {
                data.id = data.workId;
                return (
                    <span>
                        <Link
                            to={{
                                pathname: "/product/store/modify",
                                state: {
                                    editData: data,
                                    isDraft: true,
                                    isVerify: true,
                                },
                            }}
                        >
                            审核
                        </Link>
                        {/* &emsp;
            <DangerBtn onConfirm={moveIt(data)} /> */}
                    </span>
                );
            },
        },
    ];
    return (
        <Table
            dataSource={datas}
            columns={columns}
            rowKey={(data) => data.id || data.workId}
            pagination={pageInfo}
            onChange={handleTableChange}
        />
    );
}
