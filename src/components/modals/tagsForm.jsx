import React, { useRef, useEffect } from 'react'
import { Form, Modal, Input, Row, Col } from 'antd'
import FilterableSelect from '../formItem/FilterableSelect';
const Item = Form.Item
const mb8 = { marginBottom: 8 }
const fullw = { width: '100%' }
const useResetFormOnCloseModal = ({ form, visible }) => {
    const prevVisibleRef = useRef();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;
    useEffect(() => {
        if (!visible && prevVisible) {
            form.resetFields();
        }
        //eslint-disable-next-line
    }, [visible]);
};

export default function ModalForm({ visible, onCancel, options, defo, freeze = false }) {
    const [form] = Form.useForm();
    useEffect(() => {
        if (!visible) return;
        if (defo && defo.length) {
            form.setFieldsValue({ tags: defo })
        }
    }, [visible, defo])
    useResetFormOnCloseModal({
        form,
        visible,
    });

    const onOk = () => {
        if (freeze) {
            onCancel()
            return;
        }
        form.submit();
    };

    return (
        <Modal title="绑定标签" visible={visible} onOk={onOk} onCancel={onCancel} width={960}>
            <Form form={form} layout="inline" name="tagsForm">
                <Row gutter={10} justify="space-between" style={fullw}>
                    {options.map((v, i) => (
                        <Col span={11} style={mb8} key={i}>
                            <Item noStyle>
                                <Item hidden name={['tags', i, 'pid']} initialValue={v.id}><Input /></Item>
                                <Item name={['tags', i, 'valueIds']} label={v.name} >
                                    <FilterableSelect
                                        mode="multiple"
                                        options={v.options}
                                        disabled={freeze}
                                    />
                                </Item>
                            </Item>
                        </Col>
                    ))}
                </Row>
            </Form>
        </Modal>
    );
};