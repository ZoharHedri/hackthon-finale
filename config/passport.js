const JwtStrategy = require('passport-jwt').Strategy;
// we can extract the token from th header token
const ExtractJwt = require('passport-jwt').ExtractJwt;

let Bussiness = require('../model/BussinesModel');
let Client = require('../model/ClientsModel');
let Event = require('../model/EventModel');
let Activty = require('../model/ActivtyModel');

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.SECERT_KEY;

    // we use the passport and set its sttrategy to jwt
    passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
        try {
            let bussiness = await Bussiness.findOne({ _id: jwt_payload.id }).populate({
                path: 'workingDays.events  activites',
                populate: {
                    path: 'activityId',
                    model: 'activity'
                }
            }).populate({ path: 'clients', populate: { path: "events" } }).exec();
            if (bussiness) {
                return done(null, bussiness);
            } else {
                // if user not found we need to check if its a client
                let client = await Client.findOne({ _id: jwt_payload.id }).populate({
                    path: 'events',
                    populate: {
                        path: 'activityId',
                        model: "activity"
                    }
                });
                if (!client) return done(null, false);
                return done(null, client);
            }
        } catch (err) { done(err, false) };
    }));
}