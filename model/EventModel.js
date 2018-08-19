const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    activityId: { type: mongoose.SchemaTypes.ObjectId, ref: 'activty' },
    date: Date,
    startingTime: String
});

module.exports = mongoose.model('event', EventSchema);