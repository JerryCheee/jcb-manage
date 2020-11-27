
var http = require('http');
var express = require('express');
var apis = require('./api/index');


var app = express();
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,X-Access-Token");
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Max-Age","600")//600秒=10分钟 减少option请求
    // console.log(req.url,req.body,req.query,req.params);//如果出现500  可以取消注释，看看打印结果是否符合预期
    if (req.method === 'OPTIONS') {//浏览器处理跨域原理，发出请求前先发出一个option请求 询问是否允许
        res.sendStatus(200)
    } else {
        next();
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));


app.use('/jcb-collect', apis)
// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.send('error');
});
var port = '4396'
app.set('port', port);
var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('List dening on ' + bind);
}