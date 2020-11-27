
var proxy = require('../proxyCRUD')
const staticResBody={"success":true,"message":"操作成功！","code":200,"result":[{"id":"1323175185236017154","createBy":"admin","createTime":"2020-11-02 16:08:42","updateBy":"e9ca23d68d884d4ebb19d07889727dae","updateTime":"2020-11-05 17:34:22","name":"测试y","account":"s2","password":"4594da3df73dd8a4","asynchLogin":null,"logo":null,"status":0,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"这是第一个有管理端添加的 供应商","salt":"B6N7XSYh","userId":"1323175184418127873","isArrivePay":null,"isDistribution":null,"isSinceLift":null},{"id":"1325377415229902850","createBy":"e9ca23d68d884d4ebb19d07889727dae","createTime":"2020-11-08 17:59:35","updateBy":null,"updateTime":null,"name":"汉舍卫浴佛山分厂","account":"15364476816","password":"c39d74dfbc4de7326550ec0fd71020c9","asynchLogin":null,"logo":"","status":0,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"汉舍卫浴，注重生活品质的陶瓷品牌","salt":"OxUrnvuO","userId":"1325377413032087553","isArrivePay":null,"isDistribution":null,"isSinceLift":null},{"id":"1327853336453066753","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"测试进货商","account":"17817995154","password":"48997ca5cef3c1f0e7fa27beae049684","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"测试进货商测试进货商测试进货商测试进货商","salt":"JL0U15jM","userId":"1327853335882641410","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853337556168705","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"联塑","account":"13189619206","password":"0f1529b37668c55225f1771a6fe9e351","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"联塑","salt":"1MZFTiNj","userId":"1327853337132544001","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853338952871937","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"松崎","account":"13189619206","password":"ed939d09c064a770f2da5e6da36ed1be","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"松崎","salt":"rlzqPXie","userId":"1327853338319532034","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853339930144770","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"广东电缆","account":"13189619206","password":"afd72b8f69fcde9a99d2e5e9f674bccd","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"广东电缆","salt":"xKCpMX7z","userId":"1327853339540074497","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853341192630274","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"金材宝","account":"16603096134","password":"04f077416e3eea03ffaf9c8133b74a62","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"金材宝五金+建材+施工+金融一体化服务平台！","salt":"ao7b1Jx4","userId":"1327853340693508098","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853342497058817","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"松本","account":"13189619206","password":"d0e69fc7782a475cfb8324cb51c0825e","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"松本","salt":"BD40tBr2","userId":"1327853341842747393","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853343507886081","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"1","account":"13519441319","password":"920f3d652c4e7db04acb3fd72fb1dca4","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"1","salt":"iZBCaoP9","userId":"1327853343142981633","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853344422244353","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"华盛","account":"13189619206","password":"bdf5b02700fe8ca45f53bca1d72f402a","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"v","salt":"lvJxBk2p","userId":"1327853344048951298","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853345319825409","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"南盛板材","account":"13189619206","password":"ba7404e95b3a956382977028fb4a9593","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"南盛板材","salt":"B3hC4wbN","userId":"1327853344980086785","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853346229989377","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"金联宇","account":"13189619206","password":"ec5b8e9d2eb474bb5f1d391adc9fff81","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"地方","salt":"aeUrNccN","userId":"1327853345856696321","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853347140153345","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"峻泰木业","account":"13189619206","password":"685a196ce701a6b4c0ad92e6e477d611","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"发","salt":"P3MzLMi9","userId":"1327853346775248897","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853348494913538","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"雪玉龙骨","account":"13189619206","password":"2fb7c2960ed1d162b4e2db0c21587d80","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"11","salt":"JY31StkL","userId":"1327853347798659073","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853349505740801","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"阳光水暖","account":"13189619206","password":"cac822a96dd60010dc03bd49de9be3e3","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"阳光水暖","salt":"SJ4I8tcZ","userId":"1327853349077921794","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853350487207938","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"豪迪五金工具","account":"13189619206","password":"41d3b34cec27929d30ee33f0b3051774","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"豪迪五金工具","salt":"wwc9tpAg","userId":"1327853350088749057","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853351498035201","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"永发木业","account":"13189619206","password":"072b50b2ec3c49a19f70232cd6a7d1ae","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"111","salt":"dmcI32n0","userId":"1327853351061827586","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853352836018177","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"康缘板材","account":"13189619206","password":"a3f776f381a2ba5566a0b8ca569ca036","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"123","salt":"RwAYElRV","userId":"1327853352131375106","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853353771347969","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"水中王","account":"13189619206","password":"60b62f481afcd604628c49da5410169c","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"卫浴，水暖","salt":"DSRI8Qyg","userId":"1327853353318363137","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853354786369538","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"华尖","account":"13189619206","password":"7e9f3e3f8d00feca9f12a6a619ad02b7","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"枪钉批发","salt":"ctrRKxXL","userId":"1327853354249498625","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853355696533505","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"东龙力冠龙骨","account":"13189619206","password":"7d03d3d50b6530df47b30f089b6ebdd7","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"龙骨厂家","salt":"BHJqQXZG","userId":"1327853355264520193","isArrivePay":0,"isDistribution":1,"isSinceLift":1},{"id":"1327853356673806337","createBy":null,"createTime":"2020-11-15 13:58:00","updateBy":null,"updateTime":"2020-11-15 13:58:00","name":"金万宇","account":"16603096134","password":"0e41566373d75bc397cdccd79016d105","asynchLogin":null,"logo":null,"status":1,"verifyBy":null,"verifyTime":null,"verifyNote":null,"content":"陈","salt":"qkwV5p2g","userId":"1327853356212432897","isArrivePay":0,"isDistribution":1,"isSinceLift":1}],"timestamp":1605619045848}
module.exports = {
    'get /supplier/list': proxy.get,
    'get /supplier/options': proxy.get,
    // 'get /supplier/options': function (req,res,next) {
    //     res.json(staticResBody)
    // },
    'delete /supplier': proxy.dele,
    'put /supplier/:id': proxy.put,
    'put /supplier/:id/resetPwd': proxy.put,
    'post /supplier': proxy.post,

}
