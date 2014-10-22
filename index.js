'use strict';
module.exports = function(options, callback) {
  var fs = require('fs');
  var findParentDir = require('find-parent-dir');
  var CURRENT_WORKING_DIRECTORY = process.cwd();
  var errorMessage = 'missing process.env settings: ';
  var isError = false;
  var settings = [];
  var assertFilePath = 'assert.env';

  options = options || {};
  callback = callback || function() {};

  function getSettingsFromFile(options) {
    var file = '' + fs.readFileSync(options.assertFilePath);
    var lines = file.split(/\r?\n/);
    var settings = [];

    lines.map(function(line) {
      var setting = line.trim();
      if (setting.length > 0) {
        settings.push(setting);
      }
    });

    return settings;
  }

  function assertSettings(settings) {
    var setting = 0;

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
  }

  function EnvironmentAssertionError(message) {
    this.message = message;
    this.name = '  Environment Assertion Error';
  }

  function OptionsError(message) {
    this.message = message;
    this.name = '  Options Error';
  }

  function CallbackError(message) {
    this.message = message;
    this.name = '  Callback Error';
  }

  function FileNotFoundError(message) {
    this.message = message;
    this.name = '  File Not Found Error';
  }

  if (arguments.length > 0) {
    if (typeof options !== 'object' || Object.prototype.toString.call(options) === '[object Array]') {
      errorMessage = '    As of version 2.1.0, you can only pass an Options Object and Callback Function ' +
        'or empty arguments to dotenv-assert. Please see the official README.md for details.';
      throw new OptionsError(errorMessage);
    }

    assertFilePath = options.filePath || assertFilePath;

    if (typeof callback !== 'function') {
      errorMessage = '    The callback is not a function';
      throw new CallbackError(errorMessage);
    }
  }

  if (assertFilePath.indexOf('/') > -1) {

    // look for explicit file location
    fs.exists(assertFilePath, function(exists) {
      if (!exists) {
        errorMessage = assertFilePath + ' does not exist.';
        throw new FileNotFoundError(errorMessage);
      }

      settings = getSettingsFromFile({
        'assertFilePath': assertFilePath
      });
      assertSettings(settings);

      callback();
    });
  } else {

    // find the file in $CWD or the nearest parent directory
    findParentDir(CURRENT_WORKING_DIRECTORY, assertFilePath, function(error, directory) {
      if (error || directory === null) {
        errorMessage = assertFilePath + ' cannot be found.';
        throw new FileNotFoundError(errorMessage);
      }

      assertFilePath = directory + '/' + assertFilePath;

      settings = getSettingsFromFile({
        'assertFilePath': assertFilePath
      });

      assertSettings(settings);

      callback();
    });
  }
};