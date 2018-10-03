const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../config/conncetion');

const CategorySchema = new Schema({
    name: String,
    color: { name: String, hex: String }
})

module.exports = conn.model('category', CategorySchema);