const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars') 
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db')


// Carica configurazioneee
// variabili  ambiente
// chiavi API

dotenv.config( {path: './config/config.env'})

// Configurare passport
require('./config/passport')(passport)

connectDB()

const app = express()


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
// Inizializza handlebars (roba simile a ejs, mi servivano le pagine come segan posto)
app.engine('.hbs', exphbs({defaultLayout: 'main',extname: '.hbs'}))
app.set('view engine', '.hbs')

// File statici (css, javascript (frontend), immagini)
app.use(express.static(path.join(__dirname, 'public')))

// Passport session
app.use(session({
    secret: 'keyboard cat',
    resave: false,    //dont create session if nothing change
    saveUninitialized: false,
    //Mongo Store
    store : MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
    
}))

// Passport middlewaree
app.use(passport.initialize())
app.use(passport.session())



// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

app.use('/travel', require('./routes/travel/locationInfo'))
app.use('/calendar',require('./routes/travel/calendar'))

var carto=require("./routes/travel/cartolina");
app.use("/cartolina", carto);


app.use('/profilo', require('./routes/profilo'));



//CHAT
var chat=require("./routes/chat");
app.use("/chat", chat);

//mf
var mf=require("./routes/api/mf");
app.use("/mf",mf);

//twe
var twe=require("./routes/api/twe");
app.use("/twe", twe);

//getPostcard
var postcard=require("./routes/api/getPostcard");
app.use("/card", postcard);

//getPostcardByCity
var postByCity=require("./routes/api/getPostcardsByCity");
app.use("/cardsByCity", postByCity);


//getAllPostcards
var allCards=require("./routes/api/getAllPostcards");
app.use("/api/getAllPostcards", allCards);

// deleteuser
app.use('/api/deleteUser', require('./routes/api/deleteUser'))


const PORT = process.env.PORT


app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)