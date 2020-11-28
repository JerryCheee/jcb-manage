import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import api from "../../../api/store";
import useParamsCache from "../../../hook/useParamsCache";
import { DangerBtn, ModifyBtn } from "../../../components/styled/operateBtns";
import { defoPage, defoPageInfo, simplify } from "../../../utils/handy";
import styled from "styled-components";
import useSearchColumn from "../../../hook/useSearchColumn";

const ProductImg = styled.img`
    width: 100px;
    height: 100px;
`;

export default function SotreList() {
    const [datas, setDatas] = useState();

    const [pageInfo, setPageInfo] = useState(defoPageInfo);
    const cacheRef = useParamsCache();

    /**
     * 删除 一个或多个 这里是移到回收站
     * @param {string[]} ids
     */
    const deleSome = (ids) => async () => {
        let res = await api.dele(ids.map((v) => `ids=${v}`).join(","));
        if (res.code) return message.error(res.msg);
        message.success(res.msg || "删除成功");
        getData(cacheRef.current);
    };
    const getData = async (params) => {
        params.status = 1;
        let res = await api.getList(simplify(params));
        cacheRef.current = params;
        if (res.code) {
            return message.error(res.msg);
        }
        setDatas(res.data.records);
        let { pageSize, current } = params;
        setPageInfo({ pageSize, current, total: res.data.total });
    };

    const handleTableChange = (pagin, filters = {}, sorts = {}) => {
        getData({ ...pagin, ...filters });
    };
    useEffect(() => {
        let params = cacheRef.current ? cacheRef.current : defoPage;

        getData(params);
    }, []);

    /**@type {import('antd/lib/table').ColumnsType} */
    const columns = [
        {
            title: "门店logo",
            key: "head",
            dataIndex: "head",
            render: (t) => <ProductImg src={t} />,
        },
        {
            title: "门店名称",
            key: "keyword",
            dataIndex: "name",
            ...useSearchColumn("关键字"),
        },
        { title: "门店类型", key: "levelName", dataIndex: "levelName" },
        { title: "推荐人", key: "sourceName", dataIndex: "sourceName" },
        { title: "联系人", key: "contacts", dataIndex: "contacts" },
        { title: "联系电话", key: "phone", dataIndex: "phone" },

        {
            title: "操作",
            key: "operation",
            dataIndex: "operation",
            render: (t, data) => {
                return (
                    <>
                        <ModifyBtn carry={{ editData: data }} />
                        <DangerBtn onComfirm={deleSome([data.id])} />
                    </>
                );
            },
        },
    ];

    return (
        <div>
            <Table
                dataSource={datas}
                pagination={pageInfo}
                columns={columns}
                rowKey="id"
                onChange={handleTableChange}
            />
        </div>
    );
}
