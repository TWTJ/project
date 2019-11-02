const express = require('express')
const route = express.Router()

// const bucket = require('./bucket.js') -> 장바구니 취소 
const product = require('./product.js')
const user = require('./user.js')
const payment = require('./payment.js')

// route.use('/bucket', bucket) -> 장바구니 취소 
route.use('/product', product)
route.use('/user', user)
route.use('/payment', payment)

module.exports = route