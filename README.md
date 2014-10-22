# dotenv-assert

Requires specified environment settings to exist in node applications.

## Version 2.1.0
- This module version now accepts an optional callback function.
- It is recommended that you wrap your application in the callback, to insure that the async functions used by dotenv-assert complete before attempting to start.

## Prerequisites
- **dotenv** is not required, but recommended
  - [npmjs.org/package/dotenv](https://www.npmjs.org/package/dotenv)
  - [github/motdolta/dotenv](https://github.com/motdotla/dotenv)

## How does it work
An exception is thrown if any of these cases are true:
  - An `assert.env` file is not found
  - The keys listed in the `assert.env` file are not set on `process.env`


## Installation
```sh
$ npm install --save dotenv-assert
```

## Usage
```javascript
/**
*  load an assert.env file from CWD or
*  from the nearest parent directory where assert.env is found
*  (without a specified callback, not recommended)
*/
require('dotenv-assert')();

// or, same as above (with a callback, recommended)
require('dotenv-assert')({}, function() {
  console.log('Environment Settings Asserted!');
});

// you may include a callback on all further examples

/**
*  or, specify a custom file location
*/
require('dotenv-assert')({
  filePath: '../configs/assert.config'
});

/**
*  or, specify a custom file name, that will be loaded from
*  CWD or the nearest parent directory where it is found.
*/
require('dotenv-assert')({
  filePath: 'env.config'
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

  ```javascript
  var dotenv = require('dotenv');
  dotenv.load();

  require('dotenv-assert')({}, function() {
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
  $ node index.js
  Server running at http://127.0.0.1:1337/
  ```

## CHANGELOG

- 2.0.0
  No longer accepts an Array of settings to assert. Instead, an Options Object: `{ filePath: 'somefile.ext' }` or empty arguments are required.

## LICENSE

ISC License (ISC)

Copyright &copy; 2014, Buster Collings

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
