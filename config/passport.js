const JwtStrategy = require('passport-jwt').Strategy;
// we can extract the token from th header token
const ExtractJwt = require('passport-jwt').ExtractJwt;

let Activty = require('../model/ActivtyModel');
let WorkDay = require('../model/WorkDayModel');
let Bussiness = require('../model/BussinesModel');
let Client = require('../model/ClientsModel');
let Event = require('../model/EventModel');

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.SECERT_KEY;

    // we use the passport and set its sttrategy to jwt
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        //https://stackoverflow.com/questions/24414975/mongoose-populate-sub-sub-document
        Bussiness.findOne({ _id: jwt_payload.id }).populate({
              path: 'workingDays clients activites' ,
              populate: {
                  path: 'events',
                  populate: {
                     path: 'activityId',
                     model: 'activity'
                  }
               }
            }).exec()
            .then(bussiness => {
                if (bussiness) {
                    return done(null, bussiness);
                } else {
                    // if user not found we need to check if its a client
                    Client.findOne({ _id: jwt_payload.id }).populate('events events.activityId')
                        .then(client => {
                            if (!client) return done(null, false);
                            return done(null, client);
                        })
                        .catch(err => done(err, false));
                }
            })
            .catch(err => done(err, false));
    }));
}