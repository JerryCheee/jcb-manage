import React, { useState, useEffect, forwardRef, useMemo, useRef } from 'react'
import { message, Form, Input, InputNumber, Cascader, Radio, Button } from "antd";
import clasApi from "../../../../api/classify"
import brandApi from "../../../../api/brand"
import tagApi from "../../../../api/tag"
import supplierApi from "../../../../api/supplier"
import storeApi from "../../../../api/store"
import { makeUploadDefaultValue } from "../../../../utils/formHelp";
import ImgUpload from "../../../formItem/imgUpload";
import FilterableSelect from "../../../formItem/FilterableSelect";
import ModalForm from "../../../modals/tagsForm";


const Item = Form.Item;
const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
};
const expandWidth = { width: '100%' };

const rules = {
    name: [{ required: true, message: "请输入商品标题" }],
    classId: [{ required: true, message: "请选择分类" }],
    supplierId: [{ required: true, message: "请选择供应商" }],
    storeId: [{ required: true, message: "请选择门店" }],
    brandId: [{ required: true, message: "请选择品牌" }],
    modelName: [{ required: true, message: "请输入型号" }],
    preview: [{ required: true, message: "请输入上传品牌图片" }],
}
const optKey = { label: 'name', value: 'id' }
const getClassifyOptions = async (next) => {
    let res = await clasApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const getBrandOptions = async (next) => {
    let res = await brandApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const getTagOptions = async (brandId, next) => {
    if (!brandId) return next([])
    let res = await tagApi.getAllByBrandId(brandId)
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const getSupplierOptions = async (next) => {
    let res = await supplierApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}
const getStoreOptions = async (next) => {
    let res = await storeApi.getOptions()
    if (res.code) return message.error(res.msg)
    next(res.data)
}


const classifyFilter = (inputValue, path) => {
    return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}
/**如果是上传组件自动生成的id 返回undefined */
const getImgId = uid => /^rc-upload/.test(uid) ? undefined : uid


/**提取表单值 [父级通过ref调用] */
const extraFormValues = form => () => {
    let values = form.getFieldsValue()
    let { preview = [], classId: ids, mainImg, tags = [] } = values
    values.productMedias = preview.map((p, i) => ({
        mediaType: mainImg === p.uid ? 2 : 1,
        resource: p.response.message,
        sort: i,
        id: getImgId(p.uid)
    }))
    values.tags = tags.filter(v => v.valueIds && v.valueIds.length)
    values.preview = undefined
    values.mainImg = undefined
    values.classId = (ids || []).pop()
    return values
}
/**回填 表单值 */
const backfill = (defo) => {
    let { productBase, productMedias, supplierId, storeId } = defo;
    productBase = productBase || {};
    productMedias = productMedias || [];
    let imgs = [], ids = [], mainImg;

    productMedias.forEach(v => {
        imgs.push(v.resource);
        ids.push(v.id);
        if (v.mediaType === 2) {
            mainImg = v.id;
        }
    });
    let preview = imgs.length ? makeUploadDefaultValue(imgs, ids) : undefined

    let { classId } = productBase;
    classId = classId ? classId.split(',') : undefined;

    let initValues = { ...productBase, classId, supplierId, storeId, preview, mainImg };
    return initValues;
}
const syncSort = (tags = [], opts) => {
    let ids = tags.map(v => v.pid)
    let ahead = [];
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let j = opts.findIndex(v => v.id === id)
        if (j === -1) continue;
        ahead.push(opts.splice(j, 1)[0])
    }
    return ahead.concat(opts)
}

function ProductBase({ defo, target }, ref) {
    const [form] = Form.useForm()
    const [clasOptions, setClasOptions] = useState([])
    const [brandOptions, setBrandOptions] = useState([])
    const [supplierOptions, setSupplierOptions] = useState([])
    const [storeOptions, setStoreOptions] = useState([])
    const [tags, setTags] = useState([])
    const [isShowTags, setShowTags] = useState(false)
    const tagsValueRef = useRef([])

    useEffect(() => {
        getClassifyOptions(setClasOptions)
        getBrandOptions(setBrandOptions)
        ref.current.push(extraFormValues(form))
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (target === 1) {
            getStoreOptions(setStoreOptions)
        } else if (target === 2) {
            getSupplierOptions(setSupplierOptions)
        }
        if (!defo) return;

        let initValues = backfill(defo);
        const { brandId } = initValues;
        if (brandId) {
            const initTags = (opts) => {
                let { tags } = initValues
                tags = tags || []
                if (!tags.length) { setTags(opts); return; }
                tagsValueRef.current = tags;
                let sorted = syncSort(tags, opts)
                setTags(sorted)

            }
            getTagOptions(brandId, initTags);
        }
        form.setFieldsValue(initValues)
        //eslint-disable-next-line
    }, [defo])

    const openTagsModal = () => {
        setShowTags(true)
    }
    const closeTagsModal = () => {
        setShowTags(false)
    }
    const handleBrandChange = (brandId) => {
        getTagOptions(brandId, setTags);
        tagsValueRef.current = []
    }

    const autoSetMainImg = (imgs) => {

        let hasSeted = form.getFieldValue('mainImg') !== undefined

        if (hasSeted && !imgs.length) {
            form.setFieldsValue({ mainImg: undefined })
            return;
        }
        if (!hasSeted && imgs.length) {
            form.setFieldsValue({ mainImg: imgs[0].uid })
        }

    }
    const targetItem = useMemo(() => {
        let items = [
            null,
            <Item label="门店" name="storeId" rules={rules.storeId}>
                <FilterableSelect
                    options={storeOptions}
                    placeholder="点击选择或搜索门店名称"
                />
            </Item>,
            <Item label="供应商" name="supplierId" rules={rules.supplierId}>
                <FilterableSelect
                    options={supplierOptions}
                    placeholder="点击选择或搜索供应商名称"
                />
            </Item>
        ]

        return items[target]
    }, [target, supplierOptions, storeOptions])
    return (
        <Form.Provider
            onFormFinish={(name, { values, forms }) => {
                if (name === 'tagsForm') {
                    const { basicForm } = forms;
                    const { tags } = values
                    tagsValueRef.current = tags;
                    basicForm.setFieldsValue({ tags });
                    closeTagsModal();
                }
            }}
        >

            <Form
                {...layout}
                form={form}
                name="basicForm"
            >
                {targetItem}
                <Item label="商品图片"
                    name="preview"
                    rules={rules.preview}
                    valuePropName="fileList"
                    style={{ marginBottom: 0 }}
                    wrapperCol={{ span: 20 }}>
                    <ImgUpload multiple onChange={autoSetMainImg} />
                </Item>
                <Item noStyle shouldUpdate={(pre, cur) => pre.preview !== cur.preview}>
                    {({ getFieldValue }) => {
                        let imgs = getFieldValue('preview') || []
                        return (
                            <Item name="mainImg" label="选择主图" wrapperCol={{ span: 20 }}>
                                <Radio.Group>
                                    {imgs.map((v, i) => <Radio key={i} value={v.uid}>图{i + 1}</Radio>)}
                                </Radio.Group>
                            </Item>
                        )
                    }}
                </Item>
                <Item label="商品标题" name="name" rules={rules.name} wrapperCol={{ span: 18 }}><Input /></Item>
                <Item label="商品简介" name="note" ><Input.TextArea /></Item>
                <Item label="商品分类" name="classId" rules={rules.classId}>
                    <Cascader
                        options={clasOptions}
                        fieldNames={optKey}
                        placeholder="点击选择或输入搜索"
                        disabled
                        showSearch={{ classifyFilter }}
                    />
                </Item>
                <Item label="品牌" name="brandId" rules={rules.classId}>
                    <FilterableSelect
                        placeholder="点击选择或搜索品牌"
                        options={brandOptions}
                        onChange={handleBrandChange}
                        disabled
                    />
                </Item>
                {/* {buildDynamicTagItems(tags, defo?.tags)} */}
                <Item hidden name="tags"><Input /></Item>
                <Item noStyle shouldUpdate={(pre, cur) => pre.brandId !== cur.brandId}>
                    {({ getFieldValue }) => getFieldValue('brandId') ? <Item label="所有属性"><Button onClick={openTagsModal}>点击打开弹窗</Button></Item> : null}
                </Item>
                <Item label="型号" name="modelName" rules={rules.modelName}><Input disabled /></Item>
                <Item label="名称" name="subname"><Input /></Item>
                <Item label="装箱规格" name="packageUnit"><InputNumber disabled style={expandWidth} min={1} /></Item>
                <Item label="商品条形码" name="barCode"><Input disabled /></Item>
                <Item label="起拍数量" name="clapNumber"><InputNumber style={expandWidth} min={1} /></Item>
            </Form>
            <ModalForm visible={isShowTags} onCancel={closeTagsModal} options={tags} defo={tagsValueRef.current} freeze={true} />
        </Form.Provider>

    )

}

export default forwardRef(ProductBase)

