const express = require('express')
const router = express.Router()
const users = require('../../models/users')
const crypto = require('crypto')
const path = require('path');
const fs = require('fs');
const session = require('express-session');
// const pbkdf2Password = require('pbkdf2-password');
// const hasher = pabkdf2Password();

// get user info
// router.get('/', (req, res) => {
//     return res.status(200).json({
//         msg: 'get user info'
//     })
// })

const { FileSystemWallet, Gateway } = require('fabric-network');

const ccpPath = path.resolve(__dirname, '..','..','fabric-test', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);



// regist user info
router.post('/signup', async (req, res) => {

    //crypt 방식 암호화 
    let body = req.body;
    let inputPassword = body.user_pw; // user 한테 받은 비밀번호를 변수 둠
    let salt = Math.round((new Date().valueOf() * Math.random())) + ""; // salt 생성 
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");  //해쉬 생성 및 소금치기
    var Gender=body.gender
    if(Gender=="0") Gender="male"
    else Gender="female"
    const Email=body.user_email
    const Age=body.user_age

    users.create({
        name: body.user_name,
        Id: body.user_Id,
        password: hashPassword,
        email: body.user_email,
        age: body.user_age,
        gender: body.gender,
        salt: salt

    }).then(result => {
        res.redirect('/signin')

    })
        .catch(err => {
            console.log(err)
        })

    //couchdb로 data insert
    const walletPath = path.join(process.cwd(), 'fabric/wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    const contract = network.getContract('twtj');
    await contract.submitTransaction('initUser', Email, Age, Gender);



})

// user login
router.post('/signin', async function (req, res) {
    let { user_email, user_pw, admin } = req.body;

    if (admin === 'admin') {
        console.log('관계자가 아닙니다')
        return res.status(200).json({});
    }

    /* let result = await users.findOne({
         email: user_email
     });*/
    let result = await users.findOne({ email: user_email }, function (err, cursor) {
        if (!cursor) {
            return res.status(200).json({});
        }

        //cursor.toArray(callback);

    });
    //console.log(result, body)
    let dbPassword = result.password;
    //let inputPassword = body.user_pw;
    let salt = result.salt;
    let hashPassword = crypto.createHash("sha512").update(user_pw + salt).digest("hex");

    if (dbPassword === hashPassword) {
        console.log('로그인 성공')
        req.session.login = true;
        req.session.email = user_email;
        req.session.save(function () {
            return res.status(202).json({});
        })


    } else {
        console.log('비밀번호 불일치')
        return res.status(200).json({});
    }

});

router.post('/fabric_signin', async function (req, res) {
    let { user_email, user_pw, admin } = req.body;

    if (admin !== 'admin') {
        console.log('관계자가 아닙니다')
        return res.status(200).json({});
    }

    let result = await users.findOne({ email: user_email }, function (err, cursor) {
        if (!cursor) {
            return res.status(200).json({});
        }

        /*let result = await users.findOne({
            email: user_email
        */
    });

    //console.log(result, body)
    let dbPassword = result.password;
    //let inputPassword = body.user_pw;
    let salt = result.salt;
    let hashPassword = crypto.createHash("sha512").update(user_pw + salt).digest("hex");

    if (dbPassword === hashPassword) {
        console.log('로그인 성공')
        req.session.login = true;
        req.session.email = user_email;
        req.session.save(function () {
            return res.status(202).json({});
        })


    } else {
        console.log('비밀번호 불일치')
        return res.status(200).json({});
    }

});

/*let body = req.body;

console.log()

let result = await users.findOne({
    email: body.user_email
});
console.log(result, body)
let dbPassword = result.password;
let inputPassword = body.user_pw;
let salt = result.salt;
let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

if (dbPassword === hashPassword) {
    console.log('로그인 성공')
    req.session.login = true;
    req.session.email = body.user_email;
    req.session.save(function(){
        return res.redirect('/fabric_index');
    })
   

} else {

    console.log('비밀번호 불일치')
    res.redirect('/signin')
}
});*/
//user log out   
router.get("/logout", (req, res) => {

    req.session.destroy();
    res.clearCookie('sid');
    res.redirect('/');

    // console.log(res)
})


module.exports = router;