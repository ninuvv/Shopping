var express = require('express');
var router = express.Router();
var productHelper = require("../Helpers/ProductHelpers")
var userHelper=require("../Helpers/UserHelpers")


const verifyLogin=(req,res,next)=>{
  if ( req.session.loggedin){next()}
  else {res.redirect("/login")}
}
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
  if ( req.session.loggedin){
    res.redirect("/");
  }else{
   
     res.render('users/login',{"loginErr":req.session.loginErr});
     req.session.loginErr=false;
     }
 
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
    }else{
           req.session.loginErr="Invalid user name and password"; 
      res.redirect('/login');

    }
  })
})


router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/login')
})

router.get('/cart',verifyLogin,(req,res)=>{
  res.render('users/cart');
})
module.exports = router;
