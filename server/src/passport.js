const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');
const User = require('../models/user');
const HttpStatus = require('http-status-codes');

// first
exports.initialize = function() {
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.app.secret
    }, (payload, next) => {
        User.findOne({_id: payload._id}, function(err, user) {
            if (err) {
                return next(err, false);
            }
            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
    }));

    return passport.initialize();
}

// second
exports.authenticate = function(req, res, next) {
    passport.authenticate('jwt', { session: false }, function(err, user, info) {
        if (err) {
            return next(err); // Error 500
        }

        if (!user) {
            //Authentication failed

            return res
                .status(401).json({
                    message: HttpStatus.getStatusText(401)
                })
        }
        //Authentication successful
        req.user = {
            id: user._id
        }
        next(null)
    })(req, res, next);
}
