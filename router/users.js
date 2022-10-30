const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth')
const multer = require('multer')
const fs = require('fs');
const path = require('path');

const User = require('../models/Users');

router.get('/', ensureAuthenticated, async function(req, res) {

    const user = await User.findById({ _id: req.user._id }).lean()

    const users = await User.find().lean();
    // console.log(user);
    res.render('user/index', {
        layout: 'loggedin',
        user,
        users
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ '-' + file.originalname)
    }
});

let upload = multer({ storage: storage });

router.post('/edit/:id', upload.single('image'), async function(req, res) {
    try {

        let userobj = {
            name: req.body.name,
            phone: req.body.phone,
            image: {
                data: fs.readFileSync(path.join(__dirname, '..', '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        }

        let user = await User.findById({ _id: req.user._id }).lean()

        if (!user) {
            req.flash('error_msg', 'User not found');
            res.redirect('/dashboard')
        } else {
            user = await User.findOneAndUpdate({ _id: req.params.id }, userobj, {
                new: true,
                runValidators: true,
            })
            req.flash('success_msg', 'Updated succesfully');
            res.redirect('/user')
        }
    } catch (err) {
        console.log(err);
        req.flash('error_msg', 'Updated not succesfully');
        res.redirect('/user')
    }
});

module.exports = router