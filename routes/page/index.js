const session = require('express-session');
const users = require('../../models/users')
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //데이터 처리 미들웨어
var path = require('path');

//경로 수정(자신의 basic-network 위치로 지정)
const ccpPath = path.resolve(__dirname, '..', '..', 'fabric-test', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

router.use(bodyParser.urlencoded({ extended: false }));
/* GET home page. */

router.get('/', function (req, res, next) {
  return res.render('index', { title: 'Express' });
});

router.get('/signin', function (req, res) {
  return res.render('signin', { title: 'signin' });
});

router.get('/signup', function (req, res) {
  return res.render('signup', { title: 'signup' });
});

router.get('/product', function (req, res) {
  // console.log(req.session)
  if (!req.session.login) {
    return res.redirect("/")
  }
  return res.render('product.ejs');
});

router.get('/fabric_index', function (req, res) {
  // console.log(req.session)
  if (!req.session.login) {
    return res.redirect("/")
  }
  return res.render('fabric_index', { title: 'fabric_index' });
});


router.get('/receipt', function (req, res) {
  let { email } = req.session;
  // console.log(email);
  return res.render('receipt', { title: 'receipt' });
});

router.get('/receipt2', function (req, res) {
  let { email } = req.session;
  return res.render('receipt2', { title: 'receipt2' });
});
router.post('/api/create/', async function (req, res) {
  try {
    var email = req.session.email
    var product1 = req.body.product1
    var price1 = req.body.price1
    var product2 = req.body.product2
    var price2 = req.body.price2
    var gender;
    var age;

    await users.findOne({ email: email }, function (err, data) {
      if (err) console.log("findoneErr")
      if (!data) console.log("email not found")
      gender = data.gender;
      age = String(data.age);
      // console.log(data.age)
      // console.log(data)
    })
    // console.log(gender)
    if (gender == 0) gender = "male"
    else gender = "female"
    
    // console.log(gender)
    // console.log(age)



    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'fabric/wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
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

    const contractGender = network.getContract('gender');
    const contractAge = network.getContract('age');
    await contractGender.submitTransaction('addGender', gender, product1, price1);
    await contractGender.submitTransaction('addGender', gender, product2, price2);
    await contractAge.submitTransaction('addAge', age, product1, price1);
    await contractAge.submitTransaction('addAge', age, product2, price2);
    console.log('Transaction has been submitted');
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
});

module.exports = router;
