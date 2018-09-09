const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../config/conncetion');
const bcryptjs = require('bcryptjs');

const ClientSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'event' }],
    avatarUrl: { type: String, default: null }
});

// save the bussiness hash password using bcryptjs module
ClientSchema.pre('save', function (next) {
    let client = this;
    if (this.isModified('password') || this.isNew) {
        bcryptjs.genSalt(10)
            .then(salt => {
                bcryptjs.hash(client.password, salt)
                    .then(hash => {
                        client.password = hash;
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
ClientSchema.methods.comparePassword = function (psw, cb) {
    bcryptjs.compare(psw, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

module.exports = conn.model('client', ClientSchema);