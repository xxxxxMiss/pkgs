bumo-sdk-nodejs
=======

Let developers can all use bumo blockchain services more easily.


## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6.0.0 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install bumo-sdk --save
```


## Quick Start

  Create bumo-sdk instance:

```js
'use strict';

const BumoSDK = require('bumo-sdk');

const sdk = new BumoSDK({
  host: 'x.x.x.x:36002',
});

```

  Usage:

```js
// Create account
sdk.account.create().then(data => {
  console.log(data);
}).catch(err => {
  console.log(err.message);
});

```


## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## Docs

  * [Documentation](doc/SDK_CN.md)

## License

  [MIT](LICENSE)
