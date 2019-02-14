/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-filename-extension */
import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import './App.css';
import githubLogo from './images/GitHub-Mark-120px-plus.png';
import dashboard from './excelParser/json/dashboard.json';
import ScoreTable from './components/ScoreTable';

const options = dashboard.mentors.map(item => ({ value: item.students, label: item.mentor }));

class App extends Component {
  constructor() {
    super();

    this.state = {
      selectedOption: JSON.parse(localStorage.getItem('mentor')),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
  }

  componentDidMount() {
    if (sessionStorage.getItem('isLoggedIn')) {
      fetch('https://still-dusk-24502.herokuapp.com/user', {
        method: 'GET',
      })
        .then(res => res.json())
        .then((res) => {
          const mentor = options.filter(option => option.label === (res.mentor));
          if (mentor.length) {
            const selectedOption = mentor[0];
            this.setState({ selectedOption });
          } else {
            this.setState(JSON.parse(localStorage.getItem('mentor')));
          }
        });
    }
  }

  handleAuth() {
    sessionStorage.setItem('isLoggedIn', true);
  }

  handleChange(selectedOption) {
    localStorage.setItem('mentor', JSON.stringify(selectedOption));
    this.setState({ selectedOption });
  }

  render() {
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
        <div className="github">
          <a href="https://github.com/login/oauth/authorize?client_id=81123a658e8fe06cde15" onClick={this.handleAuth}>
            <img src={githubLogo} alt="Logo" />
          </a>
          <div>Click to login via github</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
