/* eslint-disable react/jsx-filename-extension */
import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import './App.css';
import dashboard from './excelParser/dashboard.json';
import ScoreTable from './components/ScoreTable';

const options = dashboard.mentors.map(item => ({ value: item.students, label: item.mentor }));

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: JSON.parse(localStorage.getItem('mentor')),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption) {
    localStorage.setItem('mentor', JSON.stringify(selectedOption));
    this.setState({ selectedOption });
  }

  render() {
    // console.log(this.state);
    const { selectedOption } = this.state;
    const scoreTableData = selectedOption ? selectedOption.value : selectedOption;
    return (
      <Fragment>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
        />
        <ScoreTable students={scoreTableData} tasks={dashboard.tasks} />
      </Fragment>
    );
  }
}

export default App;
