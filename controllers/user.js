const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto=require("crypto")
const {
  generateToken,
  matchPassword,
  getResetPasswordToken,
} = require("../utils/auth");
const sendEmail = require("../utils/sendEmail");
const {PythonShell}=require('python-shell')

//expire karo

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });

    const newUser = await User.create({
      email: email,
      password: password,
    });

    const token = await generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: "registered successfully",
      newUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (!exist) {
      return res.status(401).json({
        success: false,
        message: "please signup",
      });
    }

    const isMatched = await matchPassword(password, exist.password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "incorrect password",
      });
    }

    const token = await generateToken(exist);
    return res.status(200).json({
      success: true,
      message: "Loggedin successfully",
      user: exist,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.myProfile = async (req, res) => {
  try {
    const { token } = req.body;
    if (token === null) {
      return res.status(400).json({
        success: false,
        message: "Please Login",
      });
    }

    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(_id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please login",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const resetPasswordToken = getResetPasswordToken(user);
    user.save();

    const resetUrl = `${process.env.REACT_APP_URL}/resetPassword/${resetPasswordToken}`;

    const message = `Reset your password by clicking on this link\n\n ${resetUrl}`;

    try {
      await sendEmail(email, message);
      return res.status(200).json({
        success: true,
        message: "Email Sent",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      user.save();
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req,res) => {
  try {
    const { resetToken, password } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

      const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt : Date.now()}
      })

      if(!user) {
        return res.status(401).json({
            success:false,
            message:"Token has been expired or invalid"
        })
      }

      user.password=password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(200).json({
        success:true,
        message:"Password updated successfully"
      })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.emotionDetection=async (req,res)=> {
  try {
    const {image}=req.body;
    const options={
      args:[image]
    }

    let output;
    await PythonShell.run('main.py',options,(err,result)=> {
      if(err) {
        res.status(400).json({
          err
        })
      }
      if(result) {
        output=result;
      }
    })
    res.status(200).json({output})
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.recentlyPlayed=async (req,res)=> {
  try {
    const {song,userId}=req.body;

    const user=await User.findById(userId);

    if(!user) {
      return res.status(400).json({
        success:false,
        message:"Please Login"
      })
    }

    user.recents.unshift({
      album:song.album,
      name:song.name,
      preview_url:song.preview_url
    });

    await user.save();
    return res.status(200).json({
      success:true,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.favourites=async (req,res)=> {
  try {
    const {song,userId}=req.body;

    const user=await User.findById(userId);
    if(!user) {
      return res.status(400).json({
        success:false,
        message:"Please Login"
      })
    }

    user.favourites.unshift({
      album:song.album,
      name:song.name,
      preview_url:song.preview_url
    })

    await user.save();
    return res.status(200).json({
      success:true,
      message:"Added to favourites"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}