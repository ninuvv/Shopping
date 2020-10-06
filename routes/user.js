var express = require('express');
var router = express.Router();
var productHelper = require("../Helpers/ProductHelpers")
var userHelper=require("../Helpers/UserHelpers")

/* GET home page. */
router.get('/', function(req, res, next) {
let user=req.session.user

    productHelper.getallProducts().then((products) => {
    res.render('users/view_products', { products, admin: false,user });
    // res.render('users/view_products', { products, user });
  })

    // res.render('index', {products ,admin:false});
});

router.get('/login',function(req,res){
  res.render('users/login');
})
router.get('/signup',function(req,res){
  res.render('users/signup');
})
router.post('/signup',(req,res)=>{
  userHelper.doSignUp(req.body).then ((response)=>{
    console.log(response)
  })
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    // console.log(response)
    if (response.status){
      req.session.loggedin=true;
      req.session.user=response.user;
      res.redirect('/')
    }else{res.redirect('/login')}
  })
})


router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/login')
})
module.exports = router;
