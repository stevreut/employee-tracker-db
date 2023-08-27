USE hr_db;

INSERT INTO department (name) 
VALUES
    ('Sales'),
    ('Production'),
    ('Strategic Planning'),
    ('Finance'),
    ('Executive');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Chief Executive Officer',1000000,5),
    ('Sales Manager',95000,1),
    ('Sales Officer',80000,1),
    ('Planner',120000,2),
    ('Strategy Manager',150000,3),
    ('Chief Financial Officer',250000,4),
    ('Accountant',100500,4),
    ('Chief Engineer',130900,2),
    ('Journeyman Engineer',90000,2);

INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id)
VALUES
    ('Nancy','Pineta',1,NULL),
    ('Joseph','Foreman',8,1),
    ('Laura','Sims',9,2),
    ('Donovan','O''Reilly',2,1),
    ('Lisa','Carson',3,4);