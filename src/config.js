const { name } = require("ejs");
const mongoose =require("mongoose")
const connect = mongoose.connect("mongodb://localhost:27017/login");

// check database connected or not
connect.then(()=>{
    console.log("database successfully connected");
})
.catch(()=>{
    connect.log("database cannot be connected")
});

//crete schema
const Loginschema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required :true
    }
   
});

//collection 
const collection = new mongoose.model("users",Loginschema);
module.exports=collection;
