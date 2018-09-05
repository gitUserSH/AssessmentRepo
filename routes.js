var path = require('path');
var mysql      = require('mysql');

const fetch = require('node-fetch');//for

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
        console.log('HOME Page loaded');
        console.log(req.header);
        console.log(req.body);
        //res.sendStatus(200);// equivalent to res.status(200).send('OK')  //res.status(200);
        
        //res.setHeader('Content-Type', 'text/plain');
        //res.send('Home page. (Express server)');
        //pass in index
        
        res.render('index',{
            //var on the left is from the ejs file
            title: 'Customers',
            users: usersArray
        });
        res.status(204);//).send({ message: 'Welcome to our restful API' });
    });
  
    app.post('/testpost',function(req,res){
        console.log('testpost loaded');
        console.log(req.header);
        console.log(req.body);
        console.log(req.body.students);
        //console.log(req.body.students.find(1));
        //res.sendStatus(200);// equivalent to res.status(200).send('OK')  //res.status(200);
        
        res.status(204);//.send({ message: 'Welcome to our restful API' });

        res.send('testpost page. (Express server)');
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
    app.get('/createSQLTables',function(req,res) {
        console.log('createSQLTables Page loaded');
        
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
            var sql = 'CREATE TABLE Teachers(Email VARCHAR(255) NOT NULL, PRIMARY KEY (Email))'
            DBConnection.query(sql, (err, result)=> {
                if(err){
                    throw err;
                }
                console.log(result);
                console.log('SQL Teachers Table created...');
                
            });
            
            sql = 'CREATE TABLE Students(Email VARCHAR(255) NOT NULL, RegisteredTeacherEmail VARCHAR(255) ,Suspended BOOL NOT NULL, PRIMARY KEY (Email))'
            DBConnection.query(sql, (err, result)=> {
                if(err){
                    throw err;
                }
                console.log(result);
                console.log('SQL Students Table created...');
                
            });


           
            res.send('SQL Teacher,Student Tables created...');
        }
        else
        {
            res.send('Tables Already exists...');
        }
    });//end /createSQLTables

    app.get('/insertSQLdummyValues',function(req,res) {
        console.log('insertSQLdummyValues Page loaded');
        

        var sql = "INSERT INTO Teachers ( Email) VALUES ( 'TeacherJasmine@gmail.com'), ( 'TeacherKen@gmail.com'),  ( 'TeacherJim@gmail.com')";
        DBConnection.query(sql, (err, result)=> {
            if(err){
                throw err;
            }
            console.log(result);
            console.log('SQL Teacher Table VALUES INSERTED...');
        });

        sql = "INSERT INTO Students ( Email,RegisteredTeacherEmail, Suspended) VALUES ( 'StudentA@gmail.com', null ,false), ( 'StudentB@gmail.com', 'TeacherKen@gmail.com', false),  ( 'StudentC@gmail.com',null, true)";
        DBConnection.query(sql, (err, result)=> {
            if(err){
                throw err;
            }
            console.log(result);
            console.log('SQL Students Table VALUES INSERTED...');
        });
        res.send('Dummy Values inserted...');
    });//end /insertSQLdummyValues


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

}

//exports this file function
module.exports = appRouter;
module.exports.testStringInroute = testStringInroute;



