const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../config/conncetion');

const TimeDuration = new Schema({
    timeStart: String,
    timeEnd: String
})


const WorkDaySchema = new Schema({
    timeDuration: TimeDuration,
    date: { type: String, unique: true },
    breaking: [],
    events: [{ type: Schema.Types.ObjectId, ref: 'event' }] //not working
});

module.exports = conn.model('workDay', WorkDaySchema);