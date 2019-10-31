const express = require('express')
const route = express.Router()
const users = require('../../models/users')
// const pbkdf2Password = require('pbkdf2-password');
// const hasher = pabkdf2Password();

// get user info
route.get('/', (req, res) => {
    return res.status(200).json({
        msg: 'get user info'
    })
})

// regist user info
route.post('/sign_up', (req, res) => {
    let body = req.body;
    console.log(body)
    users.create({
        name: body.user_name,
        Id: body.user_Id,
        password: body.user_pw,
        email: body.user_email
    })
        .then(result => {
            res.redirect('/signin')
        })
        .catch(err => {
            console.log(err)
        })

})

// user login
route.post('/signin', (req, res) => {
    return res.status(201).json({
        msg: 'user signin'
    })
})


module.exports = route