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
  taskMap.set(taskSheet[i][0].trim(), { taskStatus: taskSheet[i][2], taskLink: taskSheet[i][1] });
}
function getTasksNames() {
  const tasksNames = [];
  taskMap.forEach((value, key) => {
    tasksNames.push([key, value]);
  });
  return tasksNames;
}

module.exports.getTasksNames = getTasksNames;
module.exports.taskMap = taskMap;
