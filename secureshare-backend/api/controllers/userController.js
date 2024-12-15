const User = require("../models/User");
const envUtil = require("../util/envUtil");
const cryptoUtil = require("../util/cryptoUtil");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({
        message: "Name, Username and Password are required to register !",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "This email is already in use, please use a different one !",
      });
    }

    const newUser = new User({
      name,
      username,
      password: cryptoUtil.createHash(password),
    });

    await newUser.save();

    return res.status(200).json({ message: "Registered successfully " });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong in registering you, please try again !",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const hashedPassword = cryptoUtil.createHash(password);
    console.log(`Passwords match => ${hashedPassword === user.password}`);
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      envUtil.getJwtSecret(),
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token, name: user.name });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
