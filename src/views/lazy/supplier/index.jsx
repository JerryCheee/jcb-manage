import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import api from "../../../api/supplier";
import useParamsCache from "../../../hook/useParamsCache";
import useSearchColumn from "../../../hook/useSearchColumn";
import {
    AddBtn,
    ModifyBtn,
    DangerBtn,
} from "../../../components/styled/operateBtns";

import styled from "styled-components";

const MidAvatar = styled.img`
    width: 80px;
    height: 80px;
`;
const defoPage = {
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (t) => `总条数${t}`,
};
export default function Seckill() {
    const [datas, setDatas] = useState([]);
    const [pageInfo, setPageInfo] = useState(defoPage);
    const cacheRef = useParamsCache();

    const deleSome = (ids) => async () => {
        let res = await api.dele(ids.map((v) => `ids=${v}`).join(","));
        if (res.code) return message.error(res.msg);
        message.success(res.msg || "删除成功");
        getData(cacheRef.current);
    };

    const getData = async (params) => {
        let { keyword } = params;
        if (keyword === "") {
            params.keyword = undefined;
        }
        cacheRef.current = params;

        let res = await api.getList(params);

        if (res.code) return message.error(res.msg);
        setDatas(res.data.records);
        setPageInfo((s) => ({ ...s, total: res.data.total }));
    };

    useEffect(() => {
        let params;
        if (cacheRef.current) {
            const { pageSize, pageNo: current } = cacheRef.current;
            setPageInfo((s) => ({ ...s, pageSize, current, total: 0 }));
            params = cacheRef.current;
        } else {
            const { pageSize, current: pageNo } = pageInfo;
            params = { pageNo, pageSize };
        }
        getData(params);
    }, []);

    const handleTableChange = ({ current, pageSize }, filters = {}) => {
        let params = { pageNo: current, pageSize, ...filters };
        getData({ ...params });
        setPageInfo((s) => ({ ...s, current, pageSize }));
    };

    const { keyword } = cacheRef.current || {};
    const columns = [
        // { title: '头像', dataIndex: 'logo', key: 'logo', width: 100, render: t => <MidAvatar src={t} /> },

        {
            title: "供应商名称",
            align: "center",
            dataIndex: "name",
            key: "keyword",
            width: "250px",
            filteredValue: keyword ? keyword : undefined,
            ...useSearchColumn("供应商名称"),
        },

        {
            title: "账号",
            align: "center",
            dataIndex: "account",
            key: "account",
        },
        {
            title: "地址",
            align: "center",
            dataIndex: "geographicName",
            key: "geographicName",
        },

        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (_, data) => {
                return (
                    <div>
                        <ModifyBtn carry={{ editData: data }} />
                        <DangerBtn onConfirm={deleSome([data.id])} />
                        {/* <DangerBtn onConfirm={resetPwd(data.id)} title="确定要Ta的重置密码?" text="重置密码" /> */}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <AddBtn />
            <Table
                dataSource={datas}
                columns={columns}
                rowKey="id"
                pagination={pageInfo}
                onChange={handleTableChange}
            />
        </div>
    );
}
