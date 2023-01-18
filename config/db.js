const mongoose=require("mongoose");

mongoose.set({strictQuery:false});

exports.connectDatabase=()=> {mongoose.connect(process.env.MONGO_URI).then((con)=> console.log("database connected")).catch((err)=>console.log(err));}