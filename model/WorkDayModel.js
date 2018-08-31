const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeDuration = new Schema({
    timeStart: String,
    timeEnd: String
})

const WorkDaySchema = new Schema({
    timeDuration: TimeDuration,
    date: Date,
    breaking: [],
    events: [{type: Schema.Types.ObjectId, ref:'event'}] //not working
});

module.exports = mongoose.model('workDay', WorkDaySchema);