const express = require('express')
const router = express.Router()
const { ensureAuthentication, ensureGuest } = require('../middleware/auth')

const Postcard = require('../models/Postcard')

// @desc Login/Landing page
// @route GET /

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @desc Manager
// @route GET /manager

router.get('/manager', ensureAuthentication, async (req, res) => {
    try {
        // lean serve a renderizzare
        const postcards = await Postcard.find( {user: req.user.id}).lean()
        res.render('manager', {
            name: req.user.firstName,
            postcards
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    
})




module.exports = router