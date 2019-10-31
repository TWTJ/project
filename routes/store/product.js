const express = require('express')
const route = express.Router()
const Product = require('../../models/product')

// all
route.get('/', (req, res) => {
    Product.find((err, data) => {
        return res.status(200).json({
            msg: 'regist all view',
            data
        })
    })
})

// one
route.get('/one', (req, res) => {
    Product.find(
        { _id: req.query.productId }
        , (err, data) => {
        return res.status(200).json({
            msg: 'regist all view',
            data: data ? data[0] : {}
        })
    })
})

route.post('/', (req, res) => {
    let { name, price } = req.body 

    if (!name || !price) {
        return res.status(200).json({
            msg: "필수항목 비어있음"
        })
    }

    // 스키마 인스턴스 생성
    const product = new Product({
        name: name,
        price: price,
        date: new Date()
    }); 

    product.save( (err, data) => {
        console.log(err)
        console.log(data)

        return res.status(201).json({
            msg: 'regist complete'
        })
    })
})

module.exports = route