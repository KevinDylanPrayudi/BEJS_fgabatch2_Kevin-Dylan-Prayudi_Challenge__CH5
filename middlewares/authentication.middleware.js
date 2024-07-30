const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const db = require('../db');

var opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    const result = await db.userInfo.findFirst({
        where: {
            email: jwt_payload.email
        }
    });

    if (result === null) {
        return done(null, false);
    }

    return done(null, result);
}));

module.exports = passport;