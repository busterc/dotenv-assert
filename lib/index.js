'use strict';

var fs = require('fs');
var findParentDir = require('find-parent-dir');
var ASSERT_FILENAME = 'assert.env';
var settings = [];

function dotenvAssert() {
  switch (arguments.length) {
  case 0:
    return dotenvAssert.syncd();
  case 1:
    var method = (typeof arguments[0] === 'function') ? 'asyncd' : 'synco';
    return dotenvAssert[method](arguments[0]);
  case 2:
    return dotenvAssert.asynco.apply({}, arguments);
  default:
    throw new Error('Invalid number of arguments');
  }
}

dotenvAssert.syncd = function () {
  var assertFilePath = getAssertFilePath.sync(ASSERT_FILENAME);
  var settings = readFileSyncToArray(assertFilePath);

  assertSettings(settings);
};

dotenvAssert.synco = function (options) {
  assertObject('options', options);

  var assertFilePath = getAssertFilePath.sync(options.filePath);
  var settings = readFileSyncToArray(assertFilePath);

  assertSettings(settings);
};

dotenvAssert.asyncd = function (callback) {
  assertFunction('callback', callback);

  getAssertFilePath(ASSERT_FILENAME, function (error, assertFilePath) {
    if (error) {
      return callback(error);
    }

    readFileToArray(assertFilePath, function (error, settings) {
      if (error) {
        return callback(error);
      }

      assertSettings(settings, callback);
    });
  });
};

dotenvAssert.asynco = function (options, callback) {
  assertObject('options', options);
  assertFunction('callback', callback);

  getAssertFilePath(options.filePath, function (error, assertFilePath) {
    if (error) {
      return callback(error);
    }

    readFileToArray(assertFilePath, function (error, settings) {
      if (error) {
        return callback(error);
      }

      assertSettings(settings, callback);
    });
  });
};

function isFunction(fn) {
  return (typeof fn === 'function');
}

function assertFunction(name, fn) {
  if (!isFunction(fn)) {
    throw new Error(name + ' is not a function');
  }
}

function isObject(obj) {
  return (typeof obj === 'object');
}

function assertObject(name, obj) {
  if (!isObject(obj)) {
    throw new Error(name + ' is not a object');
  }
}

function readFileToArray(filename, callback) {
  assertFunction('callback', callback);

  fs.readFile(filename, function (error, contents) {
    if (error) {
      return callback(error);
    }

    contents = String(contents);
    var contentsArray = fileToArray(contents);

    callback(null, contentsArray);
  });
}

function readFileSyncToArray(filename) {
  var file = String(fs.readFileSync(filename));

  return fileToArray(file);
}

function fileToArray(contents) {
  var lines = contents.split(/\r?\n/);
  var lineCount = lines.length;
  var results = [];
  var currentLine = 0;

  for (currentLine; currentLine < lineCount; currentLine++) {
    var line = lines[currentLine].trim();
    if (line.length > 0) {
      results.push(line);
    }
  }

  return results;
}

function isExplicitFilePath(filePath) {
  if (filePath.indexOf('/') > -1) {
    return true;
  }
}

function getAssertFilePath(filePath, callback) {
  assertFunction('callback', callback);

  if (isExplicitFilePath(filePath)) {
    callback(null, filePath);
  }

  var cwd = process.cwd();

  findParentDir(cwd, filePath, function (error, directory) {
    if (error || directory === null) {
      throw new Error(filePath + ' cannot be found.');
    }

    var assertFilePath = directory + '/' + filePath;

    callback(null, assertFilePath);
  });
}

getAssertFilePath.sync = function (filePath) {
  if (isExplicitFilePath(filePath)) {
    return filePath;
  }

  var cwd = process.cwd();
  var directory = findParentDir.sync(cwd, filePath);
  var assertFilePath = directory + '/' + filePath;

  return assertFilePath;
};

function assertSettings(settings, callback) {
  var settingsCount = settings.length;
  var setting = 0;
  var isError = false;
  var errorMessage = 'Missing environment setting(s):';
  var assertionError;

  for (setting; setting < settingsCount; setting++) {
    var settingName = settings[setting];
    var settingValue = process.env[settingName];

    if (!settingValue) {
      isError = true;
      errorMessage += '\n      - ' + settingName;
    }
  }

  if (isError === true) {
    assertionError = new Error(errorMessage);

    if (!isFunction(callback)) {
      throw new Error(errorMessage);
    }
  }

  if (isFunction(callback)) {
    callback(assertionError);
  }
}

module.exports = dotenvAssert;
