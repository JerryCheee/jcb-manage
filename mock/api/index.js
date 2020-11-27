var express = require('express')
var http = require('request')
var router = express.Router()
const multer = require('multer');
const upload = multer();


// This condition actually should detect if it's an Node environment
if (typeof require.context === 'undefined') {
    const fs = require('fs');
    const path = require('path');
    require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
        const files = {};
        function readDirectory(directory) {
            fs.readdirSync(directory).forEach((file) => {
                const fullPath = path.resolve(directory, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    if (scanSubDirectories) readDirectory(fullPath);
                    return;
                }
                if (!regularExpression.test(fullPath)) return;
                files[fullPath] = true;
            });
        }
        readDirectory(path.resolve(__dirname, base));
        function Module(file) {
            return require(file);
        }
        Module.keys = () => Object.keys(files);
        return Module;
    };
}
importAll(require.context('./', false, /\.js$/))

function importAll(r) {
    r.keys().forEach(key => {
        let m = r(key)
        Object.entries(m).forEach(register)
    });

}
function register([key, handler]) {
    let [method, url] = key.split(' ')
    // console.log(method, url)
    router[method](url, handler)
}
router.post('/sys/common/upload', upload.any(), function (req, res, next) {
    return res.json({
        code: 0,
        message: "https://jcb-collect.oss-accelerate.aliyuncs.com/temp/news_card_1603934484267.jpg",
        result: null,
        success: true,
        timestamp: 1603934484255
    })
    http.post('http://192.168.2.173:8080/jcb-collect/sys/common/upload', {
        headers: { 'x-access-token': req.headers['x-access-token'], 'Content-Type': 'multipart/form-data' },
        formData: {
            ...req.body,
            file: {
                value: req.files[0].buffer,
                options: { filename: req.files[0].originalname }
            },
        }
    }, function (err, se, body) {
        res.send(body)

    })



})
module.exports = router;