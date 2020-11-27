const datas = [
    { id: 1, name: "文革", },
    { id: 5, name: "钓鱼岛", },
    { id: 6, name: "比如", },
    { id: 7, name: "李白", },
    { id: 2, name: "温家宝", },
    { id: 10, name: "月无情", },
    { id: 11, name: "毛泽东", },
    { id: 12, name: "马云", },
]

module.exports = {
    'get /sensitiveWord/all': function (req, res, next) {
        res.json({ code: 200, result: datas, success: true })
    },
    'delete /sensitiveWord/:id': function (req, res, next) {
        let index = datas.findIndex(v => v.id == req.params.id)
        datas.splice(index, 1)
        res.json({ code: 200, message: '删除成功', success: true })
    },
    'put /sensitiveWord': function (req, res, next) {
        let { id } = req.body
        let index = datas.findIndex(v => v.id == id)
        console.log(req.body)
        datas[index] = { ...datas[index], ...req.body }
        res.json({ code: 200, message: '编辑成功', success: true })
    },
    'post /sensitiveWord': function (req, res, next) {
        let entity = { id: datas.length + 1, ...req.body }
        datas.push(entity)
        res.json({ code: 200, message: '添加成功', success: true })
    }
}
