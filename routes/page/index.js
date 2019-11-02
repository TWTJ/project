var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res){
    res.render('signin', {title:'signin'});
});

router.get('/signup', function(req, res){
    res.render('signup', {title:'signup'});
});
router.get('/product', function(req, res){
  res.render('product', {title:'product'});
});


module.exports = router;
