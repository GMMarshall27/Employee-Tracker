const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const { type } = require('os');



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
      start();
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
  function viewDeparments(){
      var select = 'SELECT * FROM department'
      db.query(select, function(err,res) {
          if(err)throw err;
          console.table(res)
          start();
      })
  }
function viewRoles(){
    var select = 'SELECT * FROM roles'
    db.query(select,function(err,res) {
        if(err)throw err;
        console.table(res)
        start();
    })
}

function viewEmployees(){
    var select = 'SELECT * FROM employee';
    db.query(select,function(err,res){
        if(err)throw err;
        console.table(res)
        start();
    })
}
function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name:'addD',
            message:"What is the name of the department?"
        }
    ]) .then(function(answer){
        const select = 'INSERT INTO department (name) VALUES (?)';
        db.query(select,answer.addD,function(err,res){
            if(err) throw err;
            console.log(answer.addD + ' was added to departments.');
            start();
        })
    })
}

function addRoles(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
    ]) .then(function(answer){
        const results = [ answer.addRole, answer.salary];
        const select = 'SELECT name, id FROM department';
        db.query(select,function(err,res){
            if (err) throw err;

            const depart = data.map(({name,id}) => ({name: name, value: id}));

            inquirer.prompt ([
                {
                    type: 'list',
                    name: 'depart',
                    message: 'What department does the role belong to?',
                    choices: depart
                }
            ]) .then(function(departChoice){
                const depart = departChoice.depart;
                results.push(depart);
                const select = 'INSERT INTO role (title, salary,department_id) VALUES(?,?,?)';
                db.query(select,results,function(err,res){
                    if (err) throw err;
                    console.log(answer.addRole + ' has been added to the database');
                    start();
                });
            });
        });
    });
};