 
const state={db:null}
const monogoClient=require('mongodb').MongoClient 

module.exports.Connection=function(done){
    const url="mongodb://localhost:27017"
    const dbname="Shopping"

    monogoClient.connect(url,{useUnifiedTopology: true},(err,data)=>{
        if (err) return done(err)
        state.db=data.db(dbname)
          done()
       } )
     
}
module.exports.get=function(){ return state.db}