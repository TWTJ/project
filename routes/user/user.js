const express = require('express')
const router = express.Router()
const users = require('../../models/users')
const crypto = require('crypto')
// const pbkdf2Password = require('pbkdf2-password');
// const hasher = pabkdf2Password();

// get user info
router.get('/', (req, res) => {
    return res.status(200).json({
        msg: 'get user info'
    })
})

// regist user info
router.post('/signup', (req, res) => {

    //crypt 방식 암호화 
    let body = req.body;
    let inputPassword = body.user_pw; // user 한테 받은 비밀번호를 변수 둠
    let salt = Math.round((new Date().valueOf() * Math.random())) + ""; // salt 생성 
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");  //해쉬 생성 및 소금치기

    users.create({
        name: body.user_name,
        Id: body.user_Id,
        password: hashPassword,
        email: body.user_email,
        salt: salt
    }).then(result => {
        res.redirect('/signin')

    })
        .catch(err => {
            console.log(err)
        })

})

// user login
router.post('/signin', async function (req, res){
    let body = req.body;

    let result = await users.findOne({
            email:body.user_email
    });
    console.log(result, body)
    let dbPassword = result.password;
    let inputPassword =body.user_pw;
    let salt = result.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    if (dbPassword === hashPassword) {
        console.log ('로그인 성공')
        res.redirect('/');
        alert(" 로그인성공 ")
    }else {
        console.log('비밀번호 불일치')
        res.redirect('/signin')
        alert("비밀번호가 맞지 않습니다")
    }

});

module.exports = router;