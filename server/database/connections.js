const mongoose = require('mongoose');

module.exports = (dbUrl) => mongoose.connect(dbUrl);
