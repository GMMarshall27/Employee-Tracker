//import mysql2, inquirer, and console.table
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
//creates database connection
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
//function to start the inquirer prompt once the database has connected. 
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
                    updateEmployeeRole();
                    break;
          }
      })
  }
  //function that shows all the departments
  function viewDeparments(){
      var select = 'SELECT * FROM department'
      db.query(select, function(err,res) {
          if(err)throw err;
          console.table(res)
          start();
      })
  }
  //function that shows all of the roles
function viewRoles(){
    var select = 'SELECT * FROM roles'
    db.query(select,function(err,res) {
        if(err)throw err;
        console.table(res)
        start();
    })
}
//function that shows all the employees
function viewEmployees(){
    var select = "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT (manager.first_name, ' ',manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id";
    db.query(select,function(err,res){
        if(err)throw err;
        console.table(res)
        start();
    })
}
//function to add a department
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
//function to add a role
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
        db.query(select,function(err,data){
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
                const select = 'INSERT INTO roles (title, salary,department_id) VALUES(?,?,?)';
                db.query(select,results,function(err,res){
                    if (err) throw err;
                    console.log(answer.addRole + ' has been added to the database');
                    start();
                });
            });
        });
    });
};
//function to add an employee
function addEmployee() { 
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        }
    ]).then(function(answer){
        const results = [answer.firstName, answer.lastName]
        const select = 'SELECT roles.title, roles.id, roles.salary FROM roles';
        db.query(select,function(err,data){
            if (err) throw err;
    
            const role = data.map(({id,title})=> ({name: title, value: id}));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: role
                }
            ]).then(function(choice){
                const role = choice.role;
                results.push(role);
    
                const manager = 'SELECT * FROM employee';
                db.query(manager, function(err,data){
                    if (err) throw err;
                    const managers= data.map(({id,first_name,last_name})=> ({name: first_name + '' + last_name, value: id}));
                    inquirer.prompt ([
                        {
                            type: 'list',
                            name:'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ]).then(function(manChoice){
                        const manager = manChoice.manager;
                        results.push(manager);
    
                        const select = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ?, ?, ?, ?)';
                        db.query(select,results,function(err,res){
                            if (err) throw err;
                            console.log( answer.firstName + " " + answer.lastName + ' has been added to database')
                            start();
                        });
                    });
                });
            });
        });
    });
    };
// function to update employees role
    function updateEmployeeRole (){
        const select = `SELECT * FROM employee`;

        db.query(select, function(err, data){
          if (err) throw err; 
      
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
      
          inquirer.prompt([
            {
              type: 'list',
              name: 'employee',
              message: "Which employee's role do you want to update?",
              choices: employees
            }
          ])
            .then(employeeSelect => {
              const employee = employeeSelect.employee;
              const results = []; 
              results.push(employee);
      
              const select = `SELECT * FROM roles`;
      
              db.query(select, function (err, data) {
                if (err) throw err; 
      
                const role = data.map(({ id, title }) => ({ name: title, value: id }));
                
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'roles',
                      message: "Which role do you want to assign the selected employee?",
                      choices: role
                    }
                  ])
                      .then(roleChoice => {
                      const role = roleChoice.roles;
                      results.push(role); 
                      
                      let employee = results[0]
                     results[0] = role
                      results[1] = employee 
                
                      const update = `UPDATE employee SET role_id = ? WHERE id = ?`;
      
                      db.query(update, results, function (err, res) {
                        if (err) throw err;
                      console.log("Updated employee's role");
                            start();
                        })
                    })
                })
            })
        })
      };
      