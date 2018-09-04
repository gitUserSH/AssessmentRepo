var path = require('path');
var mysql      = require('mysql');

var isSchoolDBCreated = false;
var isTeacherTableCreated = false;

var emptyDBConnection = mysql.createConnection({
    host     : 'localhost',
    port     :' 3306',
    user     : 'root',
    password : '',
    //database : 'School'
});
emptyDBConnection.connect( (err) =>{
    if(err){
       console.log('emptyDBConnection connect() err');
       console.log(err);
       throw err;
    
    }
    console.log('Mysql DB(empty) connected...');
});

var DBConnection = mysql.createConnection({
     host     : 'localhost',
     port     :' 3306',
     user     : 'root',
     password : '',
     database : 'School'
});

var testStringInroute = 'mystring';
//implement the appRouter function, basically just takes in the app(express) obj and use it to call the routing functions 
var appRouter = function (app) {

    //view engine set as ejs
    app.set('view engine','ejs');
    //specify folder for view
    app.set('views',path.join(__dirname,'views'));

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
        res.status(200);
       //res.status(200).send({ message: 'Welcome to our restful API' });
        //res.setHeader('Content-Type', 'text/plain');
        //res.send('Home page. (Express server)');
        //pass in index
        res.render('index',{
            //var on the left is from the ejs file
            title: 'Customers',
            users: usersArray
        });
    });
  
    //this rotue creates the db when theres no such db
    app.get('/createDB',function(req,res) {
        console.log('createDB Page loaded');
        
        if(isSchoolDBCreated == false) {
            //res.send('CreateDB page.');
            let sql = 'CREATE DATABASE School'
            emptyDBConnection.query(sql, (err, result)=> {
                if(err){
                    throw err;
                }
                console.log(result);
                res.send('DB created...');
            });
            
            isSchoolDBCreated = true;
        }//end if db not created yet
        else
        {
            res.send('DB Already exists...');
        }
    });
    
    //this route creates a Teacher table in the db
    //call ohly after the db is created
    app.get('/createSQLTableTeacher',function(req,res) {
        console.log('createSQLTableTeacher Page loaded');
        
        if(isTeacherTableCreated == false) {

            DBConnection.connect( (err) =>{
                if(err){
                    console.log('DBConnection() connect err');
                    console.log(err);
                    throw err;
                }
                console.log('Mysql DB(school) connected...');
            });
            //res.send('CreateDB page.');
            let sql = 'CREATE TABLE Teacher(id int AUTO_INCREMENT, TeacherName VARCHAR(255), Email VARCHAR(255),  PRIMARY KEY (id))'
            DBConnection.query(sql, (err, result)=> {
                if(err){
                    throw err;
                }
                console.log(result);
                res.send('SQL Teacher Table created...');
            });
        }
        else
        {
            res.send('Teacher Table Already exists...');
        }
    });


    app.post('/users/add',function(req,res){
        //console.log(req.body.first_name);
        var userObj = {
          first_name : req.body.first_name,
          last_name : req.body.last_name
        }
      
        console.log(userObj);
    });
}

//exports this file function
module.exports = appRouter;
module.exports.testStringInroute = testStringInroute;



