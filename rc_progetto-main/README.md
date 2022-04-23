# TWE
Progetto di reti di calcolatori anno accademico 2020/21

Il progetto consiste nella creazione di un servizio RESTful accessibile via web che offra API all'esterno. <br>
<h1>Requisiti:</h1>
1) Il servizio REST che implementate (lo chiameremo SERV) deve offrire a terze parti delle API documentate. <br>
2) SERV si deve interfacciare con almeno due servizi REST di terze parti (e.g. google maps). <br>
3) Almeno uno dei servizi REST esterni deve essere “commerciale” (es: twitter, google, facebook, pubnub, parse, firbase etc). <br>
4) Almeno uno dei servizi REST esterni deve richiedere oauth (e.g. google calendar), Non è sufficiente usare oauth solo per verificare le credenziali è necessario accedere al servizio. <br>
5) La soluzione deve prevedere l'uso di protocolli asincroni. Per esempio Websocket e/o AMQP (o simili es MQTT). <br>
6) Il progetto deve essere su GIT (GITHUB, GITLAB ...) e documentato don un README che illustri almeno : <br>
	-scopo del progetto <br>
	-architettura di riferimento e tecnologie usate (con un diagramma) <br>
	-chiare indicazioni sul soddisfacimento dei requisiti <br>
	-istruzione per l'installazione <br>
	-istruzioni per il test <br>

<h1>Avvio</h1>
<ul>
<li>Eseguire "npm install" per installare le dipendenze, esse verranno lette dal file "package.json" e installate.</li>
<li>Per avviare l'application server eseguire "node app.js".</li>
<li>Per avviare la chat aprire un altro terminale ed eseguire "node appChat.js" .</li>
</ul>

<h1>Descrizione</h1>
Il progetto Twe sfrutta le API fornite da Amadeus, OpenweatherMap, Teleport e Google Calendar per fornire un servizio aggiuntivo agli amanti dei viaggi. Attraverso Twe un cliente potrá ottenere informazioni utili sul clima e sulla disponibilità degli alberghi in base alla città che vuole visitare, e potrà inoltre creare, salvare su database ed eliminare delle Postcard dei suoi luoghi preferiti. Il cliente ha anche la possibilità di contattare gli sviluppatori per curiosità o problemi tecnici attraverso la chat integrata nel sito, che utilizza WebSocket.


<h1>API utilizzate</h1>
Le API utilizzate nel sito sono:
<ul>
<li><a href='https://developers.amadeus.com/'>Amadeus</a> </li>
<li><a href='https://developers.google.com/calendar'>Google Calendar</a> </li>
<li><a href='https://developers.teleport.org/api/'>Teleport</a> </li>
<li><a href='https://openweathermap.org/api'>OpenWeatherMap</a> </li>
</ul>


<h1>Tecnologie utilizzate</h1>
Tecnologie utilizzate per la realizzazione del progetto:
<ul>
<li>NodeJS</li>
<li>Express</li>
<li>Hbs</li>
<li>Socket.io</li>
<li>MongoDB/mongoose</li>
</ul>

<h1>Soddisfacimento requisiti</h1>
1) il servizio REST implementato offre a terze parti delle API documentate -> <br>
2) il servizio REST implementato si interfaccia con  almeno due servizi REST di terze parti -> Amadeus, Calendar, Openweather, Teleport.<br>
3) almeno uno dei servizi REST deve essere commerciale -> Amadeus, Google Calendar.<br>
4) almeno uno dei servizi REST esterni deve richiedere oAuth -> Google Calendar (Amadeus utlizza Client Credentials Flow).<br>
5) la soluzione deve prevedere l'uso di protocolli asincroni -> WebSocket per la chat con gli sviluppatori. <br>


<h1>Casi di test</h1>
<strong>GetPostcard</strong>
<ul>
	<li> URL: /getPostcard </li>
	<li> Metodo: 'GET' </li>
	<li> Parametri Url: 'token'=twetoken&'luogo'='florence'&'data'='2021-06-14' </li>
	<li> Risposta con successo </li> <ul>
		<li>code: 200 -> OK</li>
		<li>content: {
			  "message": {
			    "header": {
			      "status_code": 200
			    },
			    "body": {
			      "createAt": "2021-06-11T06:58:58.034Z",
			      "_id": "60c309f24008891cd6e6cdc0",
			      "city": "florence",
			      "user": "60c30723580edc1a1bcbe5fe",
			      "firstName": "Twe",
			      "giorno": "2021-06-14",
			      "foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/florence_web-9bdb5ab7cf.jpg",
			      "__v": 0
			    }
			  }
			} 
		</li>
	</ul>
</ul>
		
<strong>GetPostcardByCity</strong>
<ul>
	<li> URL: /getPostcardByCity </li>
	<li> Metodo: 'GET' </li>
	<li> Parametri Url: 'token'=twetoken&'luogo'='florence' </li>
	<li> Risposta con successo </li> <ul>
		<li>code: 200 -> OK</li>
		<li>content:
					{
		    "message": {
			"header": {
			    "status_code": 200
			},
			"body": [
			    {
				"createAt": "2021-06-11T06:58:58.034Z",
				"_id": "60c309f24008891cd6e6cdc0",
				"city": "florence",
				"user": "60c30723580edc1a1bcbe5fe",
				"firstName": "Twe",
				"giorno": "2021-06-14",
				"foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/florence_web-9bdb5ab7cf.jpg",
				"__v": 0
			    }
			]
		    }
		}
		</li>
	</ul>
</ul>	
		
<strong>GetAllPostcards</strong>		
<ul>
	<li> URL: /api/getAllPostcards </li>
	<li> Metodo: 'GET' </li>
	<li> Parametri Url: 'token'=twetoken </li>
	<li> Risposta con successo </li> <ul>
		<li>code: 200 -> OK</li>
		<li>content: {
		  "message": {
		    "header": {
		      "status_code": 200
		    },
		    "body": [
		      {
			"createAt": "2021-06-11T06:58:58.034Z",
			"_id": "60c309f24008891cd6e6cdc0",
			"city": "florence",
			"user": "60c30723580edc1a1bcbe5fe",
			"firstName": "Twe",
			"giorno": "2021-06-14",
			"foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/florence_web-9bdb5ab7cf.jpg",
			"v": 0
		      },
		      {
			"createAt": "2021-06-11T06:58:58.034Z",
			"_id": "60c30a264008891cd6e6cdc1",
			"city": "berlin",
			"user": "60c30723580edc1a1bcbe5fe",
			"firstName": "Twe",
			"giorno": "2021-06-14",
			"foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/berlin_web-42996a2587.jpg",
			"v": 0
		      },
		      {
			"createAt": "2021-06-11T07:10:05.217Z",
			"_id": "60c30c837973701da36677df",
			"city": "turin",
			"user": "60c30723580edc1a1bcbe5fe",
			"firstName": "Twe",
			"giorno": "2021-06-15",
			"foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/turin_web-d91d1c8483.jpg",
			"v": 0
		      },
		      {
			"createAt": "2021-06-11T07:10:05.217Z",
			"_id": "60c30ce77973701da36677e0",
			"city": "warsaw",
			"user": "60c30723580edc1a1bcbe5fe",
			"firstName": "Twe",
			"giorno": "2021-06-14",
			"foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/warsaw_web-d6a52b39b9.jpg",
			"v": 0
		      }
		    ]
		  }
		}
		</li>			
	</ul>	

</ul>	
		
<strong>Twe</strong>
<ul>
	<li> URL: /twe </li>
	<li> Metodo: 'GET' </li>
	<li> Parametri Url: 'citta'='milan'&'g'=2 </li>
	<li> Risposta con successo <ul>
		<li>code: 200 -> OK</li>
		<li>content: {
			  "message": {
			    "header": {
			      "status_code": 200
			    },
			    "body": {
			      "city": "milan",
			      "tempe": 25.05,
			      "lat": 45.4643,
			      "long": 9.1895,
			      "pressione": 1015,
			      "umidità": 62,
			      "hotel1": {
				"hotelName": "CROWNE PLAZA MILAN CITY",
				"hotelRating": "3",
				"hotelTelephone": "+39 02 66717715"
			      },
			      "hotel2": {
				"hotelName": "MELIA MILANO",
				"hotelRating": "4",
				"hotelTelephone": "39-02-44406"
			      },
			      "hotel3": {
				"hotelName": "Best Western Hotel Blaise & Francis",
				"hotelRating": "3",
				"hotelTelephone": "+39 02 36644780"
			      },
			      "data": "2021-06-11",
			      "meteo": "pioggia leggera",
			      "foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/milan_web-b92932c77a.jpg"
			    }
			  }
			}
					
		

</ul>	
		
<strong>mf<strong>
<ul>
	<li> URL: /mf </li>
	<li> Metodo: 'GET' </li>
	<li> Parametri Url: 'citta'='florence'&'g'=3 </li>
	<li> Risposta con successo </li><ul>
		<li>code: 200 -> OK</li>
		<li>content: {
			  "message": {
			    "header": {
			      "status_code": 200
			    },
			    "body": {
			      "city": "florence",
			      "temperature": 19.24,
			      "meteo": "nubi sparse",
			      "foto": "https://d13k13wj6adfdf.cloudfront.net/urban_areas/florence_web-9bdb5ab7cf.jpg"
			    }
			  }
			}
		</li>		
	</ul>	

</ul>
		
<strong>deleteUser</strong>
<ul>
	<li> URL: /api/deleteUser </li>
	<li> Metodo: 'GET' </li>
	<li> Parametri Url: 'token'=twetoken </li>
	<li> Risposta con successo </li> <ul>
		<li>code: 200 -> OK</li>
		<li>content: {
			"message":{
			    "header":{
				"status_code": 200
			    },
			    "body": "User deleted"
			}
		}	
		</li>			
	</ul>	

</ul>		
		
		
