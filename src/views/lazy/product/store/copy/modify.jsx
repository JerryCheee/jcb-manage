import React, { useEffect, useRef, useState } from "react";
import { message, Button, Row, Col } from "antd";
import api from "../../../../../api/product";
import styled from "styled-components";
import Specify from "../../../../../components/forms/product/storeCopy/specify";
import BaseInfo from "../../../../../components/forms/product/storeCopy/base";
import OtherInfo from "../../../../../components/forms/product/storeCopy/other";
import RichTextEditor from "../../../../../components/richTextEditor";

const Lead = styled.div`
    font-size: 18px;
    color: blue;
    margin-bottom: 14px;
`;
const mb14 = { marginBottom: 14 };

const getDetail = async (id, next) => {
    let res = await api.getDetail(id);
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
    const { editData } = state;
    // const isEdit = editData.parentId !== undefined//这里和其他 modify文件的判断不一样
    const subscribeRef = useRef([]); //子元素在这里注册onSubmit 异步方法,返回values
    const editorRef = useRef();
    const [detail, setDetail] = useState();
    useEffect(() => {
        // if (!isEdit) return;
        getDetail(editData.id, setDetail);
    }, []);

    const onSubmit = async () => {
        let params = takeAllValues(subscribeRef.current, editorRef);
        // let res = isEdit
        //     ? await api.edit(editData.id, params)
        //     : await api.add((params.parentId = editData.id, params))
        params.productBase.parentId = editData.id;
        let res = await api.add(params);
        if (res.code) return message.error(res.msg);
        message.success("操作成功", history.goBack);
    };

    return (
        <div>
            <Lead>1. 商品基本信息</Lead>
            <BaseInfo ref={subscribeRef} defo={detail} />
            <Lead>2. 商品规格及库存</Lead>
            <Specify ref={subscribeRef} defo={detail} target={1} />
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
                    <Button type="primary" onClick={onSubmit}>
                        立即提交
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
