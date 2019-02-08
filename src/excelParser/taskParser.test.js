const xlsx = require('node-xlsx');
const { getTasksNames } = require('./taskParser');

it('Task parser test', () => {
  const taskSheet = xlsx.parse(`${__dirname}/Tasks.xlsx`)[0].data;
  const expectedResult = taskSheet.length - 1;
  const result = getTasksNames().length;
  if (result !== expectedResult) {
    throw new Error(`Expected ${expectedResult}, but got ${result}`);
  }
});
