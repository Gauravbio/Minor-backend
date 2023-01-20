const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto=require("crypto")

exports.generateToken = function (newUser) {
  return jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
};

exports.matchPassword = async function (password, encodedPassword) {
  const decoded = await bcrypt.compare(password, encodedPassword);
  return decoded;
};

exports.getResetPasswordToken=function(user) {
  const resetToken=crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex');
  user.resetPasswordExpire=Date.now()+10*60*1000;

  return resetToken;
}
