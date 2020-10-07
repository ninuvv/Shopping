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
  res.render('admin/add_product', { admin: true })
})

router.get("/edit_products/:Prodid", async (req, res) => {
  let products = await productHelper.editProductDetails(req.params.Prodid);
  console.log(products);
  res.render('admin/edit_products', { products })
})

router.get("/del_products/:Prodid", function (req, res) {
  let ProdId = req.params.Prodid
  console.log(ProdId)
  productHelper.deleteProduct(ProdId).then((data) => {
    console.log(data)
    res.redirect("/admin")
  })
})

// router.get("/del_products", function (req, res) {
//   console.log(req.query.id)
//   console.log(req.query.name)
// })

router.post("/add_product", function (req, res) {
  productHelper.addProducts(req.body, (result) => {
    let image = req.files.Image
    image.mv('./public/product_images/' + result + '.jpg', (err, done) => {
      if (!err) res.render('admin/add_product', { admin: true })
      else console.log(err)
    })

  })
})

router.post("/edit_products/:Prodid", (req, res) => {
  productHelper.UpdateProdDetsils(req.params.Prodid, req.body).then(() => {
    id=req.params.Prodid
    res.redirect("/admin")
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/product_images/'+id+'.jpg')
    }

  })
})
module.exports = router;
