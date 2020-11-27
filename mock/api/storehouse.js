const datas = [
  {
    id: 1,
    address: "东莞市南城区白马社区",
    managerId: "56Fc7AeC-4227-4C8D-695A-eFDA4d3C6db1",
    name: "南城茶仓",
    phone: "18319198661",
    addTime: 1595299515302
  },
  {
    id: 2,
    address: "东莞市东城区",
    managerId: "DdCA9d4f-e8D9-573b-c96f-FfBBB91cc31C",
    name: "东城茶仓",
    phone: "15012585633",
    addTime: 1595378618154
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
function assignName(one) {
  one.managerName = users.get(one.managerId)
}
module.exports = {
  'get /storehouse/list': function (req, res, next) {
    let { page, limit, name } = req.query
    let data = datas, count = datas.length;
    if (name) {
      data = data.filter(v => v.name.includes(name))
      count = data.length
    }
    const begin = (page - 1) * limit
    data = data.slice(begin, begin + limit)
    const assignName = one => one.managerName = users.find(v => v.id == one.managerId).name
    data.forEach(assignName)
    res.json({ code: 0, data, count })
  },

  'get /storehouse/options': function (req, res, next) {
    const data = datas.map(v => ({ id: v.id, name: v.name }))
    return res.json({ code: 0, data })
  },
  'delete /storehouse/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },

  'patch /storehouse': function (req, res, next) {

    let { id } = req.body
    let index = datas.findIndex(v => v.id == id)
    datas[index] = { ...datas[index], ...req.body }
    res.json({ code: 0, msg: '编辑成功' })
  },

  'post /storehouse': function (req, res, next) {
    let entity = { id: datas.length + 1, addTime: new Date() * 1, ...req.body }
    datas.push(entity)
    res.json({ code: 0, msg: '添加成功' })
  }
}
