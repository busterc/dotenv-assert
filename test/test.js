'use strict';
process.env.HELLO = 'WORLD';
process.env.GOODBYE = 'WORLD';

// exceptions expected

try {
  require('../index')('nada');
} catch (error) {
  console.log('✓ CAUGHT ERROR');
  console.log(['error', error]);
}

try {
  require('../index')(['nada']);
} catch (error) {
  console.log('✓ CAUGHT ERROR');
  console.log(['error', error]);
}

// no exceptions expected

try {
  require('../index')({});
} catch (error) {
  console.log('UNEXPECTED ERROR');
  // console.log(['error', error]);
  throw error;
} finally {
  console.log('_ Empty Options and No Callback');
}

try {
  require('../index')();
} catch (error) {
  console.log('UNEXPECTED ERROR');
  // console.log(['error', error]);
  throw error;
} finally {
  console.log('_ No Options and No Callback');
}

require('../index')({
  filePath: './assert.env.settings'
}, function() {
  console.log('✓ Found custom ./assert.env.settings file.');
});

require('../index')({}, function() {
  console.log('✓ Found default assert.env file in either the CWD or a parent directory.');
});

// Dunno how to gracefully and automatically test for an unhandledException;
// so, I'm not for now.
// try {
//   require('../index')({
//     filePath: './assert.xxx'
//   });
// } catch (error) {
//   console.log('✓ CAUGHT ERROR');
//   console.log(['error', error]);
// }