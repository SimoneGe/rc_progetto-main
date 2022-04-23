var express = require('express');
var request = require('request');
var axios   = require('axios').default;
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const socket = require('socket.io');
const PORT=8000;

const exphbs = require('express-handlebars') 


const input=require('console-read-write');

const readline=require('readline');
const rl=readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});



const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

// HBS per pagine html dinamiche
app.engine('.hbs', exphbs({defaultLayout: 'main',extname: '.hbs'}))
app.set('view engine', '.hbs')

var nome;

app.get("/", function(req,res){
	console.log("GET ./ hitted for utente: "+req.query.utente);
	nome=req.query.utente;
    res.render("chat", {utente: req.query.utente, risposta:""});
	
});

//WEB SOCKET
const io = socket(server);

io.on('connection', function (socket) {
	console.log("Made socket connection with: "+nome);
	//var msg=prompt("scrivi");
	socket.on('message', function(message){
		
		//console.log("Ho ricevuto: "+message);
		//var msg=readline();

		/*rl.question(testo+"\n", (answer)=>{
			//console.log(message+"\n"+answer);
			console.log("qui");
			socket.emit('message', answer);
			
			invio=answer;
			rl.close();
		});*/
		console.log(">"+nome+": "+message+"\n");
		rl.on("line", (line)=>{
			socket.emit('message', line);

		})
		
		
	});
	
});