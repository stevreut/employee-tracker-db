DROP DATABASE IF EXISTS hr_db;
CREATE DATABASE hr_db;

USE hr_db;

CREATE TABLE department (
    id INT NOT NULL auto_increment PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL auto_increment PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
        ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL auto_increment PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,  -- could be NULL for CEO
    FOREIGN KEY (role_id) REFERENCES role(id)
        ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id)
        ON DELETE SET NULL
);


