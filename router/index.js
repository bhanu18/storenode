const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middleware/auth')
const Product = require('../models/Products')
const Sale = require('../models/Sale')
const Contact = require('../models/Contact');
const MisedSales = require('../models/MissedSales');

const sgMail = require('@sendgrid/mail');
const Products = require('../models/Products')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get('/', function (req, res) {
    const pageName = "Home";
    res.render('home/index', {
        pageName
    });
});


router.get('/dashboard', ensureAuthenticated, async function (req, res) {

    try {
        const products = await Product.find().lean()

        const sale = await Sale.find().lean()

        const contact = await Contact.find().lean()

        const missed_sales = await MisedSales.find().lean()

        const pageName = "Dashboard";

        res.render('dashboard/index', {
            layout: 'loggedin',
            pageName,
            user: req.user.name,
            products,
            sale,
            contact,
            missed_sales
        });
    } catch (error) {
        console.log(error)
    }
})

router.get('/prod', async (req, res) => {
    try {
        const products = await Products.find().lean();

        res.status(200).json(products);

    } catch (error) {
        console.log(error);
    }
})


router.post('/contact', async function (req, res) {

    try {

        let error = [];

        const { contact_email, contact_name, contact_subject } = req.body;

        if (!contact_email || !contact_name || !contact_subject) {
            error.push({ msg: "Please complete the fields" });
        }

        if (error.length > 0) {

            res.render('home/index', {
                error
            });
        }
        else {
            let html_msg = "<p>Email from: " + req.body.contact_email;
            html_msg += "<p>message: " + req.body.contact_msg + "</p>";
            html_msg += "<p>consent: " + req.body.contact_consent + "</p>";

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

            if (await Contact.create(contact_obj)) {
                await sgMail.send(msg);
            }

            req.flash('success_msg', 'Message sent');
            res.redirect('/');

        }
    } catch (error) {
        console.log(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }

})
module.exports = router;