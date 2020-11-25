
var db = require("../Config/connection")
var collection = require("../Config/collections")
// var bcyrpt = require("bcrpyt")
var bcrypt = require("bcrypt")
const collections = require("../Config/collections")
const { ResumeToken } = require("mongodb")
var ObjId = require("mongodb").ObjectID


module.exports = {
    doSignUp: (userdata) => {
        return new Promise(async (resolve, reject) => {
            userdata.password = await bcrypt.hash(userdata.password, 10)
            db.get().collection(collection.USER_COLECTION).insertOne(userdata).then((data) => {
                resolve(data.ops[0])
            })

        })
    },
    doLogin: (userdata) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLECTION).findOne({ first_name: userdata.username })
            if (user) {
                bcrypt.compare(userdata.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    }
                    else {
                        console.log("login failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failed")
                resolve({ status: false })
            }
        })
    },
    addToCart: (Prod_id, User_id) => {

        return new Promise(async (resolve, reject) => {
            let ProObj = {
                item: ObjId(Prod_id),
                quantity: 1
            }
            let usercart = await db.get().collection(collection.CART_COLLECTION).findOne({ userId: ObjId(User_id) })
            console.log(usercart)

            if (usercart) {

                let proExists = usercart.products.findIndex(product => product.item == Prod_id)

                if (proExists != -1) {
                    db.get().collection(collections.CART_COLLECTION).
                        updateOne(
                            { userId: ObjId(User_id), 'products.item': ObjId(Prod_id) },
                            { $inc: { 'products.$.quantity': 1 } }
                        ).then(() => {
                            resolve()
                        })
                }
                else {
                    db.get().collection(collections.CART_COLLECTION)
                        .updateOne(
                            { userId: ObjId(User_id) },
                            { $push: { products: ProObj } }
                        ).then((response) => {
                            resolve()
                        })
                }
            } else {
                let cartObj = {
                    userId: ObjId(User_id),
                    products: [ProObj]
                }
                db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })

    },
    getCartDetails: (User_id) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([
                { $match: { userId: ObjId(User_id) } },
                { $unwind: '$products' },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTIONS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project: { item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] } }
                }
                // {
                //     $lookup: {
                //         from: collections.PRODUCT_COLLECTIONS,
                //         let: { prodLists: '$productsId' },
                //         pipeline: [{
                //             $match: { $expr: { $in: ['$_id', "$$prodLists"] } }
                //         }],
                //         as: 'cartItems'
                //     }
                // }
            ]).toArray()
            // console.log(cartItems)
            // console.log(cartItems[0].product)
            resolve(cartItems)
        })
    },
    getCardCount: (User_id) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db.get().collection(collections.CART_COLLECTION).findOne({ userId: ObjId(User_id) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },
    changeQuantity: (details) => {
        return new Promise((resolve, reject) => {


            if ((parseInt(details.count) == -1) && (parseInt(details.quantity) == 1)) {

                db.get().collection(collections.CART_COLLECTION).updateOne(
                    { _id: ObjId(details.cart) },
                    { $pull: { products: { item: ObjId(details.product) } } }
                ).then((respose) => {
                    resolve({ removeProduct: true })
                })
            } else {
                db.get().collection(collections.CART_COLLECTION).
                    updateOne(
                        { _id: ObjId(details.cart), 'products.item': ObjId(details.product) },
                        { $inc: { 'products.$.quantity': parseInt(details.count) } }
                    ).then((response) => {
                        resolve({ statu: true })
                    })
            }

        })
    },
    getTotalAmount: (User_id) => {
        return new Promise(async (resolve, reject) => {
          let  total = await db.get().collection(collections.CART_COLLECTION).aggregate([
                { $match: { userId: ObjId(User_id) } },
                { $unwind: '$products' },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTIONS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project: { item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] } }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                    }
                }

            ]).toArray()
            console.log(total[0].total)
            resolve(total[0].total)
        })
    },
    placeOrder: (order, product, total) => {
        return new Promise((resolve, reject) => {
            let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliverydetails: {
                    address: order.address,
                    pincode: order.pincode,
                    mob: order.mob
                },
                userId: ObjId(order.userId),
                paymentMethod: order['payment-method'],
                products: product,
                totalAmt: total,
                status: status,
                date: new Date()
            }
            db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collections.CART_COLLECTION).removeOne({ userId: ObjId(order.userId) })
                resolve()
            })
        })

    },

    getcartProductDetails: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = ""
            cart = await db.get().collection(collections.CART_COLLECTION).findOne({ userId: ObjId(userId) })

            console.log('cart' + cart.products)
            resolve(cart.products)


        })
    },
    getOrder: (userId) => {
        return new Promise(async (resolve, reject) => {            
            let order = await db.get().collection(collections.ORDER_COLLECTION).find({userId: ObjId(userId)}).toArray()
            // console.log(order)
            resolve(order)
        })
    },
    getOrderProduct: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let cartOrders = await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                { $match: { _id: ObjId(orderId) } },
                { $unwind: '$products' },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTIONS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'

                    }
                },
                {
                    $project: { item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] } }
                }

            ]).toArray()
              console.log(cartOrders)
            resolve(cartOrders)
        })
    }
}