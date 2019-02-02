/* eslint-disable default-case */
const xlsx = require('node-xlsx');

const taskSheet = xlsx.parse(`${__dirname}/Tasks.xlsx`)[0].data;

const taskMap = new Map();
for (let i = 1; i < taskSheet.length; i += 1) {
  if (taskSheet[i][0].indexOf('-') !== -1) {
    taskSheet[i][0] = taskSheet[i][0].slice(0, taskSheet[i][0].indexOf('-'));
  }
  if (taskSheet[i][0].indexOf('CodeJam') !== -1) {
    taskSheet[i][0] = taskSheet[i][0].replace('CodeJam', 'Code Jam');
  }
  taskMap.set(taskSheet[i][0].trim(), taskSheet[i][2]);
}
function getStatus(taskName, mark) {
  switch (taskMap.get(taskName.trim())) {
    case 'Checked':
      if (!mark) return 'red';
      return 'green';
    case 'Checking':
      if (!mark) return 'light red';
      return 'green';
    case 'In Progress':
      if (!mark) return 'yellow';
      return 'green';
    case 'ToDo':
      return 'grey';
    default:
      return '';
  }
}
module.exports = getStatus;
