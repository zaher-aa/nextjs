const { sign, verify } = require('jsonwebtoken');
const { User, Post } = require('../database/models');

const checkAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  });
};

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

const getAllPostsHandler = async (req, res) => {
  const allPosts = await Post.find();

  res.json({ message: 'Posts fetched successfully', data: allPosts });
};

const createPost = async (req, res) => {
  const { user: { _id: owner }, body: { title, content } } = req;

  const { _doc: newPost } = await Post.create({ title, content, owner });

  res.json({ message: 'Post created successfully', data: newPost });
};

const getUserPostsHandler = async (req, res) => {
  const { _id: owner } = req.params;

  try {
    const userPosts = await Post.find({ owner });

    res.json({ message: 'User posts fetched successfully', data: userPosts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user posts' });
  }
};

module.exports = {
  logInHandler,
  signUpHandler,
  checkAuth,
  getAllPostsHandler,
  createPost,
  getUserPostsHandler,
};
