const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('client', ClientSchema);