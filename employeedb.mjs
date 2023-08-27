import inquirer from 'inquirer';

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



