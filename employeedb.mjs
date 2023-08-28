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

function fixLen(str, len) {
  if (str === null) {
    str = 'NULL';
  }
  let strr = str.toString();
  while (strr.length < len) {
    strr += ' ';
  }
  return strr;
}

function dashLine(len) {
  let line = '';
  while (line.length < len) {
    line += '-';
  }
  return line;
}

function logQueryResults(results) {
  if (results.length === 0) {
    console.log('\n\nNo results returned');
  } else {
    let hdrArr = Object.keys(results[0]);
    let colWidths = [];
    for (const hdr of hdrArr) {
      colWidths.push(hdr.length);
    }
    for (const row of results) {
      let rowKeys = Object.keys(row);
      console.log('row key = ' + JSON.stringify(rowKeys));
      for (let i=0;i<rowKeys.length;i++) {
        let value = row[rowKeys[i]];
        let len = 0;
        if (value === null) {
          len = 4;
        } else {
          len = row[rowKeys[i]].toString().length;
        }
        console.log('len of "' + row[rowKeys[i]] + '" = ' + len);
        if (len > colWidths[i]) {
          console.log('width at ' + i + ' : ' + colWidths[i] + ' -> ' + len);
          colWidths[i] = len;
        }
      }
    }
    console.log('hdrs = ' + JSON.stringify(hdrArr));
    console.log('lens = ' + JSON.stringify(colWidths));
    console.log('\n\n\n');
    let hdrLine = '  ';
    for (let k=0;k<colWidths.length;k++) {
      hdrLine += fixLen(hdrArr[k], colWidths[k]);
      hdrLine += '  ';
    }
    console.log(hdrLine);
    let line = '  ';
    for (let j=0;j<colWidths.length;j++) {
      line += dashLine(colWidths[j]);
      line += '  ';
    }
    console.log(line);
    for (const row of results) {
      let printLine = '  ';
      let rowKeys = Object.keys(row);
      for (let i=0;i<rowKeys.length;i++) {
        printLine += fixLen(row[rowKeys[i]], colWidths[i]);
        printLine += '  ';
      }
      console.log(printLine);
    }
  }
}

function showDepartments() {
  empDb.query('SELECT name AS Department_name, id as Dept_ID FROM department', function (err, results) {
    if (err) {
      allDone = true;
      console.log('error querying departments - QUITTING');
    } else {
      let hdrs = ['Department Name','Dept. ID'];
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
