
console.log(`Starting server.js`);

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

var app = express();
app.get('/',function(req,res){
  res.send('Hello World.  (express)');
});

app.listen(port,function(){
  console.log('Server Started on Port:'+port+'...');
});
console.log(`Server created`);




/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  res.end('Hello Worlddskfbdsihbdividjfv \n'); 

});



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/

