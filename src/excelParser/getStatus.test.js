const getStatus = require('./getStatus');
const { taskMap } = require('./taskParser');

it('Get Status test', () => {
  const expectedResult = 'red';
  const result = getStatus(taskMap, 'Code Jam "CV"', 0);
  if (result !== expectedResult) {
    throw new Error(`Expected ${expectedResult}, but got ${result}`);
  }
});
