
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
      return 1;
  });

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
    
    sql = 'CREATE TABLE Students(Email VARCHAR(255) NOT NULL, RegisteredTeacherEmail VARCHAR(255) ,Suspended BOOL NOT NULL, PRIMARY KEY (Email))'
    DBConnection.query(sql, (err, result)=> {
        if(err){
            throw err;
            return err;
        }
        console.log(result);
        console.log('SQL Students Table created...');
        
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

    sql = "INSERT INTO Students ( Email,RegisteredTeacherEmail, Suspended) VALUES ( 'StudentA@gmail.com', NULL ,false), ( 'StudentB@gmail.com', 'TeacherKen@gmail.com', false),  ( 'StudentC@gmail.com',NULL, true)";
    DBConnection.query(sql, (err, result)=> {
        if(err){
            throw err;
            return err;
        }
        console.log(result);
        console.log('SQL Students Table VALUES INSERTED...');
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
        let sql = 'UPDATE Students SET RegisteredTeacherEmail = ? WHERE Email = ?';

        let data = [teacherEmail, student];

        // execute the UPDATE statement
        DBConnection.query(sql, data, (err, results) => {
            if (err){
                throw err;
            }
        });
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

