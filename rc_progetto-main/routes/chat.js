var express = require('express');
var router = express.Router();
const { ensureAuthentication, ensureGuest } = require('../middleware/auth')



router.get("/", ensureAuthentication, async (req,res)=>{
    console.log("GET ./chat hitted");

    try {
        // lean serve a renderizzare
        var nome=req.user.firstName;
        console.log("GET on localhost:8000...");
        res.redirect("http://localhost:8000?utente="+nome);
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});



module.exports = router;