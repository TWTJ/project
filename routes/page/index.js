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
  // console.log(req.session)
  if(!req.session.login){
    return res.redirect("/")
  }
  return res.render('product', {title:'product'});
});


module.exports = router;
