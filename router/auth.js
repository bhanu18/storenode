const express = require("express");
const router = express.Router();
const passport = require("passport");
const { forwardAuthenticated } = require('../middleware/auth');
const bcryprtjs = require('bcryptjs')
const User = require('../models/Users')

router.get('/login', forwardAuthenticated, (req, res) => {
    const pageName = "login";
    res.render('auth/login', {
        pageName
    })
})

router.get("/register", forwardAuthenticated, (req, res) => {
    const pageName = "Register";
    res.render('auth/register', {
        pageName
    })
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body

    let errors = []
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all Fields' })
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should more the 6 characters' })
    }

    if (password != password2) {
        errors.push({ msg: 'Pasword does not match' })
    }

    if (errors.length > 0) {
        res.render('auth/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: "User exist" });
                res.render('auth/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                });

                bcryprtjs.genSalt(10, (err, salt) =>
                    bcryprtjs.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser.save().then(user => {
                                req.flash('success_msg', 'you are now registered');
                                res.redirect('/auth/login');
                            })
                            .catch(err => console.log(err));
                    }))
            }
        })
    }
})

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'Logged out succesfully');
        res.redirect('/auth/login');
    });
});

module.exports = router;