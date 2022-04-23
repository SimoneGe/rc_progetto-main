var express = require('express');
var router = express.Router();
var axios = require('axios').default;
router.use(express.urlencoded({extended:false}));
const { ensureAuthentication, ensureGuest } = require('../../middleware/auth')


const apitok = process.env.AMADEUS_API_TOKEN; // non pushare sul repo 
const apisec = process.env.AMADEUS_API_SECRET; // non pushare sul repo

// secrets OPW
const opwAppId = process.env.OWM_KEY; // non pushare sul repo

//Dove prendere il token di Amadeus
var urlgetTok = process.env.AMADEUS_URL_TOKEN;

// Token Amadeus
var token;

//Setup delle chiavi di autorizzazione
let headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
let contenuto = "grant_type=client_credentials&client_id="+apitok+"&client_secret="+apisec;

axios.post(urlgetTok, contenuto, {
    headers : headers
}).then(function(res) {
    var info =  JSON.parse(JSON.stringify(res.data));
    token = info.access_token;
   });




router.post('/locationInfo', ensureAuthentication,  function(req, res) {
	
    console.log("POST ./travel  hitted");

	var valAggiunto = {
		city : "",
		temp : 0,
		
		pressure: 0,
		humidity: 0,

		
		lat : 0,
		lon : 0,
		hotels: [],
		foto: "",
		data: "",
		meteo: ""
	};
	var citta = req.body.dest;
	var giorno=req.body.quando;
	valAggiunto.city = citta;
	var url;
	
	//console.log(citta);
	cittaminuscola=citta.toLowerCase();

	//Chiamata a Teleport
	var urlx="https://api.teleport.org/api/urban_areas/slug:"+cittaminuscola+"/images";
    		var chiamata=require('request');
    		chiamata.get(urlx,function callback(error,response){
        
            var Contenuto=JSON.parse(response.body);
            var photo=Contenuto.photos;
           
			var fot=photo[0].image;
			console.log(fot.web);
			valAggiunto.foto=photo[0].image.web;
			
    		})
			

	// Chiamata REST a OWM per ottenere le condizioni climatiche
    url='http://api.openweathermap.org/data/2.5/forecast/?q='+citta+'&lang=it&appid='+opwAppId+"&units=metric";
    var chiamata=require('request');
    chiamata.get(url,function callback(error,response){
      if(error) 
	  	console.log(error);
      else{
		  const currentHour = Math.ceil(new Date().getHours())
		  const todayRes = Math.floor((24 - currentHour)/3) - 1 //occhio all'ora
		  const g = todayRes + 7*giorno
		  //console.log(currentHour)
          var info=JSON.parse(response.body);
		  console.log(info.list);
		  
	  	  var out=info.list[g].main;
			console.log(out)
			console.log('PAUSA')
			//console.log(info.list);
			var weather=JSON.stringify(info.list[g].weather);
			
			//valAggiunto.meteo
			var me=JSON.parse(weather);
			var meteo=me[0].description;
			valAggiunto.meteo=meteo;


			var days=info.list[g].dt_txt;
			var d=days.split(" ");
			var day=d[0];
			valAggiunto.data=day;
		  
		  
		  valAggiunto.temp = out.temp;
		  valAggiunto.pressure = out.pressure,
		  valAggiunto.humidity = out.humidity,
		  valAggiunto.lat = info.city.coord.lat;
		  valAggiunto.lon = info.city.coord.lon;


		  // Chiamata REST verso Amadeus  per ottenere gli hotel
		  let beartok = 'Bearer ' + token;
    	  let headpost = {'Authorization' : beartok};
    	  var urlreq = "https://test.api.amadeus.com/v2/shopping/hotel-offers?latitude="+valAggiunto.lat +"&longitude="+valAggiunto.lon+"&radius=300"; 

		  axios.get(urlreq, {
			  headers : headpost
		  }).then( function(ress) {
			  var info = JSON.parse(JSON.stringify(ress.data));
			  var hotels = JSON.parse(JSON.stringify(info.data));
			  var l = hotels.length;
			  let i;
			  for (i = 0; i < l; i++) {
				  valAggiunto.hotels.push({
					  hotelName : hotels[i].hotel.name,
					  hotelRating : hotels[i].hotel.rating,
					  hotelTelephone : hotels[i].hotel.contact.phone
			  		})
				}

			  // Risultato completo 
			  console.log(valAggiunto);

			  //res.send(valAggiunto);
			  try {
				
				
				res.render('manager', {
					viaggio:true,
					foto : valAggiunto.foto,
					city : valAggiunto.city,
					temperatura:valAggiunto.temp,
					pressione:valAggiunto.pressure,
					umidità:valAggiunto.humidity,
					lat: valAggiunto.lat,
					long:valAggiunto.lon,
					hotels : valAggiunto.hotels,
					data: valAggiunto.data,
					meteo: valAggiunto.meteo,
					name: req.user.firstName,
					tempe : valAggiunto.temp

				})
			} catch (error) {
				console.error(error)
				res.render('error/500')
			}

			});
			

		}



	});
});

module.exports = router;