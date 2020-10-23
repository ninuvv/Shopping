
var db = require("../Config/connection")
var collection = require("../Config/collections")
var ObjId=require("mongodb").ObjectID


module.exports = {
    addProducts: (product, callback) => {
        product.price=parseInt(product.price)
        db.get().collection(collection.PRODUCT_COLLECTIONS).insertOne(product).then((data) => {
            // console.log(data)
            callback(data.ops[0]._id)
        })
    },
    getallProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray();
            resolve(products)
        })
    },
    deleteProduct:(ProdId)=>{
        return new Promise( (resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTIONS).removeOne({_id:ObjId(ProdId)}).then((data)=>{
                resolve(data)
            })
            
        })
    },
    editProductDetails:(ProdId)=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id:ObjId(ProdId)})
            resolve(products)
        })
    },
    UpdateProdDetsils:(ProdId,proDetails)=>{
            return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS)
            .updateOne({_id:ObjId(ProdId)},{
                $set:{
                    name:proDetails.name,
                    cate:proDetails.cate,
                    price:parseInt(proDetails.price),
                    desc:proDetails.desc
                }                              
            }) .then((resp)=>{
                resolve()
            })
        })
    }
}