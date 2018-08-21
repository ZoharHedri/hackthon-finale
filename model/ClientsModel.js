const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    username: String,
    events: []
});

module.exports = mongoose.model('client', ClientSchema);