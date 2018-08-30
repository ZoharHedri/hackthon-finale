const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../config/conncetion');

const ActivitySchema = new Schema({
    type: { type: String, required: true },
    price: Number,
    duration: Number
});

module.exports = conn.model('activity', ActivitySchema);