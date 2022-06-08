const { sign } = require('jsonwebtoken');
const { User } = require('../database/models');

const logInHandler = async (req, res) => {
  const { email, password } = req.body;
  const { _doc: user } = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  const isValid = password === user.password;
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const { password: pass, ...userInfo } = user;

  sign(userInfo, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      return res.status(500).json({ message: 'Error signing token' });
    }
    return res
      .cookie('token', token)
      .json({ message: 'Logged in successfully', data: userInfo });
  });
};

const signUpHandler = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const { _doc: newUser } = await User.create({ name, email, password });

  const { password: pass, ...userInfo } = newUser;

  sign(userInfo, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      return res.status(500).json({ message: 'Error signing token' });
    }
    return res
      .cookie('token', token)
      .json({ message: 'User crated successfully', data: userInfo });
  });
};

module.exports = {
  logInHandler,
  signUpHandler,
};
