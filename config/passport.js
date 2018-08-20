const JwtStrategy = require('passport-jwt').Strategy;
// we can extract the token from th header token
const ExtractJwt = require('passport-jwt').ExtractJwt;

let Bussiness = require('../model/BussinesModel');

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.SECERT_KEY;

    // we use the passport and set its sttrategy to jwt
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        Bussiness.findOne({ _id: jwt_payload.id })
            .then(bussiness => {
                if (bussiness) {
                    return done(null, bussiness);
                } else {
                    // if user not found
                    return done(null, false);
                }
            })
            .catch(err => done(err, false));
    }));
}