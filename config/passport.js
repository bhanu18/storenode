const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({
                email: email
            }).then(user => {

                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch && user.email_verfied_at) {
                        return done(null, user);
                    } else {
                        return done(null, false, req.flash('error_msg', 'Password not matched'));
                    }
                });
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}