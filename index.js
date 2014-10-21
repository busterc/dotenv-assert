'use strict';
module.exports = function(options) {
  var fs = require('fs');
  var findParentDir = require('find-parent-dir');
  var CURRENT_WORKING_DIRECTORY = process.cwd();
  var errorMessage = 'missing process.env settings: ';
  var isError = false;
  var settings = [];
  var assertFilePath = 'assert.env';

  options = options || {};

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

  function FileNotFoundError(message) {
    this.message = message;
    this.name = '  File Not Found Error';
  }

  if (arguments.length > 0) {
    if (typeof options !== 'object' || Object.prototype.toString.call(options) === '[object Array]') {
      errorMessage = '\n    As of version 2.0.0, you can only pass an Options Object ' +
        'or empty arguments to dotenv-assert. Please see the official README.md for details.';
      throw new OptionsError(errorMessage);
    }

    if (!options.filePath) {
      errorMessage = '\n    An Options Object must contain a "filePath" property, ' +
        'e.g { filepath: "../settings/assert.env" }';
      throw new OptionsError(errorMessage);
    }

    assertFilePath = options.filePath;
  }

  // look for explicit file location
  if (assertFilePath.indexOf('/') > -1) {
    fs.exists(assertFilePath, function(exists) {
      if (exists) {
        settings = getSettingsFromFile({
          'assertFilePath': assertFilePath
        });
        assertSettings(settings);

        return true;
      }

      errorMessage = assertFilePath + ' does not exist.';
      throw new FileNotFoundError(errorMessage);
    });
  }

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

    return true;
  });
};