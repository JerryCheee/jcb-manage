const datas = [
  {
    id: 1,
    No: 'storage-0000',
    brandId: 1,
    endTime: 1596189969946,
    name: "2",
    phone: "18319198661",
    price: 100,
    realName: "雷佳音",
    salerId: "EBc96B1d-58fC-c5BC-d2a5-89421bB1ce9d",
    storehouseId: "1",
    total: 10,
    unit: "饼",
    userId: "56Fc7AeC-4227-4C8D-695A-eFDA4d3C6db1",
    year: "2020年",
    addTime: 1592325969946,
    state:1,//['待审核','通过','拒绝']
  },
  {
    id: 2,
    No: 'storage-0001',
    brandId: 2,
    name: "1",
    phone: "15012685633",
    price: 120,
    realName: "孙红雷",
    salerId: "b83B9c21-d485-876f-EE79-3D61c69AcE99",
    storehouseId: "2",
    total: 12,
    unit: "提",
    userId: "E77fBC24-Ac12-CC56-fF12-AcDCCdE309c0",
    year: "2020年",
    addTime: 1595379111528,
    state:1,
  }
]
const users = [
  { id: "56Fc7AeC-4227-4C8D-695A-eFDA4d3C6db1", name: "万刚" },
  { id: "EBc96B1d-58fC-c5BC-d2a5-89421bB1ce9d", name: "常磊" },
  { id: "DdCA9d4f-e8D9-573b-c96f-FfBBB91cc31C", name: "黎军" },
  { id: "E77fBC24-Ac12-CC56-fF12-AcDCCdE309c0", name: "谭平" },
  { id: "b83B9c21-d485-876f-EE79-3D61c69AcE99", name: "傅伟" },
  { id: "e08E79b7-FFB7-AcDC-AF7C-4Bb1e3f4C7e3", name: "叶涛" },
  { id: "f2CB1d5D-8D74-F5b6-2411-D4aeFfeFfCA2", name: "顾秀兰" },
  { id: "6CbbAfAF-F11A-17eD-146C-7beb81A44B75", name: "曾艳" },
  { id: "F3Fa76FC-Dc53-bD48-D1Bc-c8AbcfAcA81f", name: "郑娜" },
  { id: "e1C0F28d-bfD9-eED7-b8FB-Fc835272D8Eb", name: "龚静" },
]
const brands = [
  { id: 1, name: "大益" },
  { id: 2, name: "今大福" },
  { id: 3, name: "福今" },
  { id: 4, name: "陈升号" },
  { id: 5, name: "广隆" },
  { id: 6, name: "白菜孔雀" },
  { id: 7, name: "七子饼茶" },
  { id: 8, name: "印级茶" },
  { id: 9, name: "号级茶" }]
const house = [
  { id: 1, name: '南城茶仓' },
  { id: 2, name: '东城茶仓' },
]

module.exports = {
  'get /storage/list': function (req, res, next) {
    let { page, limit, realName, brandId, storehouseId,phone } = req.query
    let data = datas, count = datas.length;
    if (realName) {
      data = data.filter(v => v.realName.includes(realName))
      count = data.length
    }
    if (phone) {
      data = data.filter(v => v.phone.includes(phone))
      count = data.length
    }
    if (brandId) {
      let ids = brandId.split(',').map(v => v * 1)
      data = data.filter(v => ids.includes(v.brandId))
      count = data.length
    }
    if (storehouseId) {
      let ids = storehouseId.split(',')
      data = data.filter(v => ids.includes(v.storehouseId))
      count = data.length
    }

    const begin = (page - 1) * limit
    data = data.slice(begin, begin + limit)
    const assign = (one) => {
      one.salerName = users.find(v => v.id == one.salerId).name
      one.nickName = users.find(v => v.id == one.userId).name
      one.brandName = brands.find(v => v.id == one.brandId).name
      one.storeName = house.find(v => v.id == one.storehouseId).name
    }
    data.forEach(assign)
    res.json({ code: 0, data, count })
  },

  'delete /storage/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },

  'patch /storage': function (req, res, next) {

    let { id } = req.body
    let index = datas.findIndex(v => v.id == id)
    datas[index] = { ...datas[index], ...req.body }
    res.json({ code: 0, msg: '编辑成功' })
  },

  'post /storage': function (req, res, next) {
    let len = datas.length + 1
    let entity = {
      id: len,
      addTime: new Date() * 1,
      No: 'storage-000' + len,
      ...req.body
    }
    datas.push(entity)
    res.json({ code: 0, msg: '添加成功' })
  }
}
