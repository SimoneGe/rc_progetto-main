const express = require('express')
const router = express.Router()
const { ensureAuthentication, ensureGuest } = require('../middleware/auth')

const Postcard = require('../models/Postcard')



router.get('/', ensureAuthentication, async (req, res) => {
    try {
        // lean serve a renderizzare
        const postcards = await Postcard.find( {user: req.user.id}).lean()
        res.render('profilo', {
            name: req.user.firstName,
            postcards,
            lastName : req.user.lastName,
            tweToken : req.user.tweToken
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    
})




module.exports = router