const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    activityId: { type: Schema.Types.ObjectId, ref: 'activty' },
    date: { type: Date, required: true },
    startingTime: { type: String, required: true }
});

module.exports = mongoose.model('event', EventSchema);