/* eslint-disable no-lonely-if */
/* eslint-disable no-loop-func */
const xlsx = require('node-xlsx');
const fs = require('fs');
const shortenLinks = require('./shortenLinks');
const { taskMap, getTasksNames } = require('./taskParser');
const getStatus = require('./getStatus');
// Create map with Name+Sruname as a key and githubNickname with students Map as a value
const workSheet = xlsx.parse(`${__dirname}/Mentor-students pairs.xlsx`);
const mentorMap = new Map();
const mentorData = workSheet[1].data;
for (let i = 1; i < mentorData.length; i += 1) {
  if (mentorData[i][3]) {
    mentorMap.set(`${mentorData[i][0]} ${mentorData[i][1]}`, { githubNickname: mentorData[i][4], students: new Map() });
  }
}
// edit student's map
const mentorStudents = workSheet[0].data;
for (let i = 1; i < mentorStudents.length; i += 1) {
  if (mentorMap.has(mentorStudents[i][0])) {
    mentorMap.get(mentorStudents[i][0]).students.set(`${mentorStudents[i][1]}`, []);
  }
}
// shorten github links in order to avoid the mistakes like
// HTTP://github.com/ or https://githib.com/
const mentorGithubMap = new Map();
// create student map to simplify searching process
const studentsMap = new Map();
mentorMap.forEach((value, key) => {
  const fullGithubLink = value.githubNickname.toLowerCase();
  mentorGithubMap.set(shortenLinks(fullGithubLink, 'github.com/'), value.students);
  value.students.forEach((value, key) => {
    studentsMap.set(key, []);
  });
});

const mentorScore = xlsx.parse(`${__dirname}/Mentor score.xlsx`);
const mentorScoreData = mentorScore[0].data;
// go through all data and swap mentor's and student's github
// if they were written in the wrong order
for (let i = 1; i < mentorScoreData.length; i += 1) {
  let flag = false;
  let requiredKey = '';
  let mentorGithub = mentorScoreData[i][1];
  let studentGithub = mentorScoreData[i][2];

  studentsMap.forEach((value, key) => {
    if (studentGithub.toLowerCase().indexOf(key) !== -1) {
      flag = true;
      requiredKey = key;
    } else if (mentorGithub.toLowerCase().indexOf(key) !== -1) {
      const tmp = mentorGithub;
      mentorGithub = studentGithub;
      studentGithub = tmp;
      flag = true;
      requiredKey = key;
    }
  });
  // if the required key was found, push new object
  if (flag) {
    if (studentsMap.get(requiredKey)) {
      studentsMap
        .get(requiredKey)
        .push({
          task: mentorScoreData[i][3],
          status: getStatus(taskMap, mentorScoreData[i][3], mentorScoreData[i][5]),
        });
    }
  } else {
    // otherwise add unknown student to appropriate mentor or create new mentor with this student
    const fullLink = mentorGithub;
    let shortLink = '';
    const rssSchoolLink = 'github.com/rolling-scopes-school/';
    const githubLink = 'github.com/';
    if (fullLink.indexOf(rssSchoolLink) !== -1) {
      shortLink = shortenLinks(fullLink, rssSchoolLink);
    } else if (fullLink.indexOf(githubLink) !== -1) {
      shortLink = shortenLinks(fullLink, githubLink);
    }
    const fullStudentLink = studentGithub;
    let shortStudentLink = '';
    if (fullStudentLink.indexOf(rssSchoolLink) !== -1) {
      shortStudentLink = shortenLinks(fullStudentLink, rssSchoolLink);
    } else if (fullStudentLink.indexOf(githubLink) !== -1) {
      shortStudentLink = shortenLinks(fullStudentLink, githubLink);
    }
    if (mentorGithubMap.has(shortLink.toLowerCase())) {
      mentorGithubMap
        .get(shortLink.toLowerCase()).set(shortStudentLink.toLowerCase(), []);
      studentsMap
        .set(shortStudentLink.toLowerCase(),
          [{
            task: mentorScoreData[i][3],
            status: getStatus(taskMap, mentorScoreData[i][3], mentorScoreData[i][5]),
          }]);
    } else {
      studentsMap
        .set(shortStudentLink.toLowerCase(),
          [{
            task: mentorScoreData[i][3],
            status: getStatus(taskMap, mentorScoreData[i][3], mentorScoreData[i][5]),
          }]);
      const newStudentMap = new Map();
      newStudentMap.set(shortStudentLink.toLowerCase(),
        [{
          task: mentorScoreData[i][3],
          status: getStatus(taskMap, mentorScoreData[i][3], mentorScoreData[i][5]),
        }]);
      mentorGithubMap.set(shortLink.toLowerCase(), newStudentMap);
    }
  }
}
let str = '';
// join studentMap and mentorMap
mentorGithubMap.forEach((students, mentor) => {
  students.forEach((studentTasks, student) => {
    studentTasks.push(...studentsMap.get(student));
  });
});
const jsonMentorArray = [];
mentorGithubMap.forEach((value, key) => {
  const mentorItem = { mentor: key };
  str += `${key} => Map { \n`;
  mentorItem.students = [];
  value.forEach((secondValue, secondKey) => {
    mentorItem.students.push({ studentName: secondKey, tasks: [...secondValue] });
    str += `\t\t${secondKey} { \n`;
    str += `\t\t${secondValue.map(val => JSON.stringify(val)).join('\n\t\t')}\n`;
    str += '\t\t }\n';
  });
  str += '}\n';
  jsonMentorArray.push(mentorItem);
});
const data = {
  tasks: getTasksNames(),
  mentors: jsonMentorArray,
};
fs.writeFile('./src/excelParser/dashboard.json', JSON.stringify(data), (err) => {
  if (err) throw err;
});
fs.writeFile('text.txt', str, (error) => {
  if (error) throw error;
});
