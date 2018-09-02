const mongoose = require('mongoose')
const conn = mongoose.createConnection(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds125862.mlab.com:25862/hackton_db`);

module.exports = conn;