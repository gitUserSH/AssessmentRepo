
# NodeJS API END POINT PROJECT


### Prerequisites

Nodejs: Download from https://nodejs.org/en/

MySql: The client is required, I am using xampp https://www.apachefriends.org/index.html

### Installing/Setting up

After making sure Nodejs is installed.
Go to the root of this project folder, open up a terminal/command prompt( or just navigate from command prompt to the root of this folder)
And input the following command

```
npm install
```

For Mysql if you are using Xampp just run it and start both the 'Apache' and 'MySQL'

Also make sure that your Mysql settings are as follows:

```
port     : '3306',
user     : 'root',
password : '',
```
Make sure the port is 3306, and theres a user account 'root' and the password is empty


### Initializing

If this is the first time running the MySql, and database is empty.
Run the following URLs to create DB and tables

*note change the ports accordingly if environmental variable(port) is being used.

* [http://localhost:3000/createDB] (http://localhost:3000/createDB) - Creates the DB
* [http://localhost:3000/createSQLTables] (http://localhost:3000/createSQLTables) - Creates the Tables (3 in total)
* [(optional)http://localhost:3000/insertSQLdummyValues] (http://localhost:3000/insertSQLdummyValues) - inserts dummy values

### APIs

These are the links to the 4 APIs

*note change the ports accordingly if environmental variable(port) is being used.

* [http://localhost:3000/api/register] (http://localhost:3000/api/register) - Registers one or more students to a teacher
* [http://localhost:3000/commonstudents] (http://localhost:3000/commonstudents) - Given teacher/s, retrieve list of common students
* [http://localhost:3000/suspend] (http://localhost:3000/suspend) - Suspend a Student
* [http://localhost:3000/retrievefornotifications] (http://localhost:3000/retrievefornotifications) -  Retrieve a list of students who can receive a given notification.


