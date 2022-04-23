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



// mf: Devo iniziare a copiare da qui
router.post('/',function(req, res) {
	
    console.log("POST ./twe  hitted");

	var valAggiunto = {
		city : "",
		temp : 0,
		//modifica greve in corso
		pressure: 0,
		humidity: 0,

		//modifica greve finita
		lat : 0,
		lon : 0,
		hotels: [],
		foto: "",
		data: "",
		meteo: ""
	};
	var citta = req.query.citta;
	var giorno=req.query.g;
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
			console.log(valAggiunto.foto)



			
			
    	})
			

	// Chiamata REST a OWM per ottenere le condizioni climatiche
    url='http://api.openweathermap.org/data/2.5/forecast/?q='+citta+'&lang=it&appid='+opwAppId+"&units=metric";
    var chiamata=require('request');
    chiamata.get(url,function callback(error,response){
      if(error) 
	  	console.log(error);
      else{
		  const currentHour = Math.ceil(new Date().getHours())
		  const todayRes = Math.floor((24 - currentHour)/3) - 1
		  const g = todayRes + 7*giorno
		  //console.log(currentHour)
          var info=JSON.parse(response.body);
		  console.log("x"+info);
		  if(info.list==undefined){
		 	 res.send({
			"message": {
				"header": {
				"message": "Errore, citta non trovata",
				},
				"body": {}
			}
					})
			}
		else {
	  	  var out=info.list[giorno].main;
			console.log(out)
			console.log('PAUSA')
			//console.log(info.list);
			var weather=JSON.stringify(info.list[giorno].weather);
			
			//valAggiunto.meteo
			var me=JSON.parse(weather);
			var meteo=me[0].description;
			valAggiunto.meteo=meteo;


			var days=info.list[giorno].dt_txt;
			var d=days.split(" ");
			var day=d[0];
			valAggiunto.data=day;
		  
		  // coordinate passate a mano
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
				res.send({
					"message":{
						"header":{
							"status_code": 200
						},
						"body":{
							'city' : valAggiunto.city,
							'tempe':valAggiunto.temp,
							'lat': valAggiunto.lat,
							'long':valAggiunto.lon,
							'pressione':valAggiunto.pressure,
							'umidità':valAggiunto.humidity,
							'hotel1': valAggiunto.hotels[0],
							'hotel2': valAggiunto.hotels[1],
							'hotel3': valAggiunto.hotels[2],
							'data': valAggiunto.data,
							'meteo': valAggiunto.meteo,
							'foto' : valAggiunto.foto,

						}
					}
			})
			}).catch (function(error) {
				res.status(404).send(
					{"message": {
						"header": {
						  "message": error.message
						},
						"body": {}
					}
				}
			)})

			}

		}



	});
});

module.exports = router;