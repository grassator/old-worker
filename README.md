# Old Worker

> NOTE This is work in progress and probably doesn't do anything useful yet.

Goal of `Old Worker` is to provide highly-accurate polyfill for Web Workers in following browsers:

- Android 2.3 - Android 4.3
- IE9
- IE8 (possibly)

[![NPM version](https://badge.fury.io/js/happened.svg)](https://npmjs.org/package/old-worker)
[![GitHub version][git-tag-image]][project-url]
[![Dependency Status][daviddm-url]][daviddm-image]

## Contributing

### Setting Up Development Environment

To start do a fork of this repo, clone it locally and type in your terminal:

```bash
npm install
gulp tdd
```

This will continuously run tests for nice dev experience. To run tests just once or in CI environment you can use:

```bash
gulp test
```

To build for production run:

```bash
gulp build
```

## License

© 2015 Dmitriy Kubyshkin. Licensed under the MIT style license.

[project-url]: https://github.com/grassator/old-worker
[git-tag-image]: http://img.shields.io/github/tag/grassator/old-worker.svg
[travis-url]: https://travis-ci.org/grassator/old-worker
[travis-image]: https://travis-ci.org/grassator/old-worker.svg?branch=master
[daviddm-url]: https://david-dm.org/grassator/old-worker.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/grassator/old-worker
