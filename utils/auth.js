const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.generateToken = function (newUser) {
  return jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
};

exports.matchPassword = async function (password, encodedPassword) {
  const decoded = await bcrypt.compare(password, encodedPassword);
  return decoded;
};
