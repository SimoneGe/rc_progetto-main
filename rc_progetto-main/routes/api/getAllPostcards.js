/**
 * @api {get} /api/getAllPostcards:id Retrieve all postcards saved by user
 * @apiName getAllPostcards
 * @apiGroup Api
 *
 * @apiParam {tweToken} unique token associated to user.
 *
 * @apiSuccess {JSON} JSON with information about postcards as in database
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
var express = require('express');
var router = express.Router();
router.use(express.urlencoded({extended:false}));

const mongoose = require('mongoose');

const Postcard = require('../../models/Postcard')
const User=require("../../models/User");

router.get('/',  async (req, res) => {
    console.log("GET ./API/getPostcard hitted")
  
    var token = req.query.token;
    if(token=="") {
        res.status(400).send(
            {"message": {
                "header": {
                  "message": "Bad request 400"
                },
                "body": {}
            }
        }
    )}

    var user=await User.findOne({tweToken : token })
    if(user==null){
        res.status(404).send({
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
                var postcard=await Postcard.find({user: user_id});
                
                if(postcard.length==0){
                    res.status(500).send({
                        "message": {
                            "header": {
                                
                            "message": "Errore, postcard non trovata",
                            },
                            "body": {}
                        }
                    })
                }
                else{

                
                    res.status(200).send({
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