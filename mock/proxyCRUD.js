var http = require('./axiosIns').instans
module.exports = {
    get: async function (req, res, next) {
        let config = {
            method: 'get',
            url: req.originalUrl,
            headers: req.headers
        }
        let r = await http(config)
        res.json(r.data)
    },
    post:  async function (req, res, next) {
        let config = {
            method: 'post',
            url: req.originalUrl,
            data: JSON.stringify(req.body),
            headers: req.headers
        }
        let r = await http(config)
        res.json(r.data)

    },
    put:async function (req, res, next) {
        let config = {
            method: 'put',
            url: req.originalUrl,
            data: JSON.stringify(req.body),
            headers: req.headers
        }
        let r = await http(config) 
        res.json(r.data)

    },
    dele:async function (req, res, next) {

        let config = {
            method: 'delete',
            url: req.originalUrl,
            headers: req.headers
        }
        let r = await http(config) 
        res.json(r.data)

    }
}