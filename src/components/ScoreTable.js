/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import idGenerator from 'react-id-generator';
import getStatus from '../excelParser/getStatus';
import './ScoreTable.css';

class ScoreTable extends Component {
  render() {
    const { students, tasks } = this.props;
    if (students) {
      tasks.sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        return (a[0] < b[0]) ? -1 : 1;
      });
      console.log(tasks);
      const tasksMap = new Map();
      tasks.forEach((element) => {
        tasksMap.set(element[0].trim(), element[1]);
      });
      console.log(tasksMap);
      const studentsData = students.map((student) => {
        tasksMap.forEach((value, key) => {
          let exists = false;
          student.tasks.forEach((member) => {
            if (member.task === key) {
              exists = true;
            }
          });
          if (!exists) {
            student.tasks.push({ task: key, status: getStatus(tasksMap, key, 0) });
          }
        });
        console.log(student.tasks);

        student.tasks.sort((a, b) => {
          if (a.task === b.task) {
            return 0;
          }
          return (a.task < b.task) ? -1 : 1;
        });
        student.tasks = student.tasks.filter(element => element.status);
        const studentsElements = student.tasks.map(task => (
          <td key={idGenerator()} style={{ backgroundColor: task.status }} />
        ));
        return (
          <tr key={idGenerator()}>
            <td>{student.studentName}</td>
            {studentsElements}
          </tr>
        );
      });
      const taskElements = tasks.map(task => (<th key={idGenerator()}>{task[0]}</th>));
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
      <div>Ready for work</div>
    );
  }
}
export default ScoreTable;
