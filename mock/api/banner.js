
const datas = [

  {
    id: 0,
    img: "https://www.youfuchaye.com//data/afficheimg/20200619trxsio.jpg",
    title: "林深幽暗 绿羽惊鸿",
    link: "https://youfuchaye.com/goods.php?id=2446",
    addTime: 1594893537612,
    hidden: 0,

  },
  {
    id: 1,
    img: "https://www.youfuchaye.com//data/afficheimg/20200101oonyak.jpg",
    title: "鼠开洞开，茶友福地",
    link: "https://www.youfuchaye.com/goods.php?id=2360",
    addTime: 1594843637612,
    hidden: 0,
  },
  {
    id: 2,
    img: "https://www.youfuchaye.com//data/afficheimg/20200701pmfeav.jpg",
    title: "让世界认识地道的普洱茶",
    link: "https://www.youfuchaye.com/goods.php?id=2456",
    addTime: 1594873737612,
    hidden: 0,
  }

]

function extraUnionKeys(a, b) {
  let validKeys = Object.keys(a)
  let reqKeys = Object.keys(b)
  return reqKeys.filter(k => validKeys.includes(k))
}

module.exports = {
  'get /banner/list': function (req, res, next) {
    const { page, limit, title } = req.query
    let data = datas
    let count = datas.length

    if (title) {
      data = data.filter(v => v.title.includes(title))
      count = data.length
    }
    const begin = (page - 1) * limit
    data = data.slice(begin, begin + limit)
    res.json({ code: 0, data, count: datas.length })
  },
  'delete /banner/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },
  'patch /banner': function (req, res, next) {
    let { id } = req.body;
    let entity = req.body
    let target = datas.find(v => v.id == id)
    let unionKeys = extraUnionKeys(target, entity)
    unionKeys.forEach(k => (target[k] = entity[k]))

    res.json({ code: 0, msg: '编辑成功' })
  },
  'post /banner': function (req, res, next) {
    let entity = req.body
    let target = {}
    entity.id = datas.length + 1
    entity.addTime=new Date()*1
    let model = datas[0]
    let unionKeys = extraUnionKeys(model, entity)
    unionKeys.forEach(k => target[k] = entity[k])
    datas.push(target)
    res.json({ code: 0, msg: '添加成功' })
  },

}
