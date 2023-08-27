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
let empDb = mysql.createConnection(
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
  

empDb.query('SELECT * FROM employee', function (err, results) {
  console.log('err = ', err);
  console.log('results = ', results);
  console.log('\n\n');
  console.table(results);
  console.log('\n\ndone logging results \n\n');
});


let qst = [
  {
    type: 'list',
    name: 'yesOrNo',
    choices: ['yes','no'],
    message: 'Go again?'
  }
];

let goAgainResp = await inquirer.prompt(qst);
const { yesOrNo } = goAgainResp;
console.log('yesOrNo = "' + yesOrNo + '"');
if (yesOrNo === 'yes') {
  console.log('doing another query');
  empDb.query('SELECT * FROM department', function (err, results) {
    console.log('err = ', err);
    console.log('results = ', results);
    console.log('\n\n');
    console.table(results);
    console.log('\n\ndone logging results for department\n\n');
  });
} else {
  console.log('no more');
}


