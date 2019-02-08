const shortenLinks = require('./shortenLinks');

it('Shorten Links test', () => {
  const expectedResult = 'Artsiom-Zhuk';
  const result = shortenLinks('https://github.com/Artsiom-Zhuk', 'github.com/');
  if (result !== expectedResult) {
    throw new Error(`Expected ${expectedResult}, but got ${result}`);
  }
});
