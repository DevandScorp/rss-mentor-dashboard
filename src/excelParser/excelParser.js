/* eslint-disable no-loop-func */
const xlsx = require('node-xlsx');
const fs = require('fs');
const shortenLinks = require('./shortenLinks');

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
mentorMap.forEach((value, key) => {
  const fullGithubLink = value.githubNickname.toLowerCase();
  mentorGithubMap.set(shortenLinks(fullGithubLink, 'github.com/'), value.students);
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
  mentorGithubMap.forEach((value, key) => {
    if (mentorGithub.toLowerCase().indexOf(key) !== -1) {
      flag = true;
      requiredKey = key;
    } else if (studentGithub.toLowerCase().indexOf(key) !== -1) {
      const tmp = mentorGithub;
      mentorGithub = studentGithub;
      studentGithub = tmp;
      flag = true;
      requiredKey = key;
    }
  });
  if (flag) {
    const fullLink = studentGithub;
    let shortLink = '';
    const rssSchoolLink = 'github.com/rolling-scopes-school/';
    const githubLink = 'github.com/';
    if (fullLink.indexOf(rssSchoolLink) !== -1) {
      shortLink = shortenLinks(fullLink, rssSchoolLink);
    } else if (fullLink.indexOf(githubLink) !== -1) {
      shortLink = shortenLinks(fullLink, githubLink);
    }
    if (mentorGithubMap.get(requiredKey).get(shortLink.toLowerCase())) {
      mentorGithubMap
        .get(requiredKey)
        .get(shortLink.toLowerCase())
        .push({ task: mentorScoreData[i][3], mark: mentorScoreData[i][5] });
    } else {
      mentorGithubMap
        .get(requiredKey)
        .set(shortLink.toLowerCase(),
          [{ task: mentorScoreData[i][3], mark: mentorScoreData[i][5] }]);
    }
  }
}
let str = '';
mentorGithubMap.forEach((value, key) => {
  str += `${key} => Map { \n`;
  value.forEach((secondValue, secondKey) => {
    str += `\t\t${secondKey} { \n`;
    str += `\t\t${secondValue.map(val => JSON.stringify(val)).join('\n\t\t')}\n`;
    str += '\t\t }\n';
  });
  str += '}\n';
});
fs.writeFile('text.txt', str, (error) => {
  if (error) throw error;
});
