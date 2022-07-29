const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middleware/auth')

const Product = require('../models/Products')

router.get('/', ensureAuthenticated, async function(req, res) {

    try {
        const products = await Product.find().lean()

        res.render('products/index', {
            layout: "loggedin",
            products
        })

        // console.log(products)
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }

})

router.post('/', ensureAuthenticated, async function(req, res) {
    try {
        await Product.create(req.body)
            // console.log(req.body);
        req.flash('success_msg', 'Added succesfully');
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/edit/:id', ensureAuthenticated, async(req, res) => {

    const pageName = 'edit Product'
    const product = await Product.findOne({
        _id: req.params.id
    }).lean()

    if (!product) {
        return res.render('error/404')
    } else {
        res.render('products/edit', {
            product,
            layout: 'loggedin',
            pageName
        })

        // console.log(product);
    }
})

router.put('/:id', ensureAuthenticated, async(req, res) => {
    try {
        let product = await Product.findById(req.params.id).lean()

        if (!product) {
            req.flash('error_msg', 'Product not found');
            res.redirect('/dashboard')
        } else {
            product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })
            req.flash('success_msg', 'Updated succesfully');
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

router.get('/delete/:id', ensureAuthenticated, async(req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.id)

        // await product.remove({ _id: req.params.id })
        req.flash('success_msg', 'Prduct deleted');
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err)
        return res.send('500')
    }
})

module.exports = router