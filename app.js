var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));



app.set("view engine", "html");

app.get("/", function(req, res){
    
     res.sendfile("index.html");
});


const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, function(){
    console.log("server started");
});