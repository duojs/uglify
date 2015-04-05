# duo-uglify

> An uglify plugin for use in duo builds

## Installation

```sh
$ npm install duo-uglify
```

## Usage

```sh
$ duo --use duo-uglify
```

```js
var duo = require('duo');
var uglify = require('duo-uglify');

duo(__dirname)
  .use(uglify())
  .entry('index.js')
  .run(function (err, results) {
    // ...
  });
```

## API

### uglify(options)

Generates a duo plugin function. Any `options` will be passed directly to
`UglifyJS.minify()`.

This plugin will automatically detect source-maps support.
