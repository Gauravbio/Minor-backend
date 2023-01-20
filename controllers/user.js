const jwt = require("jsonwebtoken");
const User=require("../models/User")
const {generateToken, matchPassword}=require("../utils/auth");

//expire karo

exports.signup=async (req,res) => {
    try {
        const {email,password}=req.body;

        const exist=await User.findOne({email});
        if(exist) return res.status(400).json({
            success:false,
            message:"User already exist"
        })

        const newUser=await User.create({
            email:email,
            password:password
        })

        const token=await generateToken(newUser);
        return res.status(201).json({
            success:true,
            message:"registered successfully",
            newUser,
            token
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.login=async (req,res)=> {
    try {
        const {email,password}=req.body;

        const exist=await User.findOne({email});
        if(!exist) {
            return res.status(401).json({
                success:false,
                message:"please signup"
            })
        }

        const isMatched=await matchPassword(password,exist.password);
        if(!isMatched) {
            return res.status(401).json({
                success:false,
                message:"incorrect password"
            })
        }

        const token=await generateToken(exist);
        return res.status(200).json({
            success:true,
            message:"Loggedin successfully",
            user:exist,
            token
        })        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.myProfile=async (req,res)=> {
    try {
        const {token}=req.body;
        if(token===null) {
            return res.status(400).json({
                success:false,
                message:"Please Login"
            })
        }

        const {_id}=await jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(_id);

        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}