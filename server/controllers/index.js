const { sign } = require('jsonwebtoken');
const { User } = require('../database/models');

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
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
    return res.status(200).json({ token });
  });
};

module.exports = {
  loginHandler,
};
