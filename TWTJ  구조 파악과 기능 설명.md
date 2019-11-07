## "TWTJ"  구조 파악과 기능 설명

### 목차

* DB(models )  - db 연결, 스키마, mongo compase 
* Router (routes) - 회원 가입 (암호화) , 로그인 (session), 로그아웃 

* view (템플릿 엔진)

* app.js - 간단한 module 설명

  ----

  ##### <u>DB(models/index)</u>

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

  index 부분은 MongoDB와 연결하는 부분이다. MongoDB에서 제공하는 localhost 와 port 번호를 이용하여 프로젝트 (TWTJDB)와 연결하는 부분을 알수 있다.

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

  * 몽고디비 다운로드
  * 

  MySQL은 SQL을 사용하는 대표적인 db이며, SQL을 사용하지 않는  NoSQL이라고 부르는 데이터베이스로 대표적인 db는 이번 프로젝트에서 활용한 MongoDB다.  

   MongoDB는 https://www.mongodb.com/download-center/enterprise 여기서 받을 수 있고, 환경에 맞는 OS 를 선택하면 쉽게 다운로드 받을 수 있다. ( 참고) mongodb에서는 atlas라는 cloud도 제공하는데 필요시 이용하면 좋을 것 같다. 이번 프로젝트에서는 직접 다운받아 프로젝트를 진행 했다.

  

  

  

  

  

  

  

  

  

  

  

  

  

  







