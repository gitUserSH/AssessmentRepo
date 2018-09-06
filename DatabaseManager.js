
var mysql      = require('mysql');

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

module.exports.createDatabase =  function () {
  //res.send('CreateDB page.');
  let sql = 'CREATE DATABASE School'
  emptyDBConnection.query(sql, (err, result)=> {
      if(err){
          throw err;
          return err;
      }
      console.log(result);
      console.log('createDatabase function success...');
      
  });
  return 1;
}
module.exports.createTables =  function () {
    DBConnection.connect( (err) =>{
        if(err){
            console.log('DBConnection() connect err');
            console.log(err);
            throw err;
            return err;
        }
        console.log('Mysql DB(school) connected...');
    });
    //res.send('CreateDB page.');
    var sql = 'CREATE TABLE Teachers(Email VARCHAR(255) NOT NULL, PRIMARY KEY (Email))'
    DBConnection.query(sql, (err, result)=> {
        if(err){
            throw err;
            return err;
        }
        console.log(result);
        console.log('SQL Teachers Table created...');
        
    });
    
    sql = 'CREATE TABLE Students(Email VARCHAR(255) NOT NULL ,Suspended BOOL NOT NULL, PRIMARY KEY (Email))'
    DBConnection.query(sql, (err, result)=> {
        if(err){
            throw err;
            return err;
        }
        console.log(result);
        console.log('SQL Students Table created...');
        
    });

    sql = 'CREATE TABLE StudentsRegisteredToTeachers( id INT AUTO_INCREMENT, StudentEmail VARCHAR(255) NOT NULL, RegisteredTeacherEmail VARCHAR(255) , PRIMARY KEY (id))'
    DBConnection.query(sql, (err, result)=> {
        if(err){
            throw err;
            return err;
        }
        console.log(result);
        console.log('SQL StudentsRegisteredToTeachers Table created...');
        
    });


    console.log('createTables function success...');
    return 1;
}

module.exports.insertDummyValues =  function () {
    var sql = "INSERT INTO Teachers ( Email) VALUES ( 'TeacherJasmine@gmail.com'), ( 'TeacherKen@gmail.com'),  ( 'TeacherJim@gmail.com')";
    DBConnection.query(sql, (err, result)=> {
    if(err){
        throw err;
        return err;
    }
    console.log(result);
    console.log('SQL Teacher Table VALUES INSERTED...');
    });

    sql = "INSERT INTO Students ( Email, Suspended) VALUES ( 'StudentA@gmail.com' ,false), ( 'StudentB@gmail.com', false),  ( 'StudentC@gmail.com', true),  ( 'StudentD@gmail.com', true),  ( 'StudentE@gmail.com', false)";
    DBConnection.query(sql, (err, result)=> {
        if(err){
            throw err;
            return err;
        }
        console.log(result);
        console.log('SQL Students Table VALUES INSERTED...');
    });

    sql = "INSERT INTO StudentsRegisteredToTeachers ( StudentEmail, RegisteredTeacherEmail) VALUES ( 'StudentA@gmail.com' ,'TeacherJasmine@gmail.com'), ( 'StudentB@gmail.com', 'TeacherJasmine@gmail.com'),  ( 'StudentA@gmail.com', 'TeacherKen@gmail.com' ),  ( 'StudentC@gmail.com', 'TeacherKen@gmail.com'),  ( 'StudentD@gmail.com', 'TeacherJasmine@gmail.com') ,( 'StudentD@gmail.com', 'TeacherJim@gmail.com'),( 'StudentA@gmail.com', 'TeacherJim@gmail.com')";
    DBConnection.query(sql, (err, result)=> {
        if(err){
            throw err;
            return err;
        }
        console.log(result);
        console.log('SQL StudentsRegisteredToTeachers Table VALUES INSERTED...');
    });



    console.log('insertDummyValues function success...');
    return 1;
}

//reg students to a teacher
module.exports.registerStudents =  function (teacherEmail, studentArray) {
    console.log('  registerStudents function start. Registering to Teacher: '+teacherEmail);

    for (i = 0; i < studentArray.length; i++) {
        var student = studentArray[i]; // this is the email/primary key of the student
        console.log('  Updating student: '+ student);
                // update statment

        let sql = 'INSERT INTO StudentsRegisteredToTeachers ( StudentEmail, RegisteredTeacherEmail) VALUES (?,?)';
        let data = [student,teacherEmail];
        DBConnection.query(sql, data, (err, results) => {
            if (err){
                throw err;
            }
        });
        /*
        let sql = 'UPDATE Students SET RegisteredTeacherEmail = ? WHERE Email = ?';

        let data = [teacherEmail, student];

        // execute the UPDATE statement
        DBConnection.query(sql, data, (err, results) => {
            if (err){
                throw err;
            }
        });
        */

    }
    console.log('  registerStudents function completed successfully.');
    return 1;
}

//suspend a student to a teacher
module.exports.suspendStudent =  function (student) {
    console.log('  suspendStudent function start. Suspending to Teacher: '+student);
    let sql = 'UPDATE Students SET Suspended = ? WHERE Email = ?';

    let data = [true, student];

    // execute the UPDATE statement
    DBConnection.query(sql, data, (err, results) => {
        if (err){
            throw err;
        }
    });
    
    console.log('  suspendStudent function completed successfully.');
    return 1;
}
var retrieveCommonStudentsResult = [];
module.exports.retrieveCommonStudents =  function (teachersArray,callback) {
    console.log('  retrieveCommonStudents function start.');
    retrieveCommonStudentsResult = [];

    let sql = "SELECT StudentEmail FROM studentsregisteredtoteachers GROUP BY RegisteredTeacherEmail HAVING (RegisteredTeacherEmail =  '" + teachersArray[0] +"'";
    for (i = 1; i < teachersArray.length; i++) {

        //sql = sql + ", RegisteredTeacherEmail = '"+teachersArray[i] +"'" ;
        sql = sql + "OR RegisteredTeacherEmail = '"+teachersArray[i] +"'" ;
    }
    sql = sql + " ) ";
    //console.log(sql);

    // execute the UPDATE statement
    //var queryResult;
    DBConnection.query(sql, (err, results) => {
        if (err){
            return callback(err);
            throw err;
        }
        if(results.length){
            for(var i = 0; i < results.length ; i++ ){     
                retrieveCommonStudentsResult.push(results[i]);
            }
        }
        callback(null, retrieveCommonStudentsResult);
        console.log("retrieveCommonStudentsResult: "+retrieveCommonStudentsResult);

        //console.log(results.);
    });
    console.log('  retrieveCommonStudents function completed successfully.');
    return 1;
}

//module.exports.DBConnection = DBConnection;
var retrieveForNotificationsResult = [];
//given teacher and @mentioned students, find out which students can be notified
module.exports.retrieveForNotifications =  function (teacherEmail, studentArray,callback) {
    console.log('  retrieveForNotifications function start.');
    retrieveForNotificationsResult = [];
    /*
    SELECT * FROM `students` as A
        left outer join  `studentsregisteredtoteachers` as B on A.Email = B.StudentEmail
        WHERE B.registeredteacheremail = 'TeacherKen@gmail.com' OR A.Email = 'StudentB@gmail.com'
        
    */
    var sql;
    if(studentArray.length)
    {
        sql = "SELECT * FROM `students` as a \n LEFT OUTER JOIN `studentsregisteredtoteachers` as b on a.Email = b.StudentEmail \n WHERE (b.RegisteredTeacherEmail = '"  + teacherEmail + "' \n OR a.Email = '"+studentArray[0] + "'";
    
        for (i = 1; i < studentArray.length; i++) {
            sql = sql + "OR a.Email = '"+studentArray[i] +"'" ;
        }
        
    }
    else // no student @mentioned 
    {
        sql = "SELECT * FROM `students` as a \n LEFT OUTER JOIN `studentsregisteredtoteachers` as b on a.Email = b.StudentEmail \n WHERE (b.RegisteredTeacherEmail = '"  + teacherEmail + "'";
    }

    sql = sql + ')  \n HAVING Suspended = 0 ';

    console.log("sql "+sql);

    DBConnection.query(sql, (err, results) => {
        if (err){
            return callback(err);
            throw err;
        }
        else{
            if(results.length){
                for(var i = 0; i < results.length ; i++ ){     
                    retrieveForNotificationsResult.push(results[i]);
                }
            }
            callback(null, retrieveForNotificationsResult);
            console.log("retrieveForNotificationsResult: "+retrieveForNotificationsResult);
        }
    });
    console.log('  retrieveForNotifications function completed.');
    return 1;
}




        /*
        console.log(results);
        var rows = JSON.parse(JSON.stringify(results));
        console.log("rows: "+rows);
        return results;
        queryResult = results;
        */