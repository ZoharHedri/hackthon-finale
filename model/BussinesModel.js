const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BussinessSchema = new Schema({
    name: String,
    category: String,
    phone: String,
    email: String,
    password: String,
    address: String,
    clients: [{}],
    workingDays: [],
    activites: []
});

module.exports = mongoose.model('business', BussinessSchema);