import inquirer from 'inquirer';

import mysql from 'mysql2';


let empDb = await mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hr_db'
  },
);

const OPT_ALL_DEPTS = 'View all departments';
const OPT_ALL_ROLES = 'View all roles';
const OPT_ALL_EMPS  = 'View all employees';
const OPT_ADD_DEPT  = 'Add new department';
const OPT_ADD_ROLE  = 'Add new role';
const OPT_ADD_EMPL  = 'Add new employee';
const OPT_UPD_ROLE  = 'Update an employee role';

// Right pads str with spaces until it has length
// len. 
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

// Creates a string consisting of a sequence of
// cashes with a length dictated by the 'len' variable.
function dashLine(len) {
  let line = '';
  while (line.length < len) {
    line += '-';
  }
  return line;
}

// Renders the query results to console in a tabular format
function logQueryResults(results) {
  if (results.length === 0) {
    console.log('\n\nNo results returned');
  } else {
    // Get the field names from the first row (which will
    // be the same as the field names in subsequent rows).  These
    // field names will be our headers.
    let hdrArr = Object.keys(results[0]);
    // Ultimately colWidths will contain the desired width for
    // each column.  This width will be calculated by determining
    // the maximum length of the header and all data elements for
    // that column.
    let colWidths = [];
    for (const hdr of hdrArr) {
      colWidths.push(hdr.length);
    }
    for (const row of results) {
      let rowKeys = Object.keys(row);
      for (let i=0;i<rowKeys.length;i++) {
        let value = row[rowKeys[i]];
        let len = 0;
        if (value === null) {
          len = 4;
        } else {
          len = row[rowKeys[i]].toString().length;
        }
        // If the length of the data found in column i
        // is greater than colWidth[i] then update colWidth[i]
        // with the new maximum length for that column.
        if (len > colWidths[i]) {
          colWidths[i] = len;
        }
      }
    }
    // Render the header line and the blank lines prior
    console.log('\n\n\n');
    let hdrLine = '  ';
    for (let k=0;k<colWidths.length;k++) {
      hdrLine += fixLen(hdrArr[k], colWidths[k]);
      hdrLine += '  ';
    }
    console.log(hdrLine);
    // Render dashes under the headers
    let line = '  ';
    for (let j=0;j<colWidths.length;j++) {
      line += dashLine(colWidths[j]);
      line += '  ';
    }
    console.log(line);
    // For each data row, format the output line so that
    // the data lines up under the column headers.
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

// Output department names and IDs to the console in a tabular format
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

// Output role information and associated department name to the console in
// a tabular format
function showRoles() {
  empDb.query(
  `SELECT
    title AS Job_Title,
    role.id AS Role_ID,
    department.name AS Department,
    FORMAT(salary,2) AS salary
   FROM role LEFT JOIN department
   ON role.department_id = department.id`,
   function(err, results) {
    if (err) {
      allDone = true;
      console.log('error querying roles - QUITTING');
    } else {
      logQueryResults(results);
    }
  })
};

// Output employee information, including manager, role, and department info
// for all employees to the console in a tabular format
function showEmployees() {
  empDb.query(
`SELECT 
Employee_ID,
  Empl_First_Name,
  Empl_Last_Name,
  role.title AS Job_Title,
  department.name AS Department,
  FORMAT(salary,2) AS Salary,
  Manager_First_Name,
  Manager_Last_Name
FROM
(SELECT 
emp.id AS Employee_ID,
  emp.first_name AS Empl_First_Name,
  emp.last_name AS Empl_Last_name,
  emp.role_id AS Role_ID,
  mgr.first_name AS Manager_First_Name,
  mgr.last_name AS Manager_Last_Name
FROM
employee AS emp
  LEFT JOIN
employee AS mgr
  ON emp.manager_id = mgr.id) AS E2
LEFT JOIN role ON E2.Role_ID = role.id
LEFT JOIN department ON role.department_id = department.id`,
  function (err, results) {
    if (err) {
      allDone = true;
      console.log('error querying employees - QUITTING');
    } else {
      logQueryResults(results);
    }
  })
};

// Adds a new department to the department table after
// first confirming that a depart of that name does not
// already exist.
async function addDepartment() {
  let response = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'answer',
        message: 'Department to be added : '
      }
    ]
  );
  const { answer } = response;
  if (answer) {
    let deptName = answer;
    empDb.query(`SELECT * FROM department WHERE name = ?`, deptName,
      function (err, results) {
        if (err) {
          allDone = true;
          console.log('error determining uniqueness of department name - QUITTING');
        } else {
          if (results.length >= 1) {
            // If a query of the department table based on the name provided returns
            // at least one row then the name is already in use and is reject.
            console.log(deptName + " NOT ADDED - already exists on DB");
          } else {
            // Otherwise, insert the new name into the table and allow the correspoding
            // ID to be auto-incremented.
            empDb.query(`INSERT INTO department (name) VALUE (?)`, deptName,
              function (err, results) {
                if (err) {
                  allDone = true;
                  console.log('error inserting dept - QUITTING');
                } else {
                  console.log('Department "' + deptName + '" has been added.');
                }
              });
          }
        }
      });
  };
};

// Would add a new role based on provided role name, salary, and the selection of a 
// pre-existing department.  Unfortunately, inability to diagnose behavior of
// inquirer prevented completion of the implementation of this function.
function addRole() {
  empDb.query('SELECT name, id FROM department', async function (err, deptListResults) {
    if (err) {
      allDone = true;
      console.log('error querying departments - QUITTING');
    } else {
      if (deptListResults.length < 0) {
        console.log("At least one department must be added before a role can be added");
      } else {
        let deptArr = [];
        for (const deptListItem of deptListResults) {
          deptArr.push(deptListItem.name);
        }
        let roleInqResp = await inquirer.prompt(
          [
            {
              type: 'input',
              name: 'role',
              message: 'Name of new role? : '
            },
            {
              type: 'input',
              name: 'salary',
              message: 'Salary for role? : '
            },
            {
              type: 'list',
              name: 'deptName',
              choices: deptArr,
              message: 'Department associated with role ? : '
            }
          ]
        );
        const { role, salary, deptName } = roleInqResp;
        if (!role || !salary || !deptName) {
          console.log('missing role, salary, or department name - no role added');
        } else {
          // Unable to implement due to inability to get past unpredictable and
          // unexplained behavior of inquirer.
        }
      }
    }
  });
}


function addEmployee() {
  // Unable to implement due to inability to get past unpredictable and
  // unexplained behavior of inquirer.
}

function updateEmployeeRole() {
  // Unable to implement due to inability to get past unpredictable and
  // unexplained behavior of inquirer.
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
  
// Repeatedly prompt for main menu items, executing appropriate menu items 
// depending on the user selection, or until 'QUIT' is chosen, at which point
// the loop is terminated and the process stopped.
let allDone = false;
while (!allDone) {
  console.log('\n\n\n');
  let menuResp = await inquirer.prompt(menuOptions);
  if (!menuResp || !menuResp.menuOption) {
    allDone = true;
    console.log('Error getting menu selection - QUITTING');
  } else {
    const { menuOption } = menuResp;
    if (menuOption === 'QUIT') {
      allDone = true;
      console.log('QUITTING program');
    } else {
      switch (menuOption) {
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
          await addDepartment();
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

process.exit();
