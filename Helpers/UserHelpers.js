
var db = require("../Config/connection")
var collection = require("../Config/collections")
// var bcyrpt = require("bcrpyt")
var bcrypt = require("bcrypt")


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
                    if (status)
                        {console.log("login success");
                        response.user=user;
                        response.status=true;
                        resolve(response)
                    }
                    else
                      {  console.log("login failed");
                      resolve({status:false})
                    }
                })
            } else{
                console.log("login failed")
                resolve({status:false})
            }
        })
    }
}