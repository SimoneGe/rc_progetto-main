//Dato Token ed email elimino sezione utente con findAndDelete


var express = require('express');
var router = express.Router();
var axios = require('axios').default;
router.use(express.urlencoded({extended:false}));

const mongoose = require('mongoose');

const Postcard = require('../../models/Postcard')
const User = require('../../models/User')


router.get('/',  async (req, res) => {
     const user = await User.findOne({tweToken : req.query.token })
    console.log(user)
    const user_id = user._id
    const ris = await Postcard.deleteMany({user :  user_id})

    var token = req.query.token;
    var email=req.query.email;

    var distrutto=await User.findOneAndDelete({tweToken : token }, function (err){
        console.log("Trovata ed eliminata!");
        if(err){
            res.send({
                "message": {
                    "header": {
                        "status_code":404,
                    "message": "Errore, impossibile eliminare utente non trovato",
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
                    "body": "User deleted"
                }
            });
    
        }        
    })

})


module.exports = router;



