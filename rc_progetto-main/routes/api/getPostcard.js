//Dato tweTok luogo e data ritorna una postcard
var express = require('express');
var router = express.Router();
router.use(express.urlencoded({extended:false}));
const { ensureAuthentication, ensureGuest } = require('../../middleware/auth');
const mongoose = require('mongoose');

const Postcard = require('../../models/Postcard')
const User=require("../../models/User");

router.get('/',  async (req, res) => {
    console.log("GET ./API/getPostcard hitted")
  
    var token = req.query.token;
    var luogo=req.query.luogo;
    var data=req.query.data;

    var user=await User.findOne({tweToken : token })
    if(user==null){
        res.send({
            "message": {
                "header": {
                "message": "Errore, utente non trovata",
                },
                "body": {}
            }
        })
    }else{

                var user_id=user._id;
                var postcard=await Postcard.findOne({user: user_id , city: luogo, giorno: data});
                
                if(postcard==null){
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