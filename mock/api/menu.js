
const menus =
    [
        { id: 1, sort: 1, pid: 0, path: "/dashboard", component: "dashboard", name: "首页", hiden: 0 },
        { id: 2, sort: 3, pid: 0, path: "/admin", component: "", name: "后台管理", hiden: 0 },
        { id: 3, sort: 1, pid: 2, path: "/admin/index", component: "admin/index", name: "管理员列表", hiden: 0 },
        { id: 4, sort: 2, pid: 2, path: "/admin/modify", component: "admin/modify", name: "编辑管理员", hiden: 1 },
        { id: 5, sort: 3, pid: 2, path: "/role/assign", component: "role/assign", name: "分配权限", hiden: 1 },
        { id: 6, sort: 4, pid: 2, path: "/sys/menu/index", component: "menu/index", name: "路由管理", hiden: 0 },
        { id: 7, sort: 5, pid: 2, path: "/sys/menu/modify", component: "menu/modify", name: "编辑路由", hiden: 1 },
        { id: 8, sort: 6, pid: 2, path: "/role/index", component: "role/index", name: "角色列表", hiden: 0 },
        { id: 9, sort: 7, pid: 2, path: "/role/modify", component: "role/modify", name: "编辑角色", hiden: 1 },
        { id: 10, sort: 8, pid: 2, path: "/wxMenu/index", component: "wxMenu/index", name: "微信菜单", hiden: 0 },
        { id: 11, sort: 4, pid: 0, path: "/product", component: "", name: "商品管理", hiden: 0 },
        { id: 12, sort: 1, pid: 11, path: "/product/index", component: "product/index", name: "商品列表", hiden: 0 },
        { id: 13, sort: 2, pid: 11, path: "/product/modify", component: "product/modify", name: "编辑商品", hiden: 1 },
        { id: 14, sort: 3, pid: 11, path: "/classify/index", component: "classify/index", name: "类型列表", hiden: 0 },
        { id: 15, sort: 4, pid: 11, path: "/classify/modify", component: "classify/modify", name: "编辑商品类型", hiden: 1 },
        { id: 16, sort: 5, pid: 11, path: "/proptype/index", component: "proptype/index", name: "属性列表", hiden: 0 },
        { id: 17, sort: 6, pid: 11, path: "/proptype/modify", component: "proptype/modify", name: "编辑属性", hiden: 1 },
        { id: 18, sort: 7, pid: 11, path: "/brand/index", component: "brand/index", name: "品牌列表", hiden: 0 },
        { id: 19, sort: 8, pid: 11, path: "/brand/modify", component: "brand/modify", name: "编辑品牌", hiden: 1 },
        { id: 20, sort: 9, pid: 11, path: "/tag/index", component: "tag/index", name: "标签列表", hiden: 0 },
        { id: 21, sort: 10, pid: 11, path: "/tag/modify", component: "tag/modify", name: "编辑标签", hiden: 1 },
        { id: 22, sort: 11, pid: 11, path: "/sensitiveWord/index", component: "sensitiveWord/index", name: "敏感词库", hiden: 0 },
        { id: 23, sort: 12, pid: 11, path: "/sensitiveWord/modify", component: "sensitiveWord/modify", name: "编辑敏感词", hiden: 1 },
        { id: 24, sort: 2, pid: 0, path: "/workbench", component: "", name: "工作台", hiden: 0 },
        { id: 25, sort: 1, pid: 24, path: "/workbench/store/index", component: "workbench/store/index", name: "门店审核", hiden: 0 },
        { id: 26, sort: 2, pid: 24, path: "/workbench/supplier/index", component: "workbench/supplier/index", name: "供应商审核", hiden: 0 },
        { id: 27, sort: 3, pid: 24, path: "/workbench/store/product", component: "workbench/store/product", name: "门店商品审核", hiden: 0 },
        { id: 28, sort: 4, pid: 24, path: "/workbench/supplier/product", component: "workbench/supplier/product", name: "供应商商品审核", hiden: 0 },
        { id: 29, sort: 5, pid: 24, path: "/comment/customer", component: "comment/customer", name: "C端评论审核", hiden: 0 },
        { id: 30, sort: 6, pid: 24, path: "/comment/business", component: "comment/business", name: "B端评论审核", hiden: 0 },
        { id: 31, sort: 7, pid: 24, path: "/comment/ugc", component: "comment/ugc", name: "社区评论审核", hiden: 0 },
        { id: 32, sort: 8, pid: 24, path: "/comment/o2o", component: "comment/o2o", name: "服务评论审核", hiden: 0 },
        { id: 33, sort: 9, pid: 24, path: "/user/feedback", component: "user/feedback", name: "用户反馈", hiden: 0 },

        { id: 34, sort: 5, pid: 0, path: "/marketing", component: "", name: "营销管理", hiden: 0 },
        { id: 35, sort: 1, pid: 34, path: "/coupon/index", component: "coupon/index", name: "优惠卷", hiden: 0 },
        { id: 36, sort: 2, pid: 34, path: "/coupon/modify", component: "coupon/modify", name: "编辑管理员", hiden: 1 },
        { id: 37, sort: 3, pid: 34, path: "/groupBuy/index", component: "groupBuy/index", name: "拼团商品", hiden: 0 },
        { id: 38, sort: 4, pid: 34, path: "/groupBuy/modify", component: "groupBuy/modify", name: "编辑拼团商品", hiden: 1 },
        { id: 39, sort: 5, pid: 34, path: "/seckill/index", component: "seckill/index", name: "秒杀商品", hiden: 0 },
        { id: 40, sort: 6, pid: 34, path: "/seckill/modify", component: "seckill/modify", name: "编辑秒杀商品", hiden: 1 },
        // { id: 41, sort: 7, pid: 34, path: "/presale/index", component: "presale/index", name: "限时打折", hiden: 0 },
        // { id: 42, sort: 8, pid: 34, path: "/presale/modify", component: "presale/modify", name: "编辑限时打折", hiden: 1 },
        { id: 43, sort: 6, pid: 0, path: "/o2o", component: "", name: "服务管理", hiden: 0 },
        { id: 44, sort: 1, pid: 43, path: "/o2o/kind/index", component: "o2o/kind/index", name: "服务分类", hiden: 0 },
        { id: 45, sort: 2, pid: 43, path: "/o2o/kind/modify", component: "o2o/kind/modify", name: "编辑服务分类", hiden: 1 },
        { id: 46, sort: 3, pid: 43, path: "/o2o/type/index", component: "o2o/type/index", name: "服务类型", hiden: 0 },
        { id: 47, sort: 4, pid: 43, path: "/o2o/type/modify", component: "o2o/type/modify", name: "编辑服务类型", hiden: 1 },
        { id: 48, sort: 7, pid: 0, path: "/order", component: "", name: "订单管理", hiden: 0 },
        { id: 49, sort: 1, pid: 48, path: "/order/mall", component: "order/mall", name: "商城订单", hiden: 0 },
        { id: 50, sort: 2, pid: 48, path: "/order/purchase", component: "order/purchase", name: "进货订单", hiden: 0 },
        { id: 51, sort: 3, pid: 48, path: "/order/supplier", component: "order/supplier", name: "供应商订单", hiden: 0 },
        { id: 52, sort: 4, pid: 48, path: "/order/o2o", component: "order/o2o", name: "服务订单", hiden: 0 },
        { id: 53, sort: 8, pid: 0, path: "/rule", component: "", name: "平台规则", hiden: 0 },
        { id: 54, sort: 1, pid: 53, path: "/rule/distribution", component: "rule/distribution", name: "分销规则", hiden: 0 },
        { id: 55, sort: 2, pid: 53, path: "/rule/afterSale", component: "rule/afterSale", name: "售后规则", hiden: 0 },
        { id: 56, sort: 3, pid: 53, path: "/rule/rewordPunish", component: "rule/rewordPunish", name: "奖惩规则", hiden: 0 },
        { id: 57, sort: 9, pid: 0, path: "/user", component: "", name: "会员列表", hiden: 0 },
        { id: 58, sort: 1, pid: 57, path: "/user/index", component: "user/index", name: "会员列表", hiden: 0 },
        { id: 61, sort: 3, pid: 57, path: "/user/level/index", component: "user/level/index", name: "会员等级", hiden: 0 },
        { id: 62, sort: 4, pid: 57, path: "/user/level/modify", component: "user/level/modify", name: "编辑会员等级", hiden: 1 },
        { id: 63, sort: 5, pid: 57, path: "/user/artisan", component: "user/artisan", name: "师傅加盟", hiden: 0 },
        { id: 64, sort: 10, pid: 0, path: "/store", component: "", name: "门店管理", hiden: 0 },
        { id: 65, sort: 1, pid: 64, path: "/store/index", component: "store/index", name: "门店列表", hiden: 0 },
        { id: 66, sort: 2, pid: 64, path: "/store/level/index", component: "store/level/index", name: "门店等级", hiden: 0 },
        { id: 67, sort: 3, pid: 64, path: "/store/level/modify", component: "store/level/modify", name: "编辑门店等级", hiden: 1 },
        { id: 68, sort: 4, pid: 64, path: "/store/merchants", component: "store/merchants", name: "招商简介", hiden: 0 },
        { id: 69, sort: 5, pid: 64, path: "/protocol/store/join", component: "protocol/store/join", name: "加盟协议", hiden: 0 },
        { id: 70, sort: 11, pid: 0, path: "/supplier", component: "", name: "供应商管理", hiden: 0 },
        { id: 71, sort: 1, pid: 70, path: "/supplier/index", component: "supplier/index", name: "供应商列表", hiden: 0 },
        { id: 72, sort: 2, pid: 70, path: "/supplier/modify", component: "supplier/modify", name: "编辑供应商", hiden: 1 },
        { id: 73, sort: 12, pid: 0, path: "/logistics", component: "", name: "物流管理", hiden: 0 },
        { id: 74, sort: 1, pid: 73, path: "/logistics/index", component: "logistics/index", name: "物流模版", hiden: 0 },
        { id: 75, sort: 2, pid: 73, path: "/logistics/modify", component: "logistics/modify", name: "编辑物流模版", hiden: 1 },
        { id: 76, sort: 3, pid: 73, path: "/logistics/limit", component: "logistics/limit", name: "物流界限", hiden: 0 },
        { id: 77, sort: 13, pid: 0, path: "/invoice", component: "", name: "发票管理", hiden: 0 },
        { id: 78, sort: 1, pid: 77, path: "/invoice/index", component: "invoice/index", name: "抬头信息", hiden: 0 },
        { id: 79, sort: 2, pid: 77, path: "/invoice/modify", component: "invoice/modify", name: "编辑发票抬头", hiden: 1 },
        { id: 80, sort: 3, pid: 77, path: "/invoice/confirm", component: "invoice/confirm", name: "发票审核", hiden: 0 },
        { id: 81, sort: 4, pid: 77, path: "/invoice/apply", component: "invoice/apply", name: "发票申请", hiden: 0 },
        { id: 82, sort: 14, pid: 0, path: "/ugc", component: "", name: "互动社区", hiden: 0 },
        { id: 83, sort: 1, pid: 82, path: "/ugc/index", component: "ugc/index", name: "课件列表", hiden: 0 },
        { id: 84, sort: 2, pid: 82, path: "/ugc/modify", component: "ugc/modify", name: "编辑课件", hiden: 1 },
        { id: 85, sort: 17, pid: 0, path: "/other", component: "", name: "其他管理", hiden: 0 },
        { id: 86, sort: 1, pid: 85, path: "/banner/index", component: "banner/index", name: "广告图", hiden: 0 },
        { id: 87, sort: 2, pid: 85, path: "/banner/modify", component: "banner/modify", name: "编辑广告图", hiden: 1 },
        { id: 88, sort: 3, pid: 85, path: "/message/index", component: "message/index", name: "消息推送", hiden: 0 },
        { id: 89, sort: 4, pid: 85, path: "/message/modify", component: "message/modify", name: "编辑消息", hiden: 1 },
        { id: 90, sort: 4, pid: 0, path: "/store/product", component: "", name: "门店-商品管理", hiden: 0 },
        { id: 91, sort: 1, pid: 90, path: "/product/store/index", component: "product/store/index", name: "商品列表", hiden: 0 },
        { id: 92, sort: 2, pid: 90, path: "/product/store/modify", component: "product/store/modify", name: "编辑商品", hiden: 1 },
        { id: 93, sort: 4, pid: 0, path: "/supplier/product", component: "", name: "供应商-商品管理", hiden: 0 },
        { id: 94, sort: 1, pid: 93, path: "/product/supplier/index", component: "product/supplier/index", name: "商品列表", hiden: 0 },
        { id: 95, sort: 2, pid: 93, path: "/product/supplier/modify", component: "product/supplier/modify", name: "编辑商品", hiden: 1 },
        { id: 96, sort: 7, pid: 0, path: "/store/order", component: "", name: "门店-订单管理", hiden: 0 },
        { id: 97, sort: 1, pid: 96, path: "/order/store/index", component: "order/store/index", name: "订单列表", hiden: 0 },
        { id: 98, sort: 7, pid: 0, path: "/supplier/order", component: "", name: "供应商-订单管理", hiden: 0 },
        { id: 99, sort: 1, pid: 98, path: "/order/supplier/index", component: "order/supplier/index", name: "订单列表", hiden: 0 },
        { id: 100, sort: 16, pid: 0, path: "/finance", component: "", name: "财务管理", hiden: 0 },
        { id: 101, sort: 1, pid: 100, path: "/finance/index", component: "finance/index", name: "对账明细", hiden: 0 },
        { id: 102, sort: 2, pid: 100, path: "/finance/cashOut", component: "finance/cashOut", name: "提现审核", hiden: 0 },
        { id: 103, sort: 3, pid: 100, path: "/finance/refund", component: "finance/refund", name: "退款审核", hiden: 0 },

    ]
/**
* 将数据转换为sql
* INSERT INTO ecs_menu ([path], [hiden], [pid], [icon], [sort], [DelFlag], [component], [addTime], [name]) VALUES (NULL, '0', '0', N'icon iconfont icon-quanxian', '2', '0', NULL, '2018-03-07 15:42:01.257', N'权限管理');
*/
function conver2Sql(datas) {
    var fs = require('fs')
    var path = require('path')
    let keySufix = ', [DelFlag], [icon]'
    let vauleSufix = ", '0', NULL"
    let dirPath = path.resolve(__dirname, '../sql')
    let filePath = `${dirPath}/sys/menu.sql`
    let sorted = datas.sort((a, b) => a.id - b.id).slice()
    let sql = sorted.map(v => {
        delete v.id
        v.hiden = Number(v.hiden)
        let keyStr = Object.keys(v)
            .map(cur => cur == '' ? 'NULL' : `[${cur}]`)
            .join(',') + keySufix
        let valueStr = Object.values(v)
            .map(cur => cur == '' ? 'NULL' : `'${cur}'`)
            .join(',') + vauleSufix
        return `INSERT INTO ecs_menu (${keyStr}) VALUES (${valueStr})`
    })
    fs.mkdir(dirPath, (err, ok) => {

        fs.writeFile(filePath, sql.join('\n'), (e) => {
            if (e) { console.log(JSON.stringify(e)) }
        })
    })
}
// conver2Sql(menus) 直接用vscode debugger 运行

const proxy = require('../proxyCRUD')
const staticResBody = {
    success: true, code: 200, result: [
        {
            "id": "1322476102846455810",
            "parentId": null,
            "name": "供应商-商品管理",
            "perms": null,
            "permsType": "0",
            "icon": null,
            "component": "",
            "componentName": null,
            "url": "/product",
            "redirect": null,
            "sortNo": 105,
            "menuType": 0,
            "leaf": false,
            "route": false,
            "keepAlive": false,
            "description": null,
            "createBy": "e9ca23d68d884d4ebb19d07889727dae",
            "delFlag": 0,
            "ruleFlag": 0,
            "hidden": false,
            "createTime": "2020-10-31 17:50:48",
            "updateBy": "e9ca23d68d884d4ebb19d07889727dae",
            "updateTime": "2020-10-31 17:50:48",
            "status": null,
            "alwaysShow": false,
            "internalOrExternal": false
          },

            {
              "id": "1322846785451458561",
              "parentId": "1322476102846455810",
              "name": "商品列表",
              "perms": null,
              "permsType": "0",
              "icon": null,
              "component": "product/supplier/index",
              "componentName": null,
              "url": "/product/supplier/index",
              "redirect": "/product",
              "sortNo": 101,
              "menuType": 1,
              "leaf": true,
              "route": false,
              "keepAlive": false,
              "description": null,
              "createBy": "e9ca23d68d884d4ebb19d07889727dae",
              "delFlag": 0,
              "ruleFlag": 0,
              "hidden": false,
              "createTime": "2020-11-01 18:23:46",
              "updateBy": "e9ca23d68d884d4ebb19d07889727dae",
              "updateTime": "2020-11-01 18:23:46",
              "status": null,
              "alwaysShow": false,
              "internalOrExternal": false
            },
            {
              "id": "1322846857924837378",
              "parentId": "1322476102846455810",
              "name": "编辑商品",
              "perms": null,
              "permsType": "0",
              "icon": null,
              "component": "product/supplier/modify",
              "componentName": null,
              "url": "/product/supplier/modify",
              "redirect": "/product",
              "sortNo": 102,
              "menuType": 1,
              "leaf": true,
              "route": false,
              "keepAlive": false,
              "description": null,
              "createBy": "e9ca23d68d884d4ebb19d07889727dae",
              "delFlag": 0,
              "ruleFlag": 0,
              "hidden": true,
              "createTime": "2020-11-01 18:24:03",
              "updateBy": "e9ca23d68d884d4ebb19d07889727dae",
              "updateTime": "2020-11-01 18:24:03",
              "status": null,
              "alwaysShow": false,
              "internalOrExternal": false
            }

    ]
}
module.exports = {
    'get /sys/menu/all': proxy.get,
    // 'get /sys/menu/all': function (req, res, next) {
    //     res.json(staticResBody)
    // },
    'delete /sys/menu/:id': proxy.dele,
    'put /sys/menu/:id': proxy.put,
    'post /sys/menu': proxy.post
}
