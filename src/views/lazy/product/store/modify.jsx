import React, { useEffect, useRef, useState, useMemo } from "react";
import { message, Button, Row, Col } from "antd";
import api from "../../../../api/product";
import workApi from "../../../../api/work";
import styled from "styled-components";
import Specify from "../../../../components/forms/product/specify";
import BaseInfo from "../../../../components/forms/product/base";
import OtherInfo from "../../../../components/forms/product/other";
import RichTextEditor from "../../../../components/richTextEditor";
import { useSelector } from "react-redux";
import VerifyForm from "../../../../components/forms/verifyForm";

const Lead = styled.div`
    font-size: 18px;
    color: blue;
    margin-bottom: 14px;
`;
const mb14 = { marginBottom: 14 };
const validRoleTypes = [-1, 0, 1, 2]; //门店和城市运营中心

const conditionGet = (isDraft, isVerify) => {
    if (isVerify) return api.getDetail;

    let methodName = isDraft ? "getDraftDetail" : "getDetail";
    return api[methodName];
};
const getDetail = async (id, isDraft, isVerify, next) => {
    debugger;
    let req = conditionGet(isDraft, isVerify);
    let res = await req(id);
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
    const { editData, isDraft, isVerify } = state;
    const isEdit = editData !== undefined;
    const subscribeRef = useRef([]); //子元素在这里注册onSubmit 异步方法,返回values
    const editorRef = useRef();
    const [detail, setDetail] = useState();
    const curUser = useSelector((s) => s.admin.info);
    const verfiySubmitRef = useRef(() => {});

    useEffect(() => {
        if (!isEdit) return;
        getDetail(editData.id, isDraft, isVerify, setDetail);
        //eslint-disable-next-line
    }, []);

    const onSubmit = async () => {
        if (!validRoleTypes.includes(curUser.roleType))
            return message.error("请使用门店类型的账号");

        let params = takeAllValues(subscribeRef.current, editorRef);
        params.storeId = curUser.id; //门店id即自己的id
        // return console.log(params)
        let res = isEdit
            ? await api.edit(editData.id, params)
            : await api.add(params);
        if (res.code) return message.error(res.msg);
        message.success("操作成功", history.goBack);
    };
    const onSave = async () => {
        let params = takeAllValues(subscribeRef.current, editorRef);
        let res = await api.save(params);
        if (res.code) return message.error(res.msg);
        message.success(res.msg, history.goBack);
    };
    const Intents = useMemo(() => {
        if (isVerify) {
            return (
                <>
                    <VerifyForm ref={verfiySubmitRef} />
                    <Row>
                        <Col span={3} offset={8}>
                            <Button type="primary" onClick={onSubmit}>
                                立即提交
                            </Button>
                        </Col>
                    </Row>
                </>
            );
        }
        return (
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
        );
    }, [isVerify]);
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
            {Intents}
        </div>
    );
}
