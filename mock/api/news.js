const datas = [
  {
    id: 1, poster: 'https://www.youfuchaye.com/data/artimg/1593739257495300314.jpg',
    kindId: "1,5", sort: 1, detail: '<p>新闻详情</p>', title: '2017班章珍藏孔雀丨高端产品单提收藏，已成为未来趋势',
    seoTitle: '', seoKeyword: '', seoDescription: ''
  },
  {
    id: 2,
    poster: "https://www.youfuchaye.com/data/artimg/1589160755702574437.jpg",
    title: "神隐瑞象，耀世登场 | 大象将与白菜孔雀齐飞？？？",
    kindId: "2",
    sort: 1,
    detail: "<p>在当今普洱茶界，提起何宝强先生想必大家都会想起班章白菜和孔雀，起源于20年前何氏兄弟的努力，但是班章生态资源毕竟有限，为了有效保护班章茶区的资源不被过度开采也为了让茶友体验到更多其它茶区的优质好茶，所以特意推出了大象系列。</p>",
    seoTitle: "seo 标题",
    seoKeywords: "seo 关键字",
    seoDescription: "seo 描述"
  }

]

const kinds = [
  { id: 1, pid: 0, name: "市场动态", sort: 1 },
  { id: 2, pid: 0, name: "产品新闻", sort: 2 },
  { id: 3, pid: 0, name: "普洱资讯", sort: 3 },
  { id: 4, pid: 0, name: "每日报价", sort: 4 },
  { id: 5, pid: 1, name: "大益", sort: 1 },
  { id: 6, pid: 1, name: "今大福", sort: 2 },
  { id: 7, pid: 4, name: "广隆", sort: 1 },
  { id: 8, pid: 4, name: "老茶", sort: 2 },
  { id: 9, pid: 5, name: "第三级", sort: 1 },


]
function getKindName(kindId) {
  return kindId
    .split(',')
    .reduce((pre, cur) => {
      let k = kinds.find(v => v.id == cur)
      pre.push(k ? k.name : undefined)
      return pre
    }, [])
    .filter(v => v != undefined)
    .reverse()
}
module.exports = {
  'get /news/list': function (req, res, next) {
    const { page, limit, title, kindId ,sort} = req.query
    let data = datas.map(v => {
      let obj = {
        id: v.id,
        poster: v.poster,
        kindId: v.kindId,
        sort: v.sort,
        title: v.title,
        kindName: getKindName(v.kindId).reverse()
      }
      delete obj.detail
      return obj;
    })
    let count = datas.length;
    if (title) {
      data = data.filter(v => v.title.includes(title))
      count = data.length
    }
    if (kindId) {
      // /^[3]|^[5]|,3|,5/g.exec('1,13,15,5,3,15')
      ///^[3]|^[5]|(?<=,)3/g.exec('1,13,15,5,3,15')
      const rules = kindId.split(',').map(v => `^${v}|,${v}`)
      const reg = new RegExp(rules.join(''))
      data = data.filter(v =>reg.test(v.kindId))
      count = data.length
    }
    if (sort) {
      data = data.sort((a, b) => {
        let isBig = a.sort - b.sort
        return sort == 'ascend'
          ? isBig
          : ~isBig + 1
      })
    }
    const begin = (page - 1) * limit
    data = data.slice(begin, begin + limit)
    res.json({ code: 0, data, count })
  },

  'get /news/:id': function (req, res, next) {
    let data = datas.find(d => d.id == req.params.id)
    data.kindName = getKindName(data.kindId).reverse()
    res.json({ code: 0, data })
  },

  'delete /news/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },

  'patch /news': function (req, res, next) {

    let { id } = req.body
    let index = datas.findIndex(v => v.id == id)
    datas[index] = { ...datas[index], ...req.body }
    res.json({ code: 0, msg: '编辑成功' })
  },

  'post /news': function (req, res, next) {
    let entity = { id: datas.length + 1, ...req.body }
    datas.push(entity)
    res.json({ code: 0, msg: '添加成功' })
  }
}
