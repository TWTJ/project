const express = require('express')
const route = express.Router()

route.get('/', (req, res) => {
    return res.status(200).json({
        msg: '결제보기'
    }) 
})

route.post('/', (req, res) => {
    return res.status(201).json({
        msg: '결제하기'
    }) 
})

module.exports = route