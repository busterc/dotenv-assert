'use strict';
module.exports = function(settings) {
  var setting = 0;
  var errorMessage = 'missing .env settings: ';
  var isError = false;

  function EnvironmentAssertionError(message) {
    this.message = message;
    this.name = '  Environment Assertion Error';
  }

  for (setting; setting < settings.length; setting++) {
    var environmentSetting = settings[setting];
    var environmentSettingValue = process.env[environmentSetting];
    if (!environmentSettingValue) {
      isError = true;
      errorMessage += '\n    ' + environmentSetting;
    }
  }

  if (isError === true) {
    throw new EnvironmentAssertionError(errorMessage);
  }

  return true;
};