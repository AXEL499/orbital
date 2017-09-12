var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");

//TODO
//~~make rocket/moon/planet models/textures~~
//add sounds
//add effects (screen shake, rocket thrust)
//use github at some point
//add more levels? :D
//balance
//make highscores hosted on mongodb

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));



app.set("view engine", "html");

app.get("/", function(req, res){
    
     res.sendfile("index.html");
});


//const hostname = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("server started");
});