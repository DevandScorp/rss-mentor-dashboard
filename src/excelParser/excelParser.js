/* eslint-disable no-lonely-if */
/* eslint-disable no-loop-func */
const xlsx = require('node-xlsx');
const fs = require('fs');
const getJsonData = require('./getJsonData');

const workSheet = xlsx.parse(`${__dirname}/tables/Mentor-students pairs.xlsx`);
const mentorScore = xlsx.parse(`${__dirname}/tables/Mentor score.xlsx`);

fs.writeFile('./src/excelParser/json/dashboard.json', JSON.stringify(getJsonData(workSheet, mentorScore)), (err) => {
  if (err) throw err;
});
