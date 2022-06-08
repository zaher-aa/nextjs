/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { logInHandler, signUpHandler } = require('./controllers');
const dbConnection = require('./database/connections');

const app = express();
app.disable('x-powered-by');
app.set('port', 5000);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await dbConnection(process.env.DB_URL);
    app.listen(app.get('port'), () => {
      console.log(`Listening on port ${app.get('port')}`);
    });
  } catch (err) {
    console.log(err);
  }
};

const seek = (cb) => (req, res, next) => {
  try {
    cb(req, res);
  } catch (err) {
    next(err);
  }
};

// ? Routes
app.post('/api/login', seek(logInHandler));
app.post('/api/signup', seek(signUpHandler));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Page not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
});

startServer();
