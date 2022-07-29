const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middleware/auth')
const Product = require('../models/Products')
const Sale = require('../models/Sale')
const Contact = require('../models/Contact');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', function (req, res) {
    const pageName = "Home";
    res.render('/home/index', {
        pageName
    });
});


router.get('/dashboard', ensureAuthenticated, async function (req, res) {

    try {
        const products = await Product.find().lean()

        const sale = await Sale.find().lean()

        const contact = await Contact.find().lean()

        const pageName = "Dashboard";

        res.render('dashboard/index', {
            layout: 'loggedin',
            pageName,
            user: req.user.name,
            products,
            sale,
            contact
        });
    } catch (error) {
        console.log(error)
    }
})


router.post('/contact', async function (req, res) {

    try {

        let error = [];

        if(!req.body.contact_email){
            error.push({msg : "Please enter email"});

            res.render('home/index', {
                error
            });
        }

        let html_msg = "<p>Email from: "+ req.body.contact_email;
        html_msg+= "<p>message: " + req.body.contact_msg + "</p>";
        html_msg+= "<p>consent: "+ req.body.contact_consent + "</p>";

        // console.log(html_msg);
        // res.send(html_msg);

        const msg = {
            to: 'bmansinghani@gmail.com',
            from: process.env.SITE_EMAIL, // Use the email address or domain you verified above
            subject: req.body.contact_subject,
            text: req.body.contact_msg,
            html: html_msg,
        };

        const contact_obj = {
            name: req.body.contact_name,
            email: req.body.contact_email,
            subject: req.body.contact_subject,
            message: req.body.contact_msg,
            consent: req.body.contact_consent
        }

        await sgMail.send(msg);

        await Contact.create(contact_obj);

        req.flash('success_msg', 'Message sent');
        res.redirect('/');

    } catch (error) {
        console.log(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }

})
module.exports = router;