var path = require('path');
var mysql      = require('mysql');

const fetch = require('node-fetch');//for

var isSchoolDBCreated = false;
var isTeacherTableCreated = false;

var dbManager = require("./DatabaseManager.js");

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
        var studentsArray = req.body.students;
       // var jsonobj = req.body.students;
        console.log("Logging Students Array");
        console.log("req.body.students Array[0] : "+req.body.students[0]);
        console.log("req.body.students Array[1] : "+req.body.students[1]);
        console.log("Students Array[0] : "+studentsArray[0]);
        console.log("Students Array[1] : "+studentsArray[1]);
        console.log("Students Array[2] : "+studentsArray[2]);
        console.log("req.body.students Array[0] : "+req.body.teacher.length);
        res.status(204);//.send({ message: 'Welcome to our restful API' });

        res.send('testpost page. (Express server)');
    });

    
    //this rotue creates the db when theres no such db
    app.get('/createDB',function(req,res) {
        console.log('createDB Page loaded');
        
        if(isSchoolDBCreated == false) {
            var result = dbManager.createDatabase();
            console.log('createDB result : '+result);
            if(result === 1) {
                res.send('DB created...');
            }
            else{
                //do err message
                res.send('Error creating DB....');
            }


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

            var result = dbManager.createTables();
            console.log('createSQLTables result : '+ result);
            if(result === 1) {
                res.send('SQL Teacher,Student Tables created...');
            }
            else{
                //do err message
                res.send('Error creating Tables....');
            }
        
        }
        else
        {
            res.send('Tables Already exists...');
        }
    });//end /createSQLTables

    app.get('/insertSQLdummyValues',function(req,res) {
        console.log('insertSQLdummyValues Page loaded');
        
        var result = dbManager.insertDummyValues();
        console.log('insertSQLdummyValues result : '+ result);
        if(result === 1) {
            res.send('Dummy Values inserted...');
        }
        else{
            //do err message
            res.send('Error inserting dummy values....');
        }
        
        
    });//end /insertSQLdummyValues

    // API 1 : given student/s and a teacher, reg the students to the teacher
    app.post('/api/register',function(req,res){
        console.log('/api/register page loaded');
        console.log(req.header);
        console.log(req.body);
        console.log(req.body.students);
  
        var teacherEmail = req.body.teacher;
        var studentsArray = req.body.students;

        console.log("Logging Students Array");
        console.log("req.body.students Array[0] : "+req.body.students[0]);
        console.log("req.body.students Array[1] : "+req.body.students[1]);
        console.log("Students Array[0] : "+studentsArray[0]);
        console.log("Students Array[1] : "+studentsArray[1]);
        console.log("Students Array[2] : "+studentsArray[2]);
        console.log("req.body.teacher.length : "+req.body.teacher.length);

        //if theres input error
        if(studentsArray.length === 0 || teacherEmail.length === 0)
        {
            res.status(400);
            var jsonErrorMessage;
            if(studentsArray.length === 0)
            {
                jsonErrorMessage = jsonErrorMessageGenerator('No students were inputed');
            }
            else
            {
                jsonErrorMessage = jsonErrorMessageGenerator('Teacher Email is empty');
            }
            res.json(jsonErrorMessage);
        }
        
        var result = dbManager.registerStudents(teacherEmail,studentsArray);
        if(result !=1 ) {
            res.status(500); 
            var jsonErrorMessage = jsonErrorMessageGenerator('Error while updating Students with registed teacher');
            res.json(jsonErrorMessage);
        }


        res.status(204);
        res.send('/api/register is successful');

    });



    // API 3 : given a specified student suspend him/her
    app.post('/api/suspend',function(req,res){
        console.log('/api/suspend page loaded');
      
        var student = req.body.student;

        //if theres input error
        if(student.length === 0)
        {
            res.status(400);
            var jsonErrorMessage = jsonErrorMessageGenerator('Student Email is empty');
            res.json(jsonErrorMessage);
        }
            
        var result = dbManager.suspendStudent(student);
        if(result !=1 ) {
            res.status(500); 
            var jsonErrorMessage = jsonErrorMessageGenerator('Error while suspending student');
            res.json(jsonErrorMessage);
        }
        res.status(204);
        res.send('/api/suspend is successful');
    });
  // API 2 : given teachers, retrive list of common students
  app.get('/api/commonstudents',function(req,res){
    console.log('/api/commonstudents page loaded');
    console.log(req.param.teacher);
    console.log(req.param);
    console.log(req.query);
    console.log(req.query.teacher);
    var teacherArray = req.query.teacher;
    console.log(teacherArray[0]);
    console.log(teacherArray[1]);
    //res.status(204);
    res.send('/api/commonstudents is successful');
});
    

    function jsonErrorMessageGenerator (messageString) {
        var jsontoSend = { "message": messageString }

        var jsonReturnobj = JSON.stringify(jsontoSend);

        return jsonReturnobj;
    }
}

//exports this file function
module.exports = appRouter;
module.exports.testStringInroute = testStringInroute;



