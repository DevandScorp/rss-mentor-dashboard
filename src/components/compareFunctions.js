// functions for sorting arrays
export function sortTaskNames(a, b) {
  if (a[0] === b[0]) {
    return 0;
  }
  return (a[0] < b[0]) ? -1 : 1;
}
export function sortStudentsTaskNames(a, b) {
  if (a.task === b.task) {
    return 0;
  }
  return (a.task < b.task) ? -1 : 1;
}
