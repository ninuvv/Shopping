var express = require('express');
var router = express.Router();
var productHelper = require("../Helpers/ProductHelpers")

/* GET home page. */
router.get('/', function(req, res, next) {

  // let products=[
  //   {
  //     name:"iPhonex",
  //     category:"Mobile",
  //     decription:"Apple latest version",
  //     img:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTfVuSswKHjafJRs0rWLSVORoW81JZ4YnXHrxpaLjo51TiyJYm_ioQees0mHwnv-L9c6-BkEn1k&usqp=CAc",
  //   },
  //   {
  //     name:"huawei p20 pro",
  //     category:"Mobile",
  //     decription:"Long battery life, Good value for money, Design, Performance, Good screen",
  //     img:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS5QEv-caleX6mA795O0snu6z6JJLD8KY6QT5xAQyrB6JEEWosxuNgj-ZfisQ&usqp=CAc",
  //   },
  //   {
  //     name:"Samsung",
  //     category:"Mobile",
  //     decription:"lens improved",
  //     img:"https://images-na.ssl-images-amazon.com/images/I/71wPwmxo2NL._SL1500_.jpg"
  //   },
  //   {
  //     name:"OPPO",
  //     category:"Mobile",
  //     decription:"4GB memory",
  //     img:"https://www.91-img.com/pictures/133188-v4-oppo-f11-mobile-phone-large-1.jpg?tr=q-60",
  //   }
  // ]

  productHelper.getallProducts().then((products) => {
    res.render('users/view_products', { products, admin: false });
  })

    // res.render('index', {products ,admin:false});
});

module.exports = router;
