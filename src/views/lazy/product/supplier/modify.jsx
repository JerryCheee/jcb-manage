import React, { useEffect, useRef, useState } from "react";
import { message, Button, Row, Col } from "antd";
import api from "../../../../api/product";
import styled from "styled-components";
import Specify from "../../../../components/forms/product/specify";
import BaseInfo from "../../../../components/forms/product/base";
import OtherInfo from "../../../../components/forms/product/other";
import RichTextEditor from "../../../../components/richTextEditor";
import { useSelector } from "react-redux";

const Lead = styled.div`
    font-size: 18px;
    color: blue;
    margin-bottom: 14px;
`;
const mb14 = { marginBottom: 14 };

const getDetail = async (id, isDraft, next) => {
    let methodName = isDraft ? "getDraftDetail" : "getDetail";
    let res = await api[methodName](id);
    if (res.code) return message.error(res.msg);
    next(res.data);
};
const takeAllValues = (fns, editorRef) => {
    let [base, productSkus = [], productShelveService] = fns.map((fn) => fn());
    // 下面三行，哎
    let { serviceFee } = productShelveService;
    productSkus.forEach((s) => {
        s.serviceFee = serviceFee;
    });
    let { productMedias, ...rest } = base;
    let productBase = rest;
    productBase.detail = editorRef.current.getValue().toHTML();

    return {
        productBase,
        productSkus,
        productShelveService,
        productMedias,
    };
};
export default function ModifyProduct({ location, history }) {
    const { state = {} } = location;
    const { editData, isDraft } = state;
    const isEdit = editData !== undefined;
    const subscribeRef = useRef([]); //子元素在这里注册onSubmit 异步方法,返回values
    const editorRef = useRef();
    const [detail, setDetail] = useState();
    const curUser = useSelector((s) => s.admin.info);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isEdit) return;
        getDetail(editData.id, isDraft, setDetail);
    }, []);

    const onSubmit = async () => {
        if (loading) return;
        setLoading(true);
        if (curUser.roleType !== 2) return message.error("请使用供应商账号");
        let params = takeAllValues(subscribeRef.current, editorRef);

        if (isDraft) {
            params.supplierId = detail.supplierId;
        } else {
            params.supplierId = curUser.id;
        }
        if (editData) params.workId = editData.id;
        let res = isEdit
            ? isDraft
                ? await api.submitDraft(params)
                : await api.edit(editData.id, params)
            : await api.add(params);
        setLoading(false);
        if (res.code) return message.error(res.msg);
        message.success("操作成功", history.goBack);
    };
    const onSave = async () => {
        let params = takeAllValues(subscribeRef.current, editorRef);
        let res = await api.save(params);
        if (res.code) return message.error(res.msg);
        message.success(res.msg, history.goBack);
    };

    return (
        <div>
            <Lead>1. 商品基本信息</Lead>
            <BaseInfo ref={subscribeRef} defo={detail} />
            <Lead>2. 商品规格及库存</Lead>
            <Specify ref={subscribeRef} defo={detail} target={2} />
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
        </div>
    );
}
