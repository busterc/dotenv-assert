'use strict';
process.env.HELLO = 'WORLD';
process.env.GOODBYE = 'WORLD';

try {
  require('../../../../index')();
} catch (error) {
  console.log('UNEXPECTED ERROR');
  throw error;
} finally {
  console.log('_ No Options and No Callback, find assert file in parent directory');
}

require('../../../../index')({}, function() {
  console.log('✓ Found default assert.env file in a parent directory.');
});

require('../../../../index')({
  filePath: 'assert.env.settings'
}, function() {
  console.log('✓ Found custom filename: assert.env.settings in a parent directory');
});