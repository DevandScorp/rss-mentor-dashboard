const xlsx = require('node-xlsx');
const getJsonData = require('./getJsonData');

it('Get JSON data test', () => {
  const workSheet = xlsx.parse(`${__dirname}/Mentor-students pairs.xlsx`);
  const mentorScore = xlsx.parse(`${__dirname}/Mentor score.xlsx`);
  const mentorData = workSheet[1].data;
  let expectedResult = 0;
  for (let i = 1; i < mentorData.length; i += 1) {
    if (mentorData[i][3]) {
      expectedResult += 1;
    }
  }
  const result = getJsonData(workSheet, mentorScore).mentors.length;
  if (result !== expectedResult) {
    throw new Error(`Expected ${expectedResult}, but got ${result}`);
  }
});
