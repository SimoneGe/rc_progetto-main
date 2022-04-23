var express = require('express');
var router = express.Router();
var axios = require('axios').default;
var request = require('request');
router.use(express.urlencoded({extended:false}));
const { ensureAuthentication, ensureGuest } = require('../../middleware/auth');
const mongoose = require('mongoose');
const User =require('../../models/User');

const Postcard = require('../../models/Postcard')

router.get('/creaCalendario', ensureAuthentication, async function(req, res){  
  console.log(req.user.id)
  const userr = await User.findOne({ _id : req.user.id})
  const a_t = userr.googleAccessToken    // PRENDI L'ACCESS TOKEN SALVATO NEL DB QUANDO TI SEI OAUTENTICATO
  console.log(a_t)
  var options = {
    headers: {'Authorization': 'Bearer '+a_t,
    'Accept': 'application/json',
    'Content-Type': 'application/json'},
    url: 'https://www.googleapis.com/calendar/v3/calendars',
    json : {
      'summary':'CalendarioTWE'    // crea il calendTWE nel tuo account GOOGLE  (4,5 SECONDI)
    }
    
  };

  var optionsList = {
    headers: {'Authorization': 'Bearer '+a_t,
    'Accept': 'application/json',
    'Content-Type': 'application/json'},
    url: 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    
  };



  request.get(optionsList, function callback(error, response, body){
    console.log('eccolo')
    console.log(response.statusCode)
    var info = JSON.parse(body).items;
    //console.log(info);
    var l = info.length;
    console.log(l);
    for (let i = 0; i<l; i++){
      var calendarioi = info[i].summary;
      if (calendarioi == 'CalendarioTWE'){
        res.render('manager');
        console.log("Calendario gia presente");
        return;
      }
         
    }
    // console.log(nomi);
    request.post(options, async function callback (error, response, body) {
      console.log('eccolo')
      console.log(response.statusCode)
      console.log(body.id);
      const calendarid = body.id;
      const n = await User.updateOne({ _id : userr._id }, { calendarTwe: calendarid });
      var info = body;
      console.log(n);
      res.redirect('http://localhost:8888');
    });  

  });
  
  
});



router.post('/aggiungiEvento', ensureAuthentication, async function(req,res){
  const mesi = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const userr = await User.findOne({ _id : req.user.id})
  const calendarid = userr.calendarTwe;
  console.log(calendarid)
  

  const citta = req.body.luogo;
  const data = req.body.dataCart;
  var summary = "Visito " + citta;

  const postcard = await Postcard.findOne({user: req.user.id, city: citta, giorno: data})

  console.log(postcard)
  if(postcard === null) {
    console.log('ma che voi')
    res.redirect('http://localhost:8888')
    return
  }
  const giornoaa = parseInt(data.split('-')[2])
  const datatoParse = mesi[parseInt(data.split('-')[1]) - 1]+' '+giornoaa+', 2021'
  console.log(datatoParse)
  const dateStart = new Date(datatoParse)
  console.log(dateStart)
  var options = {
    headers: {'Authorization': 'Bearer '+userr.googleAccessToken,
    'Accept': 'application/json',
    'Content-Type': 'application/json'},
    url: 'https://www.googleapis.com/calendar/v3/calendars/'+calendarid+'/events',
    json : {
      'location' : citta,
      'summary' : summary,
      'end': {
        'dateTime':dateStart
      },
      'start': {
        'dateTime':dateStart
      },
      
    }
  };
  request.post(options, async function callback (error, response, body) {
    console.log('eccolo')
    console.log(response.statusCode)
    //console.log(response)
    //console.log(body.id);
    
    
    res.redirect('http://localhost:8888');
  });  
})


    
module.exports = router;









