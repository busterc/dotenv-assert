# dotenv-assert

Requires specified environment settings to exist.

## Prerequisites
- **dotenv** is not required, but recommended
  - [npmjs.org/package/dotenv](https://www.npmjs.org/package/dotenv)
  - [github/motdolta/dotenv](https://github.com/motdotla/dotenv)

## Installation
```sh
$ npm install --save dotenv-assert
```

## Usage
```javascript
require('dotenv-assert')([
  'PORT',
  'DB',
  'WHATEVA'
]);
```

## Express Example
```javascript
var dotenv = require('dotenv');
dotenv.load();
require('dotenv-assert')([
  'PORT',
  'DB'
]);

var express = require('express');
var app = express();

app.set('port', process.env.PORT);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
```

## LICENSE

ISC License (ISC)

Copyright &copy; 2014, Buster Collings

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
