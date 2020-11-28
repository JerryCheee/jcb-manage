import React, { useEffect, useState } from "react";
import {
    message,
    Form,
    Input,
    Button,
    Modal,
    TimePicker,
    Radio,
    Checkbox,
    Select,
    Row,
    Col,
} from "antd";
import api from "../../../../api/store";
import levelApi from "../../../../api/storeLevel";
import ImgUpload from "../../../formItem/imgUpload";
import { deliveryTypes, verifyStatus } from "../../../../config/enums";
import { makeUploadDefaultValue } from "../../../../utils/formHelp";
import moment from "moment";
import styled from "styled-components";

const StyRow = styled(Row)`
    line-height: 32px;
    margin-bottom: 24px;
    & > .ant-col:first-of-type {
        text-align: right;
    }
`;
const Item = Form.Item;
const Option = Select.Option;
const { RangePicker } = TimePicker;
const textRight = { textAlign: "right", paddingRight: 15 };

const REJECTED = 2;
const imgTypeKeys = [
    "certificatePics",
    "businessLicensePic",
    "detailsPic",
    "head",
];
const sameKeys = ["name", "introduce", "phone", "password", "status"];

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 8 },
};
/**@type {{[key:string]:import('antd/lib/form').Rule[]}} */
const rules = {
    name: [{ required: true, message: "请输入门店名称" }],
    contacts: [{ required: true, message: "请输入联系人" }],
    introduce: [{ required: true, message: "请输入门店简介" }],
    baseAddress: [{ required: true, message: "请输入门店地址" }],
    address: [{ required: true, message: "请输入详细地址" }],
    phone: [{ required: true, message: "请输入手机号码" }],
    password: [{ required: true, message: "请输入密码" }],
    businessHours: [{ required: true, message: "请输入营业时间" }],
    certificateNo: [{ required: true, message: "请输入身份证" }],
    certificatePics: [{ required: true, message: "请上传身份证照片" }],
    businessLicensePic: [{ required: true, message: "请上传营业执照" }],
    // businessLicense: [{ required: true, message: "请输入营业执照号" }],
    head: [{ required: true, message: "请上传门店logo" }],
    detailsPic: [{ required: true, message: "请上传门店照片" }],
    // status: [{ required: true, message: "请指定审核状态" }],
    // verifyNote: [{ required: true, message: "请输入驳回理由" }],
};
const getLevelOptions = async (next) => {
    let res = await levelApi.getOptions();
    next(res.data || []);
};
const getDetail = async (id, next) => {
    let res = await api.getDetail(id);
    if (res.code) return message.error(res.msg);
    next(res.data.result);
};
const extraFromValues = (detail, values) => {
    let { storeBaseVo, storeAuthVo, storeAddressVo } = detail;
    let {
        businessHours,
        certificateNo,
        contacts,
        address,
        delTypes = [],
    } = values;
    //storeBaseVo
    //eslint-disable-next-line
    let updated = sameKeys.reduce(
        (pre, k) => ((pre[k] = values[k]), pre),
        storeBaseVo
    );
    delTypes.forEach((c) => {
        updated[c] = 1;
    });
    updated.delTypes = undefined;
    const [openHours, closeHours] = (businessHours || []).map((h) =>
        h.format("HH:mm:ss")
    );
    detail.storeBaseVo = { ...updated, openHours, closeHours };
    //storeAuthVo
    let { head, ...rest } = imgTypeKeys.reduce((pre, k) => {
        pre[k] = values[k]
            ? values[k].map((g) => g.response.message)
            : undefined;
        return pre;
    }, {});
    detail.storeAuthVo = { ...storeAuthVo, certificateNo, ...rest };
    detail.storeBaseVo.head = head;

    //storeAddressVo
    detail.storeAddressVo = { ...storeAddressVo, name: contacts, address };
    //storeBankList
    let { storeBankListVo: sbl } = values;
    const isEmptyObj = (b) => Object.values(b).every((v) => v !== undefined);
    //eslint-disable-next-line
    detail.storeBankListVo = sbl
        .filter(isEmptyObj)
        .map((v, i) => ((v.type = i), v));
    return detail;
};
const backfill = (data) => {
    let values = {};
    let { storeBaseVo, storeAuthVo, storeAddressVo } = data;

    //storeAuthVo
    let combinedObj = { ...storeAuthVo, head: storeBaseVo.head };
    imgTypeKeys.forEach((k) => {
        values[k] = combinedObj[k]
            ? makeUploadDefaultValue(combinedObj[k].split(","))
            : undefined;
    });

    values.certificateNo = data.storeAuthVo.certificateNo;

    //storeAddressVo
    // let keys = ['provinceCode', 'cityCode', 'districtCode']
    values.baseAddress = storeAddressVo.addressName;
    values.contacts = storeAddressVo.name;
    values.address = storeAddressVo.address;
    values.level = storeBaseVo.level;

    //storeBaseVo
    sameKeys.forEach((k) => (values[k] = storeBaseVo[k]));
    const { openHours, closeHours } = values;
    if (openHours && closeHours) {
        values.businessHours = [openHours, closeHours].map((h) =>
            moment("2020-01-01 " + h)
        );
    }
    values.delTypes = deliveryTypes
        .map(([k]) => (storeBaseVo[k] ? k : undefined))
        .filter((k) => k !== undefined);
    values.storeBankListVo = data.storeBankListVo;
    return values;
};
/**
 *
 * @param {ModalProps} props
 */
export default function VerifyStore({ visible, toggle, id }) {
    const [form] = Form.useForm();
    const [detail, setDetail] = useState();
    const [levels, setLevels] = useState([]);
    const [account, setAccount] = useState("");

    const onSubmit = async () => {
        const status = form.getFieldValue("status");
        let values;
        if (status === REJECTED) {
            values = extraFromValues(detail, form.getFieldsValue());
        } else {
            let hasErr = false;
            values = await form.validateFields().catch((e) => (hasErr = true));
            if (hasErr) return;
            values = extraFromValues(detail, values);
        }
        delete values.storeBankList;
        values.storeBaseVo.head = values.storeBaseVo.head.join(",");
        values.storeAuthVo.businessLicensePic = values.storeAuthVo.businessLicensePic.join(
            ","
        );
        values.storeAuthVo.certificatePics = values.storeAuthVo.certificatePics.join(
            ","
        );
        values.storeAuthVo.detailsPic = values.storeAuthVo.detailsPic.join(",");
        let res = await api.edit(id, values);
        if (res.code) return message.error(res.msg);
        message.success(res.msg, toggle);
    };
    useEffect(() => {
        if (!id) return;
        getDetail(id, (data) => {
            let values = backfill(data);
            form.setFieldsValue(values);
            setDetail(data);
            let phone = data?.storeBaseVo?.phone;
            setAccount(phone || []);
        });
        getLevelOptions(setLevels);
        //eslint-disable-next-line
    }, [id]);
    const onPhoneChange = (e) => {
        let { value } = e.target;
        setAccount(value);
    };
    return (
        <Modal
            title="审核门店信息"
            visible={visible}
            closable
            onCancel={toggle}
            footer={null}
            width={1000}
        >
            <Form {...layout} form={form}>
                <StyRow>
                    <Col span={layout.labelCol.span}>登录账号：</Col>
                    <Col span={layout.wrapperCol.span}>{account}</Col>
                </StyRow>
                <Item label="登录密码" name="password">
                    <Input placeholder="不填则与会员密码相同" />
                </Item>
                <Item label="门店等级" name="level">
                    <Select placeholder="点击选择">
                        {levels.map((v) => (
                            <Option key={v.id} value={v.id}>
                                {v.name}
                            </Option>
                        ))}
                    </Select>
                </Item>
                <Item label="门店名称" name="name" rules={rules.name}>
                    <Input />
                </Item>
                <Item label="联系人" name="contacts" rules={rules.contacts}>
                    <Input />
                </Item>
                <Item label="门店简介" name="introduce" rules={rules.introduce}>
                    <Input.TextArea />
                </Item>
                <Item
                    label="门店地址"
                    name="baseAddress"
                    rules={rules.baseAddress}
                >
                    <Input disabled />
                </Item>
                <Item label="详细地址" name="address" rules={rules.address}>
                    <Input />
                </Item>
                <Item label="手机号码" name="phone" rules={rules.phone}>
                    <Input onChange={onPhoneChange} />
                </Item>
                <Item
                    label="营业时间"
                    name="businessHours"
                    rules={rules.businessHours}
                >
                    <RangePicker />
                </Item>
                <Item
                    label="身份证"
                    name="certificateNo"
                    rules={rules.certificateNo}
                >
                    <Input />
                </Item>

                <Item
                    label="身份证照片"
                    name="certificatePics"
                    rules={rules.certificatePics}
                    valuePropName="fileList"
                >
                    <ImgUpload max={2} />
                </Item>
                <Item
                    label="营业执照"
                    name="businessLicensePic"
                    rules={rules.businessLicensePic}
                    valuePropName="fileList"
                >
                    <ImgUpload />
                </Item>
                {/* <Item label="营业执照号" name="businessLicense" rules={rules.businessLicense}><Input /></Item> */}
                <Item
                    label="门店logo"
                    name="head"
                    rules={rules.head}
                    valuePropName="fileList"
                >
                    <ImgUpload />
                </Item>
                <Item
                    label="门店照片"
                    name="detailsPic"
                    rules={rules.detailsPic}
                    valuePropName="fileList"
                >
                    <ImgUpload multiple />
                </Item>
                <Row>
                    <Col span={layout.labelCol.span}>
                        <h4 style={textRight}>对公账号</h4>
                    </Col>
                </Row>
                <Item label="银行账号" name={["storeBankListVo", 0, "bankNo"]}>
                    <Input />
                </Item>
                <Item label="银行户名" name={["storeBankListVo", 0, "name"]}>
                    <Input />
                </Item>
                <Item label="开户行" name={["storeBankListVo", 0, "bankName"]}>
                    <Input />
                </Item>

                <Row>
                    <Col span={layout.labelCol.span}>
                        <h4 style={textRight}>对私账号</h4>
                    </Col>
                </Row>
                <Item label="银行账号" name={["storeBankListVo", 1, "bankNo"]}>
                    <Input />
                </Item>
                <Item label="银行户名" name={["storeBankListVo", 1, "name"]}>
                    <Input />
                </Item>
                <Item label="开户行" name={["storeBankListVo", 1, "bankName"]}>
                    <Input />
                </Item>

                <Item
                    name="delTypes"
                    label="配送类型"
                    wrapperCol={{ span: 20 }}
                >
                    <Checkbox.Group>
                        {deliveryTypes.map(([key, label]) => (
                            <Checkbox value={key} key={key}>
                                {label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                </Item>
                <Item label="审核状态" name="status">
                    <Radio.Group>
                        {verifyStatus.map((v, i) => (
                            <Radio key={i} value={i}>
                                {v}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Item>
                <Item
                    noStyle
                    shouldUpdate={(pre, cur) => pre.status !== cur.status}
                >
                    {({ getFieldValue }) => {
                        let status = getFieldValue("status");
                        return status === REJECTED ? (
                            <Item label="驳回理由" name="verifyNote">
                                <Input.TextArea />
                            </Item>
                        ) : null;
                    }}
                </Item>

                <Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" onClick={onSubmit}>
                        确认提交
                    </Button>
                </Item>
            </Form>
        </Modal>
    );
}

/**
 * @typedef {object} ModalProps
 * @property {boolean} visible
 * @property {()=>void} toggle
 * @property {string|number} id
 */
