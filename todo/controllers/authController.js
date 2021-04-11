const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).send("Fill required fills");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).send("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ email, username, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  res.status(201).json({ token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid Credentials");
  }

  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  res.status(201).json({ token });
};

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  token = token.split(" ")[1];

  try {
    let user = jwt.verify(token, "123456789");
    req.user = user.id;
    console.log(user);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }

  next();
};

module.exports = {
  register,
  login,
  verifyToken,
};
