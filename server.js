
console.log(`Starting server.js`);

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

var app = express();

var logger =function(req,res,next){
  console.log('Logging');
  next();
}
app.use(logger);

//writing docu for body parser
app.use(bodyParser.json);

//place to put static resource like css files, jquery
//set static path , 'public' is name of the folder
//if an index.html is present in /public folder, it will always overwrite the home page of this server.js
app.use(express.static(path.join(__dirname,'public')) ;

//inorder not to rs the server everytime we make a change

app.use(logger);



//homepage
app.get('/',function(req,res){
  res.send('Home page. (Express server)');

});
//server listen fn
app.listen(port,function(){
  console.log('Server Started on Port:'+ port +',IP:'+ hostname +'  ...');
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

