/** banner图类型 值为index */

export const jumpTypes = [{ text: '商品', value: 1 }, { text: '门店', value: 2 }, { text: '活动', value: 3 }]
export const showTypes = [{ text: 'B端', value: 1 }, { text: 'C端', value: 2 }]
export const sourceTypes = [{ text: '公众号端', value: 1 }, { text: 'app端', value: 2 }, { text: 'pc商城端', value: 3 }]
export const positionTypes = [{ text: '首页', value: 1 }, { text: '品牌区', value: 2 }, { text: '店铺街', value: 3 }]
    /** 用户身份 值为index */
export const userIdentity = ['普通会员', '维修师傅']

/** 角色类型 值为index */
export const roleTypes = ['平台', '门店', '供应商', '城市运营中心']

/** 管理员状态 值为index+1 */
export const adminStatus = ['正常', '冻结']

/** 运费模版->计费方式 值为index */
export const calcType = ['按件', '按重量', '按体积']

/**运费模版->不配送原因 */
export const reasonCodes = ['台风等自然灾害影响', '距离远导致的运费上升', '商品重量大导致的运费上升', '国家会议导致的运费上升', '合作快递不配送该区域', '合作快递该区域服务差', '其他']

/** 商品编辑-服务承诺 */
export const serveciCommitment = [
    ['isReturn', "七天无理由退换货", ],
    ['isDelivery', "48小时发货", ],
    ['isCompensation', "假一赔十", ],
    ['isRefund', "极速退款", ],
    ['isCity', "同城送货", ],
    ['isUndertakesTo', "一件代发"]
]

/** 门店审核-配送类型 */
export const deliveryTypes = [
    ['isDistribution', "快递配送", ],
    ['isSinceLift', "买家自提", ],
    ['isArrivePay', "物流到付", ],
    ['isHomeDelivery', "送货上门", ],
]

/** 审核状态 值为index */
export const verifyStatus = ['待审核', '通过', '拒绝']

/** 加盟申请类型 值为index */
export const joinTypeEnums = ['', '门店', '供应商']

/** 加盟申请审核状态 值为index */
export const joinStateEnums = ['待跟进', '跟进中', '条件不符', '确认加盟']

/** 优惠卷类型 值为index */
export const couponTypes = ['打折', '满减', '立减']

/** 优惠卷使用范围 值为index */
export const couponScopes = ['全场通用', '部分商品']