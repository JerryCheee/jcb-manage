const domain = 'http://192.168.2.173:8001' // 局域网测试
    // const domain = 'http://192.168.2.117:8080'// 局域网测试
    // const domain = 'https://www.youfuchaye.com'//正式服
    // const domain = `${window.location.origin.split(':')[1]}:4396`//mock 服务
    // const domain = 'https://china-jcb.com' ///测试服
export default {
    ApiDomain: domain,
    /**项目启动目录*/
    basePath: '/manage',
    /**图片上传接口 */
    uploadUrl: `${domain}/jcb-collect/sys/common/upload`,
    /**菜单专用 小于100的都不要，留给旧项目 */
    MinMenuSort: 100,
    maxSpecifyNum: 3, //最多可添加规格数量，目前允许三个
}