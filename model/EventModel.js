const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../config/conncetion');

const EventSchema = new Schema({
    activityId: { type: Schema.Types.ObjectId, ref: 'activty' },
    // bussinessId: { type: Schema.Types.ObjectId, ref: 'business' },
    bussinessId: String,
    workingDayId: String,
    date: { type: String, required: true },
    startingTime: { type: String, required: true },
    status: String
});

module.exports = conn.model('event', EventSchema);