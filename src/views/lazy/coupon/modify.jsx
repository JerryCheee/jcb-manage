import React, { useEffect, useState } from "react";
import SearchSelect from "../../../components/formItem/searchSelect";
import {
    Form,
    Input,
    DatePicker,
    InputNumber,
    message,
    Radio,
    Button,
} from "antd";
import api from "../../../api/coupon";
import productApi from "../../../api/product";
import styled from "styled-components";
import SufixTip from "../../../components/styled/sufixTip";
import moment from "moment";
import { couponScopes, couponTypes } from "../../../config/enums";

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { span: 8, offset: 2 },
};
const Number = styled(InputNumber)`
    width: min(200px, 50%);
`;
const rules = {
    name: [{ required: true, message: "请输入优惠卷名称" }],
    total: [{ required: true, message: "请输入优惠卷数量" }],
    discount: [{ required: true, message: "请输入折扣" }],
    minPay: [{ required: true, message: "请输入最低消费金额" }],
    reduce: [{ required: true, message: "请输入减免金额" }],
    rangeTime: [{ required: true, message: "请指定有效时间" }],
    product_ids: [{ required: true, message: "请指定一些商品" }],
};

const formItems = [
    <Item label="折扣" required>
        <Item name="discount" rules={rules.discount} noStyle>
            <Number min={1} max={9.9} />
        </Item>
        <SufixTip>折</SufixTip>
    </Item>,
    <>
        <Item label="最低消费" name="minPay" rules={rules.minPay}>
            <Number min={1} />
        </Item>
        <Item label="减免金额" name="reduce" rules={rules.reduce}>
            <Number min={1} />
        </Item>
    </>,
    <Item label="减免金额" name="reduce" rules={rules.reduce}>
        <Number min={1} />
    </Item>,
];

const dynamicBuildFormItems = ({ getFieldValue }) => {
    const typeNum = getFieldValue("typeNum") || 0;
    return formItems[typeNum] || null;
};
const dynamicBuildSelect = (options) => ({ getFieldValue }) => {
    const scope = getFieldValue("scope") || 0;
    if (scope < 1) return null;
    return (
        <Item label="绑定商品" name="product_ids" rules={rules.product_ids}>
            <SearchSelect
                mode="multiple"
                defaultOptions={options}
                tokenSeparators={["\n"]}
                placeholder="输入商品名称搜索 然后选择"
                searchReq={productApi.getOptions}
            />
        </Item>
    );
};

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
}
const values2data = (values) => {
    let {
        rangeTime: [start, end],
    } = values;
    values.start_time = start.format("YYYY-MM-DD HH:mm:ss");
    values.end_time = end.format("YYYY-MM-DD HH:mm:ss");
    values.rangeTime = undefined;
    return values;
};

export default function ModifyCoupons({ location, history }) {
    const { state = {} } = location;
    const { editData } = state;
    const isEdit = editData !== undefined;
    const [form] = Form.useForm();
    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
        if (!isEdit) return;
        let { start_time, end_time } = editData;
        const rangeTime = [moment(start_time), moment(end_time)];
        form.setFieldsValue({ ...editData, rangeTime });

        api.getDetail(editData.id).then((res) => {
            if (res.code) {
                message.error(res.msg);
                return;
            }
            let { reduce, minPay, discount, product_ids: options } = res.data;
            options = options || [];
            let product_ids = options.map((v) => v.id);
            form.setFieldsValue({ reduce, minPay, discount, product_ids });
            setDefaultOptions(options);
        });
        //eslint-disable-next-line
    }, []);

    const onSubmit = async () => {
        let hasErr = false;
        let values = await form.validateFields().catch((e) => (hasErr = true));
        if (hasErr) return;
        values = values2data(values);
        let res = isEdit
            ? await api.edit(((values.id = editData.id), values))
            : await api.add(values);

        if (res.code) return message.error(res.msg);
        message.success(res.msg);
        history.replace("index", { modifyed: true });
    };

    return (
        <Form {...layout} form={form} name="coupon">
            <Item label="优惠名称" name="name" rules={rules.name}>
                <Input />
            </Item>

            <Item label="有效时间" name="rangeTime" rules={rules.rangeTime}>
                <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={disabledDate}
                />
            </Item>
            <Item label="数量" name="total" rules={rules.total}>
                <Number min={0} />
            </Item>
            <Item label="优惠方式" name="typeNum" initialValue={0}>
                <Radio.Group>
                    {couponTypes.map((v, i) => (
                        <Radio key={i} value={i}>
                            {v}
                        </Radio>
                    ))}
                </Radio.Group>
            </Item>
            <Item
                noStyle
                shouldUpdate={(pre, cur) => pre?.typeNum !== cur?.typeNum}
            >
                {dynamicBuildFormItems}
            </Item>

            <Item label="使用范围" name="scope" initialValue={0}>
                <Radio.Group>
                    {couponScopes.map((v, i) => (
                        <Radio key={i} value={i}>
                            {v}
                        </Radio>
                    ))}
                </Radio.Group>
            </Item>
            <Item
                noStyle
                shouldUpdate={(pre, cur) => pre?.scope !== cur?.scope}
            >
                {dynamicBuildSelect(defaultOptions)}
            </Item>

            <Item {...tailLayout}>
                <Button type="primary" onClick={onSubmit}>
                    确认提交
                </Button>
            </Item>
        </Form>
    );
}
