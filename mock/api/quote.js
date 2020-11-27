
const datas = [
  {
    id: 1,
    brandId: 2,
    detail: "<p>详情，bulabula</p>",
    futurePrice: 1,
    imgs: ["https://games.lkrsm.com/project/files/lucky_tea/20…13/Thumbnail/525155e480c04284995af6c55f221493.jpg"],
    introduction: "简介-好茶",
    name: "今大福2020年班章茶山行纪念茶（经典印象）",
    netVolume: 6,
    productionTecTag: 11,
    referencePrice: 3000,
    salerId: "56Fc7AeC-4227-4C8D-695A-eFDA4d3C6db1",
    seoDescription: "mate description 描述",
    seoKeywords: "mate关键词",
    seoTitle: "mate标题",
    seriesTag: 19,
    specification: "250克/罐 24罐/件",
    suplyDemandDes: "出 1999",
    typeTag: 17,
    yearTag: 5,
    isOnSale: 0,//上架
    isRecommend: 0,//热门
    sort: 0,
    clickCount: 588,
    salerName: '李佳琪'
  },
  {
    id: 2,
    brandId: 1,
    detail: "<p>详情bulabula</p>",
    futurePrice: 0,
    imgs: ["https://www.youfuchaye.com/images/202006/goods_img/2115_P_1591750140129.jpg"],
    introduction: "简介bulabula",
    name: "大益2018年1801 云起",
    netVolume: 10,
    productionTecTag: 10,
    referencePrice: 1453,
    salerId: "EBc96B1d-58fC-c5BC-d2a5-89421bB1ce9d",
    seoDescription: "seo 描述 ",
    seoKeywords: "seo 关键字",
    seoTitle: "seo 标题",
    seriesTag: 20,
    specification: "357克/片 7片/提(竹壳) 4提/件(竹筐)",
    suplyDemandDes: "求出处",
    typeTag: 13,
    yearTag: 6,
    sort: 2,
    isOnSale: 0,//上架
    isRecommend: 0,//热门
    salerName: '薇娅'
  },
  {
    id: 3,
    brandId: 2,
    clickCount: 10,
    detail: "<p>详情bulabula</p>",
    futurePrice: 3000,
    id: 3,
    imgs: ["https://www.youfuchaye.com/images/202006/thumb_img/2442_thumb_G_1591046260020.jpg"],
    introduction: "简介bulabula",
    name: "今大福2020年班章德福熟饼（开业纪念茶）",
    netVolume: 2.5,
    productionTecTag: 11,
    seriesTag: 20,
    sort: 3,
    specification: "357克/片 7片/提",
    suplyDemandDes: "求购",
    typeTag: 13,
    yearTag: 5,
    sort: 3,
    referencePrice: 0,
    isOnSale: 0,//上架
    isRecommend: 0,//热门
    salerName: '罗永浩'
  }
]

const priceRecords = [
  { id: 1, quoteId: 1, addTime: '2020-07-11 08:19:30', price: 1000, type: 1 },//type: 1 参考价，2 期货价
  { id: 2, quoteId: 1, addTime: '2020-07-12 09:19:30', price: 2000, type: 1 }
]
function calcUpRate(id) {
  let records = priceRecords.filter(v => v.quoteId == id)
  if (records.length < 2) return 0;
  const byDescend = (a, b) => new Date(b.addTime) - new Date(a.addTime)
  let [recent, early] = records.sort(byDescend).slice(0, 2).map(v => v.price);
  return ((recent - early) / recent * 10000 | 0) / 100
}
function extraUnionKeys(a, b) {
  let validKeys = Object.keys(a)
  let reqKeys = Object.keys(b)
  return reqKeys.filter(k => validKeys.includes(k))
}
const normal = v => ({
  id: v.id,
  name: v.name,
  img: v.imgs[0],
  clickCount: v.clickCount,
  referencePrice: v.referencePrice,
  futurePrice: v.futurePrice,
  isOnSale: v.isOnSale,
  isRecommend: v.isRecommend,
  sort: v.sort,
  upRate: calcUpRate(v.id)
})
const simple = v => ({
  id: v.id,
  name: v.name
})
module.exports = {
  'get /quote/list': function (req, res, next) {
    const { sort, name } = req.query

    let data = datas.map(normal)
    let count = datas.length
    if (sort) {
      data = data.sort((a, b) => {
        let isBig = a.sort - b.sort
        return sort == 'ascend'
          ? isBig
          : ~isBig + 1
      })
    }
    if (name) {
      data = data.filter(v => v.name.includes(name))
      count = data.length
    }
    res.json({ code: 0, data, count: datas.length })
  },
  'get /quote/options': function (req, res, next) {
    const { name, brandId } = req.query
    const byBrand = brandId ? v => v.brandId == brandId : v => true
    const data = datas.filter(v => byBrand(v) && v.name.includes(name)).map(simple)
    return res.json({ code: 0, data })
  },
  'get /quote/:id': function (req, res, next) {//用于修改前 
    let { id } = req.params
    let target = datas.find(v => v.id == id)
    if (!target) {
      res.json({ code: 1, msg: `没有找到id为${id}的数据` })
      return
    }
    res.json({ code: 0, data: target })
  },
  'delete /quote/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },
  'patch /quote': function (req, res, next) {
    let { id } = req.body;
    let entity = req.body


    let target = datas.find(v => v.id == id)
    let unionKeys = extraUnionKeys(target, entity)
    unionKeys.forEach(k => (target[k] = entity[k]))

    res.json({ code: 0, msg: '编辑成功' })
  },
  'post /quote': function (req, res, next) {
    let entity = req.body
    let target = {}
    entity.id = datas.length + 1

    let model = datas[0]
    let unionKeys = extraUnionKeys(model, entity)
    unionKeys.forEach(k => target[k] = entity[k])

    target.clickCount = Math.random() * 1000 | 0
    target.sort = datas.length + 1
    datas.push(target)
    res.json({ code: 0, msg: '添加成功' })
  },

}
