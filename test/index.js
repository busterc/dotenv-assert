'use strict';

/* global describe, before, beforeEach, it */

var assert = require('assert');
var dotenvAssert = require('../lib');
var subdirectory = './1/2/3';
var CURRENT_WORKING_DIRECTORY;

describe('dotenvAssert', function () {

  before(function () {
    CURRENT_WORKING_DIRECTORY = __dirname;

    // apply required env settings
    var settings = [
      'DOTENV_ASSERT_DEFAULT_1',
      'DOTENV_ASSERT_DEFAULT_2',
      'DOTENV_ASSERT_DEFAULT_3',
      'DOTENV_ASSERT_DEV_1',
      'DOTENV_ASSERT_DEV_2',
      'DOTENV_ASSERT_DEV_3',
      'DOTENV_ASSERT_PARENT_1',
      'DOTENV_ASSERT_PARENT_2',
      'DOTENV_ASSERT_PARENT_3'
    ];
    var settingsCount = settings.length;
    var setting = 0;

    for (setting; setting < settingsCount; setting++) {
      var settingName = settings[setting];
      process.env[settingName] = true;
    }
  });

  beforeEach(function () {
    process.chdir(CURRENT_WORKING_DIRECTORY);
  });

  it('should run sync with defaults', function (done) {
    dotenvAssert();
    done();
  });

  it('should run sync with custom options', function (done) {
    dotenvAssert({
      filePath: 'assert.env.dev'
    });
    done();
  });

  it('should run async with defaults', function (done) {
    dotenvAssert(function (error) {
      assert.equal(null, error);
      done();
    });
  });

  it('should run async with custom options', function (done) {
    dotenvAssert({
        filePath: 'assert.env.dev'
      },
      function (error) {
        assert.equal(null, error);
        done();
      });
  });

  it('should run sync with defaults and find the assert file in a parent directory', function (done) {
    process.chdir(subdirectory);
    dotenvAssert();
    done();
  });

  it('should run sync with custom options and find the assert file in a parent directory', function (done) {
    process.chdir(subdirectory);
    dotenvAssert({
      filePath: 'assert.env.parent'
    });
    done();
  });

  it('should run async with defaults and find the assert file in a parent directory', function (done) {
    process.chdir(subdirectory);
    dotenvAssert(function (error) {
      assert.equal(null, error);
      done();
    });
  });

  it('should run async with custom options and find the assert file in a parent directory', function (done) {
    dotenvAssert({
        filePath: 'assert.env.parent'
      },
      function (error) {
        assert.equal(null, error);
        done();
      });
  });

  it('should fail to find a missing assert file path', function (done) {
    assert.throws(function () {
      dotenvAssert({
        filePath: './xxx/you-will-never-find-me.env'
      });
    });
    done();
  });

  it('should fail to assert on a missing env setting', function (done) {
    assert.throws(function () {
      dotenvAssert({
        filePath: 'assert.env.fail'
      });
    });
    done();
  });

});
