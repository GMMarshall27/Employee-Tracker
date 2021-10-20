const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Root1234',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );