const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const conn = mongoose.createConnection(process.env.DB_HOST, { autoIndex: false, user: process.env.DB_USER, pass: process.env.DB_PASS, useNewUrlParser: true });

module.exports = conn;