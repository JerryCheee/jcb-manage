import React, { useEffect, useMemo, useRef, useState } from "react";
import { message, Button, Row, Col, Spin } from "antd";
import api from "../../../api/product";
import workApi from "../../../api/work";
import styled from "styled-components";
import Specify from "../../../components/forms/product/specify";
import BaseInfo from "../../../components/forms/product/base";
import OtherInfo from "../../../components/forms/product/other";
import RichTextEditor from "../../../components/richTextEditor";
const Lead = styled.div`
    font-size: 18px;
    color: blue;
    margin-bottom: 14px;
`;
const mb14 = { marginBottom: 14 };

const takeAllValues = (fns, editorRef) => {
    let [base, productSkus = [], productShelveService] = fns.map((fn) => fn());
    // 下面三行，哎
    let { serviceFee } = productShelveService;
    productSkus.forEach((s) => {
        s.serviceFee = serviceFee;
    });
    let { supplierId, storeId, productMedias, ...rest } = base;
    let productBase = rest;
    productBase.detail = editorRef.current.getValue().toHTML();

    return {
        productBase,
        productSkus,
        productShelveService,
        supplierId,
        storeId,
        productMedias,
    };
};

export default function ModifyProduct({ location, history }) {
    const { state = {} } = location;
    /**@type {CarryData} */
    const { editData, baseData, isVerify } = state;
    const isEdit = editData !== undefined;
    const subscribeRef = useRef([]); //子元素在这里注册onSubmit 异步方法,返回values
    const editorRef = useRef();
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isEdit) return;
        setLoading(true);
        let methodName = baseData.isDraft ? "getDraftDetail" : "getDetail";
        api[methodName](editData.id)
            .then((res) => {
                setLoading(false);
                if (res.code) {
                    message.error(res.msg);
                    return;
                }
                setDetail(res.data);
            })
            .catch((e) => {
                setLoading(false);
            });
        //eslint-disable-next-line
    }, []);

    const onSubmit = async () => {
        if (loading) return;
        setLoading(true);
        let params = takeAllValues(subscribeRef.current, editorRef);

        let keys = ["", "storeId", "supplierId"];
        let names = ["", "门店", "供应商"];
        let targetK = keys[baseData.target];
        if (!params[targetK]) {
            return message.error(`请指定${names[baseData.target]}`);
        }
        //  console.log(params)
        //  setLoading(false)
        //  return
        if (editData) params.workId = editData.id;
        let res = isEdit
            ? baseData.isDraft
                ? await api.submitDraft(params)
                : await api.edit(editData.id, params)
            : await api.add(params);
        if (res.code) return message.error(res.msg);
        //以前有工作流，现在不用审核，直接调接口
        res = await workApi.verify({ id: res.data, status: 1 });
        setLoading(false);
        if (res.code) return message.error(res.msg || "审核接口 报错");
        message.success("操作成功", history.goBack);
    };
    const onSave = async () => {
        let params = takeAllValues(subscribeRef.current, editorRef);
        let res = await api.save(params);
        if (res.code) return message.error(res.msg);
        message.success(res.msg, history.goBack);
    };

    return (
        <Spin spinning={loading}>
            <Lead>1. 商品基本信息</Lead>
            <BaseInfo ref={subscribeRef} defo={detail} {...baseData} />
            <Lead>2. 商品规格及库存</Lead>
            <Specify ref={subscribeRef} defo={detail} {...baseData} />
            <Lead>3. 其他设置</Lead>
            <OtherInfo ref={subscribeRef} defo={detail} />
            <Lead>4. 商品详情</Lead>
            <div style={mb14}>
                <RichTextEditor
                    ref={editorRef}
                    value={detail?.productBase?.detail}
                />
            </div>
            <Row>
                <Col span={3} offset={8}>
                    <Button onClick={onSave}>保存草稿</Button>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={onSubmit}>
                        立即提交
                    </Button>
                </Col>
            </Row>
        </Spin>
    );
}

/**
 * @typedef {Object} editData
 * @property {String} id
 *
 * @typedef {Object} baseData
 * @property {1|2} target 1 是门店 2是供应商
 * @property {boolean} isDraft 是否草稿
 *
 * @typedef {Object} CarryData
 * @property {editData} editData
 * @property {baseData} baseData
 *
 *

 */
