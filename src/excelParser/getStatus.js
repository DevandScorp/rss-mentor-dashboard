function getStatus(taskMap, taskName, mark) {
  switch (taskMap.get(taskName.trim())) {
    case 'Checked':
      if (!mark) return 'red';
      return 'green';
    case 'Checking':
      if (!mark) return 'lightcoral';
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
