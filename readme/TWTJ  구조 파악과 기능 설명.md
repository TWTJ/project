## "TWTJ"  구조 파악과 기능 설명

### 목차

* DB(models )  - db 연결, 스키마, mongo compase 
* Router (routes) - 회원 가입 (암호화) , 로그인 (session), 로그아웃 

* view (템플릿 엔진)

* app.js - 간단한 module 설명

  ----

  ##### <u>DB(models/index)</u>

  ~~~
  npm i mongoose
  ~~~

  

  ~~~javascript
  const mongoose = require('mongoose');
  
  module.exports = () => {
    function connect() {
      mongoose.connect('mongodb://127.0.0.1:27017/TWTJDB', (err) => {
        if (err) {
          console.error('mongodb connection error', err);
        }
        console.log('mongodb connected');
      });
    }
    connect();
    //mongoose.connection.on('disconnected', connect);
    //require('./product.js'); 
  };
  
  
  
  ~~~

  index 부분은 MongoDB와 연결하는 부분이다. MongoDB에서 제공하는 localhost 와 port 번호를 이용하여 프로젝트 (TWTJDB)와 연결하는 부분을 알수 있다.  몽구스는Node.js를 모델링한다.  몽고디비는 릴레이션이 아니라 다큐먼트를 사용하므로 ORM이 아닌 ODM이다. 몽구스의 특징중 하나는 "스키마"다. 몽고디비는 데이블이 없어서 자유롭게 데이터를 넣을수 있지만 때로는 자유로움이 불편함을 초래한다. 실수로 잘못된 자료형의 데이터를 넣을 수도 있고 다른 다큐먼트에는 없는 필드의 데이터를 넣을 수 도 있다. 그러나 몽구스는 몽고디비에 데이터를 넣기 전 '노드 서버' 단에서 데이터를 한번 필터링 하는 역할을 해준다

  ##### <u>DB(models/products.js)</u>

  ~~~javascript
  const mongoose = require('mongoose');
  
  const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    date: Date
  });
  
  module.exports = mongoose.model('product', productSchema);
  
  ~~~

  product.js에서는 db에 저장할 product 정보를 설정해 주는 부분이다. product Id 부분을 string(문자)로 지정해 주고 , price 를 Number(숫자) 로 저장 하겠다고 스키마를 설정하는 부분이다.

  ##### <u>DB(moedels/users.js)</u>

  ~~~javascript
  const mongoose = require('mongoose');
  
  const userSchema = new mongoose.Schema({
    name: String,
    Id:String,
    email: String,
    password: String,
    salt : String
     
  });
  
  module.exports = mongoose.model('user', userSchema);
  
  ~~~

  회원가입하는 user들의 스키마를 설정하는 파일이다. 대부분 알 수 있듯이 이름, 아이디, 이메일, 비밀번호를 만들었고, salt는 회원가입하는 user의 비밀번호를 암호화할때 생기는 분인데, 이 부분은 라우터(회원가입)시 설명하겠다.

  

  <u>(참고)  MongoDB에 대해 간략히 설명 하겠다.</u>

  

  MySQL은 SQL을 사용하는 대표적인 db이며, SQL을 사용하지 않는  NoSQL이라고 부르는 데이터베이스로 대표적인 db는 이번 프로젝트에서 활용한 MongoDB다.

  NoSQL 특징

  - 자유로운 데이터 입력
  - 컬렉션 간 JOIN 미지원
  - 트랜젝션 미지원
  - 확장성, 가용성
  - 용어(컬렉션, 다큐먼트, 필드)

  먼저 NoSQL에는 고정된 테이블이 없다. 테이블에 상응하는 컬렉션이라는 개념이 있긴 하지만 컬럼을 따로 정의하지는 않는다. 몽고디비는 그냥 collection을 생성하고 어떠한 데이터라도 들어 갈 수 있다.  JOIN 및 트랙젝션이 되지 않지만 몽고디비를 사용하는 이유는 확장성과 가용성 때문이다. 데이터의 일관성을 보장해주는 기능이 약한 대신 데이터를 빠르게 넣을 수 있고, 쉽게 여러 서버에 데이터를 분산할 수 있다.  SQL과NOSQL에는 장/단점을 잘 이용해 기업에서는 동시에 사용하는 경우가 많다.

  

  - 몽고디비 다운로드

  > MongoDB는 https://www.mongodb.com/download-center/enterprise 여기서 받을 수 있고, 환경에 맞는 OS 를 선택하면 쉽게 다운로드 받을 수 있다. ( 참고) mongodb에서는 atlas라는 cloud도 제공하는데 필요시 이용하면 좋을 것 같다. 이번 프로젝트에서는 직접 다운받아 프로젝트를 진행 했다.

  - 몽고디비 compass 설치하기

  > 몽고디비는 관리 도구로 컴퍼스를 제공한다. 컴퍼스를 사용하면 GUI를 통해 데이터를 시각적으로 관리할 수 있어 편리하다. (필수적인 것은 아니며 콘솔로도 같은 작업을 할 수 있다.)  몽고디비 계정 이름과 비밀번호를 입력하고, localhost:27017에 접속하면 된다.  

  

  - 몽고디비에서 CRUD 작업해보기 (compass에서 확인 가능)

  > db 명령어들은 구글 에서 참고하면 좋다.
  >
  > <ul>create (생성)</ul> 
  >
  > db.컬렉션명.save(다큐먼트) -> 다큐먼트를 생성할 수 있다. 자바스크립트 객체처럼 생성 하면 된다.
  >
  > <ul>Read (조회)</ul>
  >
  > db.컬렉션명.find()  ex) db.users.find({_id:0, name:1, married: 1}) 
  >
  > find({})는 컬렉션 내의 모든 다큐먼트를 조회하라는 뜻이다. 1 또는 trure 값으로 데이터를 불러올지 말지를 설정 할 수 있다.즉 find 메서드의 두 번째 인자로 조회할 필드를 넣었다. 
  >
  > (조회시 조건을 주려면 첫 번째 인자 객체에 기입하면 된다. 예를 들면 age가 30초과, married가 true인 다큐먼트의 이름과 나이를 조회한다면 
  >
  > db.users.find({age: {$gt:30}, married: true}, { _id:0, name:1, age:1});
  >
  > <ul>Update(수정)</ul>
  >
  > db.컬렉션명.update()
  >
  > 수정할때는 $set 라는 연산자가 사용된다. 첫번째 객체는 수정할 다큐먼트를 지정하는 객체고, 두번째객체는 수정할 내용을 입력하는 객체다.
  >
  > <ul>Delete(삭제)</ul>
  > db.컬렉션명.remove() 

  

  ##### Router(routes/page/index.js)

  ~~~javascript
  var express = require('express');
  var router = express.Router();
  
  /* GET home page. */
  
  router.get('/', function(req, res, next) {
    return res.render('index', { title: 'Express' });
  });
  
  router.get('/signin', function(req, res){
    return res.render('signin', {title:'signin'});
  });
  
  router.get('/signup', function(req, res){
    return res.render('signup', {title:'signup'});
  });
  
  router.get('/product', function(req, res){
    // log-in 하지 않으면 product 페이지를 들어갈 수 없게 만든 코드.
    if(!req.session.login){
      return res.redirect("/")
    } // seesion에 값이 일치하지 않으면 redirect 메인페이지
    return res.render('product', {title:'product'});
  }); //성공시 render -> product 페이지
  
  
  module.exports = router;
  
  ~~~

  page/index.js는 view의 page들을 여는  router다.  get 방식으로 받아 뿌려주는 역할을 한다.

  

  ##### Router(routes/user/users.js)

  ~~~javascript
  const express = require('express')
  const router = express.Router()
  const users = require('../../models/users')
  const crypto = require('crypto')
  const session = require('express-session');
  
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
  router.post('/signin', async function (req, res) {
      let body = req.body;
  
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
              return res.redirect('/product');
          })
         
  
      } else {
  
          console.log('비밀번호 불일치')
          res.redirect('/signin')
      }
  });
  //user log out   
  router.get("/logout", (req, res) => {
  
      req.session.destroy();
      res.clearCookie('sid');
      res.redirect('/');
  
      // console.log(res)
  })
  
  
  module.exports = router;
  
  
  ~~~

  

   

  

  

  

  

  

  

  

  

  







