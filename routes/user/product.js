const express = require('express')
const router = express.Router()
const product = require('../../models/product')

router.get('/product1', (req, res) => {

    product.findOne({
        name: "sample1"
    }).then(result => {
        return res.json(result)
    }).catch(err => {
        console.log(err)
    })




})









// route.get('/detail', (req, res) => {
//     return res.status(200).json({
//         msg: '특정 제품 보기'
//     })
// })

module.exports = router ;