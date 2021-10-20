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

  db.connect(function(err){
      if (err) throw err;
      
  })

  function start() {
      inquirer .prompt({
          name: 'menu',
          type: 'list',
          message: 'What would you like to do?',
          choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update an employee role'
          ]
      }).then(function(answer){
          switch(answer.menu){
              case 'View all departments':
                  viewDeparments();
                  break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRoles();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployee();
                    break;
          }
      })
  }