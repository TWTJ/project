const express = require('express')
const route = express.Router()

// get user info
route.get('/', (req, res) => {
    return res.status(200).json({
        msg: 'get user info'
    })
})

// regist user info
route.post('/', (req, res) => {
    return res.status(201).json({
        msg: 'regist user info'
    })
})

// user login
route.post('/login', (req, res) => {
    return res.status(201).json({
        msg: 'user login'
    })
})

module.exports = route