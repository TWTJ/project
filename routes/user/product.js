const express = require('express')
const route = express.Router()


route.get('/', (req, res) => {
    return res.status(200).json({
        msg: '제품 리스트 보기'
    })
})






// route.get('/detail', (req, res) => {
//     return res.status(200).json({
//         msg: '특정 제품 보기'
//     })
// })

module.exports = route