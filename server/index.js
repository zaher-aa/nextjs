require('dotenv').config();
const express = require('express');
const dbConnection = require('./database/connections');

const app = express();
app.set('port', 5000);

const startServer = async () => {
  try {
    await dbConnection(process.env.DB_URL);
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
