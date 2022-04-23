//Restituisce meteo e foto data una citta



var express = require('express');
var router = express.Router();
var axios = require('axios').default;
router.use(express.urlencoded({extended:false}));



// secrets OPW
const opwAppId = process.env.OWM_KEY; // non pushare sul repo


router.get('/', function(req, res) {
	
    console.log("POST ./mf  hitted");

	var valAggiunto = {
		city : "",
		temp : 0,
		meteo: "",
		foto : ""

	};
	var citta = req.query.citta;
    
	var giorno=parseInt(req.query.g);
    var cittaminuscola=citta.toLowerCase();
	valAggiunto.city = citta;
	var url;


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
      if(error){
        res.status(404).send(
            {"message": {
                "header": {
                  "message": error.message
                },
                "body": {}
            }
        })
      } 
	  	
      else{
        var info=JSON.parse(response.body);
		  //console.log(info.list);
        if(info==undefined){
            res.send(
                {"message": {
                    "header": {
                      "message": "Citta sbagliata"
                    },
                    "body": {}
                }
            })
        





        }


        else{
		 
	  	  var out=info.list[giorno].main;
        


        var weather=JSON.stringify(info.list[giorno].weather);
        var me=JSON.parse(weather);
        var meteo=me[0].description;
        valAggiunto.meteo=meteo;
			
		  
	    
		valAggiunto.temp = out.temp;
		lat = info.city.coord.lat;
		lon = info.city.coord.lon;

        
        res.send({
            "message" : {
                "header": {
                    "status_code":200
                },
                "body" :{
                    "city" : citta,
                    "temperature" : valAggiunto.temp,
                    "meteo" : meteo,
                    "foto" : valAggiunto.foto
                }
            }
        });
        
		 
		}

    }

	});
});

module.exports = router;