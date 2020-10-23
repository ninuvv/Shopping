var express = require('express');
var router = express.Router();
var productHelper = require("../Helpers/ProductHelpers");

var userHelper = require("../Helpers/UserHelpers")
var ObjId = require("mongodb").ObjectID

const verifyLogin = (req, res, next) => {
  if (req.session.loggedin) { next() }
  else { res.redirect("/login") }
}
/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user

  let cartCount = null
  if (user) {
    cartCount = await userHelper.getCardCount(user._id)
  }

  productHelper.getallProducts().then((products) => {
    res.render('users/view_products', { products, admin: false, user, cartCount });
    // res.render('users/view_products', { products, user });
  })

});

router.get('/login', function (req, res) {
  if (req.session.loggedin) {
    res.redirect("/");
  } else {

    res.render('users/login', { "loginErr": req.session.loginErr });
    req.session.loginErr = false;
  }

})
router.get('/signup', function (req, res) {
  res.render('users/signup');
})
router.post('/signup', (req, res) => {
  userHelper.doSignUp(req.body).then((response) => {
    console.log(response)
    req.session.loggedin = true;
    req.session.user = response;
    res.redirect('/')
  })
})
router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    // console.log(response)
    if (response.status) {
      req.session.loggedin = true;
      req.session.user = response.user;
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid user name and password";
      res.redirect('/login');

    }
  })
})


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login')
})

router.get('/cart', verifyLogin, async (req, res) => {
  let Products = await userHelper.getCartDetails(req.session.user._id)
  let totalAmt = await userHelper.getTotalAmount(req.session.user._id)
  res.render('users/cart', { Products, user: req.session.user, totalAmt });


})


router.get('/add_to_cart/:id', (req, res) => {
  console.log("API Call")
  userHelper.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true })
    // res.redirect('/')
  })
})

router.post('/change_product_quantity', (req, res) => {
  userHelper.changeQuantity(req.body).then(async (response) => {
    let totalAmt = await userHelper.getTotalAmount(req.body.userId)
    response.total = totalAmt
    res.json(response)
  })

})

router.get('/place_order', verifyLogin, async (req, res) => {
  let Total = await userHelper.getTotalAmount(req.session.user._id)
  res.render('users/place_order', { Total, user :req.session.user })
})

router.post('/place_order', verifyLogin, async(req, res) => {
  let products = await userHelper.getcartProductDetails(req.body.userId)
  let Total = await userHelper.getTotalAmount(req.body.userId)
  userHelper.placeOrder(req.body, products, Total).then((response) => {
res.json({status:true})
  })
})
module.exports = router;
