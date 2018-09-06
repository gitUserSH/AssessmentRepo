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
    app.get('/api/commonstudents',function(req,res) {
        console.log('/api/commonstudents page loaded');
        /*
        console.log(req.param.teacher);
        console.log(req.param);
        console.log(req.query);
        console.log(req.query.teacher);
        
        console.log(teacherArray[0]);
        console.log(teacherArray[1]);
        //localhost:3000/api/commonstudents?teacher=TeacherJasmine%40gmail.com&teacher=TeacherKen%40gmail.com
        */
        var teacherArray = req.query.teacher;

        //if theres input error
        if(teacherArray.length === 0)
        {
            res.status(400);
            var jsonErrorMessage = jsonErrorMessageGenerator('Teachers Array is empty');
            res.json(jsonErrorMessage);
        }
        var returnStringObj = {} // empty Object
        var key = "students";
        returnStringObj[key] = []; // empty Array, which you can push() values into

        //var commonStudentsArray = [];


        dbManager.retrieveCommonStudents(teacherArray,function (err, result) {
            if (err) {
                res.status(500); 
                var jsonErrorMessage = jsonErrorMessageGenerator('Error while retriving common student');
                res.json(jsonErrorMessage);
            }
            else {
                var rows = JSON.parse(JSON.stringify(result));
                //console.log(result);
                //console.log(rows);

                for(var i = 0; i < rows.length ; i++ ){     
                    console.log("row i: "+rows[i].StudentEmail);
                    returnStringObj[key].push(rows[i].StudentEmail);
                
                }
            }
        
            console.log("returnStringObj "+returnStringObj[key]);
            var jsonReturnObject = JSON.stringify(returnStringObj);
            console.log("jsonReturnObject: " + jsonReturnObject);
            res.json(jsonReturnObject);
        });

    });
    


    // API 4 : given a specified student suspend him/her
    app.post('/api/retrievefornotifications',function(req,res){
        console.log('/api/retrievefornotifications page loaded');
      
        var teacher = req.body.teacher;
        var notification = req.body.notification;
        if(teacher.length === 0)
        {
            res.status(400);
            var jsonErrorMessage = jsonErrorMessageGenerator('Teacher Email is blank');
            res.json(jsonErrorMessage);
        }
   
        var arrayOfMentionedStudents = findEmailAddresses(notification);
        if(arrayOfMentionedStudents === null)
        {
            arrayOfMentionedStudents =[];
        }
        console.log('arrayOfMentionedStudents ' + arrayOfMentionedStudents);

        var returnStringObj = {} // empty Object
        var key = "recipients";
        returnStringObj[key] = []; // empty Array, which you can push() values into

        //var commonStudentsArray = [];


        dbManager.retrieveForNotifications(teacher, arrayOfMentionedStudents ,function (err, result) {
            if (err) {
                res.status(500); 
                var jsonErrorMessage = jsonErrorMessageGenerator('Error while retriving students for notification');
                res.json(jsonErrorMessage);
                throw err;
            }
            else {
                var rows = JSON.parse(JSON.stringify(result));
                console.log(rows);
                //console.log(rows);

                for(var i = 0; i < rows.length ; i++ ){     
                    console.log("row i: "+rows[i].Email);
                    console.log("row i: "+rows[i]);
                    returnStringObj[key].push(rows[i].Email);
                
                }
                res.status(200); 
                console.log("returnStringObj "+returnStringObj[key]);
                var jsonReturnObject = JSON.stringify(returnStringObj);
                console.log("jsonReturnObject: " + jsonReturnObject);
                res.json(jsonReturnObject);

            }
        
            
        });


        /*
        dbManagerDBConnection.query(sql, data, (err, results) => {
            if (err){
                throw err;
            }
            var rows = JSON.parse(JSON.stringify(result));
            //console.log(result);
            //console.log(rows);

            //loop through
            for(var i = 0; i < rows.length ; i++ ){     
                console.log("row i: "+rows[i].StudentEmail);
               if(!arrayOfMentionedStudents.includes(rows[i].StudentEmail) )
                {
                    arrayOfMentionedStudents.push(rows[i].StudentEmail);
                }
            }

            //now we have array of students that @mentioned || registered
        });
        */
        //res.status(204);
        //res.send('/api/retrievefornotifications is successful');
    });

    function findEmailAddresses(StrObj) {
        var separateEmailsBy = ", ";
        var email = "<none>"; // if no match, use this
        
        var emailsArray = StrObj.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        
        return  emailsArray;
        /*
        if (emailsArray) {
            email = "";
            for (var i = 0; i < emailsArray.length; i++) {
                if (i != 0) email += separateEmailsBy;
                email += emailsArray[i];
            }
        }
        return email;
        */
    }

    function jsonErrorMessageGenerator (messageString) {
        var jsontoSend = { "message": messageString }

        var jsonReturnobj = JSON.stringify(jsontoSend);

        return jsonReturnobj;
    }
}

//exports this file function
module.exports = appRouter;
module.exports.testStringInroute = testStringInroute;



