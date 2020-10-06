var express = require('express');
var router = express.Router();
var productHelper = require("../Helpers/ProductHelpers")

/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getallProducts().then((products) => {
    res.render('admin/view_product', { products, admin: true });
  })


});
router.get("/add_product", function (req, res) {
  res.render('admin/add_product',{admin:true})
})

router.post("/add_product", function (req, res) {
  // console.log(req.body);
  // console.log(req.files.Image)
 
  productHelper.addProducts(req.body, (result) => {
    let image = req.files.Image
    image.mv('./public/product_images/' + result + '.jpg', (err, done) => {
      if (!err) res.render('admin/add_product',{admin:true})
      else console.log(err)
    })

  })
})
module.exports = router;
