/* eslint-disable no-lonely-if */
/* eslint-disable no-loop-func */
const xlsx = require('node-xlsx');
const fs = require('fs');
const getJsonData = require('./getJsonData');
// Create map with Name+Sruname as a key and githubNickname with students Map as a value
const workSheet = xlsx.parse(`${__dirname}/Mentor-students pairs.xlsx`);
const mentorScore = xlsx.parse(`${__dirname}/Mentor score.xlsx`);

fs.writeFile('./src/excelParser/dashboard.json', JSON.stringify(getJsonData(workSheet, mentorScore)), (err) => {
  if (err) throw err;
});
