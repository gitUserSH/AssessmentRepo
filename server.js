
console.log(`Starting server.js`);
//inorder not to rs the server everytime we make a change, npm install nodemon -g

//importing of modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mysql      = require('mysql');

//this is the file that impletments the routes
var routes = require("./routes.js");



//const http = require('http');
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

var app = express();





/*
var logger =function(req,res,next){
  console.log('Logging');
  next();
}
app.use(logger);
*/

//run command npm install in the terminal(while inside the sourcecode folder)
// ejs Embedded JavaScript, template engine



//writing docu for body parser, middleware
//The two lines tells express to accept both JSON and url encoded values
// not using app.use(bodyParser()); because it involves bodyParser.multipart with security risks.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//place to put static resource like css files, jquery
//set static path , 'public' is name of the folder
//if an index.html is present in /public folder, it will always overwrite the home page of this server.js
app.use(express.static(path.join(__dirname,'public'))) ;



routes(app);



app.get('/myTestPage',function(req,res){
  //console.log(req.body.first_name);

  console.log(routes.testStringInroute);

  res.send(routes.testStringInroute);
});
app.post('/users/add',function(req,res){
  //console.log(req.body.first_name);
  var userObj = {
    first_name : req.body.first_name,
    last_name : req.body.last_name
  }

  console.log(userObj);
});





function postJson (path, data) {

  return fetch(path, {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
}
app.get('/postJsonTest',function(req,res){
  console.log('running postJsonTest');

  var jsontoSend = [
      {
          name:'jeff',
          pw:'qweqwe'
      }
  ]
  
  //postJson('localhost:3000/receiveJson', jsontoSend);

  req.url = '/receiveJson';
  req.body = JSON.stringify(jsontoSend); 
  //req.method = 'POST' ;

  // below is the code to handle the "forward".
  // if we want to change the method: req.method = 'POST'        
  return app._router.handle(req, res);



  //postJson('/createUser', { username, password })
  //postJson('/receiveJson', { '', '' });
});

app.get('/receiveJson',function(req,res){
  console.log('running receiveJson');
  console.log(req.body);
  console.log(req.body.name);
  res.send(req.body.name);
  
});







//server listen fn
app.listen(port,function(){
  console.log('Server Started on Port:'+ port +',IP:'+ hostname +'  ...');
});

//console.log(`Server created`);





/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  res.end('Hello Worlddskfbdsihbdividjfv \n'); 

});


var logger =function(req,res,next){
  console.log('Logging');
  next();
}
app.use(logger);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/

