var express = require('express');
var router = express.Router();
var axios = require('axios').default;
router.use(express.urlencoded({extended:false}));
const { ensureAuthentication, ensureGuest } = require('../../middleware/auth');
const mongoose = require('mongoose');

const Postcard = require('../../models/Postcard')



router.post('/aggiungi', ensureAuthentication, async (req, res) => {
    console.log("Post /cartolina Hitted!");
    //Prendo ID 
    try {
        user_id=req.user.id;

        //console.log(user_id);
        firstName=req.user.firstName;
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    //Inserisco dati nel database
    var citta = req.body.city;
    var giorno= req.body.giorno;
    
    var fotoa=req.body.fot;
    //Creo model
    const newpc=new Postcard({
        city : citta,
        user : user_id,
        firstName: firstName,
        giorno : giorno,
        foto: fotoa
    });

    //Inserisco nel database
    newpc.save(function (err){
        if (err){
             console.error(err);
        }
        else{
            console.log("Funziona");
        }

    })

    const temp=await Postcard.find({city : "london"});
    console.log("Trovata: "+temp);
    res.redirect('http://localhost:8888');

    

})



router.post('/elimina', ensureAuthentication, async (req, res) => {
    console.log("Post /cartolina Hitted!");
    //Prendo ID 
    try {
        user_id=req.user.id;

        //console.log(user_id);
        firstName=req.user.firstName;
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    //Inserisco dati nel database
    var citta = req.body.city;
    var giorno= req.body.giorno;
    
    

    

    const temp=await Postcard.findOneAndDelete({city : citta, giorno: giorno});
    
    res.redirect('http://localhost:8888');

    

})


module.exports = router;