function getStatus(taskMap, taskName, mark) {
  const taskMapElement = taskMap.get(taskName.trim());
  if (taskMapElement) {
    switch (taskMap.get(taskName.trim()).taskStatus) {
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
  } else {
    return '';
  }
}
module.exports = getStatus;
