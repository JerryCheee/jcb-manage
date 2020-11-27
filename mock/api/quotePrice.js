

const datas = [
  { id: 1, quoteId: 1, addTime: 1594426770000, price: 1000, type: 2 },//type: 1 参考价，2 期货价
  { id: 2, quoteId: 1, addTime: 1594483200000, price: 2000, type: 2 },
  { id: 3, quoteId: 1, addTime: 1594569600000, price: 3400, type: 1 },
  { id: 4, quoteId: 1, addTime: 1594656000000, price: 1300, type: 1 },
  { id: 5, quoteId: 1, addTime: 1594782769988, price: 2400, type: 1 },
].concat(new Array(20).fill(0).map((v, i) => {
  return {
    id: i + 6,
    quoteId: 1,
    addTime: 86400000 * i + 1592190769988,
    price: Math.random() * 1000 | 0,
    type: 1
  }
}))

const assignTypeName = v => v.typeName = typeEnums[v.type]

module.exports = {

  'get /quotePrice/list/only/:quoteId': function (req, res, next) {
    const { quoteId } = req.params
    const { type, page, limit, timeRange } = req.query
    let data = datas.filter(v => v.quoteId == quoteId && v.type == type)
    let count = datas.length;
    if (timeRange) {
      let [start, end] = timeRange.split(',')
      data = data.filter(v => v.addTime >= start && v.addTime <= end)
      count = data.length
    }
    const begin = (page - 1) * limit
    data = data.slice(begin, begin + limit).sort((a, b) => b.addTime - a.addTime)
    return res.json({ code: 0, data, count })
  },
  'post /quotePrice': function (req, res, next) {
    let entity = req.body;
    entity.id = datas.length + 1;
    entity.addTime = new Date() * 1
    datas.push(entity)
    return res.json({ code: 0, msg: '添加成功' })
  },
  'patch /quotePrice': function (req, res, next) {
    const { price,id } = req.body
    let target = datas.find(v => v.id == id)
    target.price = price;
    return res.json({ code: 0, msg: '修改成功' })
  },

  'delete /quotePrice/:id': function (req, res, next) {
    const { id } = req.params
    let index = datas.findIndex(v => v.id == id)
    datas.splice(index, 1)
    return res.json({ code: 0, msg: '删除成功' })
  },

}
