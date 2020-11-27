import React from "react";
import { message, Form, InputNumber, Button } from "antd";
import api from "../../../api/parameter";
import { useEffect } from "react";
import styled from "styled-components";
import SufixTip from "../../../components/styled/sufixTip";

const Item = Form.Item;
const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 6 },
};

const Inline = styled.div`
  display: flex;
  align-items: flex-end;
  .ant-form-item {
    margin-right: 0;
    margin: 0 5px;
    width: 100px;
  }
  .ant-form-item-explain {
    position: absolute;
    width: max-content;
  }
  .ant-input-number {
    border: 0;
    border-bottom: 1px solid #d9d9d9;
  }
`;
const Lead = styled.div`
    font-size:18px;
    color:blue;
    margin-bottom:14px;
`
const btnSty = {
    marginTop: 24
}
const rules = {
    integral: [{ required: true, message: "请输入积分值" }],
    integralDeduction: [{ required: true, message: "请输入积分抵扣金额" }],
    collectDeduction: [{ required: true, message: "请输入集采分抵扣金额" }],
    collectFee: [{ required: true, message: "请输入集采分" }],
    serviceFee: [{ required: true, message: "请输入服务费比例" }],
    commissionLv1: [{ required: true, message: "请输入一级返佣比例" }],
    commissionLv2: [{ required: true, message: "请输入二级返佣比例" }],
    commissionStore: [{ required: true, message: "请输入直推门店返佣比例" }],
    commissionCenter: [{ required: true, message: "请输入运营中心返佣比例" }],
    withdrawalFee: [{ required: true, message: "请输入提现手续费" }],
};

export default function DistributionRuleModify() {
    const [rateForm] = Form.useForm()
    const [form] = Form.useForm();
    const [feeForm] = Form.useForm()

    useEffect(() => {
        const fetchData = async () => {
            let values = await Promise.all([api.getDistribution(), api.getDeduction(), api.getFee()])
            values = values.map(v => v.data || {})
            if (typeof values[2] === 'number') {
                values[2] = { withdrawalFee: values[2] }
            }
            let formIns = [rateForm, form, feeForm]
            values.map((v, i) => formIns[i].setFieldsValue(v))
        };

        fetchData();
        //eslint-disable-next-line
    }, []);

    const onSubmit = async () => {
        let formIns = [rateForm, form, feeForm]

        let values = await Promise.all(formIns.map(f => f.validateFields().catch(v => false)))

        if (values.some(v => !v)) return;
        let apis = [api.editDistribution, api.editDeduction, api.editFee]
        let res = await Promise.all(values.map((v, i) => apis[i](v)))
        let errOne = res.find(r => r.code)
        if (errOne) return message.error(res.msg);
        message.success(res[0].msg);
    };

    return (
        <div>

            <Lead>分销规则</Lead>
            <Form
                {...layout}
                form={rateForm}
                name="distributionRule"
            >
                <Item label="服务费比例">
                    <Item name="serviceFee" noStyle rules={rules.serviceFee}>
                        <InputNumber min={0} />
                    </Item>
                    <SufixTip>%</SufixTip>
                </Item>
                <Item label="一级返佣比例">
                    <Item name="commissionLv1" noStyle rules={rules.commissionLv1}>
                        <InputNumber min={0} />
                    </Item>
                    <SufixTip>%</SufixTip>
                </Item>
                <Item label="二级返佣比例">
                    <Item name="commissionLv2" noStyle rules={rules.commissionLv2}>
                        <InputNumber min={0} />
                    </Item>
                    <SufixTip>%</SufixTip>
                </Item>
                <Item label="直推门店返佣比例">
                    <Item name="commissionStore" noStyle rules={rules.commissionStore}>
                        <InputNumber min={0} />
                    </Item>
                    <SufixTip>%</SufixTip>
                </Item>
                <Item label="运营中心返佣比例">
                    <Item name="commissionCenter" noStyle rules={rules.commissionCenter}>
                        <InputNumber min={0} />
                    </Item>
                    <SufixTip>%</SufixTip>
                </Item>

            </Form>
            <Lead>抵扣规则</Lead>

            <Form layout="inline" form={form} name="integral">
                <Inline>

                    <Item name="collectFee" rules={rules.collectFee}>
                        <InputNumber min={0} />
                    </Item>

                </Inline>
                <Inline>
                    <div>集采分抵扣</div>
                    <Item name="collectDeduction" rules={rules.collectDeduction}>
                        <InputNumber min={0} />
                    </Item>
                    <div>元，</div>
                </Inline>
                <Inline>
                    <div>消费1元获得</div>
                    <Item name="oneDeduction" rules={rules.oneDeduction}>
                        <InputNumber min={0} />
                    </Item>
                    <div>积分,</div>
                </Inline>

                <Inline>
                    <Item name="integral" rules={rules.integral}>
                        <InputNumber min={0} />
                    </Item>
                    <div>积分</div>
                    <div>抵扣</div>
                    <Item name="integralDeduction" rules={rules.integralDeduction}>
                        <InputNumber min={0} />
                    </Item>
                    <div>元</div>
                </Inline>
            </Form>
            <Lead />

            <Lead>提现规则</Lead>
            <Form
                {...layout}
                form={feeForm}
                name="distributionRule"
            >
                <Item label="提现手续费">
                    <Item name="withdrawalFee" noStyle rules={rules.withdrawalFee}>
                        <InputNumber min={0} />
                    </Item>
                    <SufixTip>%</SufixTip>
                </Item>
            </Form>
            <div style={btnSty}>
                <Button type="primary" onClick={onSubmit}>确认提交</Button>
            </div>
        </div>

    );
}
