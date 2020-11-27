/*
http://mockjs.com/examples.html

Mock.mock({
  'data|10':[
    {
      id:'@guid',
      avatar:'@image("100x100","#50B347","white","png","headimgurl")',
      nickname:'@cname',
      user_name:/^1\d{10}/,
      'user_rank|1':['会员','仓管员','业务员'],
      points:'@integer(60, 100)',
      addTime:'@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]

})
 */
const datas = [
  {
    "user_id": "56Fc7AeC-4227-4C8D-695A-eFDA4d3C6db1",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "万刚",
    "user_name": "13485818919",
    "user_rank": "业务员",
    "points": 94,
    "addTime": "2002-09-23 03:14:05"
  },
  {
    "user_id": "EBc96B1d-58fC-c5BC-d2a5-89421bB1ce9d",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "常磊",
    "user_name": "17913645938",
    "user_rank": "业务员",
    "points": 90,
    "addTime": "1984-03-13 02:41:19"
  },
  {
    "user_id": "DdCA9d4f-e8D9-573b-c96f-FfBBB91cc31C",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "黎军",
    "user_name": "14238635326",
    "user_rank": "会员",
    "points": 62,
    "addTime": "1995-02-19 11:42:35"
  },
  {
    "user_id": "E77fBC24-Ac12-CC56-fF12-AcDCCdE309c0",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "谭平",
    "user_name": "17218641821",
    "user_rank": "仓管员",
    "points": 67,
    "addTime": "1981-06-03 08:25:19"
  },
  {
    "user_id": "b83B9c21-d485-876f-EE79-3D61c69AcE99",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "傅伟",
    "user_name": "18356685085",
    "user_rank": "仓管员",
    "points": 71,
    "addTime": "1983-09-29 16:53:15"
  },
  {
    "user_id": "e08E79b7-FFB7-AcDC-AF7C-4Bb1e3f4C7e3",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "叶涛",
    "user_name": "12570123444",
    "user_rank": "会员",
    "points": 66,
    "addTime": "2004-03-27 19:43:12"
  },
  {
    "user_id": "f2CB1d5D-8D74-F5b6-2411-D4aeFfeFfCA2",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "顾秀兰",
    "user_name": "14821002344",
    "user_rank": "仓管员",
    "points": 69,
    "addTime": "1973-07-06 08:06:32"
  },
  {
    "user_id": "6CbbAfAF-F11A-17eD-146C-7beb81A44B75",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "曾艳",
    "user_name": "15177162736",
    "user_rank": "业务员",
    "points": 78,
    "addTime": "1992-12-23 02:33:57"
  },
  {
    "user_id": "F3Fa76FC-Dc53-bD48-D1Bc-c8AbcfAcA81f",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "郑娜",
    "user_name": "11585623843",
    "user_rank": "会员",
    "points": 69,
    "addTime": "2018-06-19 14:05:21"
  },
  {
    "user_id": "e1C0F28d-bfD9-eED7-b8FB-Fc835272D8Eb",
    "headimgurl": "http://dummyimage.com/100x100/50B347/white.png&text=avatar",
    "nickname": "龚静",
    "user_name": "18386987696",
    "user_rank": "会员",
    "points": 96,
    "addTime": "2009-04-23 15:08:36"
  }
]


module.exports = {
  'get /user/list': function (req, res, next) {
    let { page, pageSize, user_rank, addTime, points, nickname } = req.query
    let ed = datas
    if (user_rank) {
      let names = user_rank.split(',')
      ed = ed.filter(v => names.includes(v.user_rank))
    }
    if (addTime) {
      ed = ed.sort((a, b) => {
        let isBig = new Date(a.addTime) - new Date(b.addTime)
        return addTime == 'ascend'
          ? isBig
          : ~isBig + 1
      })
    }
    if (points) {
      ed = ed.sort((a, b) => {
        let isBig = a.points - b.points
        return addTime == 'ascend'
          ? isBig
          : ~isBig + 1
      })
    }
    if (nickname) {
      ed = ed.filter(v => v.nickname.includes(nickname))
    }
   
    let p = page - 1
    let data = ed.slice(p * pageSize, p + pageSize)
    res.json({ code: 0, data, count: ed.length })
  },
  'delete /user/:id': function (req, res, next) {
    let index = datas.findIndex(v => v.user_id == req.params.id)
    datas.splice(index, 1)
    res.json({ code: 0, msg: '删除成功' })
  },
  'patch /user': function (req, res, next) {
    let { id } = req.body;
    let i = datas.findIndex(v => v.user_id == id)
    datas[i] = { ...datas[i], ...req.body }
    res.json({ code: 0, msg: '编辑成功' })
  },
  'post /user': function (req, res, next) {
    let entity = {}
    Object.keys(req.body).forEach(v => entity[v] = req.body[v])
    datas.push(entity)
    res.json({ code: 0, msg: '添加成功' })
  }
}
