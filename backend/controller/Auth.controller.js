const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/generateJwtToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields!");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });
  if (user) {
    const { _id, name, email, pic } = user;
    res.status(201).json({ _id, name, email, pic, token: generateToken(_id) });
  } else {
    res.status(400);
    throw new Error("Failed to create User!");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
  const { _id, name, pic } = user;
  const isPassMatch = await bcrypt.compare(password, user.password);
  if (isPassMatch) {
    res.json({
      _id,
      name,
      email,
      pic,
      token: generateToken(_id),
      msg: "Login successful!",
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { registerUser, loginUser };
