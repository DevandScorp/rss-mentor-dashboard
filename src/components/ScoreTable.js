/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import idGenerator from 'react-id-generator';
import _ from 'lodash';
import getStatus from '../excelParser/getStatus';
import { sortTaskNames, sortStudentsTaskNames } from './compareFunctions';
import './ScoreTable.css';

class ScoreTable extends Component {
  render() {
    const { students, tasks } = this.props;
    if (students) {
      tasks.sort(sortTaskNames);
      const tasksMap = new Map();
      tasks.forEach((element) => {
        tasksMap.set(element[0].trim(), element[1]);
      });
      const studentsData = students.map((student) => {
        tasksMap.forEach((value, key) => {
          let exists = false;
          student.tasks.forEach((member) => {
            if (member.task === key) {
              exists = true;
            }
          });
          // if there is no task, put 0 as a mark
          if (!exists) {
            student.tasks.push({ task: key, status: getStatus(tasksMap, key, 0) });
          }
        });
        // sort and filter tasks to remove repeated tasks
        student.tasks.sort(sortStudentsTaskNames);
        student.tasks = student.tasks.filter(element => element.status);
        student.tasks = _.uniqBy(student.tasks, 'task');
        const studentsElements = student.tasks.map(task => (
          <td key={idGenerator()} style={{ backgroundColor: task.status }} />
        ));
        return (
          <tr key={idGenerator()}>
            <td>
              <a href={`https://github.com/${student.studentName}`} className="githubLinks">{student.studentName}</a>
            </td>
            {studentsElements}
          </tr>
        );
      });
      const taskElements = tasks.map(task => (
        <th key={idGenerator()}>
          <a href={task[1].taskLink} className="githubLinks" target="_blank" rel="noopener noreferrer">{task[0]}</a>
        </th>
      ));
      return (
        <table>
          <tbody>
            <tr>
              <th>Students</th>
              {taskElements}
            </tr>
            {studentsData}
          </tbody>
        </table>
      );
    }
    return (
      <div>Ready to work</div>
    );
  }
}
export default ScoreTable;
