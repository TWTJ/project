var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./models'); // db 모듈 불러오기
var bodyParser = require('body-parser'); //데이터 처리 미들웨어

var PAGEAPI = require('./routes/page');
var STOREAPI = require('./routes/store');
var USERAPI = require('./routes/user');
var app = express();
var session = require('express-session'); // log-in session
var FileStore = require('session-file-store')(session);

//db 연결
db();

//hyperledger fabric 연결 
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));

//경로 수정(자신의 basic-network 위치로 지정)
const ccpPath = path.resolve(__dirname, 'fabric-test', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


//Attach the middleware
app.get('/fabric_index', function (req, res) {
  fs.readFile('views/fabric_index.ejs', function (error, data) {
    res.send(data.toString());

  });
});

app.get('/api/querycar/', async function (req, res) {
  // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
  try {
    var carno = req.query.carno;
    console.log(carno);

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

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('fabcar');

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('queryCar', carno);

    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.status(200).json({ response: result.toString() });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
});

app.get('/api/createuser', function (req, res) {
  fs.readFile('fabric/createuser.html', function (error, data) {
    res.send(data.toString());

  });
});

app.post('/api/createuser/', async function (req, res) {
  try {
    var Email = req.body.email;
    var Age = req.body.age;
    var Gender = req.body.gender;
    var Product = req.body.product;
    var Price = req.body.price;

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

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('twtj');
    const contractGender = network.getContract('gender');
    const contractAge = network.getContract('age');

    // Submit the specified transaction.
    // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
    // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
    //        await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
    await contract.submitTransaction('initUser', Email, Age, Gender);
    await contractGender.submitTransaction('addGender', Gender, Product, Price);
    await contractAge.submitTransaction('addAge', Age, Product, Price);

    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    await gateway.disconnect();

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }

});

// app.post('/api/create/', async function (req, res) {
//     var Email=req.session
//     // var Product1 = req.body.product1;
//     // var Price1 = req.body.price1;
//     // var Product2 = req.body.product2;
//     // var Price2 = req.body.price2;
//     console.log(Email)
//     // console.log(Product1)
//     // console.log(500)

// });



//========================================================
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
//session 미들웨어 설정
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  },
  store: new FileStore()

}));
app.use('/', PAGEAPI);
app.use('/API_STORE', STOREAPI);
app.use('/API_USER', USERAPI);
app.use('/signin', PAGEAPI);
app.use('/signup', PAGEAPI);
app.use('/product', PAGEAPI);
app.use('/receipt', PAGEAPI);
app.use('/receipt2', PAGEAPI);
app.use('/fabric_index', PAGEAPI);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

