const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')

const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {

        const newUser = {
            googleId: profile.id,
            displayName : profile.displayName,
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            googleAccessToken : accessToken,
            tweToken : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) //funzione hash
        }

        try {
            let user = await User.findOne( {
                googleId : profile.id
            })

            if (user) {
                
                const aggiornamento = await User.updateOne({googleId: profile.id}, {googleAccessToken: accessToken})
                done(null, user)
            } else {
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (error) {
            console.log(error)
            
        }


    }))

    passport.serializeUser( (user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser( (id, done) => {
        User.findById(id,(err, user) => done(err, user))
    })
}
