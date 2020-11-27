
const admins = [
    {
        id: 1, account: 'admin', addTime: '2020-06-30 12:35:43',
        name: '月无情', phone: '18319198661', password: '123', roleId: 1
    },
    {
        id: 2, account: 'wu', addTime: '2020-06-30 14:37:45',
        name: '月无情', phone: '1502685633', password: '123', roleId: 2
    },
    {
        id: 3, account: 'qing', addTime: '2020-06-30 16:39:47',
        name: '月无情', phone: '17076929434', password: '123', roleId: 2
    },
]


const roles = [
    { id: 1, account: "超级管理员" },
    { id: 2, account: "仓管员" }
]

const proxy = require('../proxyCRUD')
const  staticResBody={"success":true,"message":"操作成功！ooo","code":200,"result":{"userInfo":{"id":"e9ca23d68d884d4ebb19d07889727dae","username":"admin","realname":"管理员","avatar":"http://minio.jeecg.com/otatest/temp/lgo33_1583397323099.png","birthday":"2018-12-05","sex":1,"email":"jeecg@163.com","phone":"18611111111","orgCode":"A01","orgCodeTxt":null,"status":1,"delFlag":0,"workNo":"00001","post":"developer","telephone":null,"createBy":null,"createTime":"2038-06-21 17:54:10","updateBy":"admin","updateTime":"2020-10-30 11:28:09","activitiSync":1,"userIdentity":2,"departIds":"088f77e6b48c45818eea614149a9001d","thirdType":null,"relTenantIds":"1","clientId":null,"roleType":0,"pid":""},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDUwMTEwMDQsInVzZXJuYW1lIjoiYWRtaW4ifQ.RC2fcN6yseq1vDbYDMRId9PsS6b12TC0iayAP1AjQio"},"timestamp":1605012622905}
module.exports = {

    'get /sys/admin/list': proxy.get,
    'get /sys/admin': proxy.get,
    // 'get /sys/admin': function (req,res,next) {
    //     res.json(staticResBody)
    // },
    'get /sys/admin/:id': proxy.get,
    'put /sys/admin/:id': proxy.put,
    'put /sys/admin/changePassword/:id': proxy.put,
    'post /sys/admin': proxy.post,
    'delete /sys/admin/:id': proxy.dele

}
