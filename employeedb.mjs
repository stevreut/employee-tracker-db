import inquirer from 'inquirer';

import mysql from 'mysql2';


// Connect to database
let empDb = await mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'hr_db'  // TODO - must match schema.sql
    },
    console.log(`Connected to the classlist_db database.`)
  );
// TODO - code for connection failure

const OPT_ALL_DEPTS = 'View all departments';
const OPT_ALL_ROLES = 'View all roles';
const OPT_ALL_EMPS  = 'View all employees';
const OPT_ADD_DEPT  = 'Add new department';
const OPT_ADD_ROLE  = 'Add new role';
const OPT_ADD_EMPL  = 'Add new employee';
const OPT_UPD_ROLE  = 'Update an employee role';

function logQueryResults(results) {
  console.table(results);  // TODO
}

function showDepartments() {
  empDb.query('SELECT name AS Department_name, id as Dept_ID FROM department', function (err, results) {
    if (err) {
      allDone = true;
      console.log('error querying departments - QUITTING');
    } else {
      logQueryResults(results);
    }
  }
  )
};

function showRoles() {
  empDb.query('SELECT * FROM role', function (err, results) {
    if (err) {
      allDone = true;
      console.log('error querying roles - QUITTING');
    } else {
      logQueryResults(results);
    }
  }
  )
};

function showEmployees() {
  empDb.query('SELECT * FROM employee', function (err, results) {
    if (err) {
      allDone = true;
      console.log('error querying employees - QUITTING');
    } else {
      logQueryResults(results);
    }
  }
  )
};

function addDepartment() {
  // TODO
};

function addRole() {
  // TODO
};

function addEmployee() {
  // TODO
}

function updateEmployeeRole() {
  // TODO
}

let menuOptions = [
  {
    type: 'list',
    name: 'menuOption',
    choices: [
      OPT_ALL_DEPTS,
      OPT_ALL_ROLES,
      OPT_ALL_EMPS,
      OPT_ADD_DEPT,
      OPT_ADD_ROLE,
      OPT_ADD_EMPL,
      OPT_UPD_ROLE,
      'QUIT'
    ],
    message: '\n\nChoose one of the following options:'
  }
]
  
let allDone = false;
while (!allDone) {
  console.log('\n\n\n');
  let menuResp = await inquirer.prompt(menuOptions);
  if (!menuResp || !menuResp.menuOption) {
    allDone = true;
    console.log('Error getting menu selection - QUITTING');
  } else {
    const { menuOption } = menuResp;
    console.log('select menu option = "' + menuOption + '"');  // TODO remove after testing
    if (menuOption === 'QUIT') {
      allDone = true;
      console.log('QUITTING program');
    } else {
      console.log('processing menu option "' + menuOption + '"');
      switch(menuOption) {
        case OPT_ALL_DEPTS:
          showDepartments();
          break;
        case OPT_ALL_ROLES:
          showRoles();
          break;
        case OPT_ALL_EMPS:
          showEmployees();
          break;
        case OPT_ADD_DEPT:
          addDepartment();
          break;
        case OPT_ADD_ROLE:
          addRole();
          break;
        case OPT_ADD_EMPL:
          addEmployee();
          break;
        case OPT_UPD_ROLE:
          updateEmployeeRole();
          break;
        default:
          console.log('unexpected menu option - QUITTING');
          allDone = true;
      }
    }
  }
}

// empDb.query('SELECT * FROM employee', function (err, results) {
//   console.log('err = ', err);
//   console.log('results = ', results);
//   console.log('\n\n');
//   console.table(results);
//   console.log('\n\ndone logging results \n\n');
// });  // TODO - do I have to "then" this?
