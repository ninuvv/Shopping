
var db = require("../Config/connection")
var collection=require("../Config/collections")


module.exports = {
    addProducts: (product, callback) => {      
        db.get().collection(collection.PRODUCT_COLLECTIONS).insertOne(product).then((data) => {
            // console.log(data)
            callback(data.ops[0]._id)
        })
    },
getallProducts:()=>{
    return new Promise(async(resolve,reject)=>{
let products= await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray();
resolve(products)
    })
}
}