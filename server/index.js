/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const { join } = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const dbConnection = require('./database/connections');
const {
  logInHandler,
  signUpHandler,
  getAllPostsHandler,
  createPostHandler,
  checkAuth,
  getUserPostsHandler,
  deletePostHandler,
  editPostHandler,
} = require('./controllers');

const { env: { DB_URL, NODE_ENV } } = process;

const app = express();
app.disable('x-powered-by');
app.set('port', 5000);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await dbConnection(DB_URL);
    app.listen(app.get('port'), () => {
      console.log(`Listening on port ${app.get('port')}`);
    });
  } catch (err) {
    console.log(err);
  }
};

const seek = (cb) => (req, res, next) => {
  try {
    cb(req, res, next);
  } catch (err) {
    next(err);
  }
};

if (NODE_ENV === 'development') {
  app.get('/', (req, res) => res.json({ message: 'Server is running' }));
}

if (NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// ? Routes
app.post('/api/login', seek(logInHandler));
app.post('/api/signup', seek(signUpHandler));
app.get('/api/post/all', seek(getAllPostsHandler));
app.get('/api/post/:_id/all', seek(getUserPostsHandler));
app.use(checkAuth);
app.post('/api/post/new', seek(createPostHandler));
app.patch('/api/post/:_id/edit', seek(editPostHandler));
app.delete('/api/post/:_id/delete', seek(deletePostHandler));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Page not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
});

startServer();
