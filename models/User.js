const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"please enter email"]
    },
    password:{
        type:String,
        required:[true,"please enter password"]
    },
    role:{
        type:String,
        default:"user"
    },
    playlists:[
        {
            url:String,
        }
    ],
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

userSchema.pre('save',async function(next) {
    if(this.isModified("password")) {
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
})

userSchema.methods.getResetPasswordToken=function() {
    const resetToken=crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordExpire=Date.now()+10*60*1000;

    return resetToken;
}

module.exports=mongoose.model("User",userSchema);