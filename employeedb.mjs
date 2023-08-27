import inquirer from 'inquirer';

import mysql from 'mysql2';

console.log('preparing to prompt for info mjs');  // TODO - remove


// Just proof-of-concept questions - so far - TODO 
const questions = [
    {
        type: 'input',
        name: 'fieldName1',
        message: 'The question goes here?'
    },
    {
        type: 'list',
        name: 'fieldNameForList1',
        message: 'The question (to be followed by options)?',
        choices: ['choice1','choice2','choice3']
        // filter (val) {
        //     return val.toLowerCase().trim();
        // }
    }
];

let inqResp = await inquirer.prompt(questions);
console.log('answers received');
let answersJsonString = JSON.stringify(inqResp, null, '  ');
console.log('JSON of answers = \n' + answersJsonString);


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
    }
  }
}

empDb.query('SELECT * FROM employee', function (err, results) {
  console.log('err = ', err);
  console.log('results = ', results);
  console.log('\n\n');
  console.table(results);
  console.log('\n\ndone logging results \n\n');
});  // TODO - do I have to "then" this?
