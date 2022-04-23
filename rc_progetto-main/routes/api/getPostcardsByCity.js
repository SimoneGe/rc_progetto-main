//Dato token recuperiamo utente e poi con id recuperiamo tutte le postcard di un luogo
var express = require('express');
var router = express.Router();
var axios = require('axios').default;
router.use(express.urlencoded({extended:false}));
const { ensureAuthentication, ensureGuest } = require('../../middleware/auth');
const mongoose = require('mongoose');

const Postcard = require('../../models/Postcard')
const User=require("../../models/User");

router.get('/', async (req, res) => {
    console.log("Post /api/getPostcardsbyCity hitted!");
    //Prendo ID 

    var token = req.query.token;
    var luogo=req.query.luogo;

    var user=await User.findOne({tweToken : token })
    if(user===null){
        res.send({
            "message": {
                "header": {
                "message": "Errore, utente non trovata",
                },
                "body": {}
            }
        })
    }
    else{

            var user_id=user._id;
            var postcard=await Postcard.find({user: user_id , city: luogo});
            
            if(postcard.length==0){
                res.send({
                    "message": {
                        "header": {
                        "message": "Errore, postcard non trovata",
                        },
                        "body": {}
                    }
                })
            }
            else{

            
                res.send({
                    "message":{
                        "header":{
                            "status_code": 200
                        },
                        "body": postcard
                    }
                });
            }




    
    }
})


module.exports = router;