const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require('bcryptjs');
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

const BussinessSchema = new Schema({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    ratingVote: {
        5: { type: Number, deafult: 0 },
        4: { type: Number, deafult: 0 },
        3: { type: Number, deafult: 0 },
        2: { type: Number, deafult: 0 },
        1: { type: Number, deafult: 0 },
    },
    rating: { type: Number, default: 0 },
    phone: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    clients: [{ type: Schema.Types.ObjectId, ref: 'client' }],
    workingDays: [WorkDaySchema],
    activites: [{ type: Schema.Types.ObjectId, ref: 'activity', autopopulate: true }],
    avatarUrl: { type: String, default: null }
});

// save the bussiness hash password using bcryptjs module
BussinessSchema.pre('save', function (next) {
    let bussiness = this;
    if (this.isModified('password') || this.isNew) {
        bcryptjs.genSalt(10)
            .then(salt => {
                bcryptjs.hash(bussiness.password, salt)
                    .then(hash => {
                        bussiness.password = hash;
                        return next();
                    })
                    .catch(err => next(err));
            })
            .catch(err => next(err));
    }
    else {
        return next()
    }
})

//a method to compare between two password 
BussinessSchema.methods.comparePassword = function (psw, cb) {
    bcryptjs.compare(psw, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

module.exports = conn.model('business', BussinessSchema);