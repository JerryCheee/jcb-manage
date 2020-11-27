
const datas = [
  {
    id: 1,
    img: 'https://www.youfuchaye.com/images/202006/goods_img/2115_P_1591750140129.jpg',
    title: '大益2018年1801 云起',
    content: '我觉得还可以再涨涨',
    userName: '月无情',
    addTime: 1596530722,
    state: 1
  },
  {
    id: 2,
    img: 'https://www.youfuchaye.com/images/202006/goods_img/2115_P_1591750140129.jpg',
    title: '大益2018年1801 云起',
    content: '我觉得你太年轻',
    userName: '杆精',
    addTime: 1596530722,
    state: 0
  }
]
const nameArr = ['待审核', '通过', '拒绝']
module.exports = {

  'get /comment/list': function (req, res, next) {
    let data = datas.map(v => (v.stateName = nameArr[v.state], v))
    data[1].replyTarget = data[0]
    res.json({
      code: 0,
      data
    })
  },
  'patch /comment': function (req, res, next) {
    const { id } = req.body;
    let i = datas.findIndex(v => v.id == id)
    datas[i] = { ...datas[i], ...req.body }
    res.json({ code: 0, msg: '编辑成功' })
  },
  'delete /comment': function (req, res, next) {
    const { id } = req.params;
    let index = datas.find(v => v.id == id)
    datas.splice(index, 1)
    res.json({
      code: 0,
      msg: '删除成功'
    })
  }

}
