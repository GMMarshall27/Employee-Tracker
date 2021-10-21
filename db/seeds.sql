INSERT INTO department (name)
VALUES ('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Sales Lead',100000,1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000,2),
('Software Engineer',120000,2),
('Account Manager',160000,3),
('Accountant',125000,3),
('Legal Team Lead',250000,4),
('Lawyer',190000,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John','Doe', 2, null),
('Mike','Chan', 1, 1),
('Ashley','Rodriguez', 4, null),
('Kevin','Tupik', 3, 3),
('Kunal','Singh', 6, null),
('Malia','Brown', 5, 5),
('Sarah','Lourd', 7, null),
('Tom','Allen', 8, 7);