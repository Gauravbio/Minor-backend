const mongoose=require("mongoose");

mongoose.set({strictQuery:false});

exports.connectDatabase=()=> {mongoose.connect("mongodb+srv://Gaurav:g6p25p2v11@cluster0.cte7qkn.mongodb.net/Minor?retryWrites=true&w=majority").then((con)=> console.log("database connected")).catch((err)=>console.log(err));}