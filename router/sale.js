const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middleware/auth');
const ObjectId = require('mongodb').ObjectId;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Sale = require('../models/Sale');
const Product = require('../models/Products');
const Items = require('../models/Items');
const MisedSales = require('../models/MissedSales');

router.get('/view/:id', async function (req, res) {
    try {
        const sale = await Sale.findById(req.params.id)
            .sort({ createdAt: 'desc' })
            .lean();

        const item = await Items.find({
            item_id: sale.item_id
        })
            .populate({
                path: 'product'
            }).lean()

        const pageName = 'View Sale';

        res.render('sale/view', {
            layout: "loggedin",
            sale,
            pageName,
            item
        });
    } catch (error) {

    }
})


router.get('/add', async function (req, res) {

    try {

        const pageName = 'Add Sale';
        let product = await Product.find().lean();
        res.render('sale/add', {
            layout: 'loggedin',
            product,
            pageName
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/add', ensureAuthenticated, async function (req, res) {
    try {

        let original_id = ObjectId(32);
        for (let i = 0; i < req.body.products.length; i++) {
            let item_obj = {
                item_id: original_id,
                product: req.body.products[i],
                quantity: req.body.quantity[i],
                price: req.body.price[i]
            };

            // console.log(item_obj);
            const product = await Product.findById({ _id: req.body.products[i] })

            let current_quantity = product.quantity; // get the current product qunatity

            let new_quantity = current_quantity - req.body.quantity[i]; // get the difference 

            let product_obj = {
                quantity: new_quantity
            }

            await Product.findByIdAndUpdate({ _id: req.body.products[i] }, product_obj); // update the product with new quantity

            // console.log(new_quantity);

            await Items.create(item_obj);
        }


        let sale_obj = {
            customer_id: req.body.customer_id,
            total_price: req.body.total_price,
            total_quantity: req.body.total_quantity,
            item_id: original_id
        };

        // console.log(sale_obj);

        await Sale.create(sale_obj);


        // console.log(req.body);

        // res.send('done');

        req.flash('success_msg', 'Sale added');
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
    }
});

router.get('/edit/:id', ensureAuthenticated, async function (req, res) {

    try {
        const product = await Product.find().lean()

        const sale = await Sale.findById(req.params.id)
            .sort({ createdAt: 'desc' })
            .lean();

        const item = await Items.find({
            item_id: sale.item_id
        })
            .populate({
                path: 'product'
            }).lean()

        const pageName = 'Edit Sale';

        res.render('sale/edit', {
            layout: "loggedin",
            sale,
            pageName,
            item,
            product
        });

    } catch (error) {
        console.log(error);
    }
})

router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {

        for (let i = 0; i < req.body.products.length; i++) {
            let item_obj = {
                product: req.body.products[i],
                quantity: req.body.quantity[i],
                price: req.body.price[i]
            };
            const item = await Items.findById(req.body.item_product_id[i]);

            let current_sale_quantity = item.quantity;

            if (req.body.quantity[i] > current_sale_quantity) {

                const product = await Product.findById({ _id: req.body.products[i] }); // get the products by calling model

                let sale_diff = req.body.quantity[i] - current_sale_quantity; // calucate the diferrence between current sale quan and the previous updated quan

                let current_quantity = product.quantity; // get the current product qunatity

                let new_quantity = current_quantity - sale_diff; // minus the sale differrence to the product quantity

                let product_obj = {
                    quantity: new_quantity
                }

                await Product.findByIdAndUpdate({ _id: req.body.products[i] }, product_obj); // update the product with new quantity

            }
            else {

                const product = await Product.findById({ _id: req.body.products[i] }); // get the products by calling model

                let sale_diff = current_sale_quantity - req.body.quantity[i]; // calucate the diferrence between current sale quan and the previous updated quan

                let current_quantity = product.quantity; // get the current product qunatity

                let new_quantity = current_quantity + sale_diff; // add the sale differrence to the current product qunatity 

                let product_obj = {
                    quantity: new_quantity
                }

                await Product.findByIdAndUpdate({ _id: req.body.products[i] }, product_obj); // update the product with new quantity
            }

            await Items.findByIdAndUpdate({ _id: req.body.item_product_id[i] }, item_obj, {
                new: true,
                runValidators: true,
            });

        }

        let sale_obj = {
            customer_id: req.body.customer_id,
            total_price: req.body.total_price,
            total_quantity: req.body.total_quantity
        };

        // console.log(sale_obj);

        // res.send('done');

        if (!Sale) {
            req.flash('error_msg', 'Sale not updated');
            res.redirect('/dashboard')
        } else {
            await Sale.findOneAndUpdate({ _id: req.params.id }, sale_obj, {
                new: true,
                runValidators: true,
            })
            req.flash('success_msg', 'Updated succesfully');
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err);
    }
});

router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Sale.findByIdAndRemove(req.params.id)
        req.flash('success_msg', 'deleted');
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        return res.send('500')
    }
});

router.get('/send', async function (req, res) {
    try {

        const msg = {
            to: 'bmansinghani@gmail.com',
            from: process.env.SITE_EMAIL, // Use the email address or domain you verified above
            subject: 'cron test',
            text: 'testing this cron',
            html: '<p> testing this cron service </p>',
        };

        await sgMail.send(msg);
    } catch (error) {
        console.log(error);
    }
})

router.post('/missed', async function(req, res){
    try {
        await MisedSales.create(req.body)
            // console.log(req.body);
        req.flash('success_msg', 'Added succesfully');
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router;