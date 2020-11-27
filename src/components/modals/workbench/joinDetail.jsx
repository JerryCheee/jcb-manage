import React from 'react'
import { Modal } from 'antd';
import styled from 'styled-components'
const Row = styled.div`
    display:flex;
    height:30px;
    &>div:first-of-type{
        color:#7d7d7d;
    }
`
export default function JoinDetail({ info: {
    companyName,//: "亮金网络",
    addrName,
    address,//: "天安数码城F4栋902",
    hasStore,//: "有门店",
    storeArea,//: "300m²-500m²",
    businessProducts,//: "电线电缆及管道,基料辅材,门窗及卫浴,瓷砖及地板,窗帘及灯饰",
    contacts,//: "池杰",
    phone,//: "13129499422",
    createTime,//: "2020-11-13 14:59:53",
}, visible, toggle }) {
    return (
        <Modal
            title="加盟详情"
            visible={visible}
            closable
            onCancel={toggle}
            footer={null}
        >
            <Row>
                <div>公司名称：</div>
                <h5>{companyName}</h5>
            </Row>
            <Row>
                <div>公司地址：</div>
                <div>{addrName}</div>
            </Row>
            <Row>
                <div>详细地址：</div>
                <div>{address}</div>
            </Row>
            <Row>
                <div>是否有门店：</div>
                <div>{hasStore}</div>
            </Row>
            <Row>
                <div>门店面积：</div>
                <div>{storeArea}</div>
            </Row>
            <Row>
                <div>经营产品：</div>
                <div>{businessProducts}</div>
            </Row>
            <Row>
                <div>联系人：</div>
                <div>{contacts}</div>
            </Row>
            <Row>
                <div>联系电话：</div>
                <div>{phone}</div>
            </Row>
            <Row>
                <div>申请时间：</div>
                <div>{createTime}</div>
            </Row>
        </Modal>
    )

}   