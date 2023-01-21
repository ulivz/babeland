<h1 align="center">babel-shared</h1>

<p align="center">
    Babel Shared Types And Utils.
</p>

<p align="center">
    <a href="https://npmjs.com/package/babel-shared"><img src="https://img.shields.io/npm/v/babel-shared.svg?style=flat" alt="NPM version"></a> 
    <a href="https://npmjs.com/package/babel-shared"><img src="https://img.shields.io/npm/dm/babel-shared.svg?style=flat" alt="NPM downloads"></a> 
    <a href="https://circleci.com/gh/saojs/babel-shared"><img src="https://img.shields.io/circleci/project/saojs/babel-shared/master.svg?style=flat" alt="Build Status"></a> 
</p>

## Quick Start

1. Click "Use this template" at this repository.
2. Rename all `babel-shared` to your package name.
3. Commands:

```bash
npm run bootstrap   # install dependencies
npm run dev         # development both cjs and esm output
npm run build       # build both cjs and esm
npm run lint        # lint code
npm run lint:fix    # fix all code lint errors
npm run test        # run all tests
npm run cov         # run all tests and generate coverage report
npm run release     # release this package
```

## Features

- TypeScript by default.
- Output both `cjs` and `esm`.
- Unit test with [jest](https://facebook.github.io/jest/).
- Format code with [eslint](https://eslint.org/docs).
- Fix and format code on each commit.
- Leverage [@insx/publish](https://github.com/insx/publish) for release flow.

## License

MIT &copy; [INS-X](https://github.com/ins-x)
