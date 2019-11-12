var express = require('express');
var router = express.Router();
const session = require('express-session');
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
  // console.log(req.session)
  if(!req.session.login){
    return res.redirect("/")
  }
  return res.render('product', {title:'product'});
});

router.get('/receipt', function(req, res){
  let { email } = req.session;
  console.log(email);
  return res.render('receipt', {title:'receipt'});
});

router.get('/receipt2', function(req, res){
  let { email } = req.session;
  return res.render('receipt2', {title:'receipt2'});
});

module.exports = router;
