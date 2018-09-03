
console.log(`Starting server.js`);
//inorder not to rs the server everytime we make a change, npm install nodemon -g

//importing of modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

//const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

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

//view engine set as ejs
app.set('view engine','ejs');
//specify folder for view
app.set('views',path.join(__dirname,'views'));

//writing docu for body parser, middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//place to put static resource like css files, jquery
//set static path , 'public' is name of the folder
//if an index.html is present in /public folder, it will always overwrite the home page of this server.js
app.use(express.static(path.join(__dirname,'public'))) ;


var usersArray = [
  {
    id : 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'jd@gmail.com'
  },
  {
    id : 2,
    first_name: 'bob',
    last_name: 'qqq',
    email: 'bbqq@gmail.com'
  }
]

//homepage
app.get('/',function(req,res){

  //res.send('Home page. (Express server)');
  //pass in index
  res.render('index',{

    //var on the left is from the ejs file
    title: 'Customers',
    users: usersArray
  });
});

app.post('/users/add',function(req,res){
  //console.log(req.body.first_name);
  var userObj = {
    first_name : req.body.first_name,
    last_name : req.body.last_name
  }

  console.log(userObj);
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


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/

