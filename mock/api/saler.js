/*
http://mockjs.com/examples.html

Mock.mock({
  'data|10':[
    {
      id:'@guid',
      userId:'',
      poster:'@image("100x120","#50B347","white","png","avatar")',
      name:'@cname',
      'sex|1':[1,2],
      'serveBrand|1':["大益","今大福","福今","陈升号","广隆","白菜孔雀","七子饼茶","印级茶","号级茶"],
      phone:/^1\d{10}/,
      sort:'@integer(0, 100)',
      'qq|8-10':/\d/,
      addTime:'@date("T")',
      detail:'',
      hidden:0
    }
  ]

})
 */
const datas = [

  {
    id: "35c6A9Bc-fEE5-CcEf-dCc1-DD419363FCed",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "邱伟",
    sex: 1,
    serveBrand: "福今",
    phone: "14853268767",
    sort: 53,
    qq: "47311674",
    addTime: "1248065504178",
    detail: "",
    hidden: 0
  },
  {
    id: "A1e8D668-BBE5-39f1-E6cF-47b3f55f7550",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "陆洋",
    sex: 2,
    serveBrand: "白菜孔雀",
    phone: "14405248178",
    sort: 17,
    qq: "3581853648",
    addTime: "1337011348828",
    detail: "",
    hidden: 0
  },
  {
    id: "D1d7Aff7-32Db-3cDc-C5Bb-bC69FAE6Ff6a",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "范刚",
    sex: 2,
    serveBrand: "陈升号",
    phone: "12847644545",
    sort: 91,
    qq: "521384151",
    addTime: "256867387903",
    detail: "",
    hidden: 0
  },
  {
    id: "1eFef431-Cee4-C47A-9C28-8Cdf9f3de0AF",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "田丽",
    sex: 1,
    serveBrand: "印级茶",
    phone: "13185511172",
    sort: 32,
    qq: "16548765",
    addTime: "933984919606",
    detail: "",
    hidden: 0
  },
  {
    id: "AE2CE2E4-eBDb-1AaF-6d88-47C3FFBd9E92",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "傅杰",
    sex: 2,
    serveBrand: "印级茶",
    phone: "17874266278",
    sort: 2,
    qq: "703288730",
    addTime: "1583195327855",
    detail: "",
    hidden: 0
  },
  {
    id: "78e5E74C-E9F6-DFf8-5D2d-DA8E3674B83F",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "何秀英",
    sex: 1,
    serveBrand: "印级茶",
    phone: "18058764790",
    sort: 92,
    qq: "924173498",
    addTime: "976211860390",
    detail: "",
    hidden: 0
  },
  {
    id: "2351a88b-8A5e-d5dF-fe7B-F44e5Db5fF4e",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "田霞",
    sex: 2,
    serveBrand: "陈升号",
    phone: "19964674042",
    sort: 8,
    qq: "25665266",
    addTime: "314563999975",
    detail: "",
    hidden: 0
  },
  {
    id: "DdebFD31-CC42-e22c-5E18-E8cAD0222AE1",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "金强",
    sex: 2,
    serveBrand: "福今",
    phone: "13217115080",
    sort: 26,
    qq: "453867876",
    addTime: "1183577713263",
    detail: "",
    hidden: 0
  },
  {
    id: "bDAEdFB0-c8c8-fcD6-E2Cf-c4be8acEEEf1",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "吕秀英",
    sex: 1,
    serveBrand: "福今",
    phone: "18392592046",
    sort: 44,
    qq: "831131220",
    addTime: "526469518742",
    detail: "",
    hidden: 0
  },
  {
    id: "dDeD33EB-1DCe-fDB1-d8Cf-5C24573bd4D1",
    userId: "",
    poster: "http://dummyimage.com/100x120/50B347/white.png&text=poster",
    name: "梁勇",
    sex: 1,
    serveBrand: "白菜孔雀",
    phone: "14855224922",
    sort: 46,
    qq: "151275717",
    addTime: "1339652103069",
    detail: "",
    hidden: 0
  }

]


function extraUnionKeys(a, b) {
  let validKeys = Object.keys(a)
  let reqKeys = Object.keys(b)
  return reqKeys.filter(k => validKeys.includes(k))
}

module.exports = {
  'get /saler/list': function (req, res, next) {
    const { page, limit, sort, name, phone, serveBrand } = req.query
    let data = datas.map(v => {
      let b = { ...v }
      delete b.detail
      return v
    })
    let count = data.length;
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
    if (phone) {
      data = data.filter(v => v.phone.includes(phone))
      count = data.length
    }
    if (serveBrand) {
      data = data.filter(v => v.serveBrand.includes(serveBrand))
      count = data.length
    }
    const begin = (page - 1) * limit
    data = data.slice(begin, begin + limit)
    res.json({ code: 0, data, count })
  },
  'get /saler/:id': function (req, res, next) {
    const { id } = req.params
    const target = datas.find(v => v.id == id)
    if (!target) return res.json({ code: 1, msg: '查无此人' })
    res.json({ code: 0, data: target.detail })
  },
  'delete /saler/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },
  'put /user': function (req, res, next) {
    let { id } = req.body;
    let entity = req.body
    let target = datas.find(v => v.id == id)
    if (target) {
      let unionKeys = extraUnionKeys(target, entity)
      unionKeys.forEach(k => (target[k] = entity[k]))
      res.json({ code: 0, msg: '编辑成功' })
    } else {
      let target = {}
      entity.id = datas.length + 1
      let model = datas[0]
      let unionKeys = extraUnionKeys(model, entity)
      unionKeys.forEach(k => target[k] = entity[k])
      datas.push(target)
      res.json({ code: 0, msg: '添加成功' })
    }
  },


}
