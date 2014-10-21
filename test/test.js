process.env.HELLO = 'WORLD';

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

try {
  require('../index')({});
} catch (error) {
  console.log('✓ CAUGHT ERROR');
  console.log(['error', error]);
}

process.env.GOODBYE = 'WORLD';

require('../index')({
  filePath: './assert.env.settings'
});
console.log('✓ Found custom ./assert.env.settings file.');

require('../index')();
console.log('✓ Found default assert.env file in either the CWD or a parent directory.');

// Dunno how to gracefully and automatically test for an unhandledException;
// so, I'm not for now.
// try{
//   require('../index')({filePath: './assert.xxx'});
// } catch(error) {
//   console.log('✓ CAUGHT ERROR');
//   console.log(['error', error]);
// }