process.env.HELLO = 'WORLD';
process.env.GOODBYE = 'WORLD';

require('../../../../index')();
console.log('✓ Found default assert.env file in a parent directory.');

require('../../../../index')({
  filePath: 'assert.env.settings'
});
console.log('✓ Found custom filename: assert.env.settings in a parent directory');