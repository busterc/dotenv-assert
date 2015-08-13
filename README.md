# dotenv-assert

Requires specified environment settings to exist in node applications.

## Version 3.0.0

- This module now fully supports sync and async execution
  - Synchronous execution throws errors (if errors)
  - Asnychronous execution passes errors to the error-first callback

## Prerequisites

- I highly recommend using **[assert-dotenv](https://github.com/busterc/assert-dotenv)** rather than this module, if you also want to apply environment settings from a `.env` file.

## How does it work

An exception is thrown if any of these cases are true:
  - An `assert.env` (or otherwise specified) file is not found
  - The keys listed in the `assert.env` file are not set on `process.env`

Otherwise, your environment settings are applied and your application executes as expected.

## Why use dotenv-assert

- Storing [configuration in the environment](http://www.12factor.net/config) is one of the tenets of a [twelve-factor app](http://www.12factor.net/).
- Implicit default settings can lead to confusing troubleshooting scenarios and should be avoided entirely.
- The `assert.env` file only lists what environment settings (keys) are required without providing values like private tokens, passwords, etc. and therefore can and should be checked into version control repositories.

## Installation

```sh
$ npm install --save dotenv-assert
```

## Usage

```javascript
/**
*  Synchronously load an assert.env file from CWD or
*  from the nearest parent directory where assert.env is found.
*/
require('dotenv-assert')();

/**
*  or, specify a custom file location
*/
require('dotenv-assert')({
  filePath: '../configs/assert.config'
});

/**
*  or, specify a custom file name (without a path) and it will
*  be loaded from CWD or the nearest parent directory where
*  it is found.
*/
require('dotenv-assert')({
  filePath: 'env.config'
});

/**
*  Asynchronous execution occurs when you provide a callback function
*/
require('dotenv-assert')(function(error) {
  if(error) throw error;
  console.log('Environment Settings Asserted!');
});

/**
*  Asynchronous execution works with custom options also
*/
require('dotenv-assert')({
    filePath: 'different.env'
  }, function(error) {
    if(error) throw error;
    console.log('Environment Settings Asserted!');
  });

```

## Simple HTTP Server Example

This example uses [**dotenv**](https://github.com/motdotla/dotenv) for applying settings, hence the `~/app/.env` file listed below:

- ~/app/.env

  ```
  IP=127.0.0.1
  PORT=1337
  ```

- ~/app/assert.env

  ```
  IP
  PORT
  ```

- ~/app/index.js

  - Synchronous Example

    ```javascript
    var dotenv = require('dotenv');
    var dotenvAssert = require('dotenv-assert');
    var http = require('http');

    dotenv.load();
    dotenvAssert();

    http.createServer(function (request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    }).listen(process.env.PORT, process.env.IP);

    console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');
    ```

  - Asynchronous Example

    ```javascript
    var dotenv = require('dotenv');
    var dotenvAssert = require('dotenv-assert');

    dotenv.load();

    dotenvAssert(function(error) {
      if(error) throw error;
      var http = require('http');

      http.createServer(function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello World\n');
      }).listen(process.env.PORT, process.env.IP);

      console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');
    });
    ```

- _Start the server and see that all is well_

  ```sh
  $ node ~/app/index.js
  Server running at http://127.0.0.1:1337/
  ```

## LICENSE

ISC License (ISC)

Copyright &copy; 2014-2015, Buster Collings

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
