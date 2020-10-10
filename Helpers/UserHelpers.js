
var db = require("../Config/connection")
var collection = require("../Config/collections")
// var bcyrpt = require("bcrpyt")
var bcrypt = require("bcrypt")
const collections = require("../Config/collections")
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
            let usercart = await db.get().collection(collection.CART_COLLECTION).findOne({ userId: ObjId(User_id) })

            if (usercart) {
                db.get().collection(collections.CART_COLLECTION).updateOne(
                    { userId: ObjId(User_id) }, {
                    $push: { productsId: ObjId(Prod_id) }
                }).then((response) => {
                    resolve()
                })

            } else {
                let cartObj = {
                    userId: ObjId(User_id),
                    productsId: [ObjId(Prod_id)]
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
                {
                    $match: { userId: ObjId(User_id) }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTIONS,
                        let: { prodLists:'$productsId'},
                        pipeline: [{
                            $match: { $expr: { $in: ['$_id', "$$prodLists"] } }
                        }],
                        as: 'cartItems'
                    }
                }
            ]).toArray()
            // resolve(cartItems)
            resolve(cartItems[0].cartItems)
        })
    }
}