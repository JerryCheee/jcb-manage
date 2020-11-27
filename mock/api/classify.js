

const proxy = require('../proxyCRUD')
const staticResBody={success:true,result:[
    {
        "id": "1321366747375927298",
        "name": "电动工具",
        "sort": 1,
        "icon": "https://jcb-collect.oss-accelerate.aliyuncs.com/temp/电动工具_1600843388539.png",
        "pid": "0",
        "children": [
          {
            "id": "1321366747472396290",
            "name": "锂电充电式工具",
            "sort": 1,
            "icon": null,
            "pid": "1321366747375927298",
            "children": []
          },
          {
            "id": "1321366747480784897",
            "name": "角向磨光机",
            "sort": 2,
            "icon": null,
            "pid": "1321366747375927298",
            "children": []
          },
          {
            "id": "1321366747480784898",
            "name": "抛光机",
            "sort": 3,
            "icon": null,
            "pid": "1321366747375927298",
            "children": []
          }
        ]
      }
]}
module.exports = {
    'get /product/classify/all': proxy.get,
    'get /product/classify/options':proxy.get,
    // 'get /product/classify/options':function (req,res,next) {
    //     res.json(staticResBody)
    // },
    'post /product/classify': proxy.post,
    'put /product/classify': proxy.put,
    'delete /product/classify':proxy.dele,
}
