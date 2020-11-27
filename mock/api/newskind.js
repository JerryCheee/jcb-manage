const datas = [
  { id: 1, pid: 0, name: "市场动态", sort: 1 },
  { id: 2, pid: 0, name: "产品新闻", sort: 2 },
  { id: 3, pid: 0, name: "普洱资讯", sort: 3 },
  { id: 4, pid: 0, name: "每日报价", sort: 4 },
  { id: 5, pid: 1, name: "大益", sort: 1 },
  { id: 6, pid: 1, name: "今大福", sort: 2 },
  { id: 7, pid: 4, name: "广隆", sort: 1 },
  { id: 8, pid: 4, name: "老茶", sort: 2 },
  { id: 9, pid: 5, name: "第三级", sort: 1 },
  { id: 10, pid: 4, name: "第三级", sort: 1 },
  { id: 11, pid: 9, name: "第四级", sort: 1 }

]

module.exports = {
  'get /newsKind/all': function (req, res, next) {
    res.json({ code: 0, data: datas })
  },

  'delete /newsKind/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },

  'patch /newsKind': function (req, res, next) {

    let { id } = req.body
    let index = datas.findIndex(v => v.id == id)
    datas[index] = { ...datas[index], ...req.body }
    res.json({ code: 0, msg: '编辑成功' })
  },

  'post /newsKind': function (req, res, next) {
    let entity = { id: datas.length + 1, ...req.body }
    datas.push(entity)
    res.json({ code: 0, msg: '添加成功' })
  }
}
