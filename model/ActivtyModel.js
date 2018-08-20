const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    type: { type: String, required: true },
    price: Number,
    duration: Number
});

module.exports = mongoose.model('activity', ActivitySchema);