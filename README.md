<h1 align="center">babel-shared</h1>

<p align="center">
    Shared Stable Types And Utilities for Babel
</p>

<p align="center">
    <a href="https://npmjs.com/package/babel-shared"><img src="https://img.shields.io/npm/v/babel-shared.svg?style=flat" alt="NPM version"></a> 
    <a href="https://npmjs.com/package/babel-shared"><img src="https://img.shields.io/npm/dm/babel-shared.svg?style=flat" alt="NPM downloads"></a> 
    <a href="https://circleci.com/gh/saojs/babel-shared"><img src="https://img.shields.io/circleci/project/saojs/babel-shared/master.svg?style=flat" alt="Build Status"></a> 
</p>

## Motivation

### Declare a type-hinted Babel Plugin

Suppose you're writing a babel plugin and want to convert all `let` and `const` declarations to `var`, you would write a plugin like this:

```ts
module.exports = (babel) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        const { node } = path;
        if (node.kind === "let" || node.kind === "const") {
          node.kind = "var";
        }
      },
    },
  };
};
```

you'll find that all context objects(`babel`, `path` and `node`) have not types, and you can only move to the next step by debugging it, therefore, this will cause a lot of trouble to coding.

With `babel-shared`, you can have full type hints:

```ts
import { defineBabelPlugin } from 'babel-shared';

export function declarePlugin((babel) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        const { node } = path;
        if (node.kind === "let" || node.kind === "const") {
          node.kind = "var";
        }
      },
    },
  };
});
```

### Why not `@babel/helper-plugin-utils`？

[@babel/helper-plugin-utils](https://babeljs.io/docs/en/babel-helper-plugin-utils) is aims to provide clear error messages if a plugin is run on a version of Babel that doesn't have the APIs that the plugin is trying to use. while you can only get its type by installing [@types/babel__helper-plugin-utils](https://www.npmjs.com/package/@types/babel__helper-plugin-utils), and this package has not been updated for many years.

With `babel-shared`, you don't need care the type obsolescence problem.


### I DON'T WANT to install so many `@babel/*` packages

If you frequently use Babel to manipulate AST transformations, you may find that you must also install these packages as well as there types (`@types/babel__*`): 

- [@babel/types](https://babeljs.io/docs/en/babel-types)
- [@babel/parser](https://babeljs.io/docs/en/babel-parser#babelparserparsecode-options)
- [@babel/traverse](https://babeljs.io/docs/en/babel-traverse)
- [@babel/generator](https://babeljs.io/docs/en/babel-generator)

That's pretty tedious, so `babel-shared` brings them all together and can be used in very quickly when you need it.

## Install

```bash
npm i babel-shared -S  # npm
pnpm i babel-shared -S # pnpm
```

## API

### `declarePlugin`

- **Description**: A helper function for declare a babel plugin.
- **Type**:
  
  ```ts
  function declarePlugin<
    T extends PluginOptions = object,
    U extends object = object
  >(fn: BabelPlugin<T, U>): typeof fn;
  ```

- **Example**:
    
  ```ts
  import { declarePlugin } from 'babel-shared';
  
  export function declarePlugin((babel) => {
    return {
      visitor: {
        // ...
      },
    };
  });
  ```

### `t`

- **Description**: Wrapped exports of [@babel/types](https://babeljs.io/docs/en/babel-types).
- **Example**:
  
  ```ts
  import { t } from 'babel-shared';
  
  if (!t.isIdentifier(path.node.property)) {
    return;
  }
  ```

### `parse()`

- **Description**: `parse()` function from [@babel/parser](https://babeljs.io/docs/en/babel-parser#babelparserparsecode-options).

### `traverse()`

Default exported method of [babel-traverse](https://babeljs.io/docs/en/babel-traverse).


### `generate()`

Default exported method of [babel-generator](https://babeljs.io/docs/en/babel-generator).


## Features

- TypeScript by default.
- Output both `cjs` and `esm`.
- Unit test with [jest](https://facebook.github.io/jest/).
- Format code with [eslint](https://eslint.org/docs).
- Fix and format code on each commit.
- Leverage [@insx/publish](https://github.com/insx/publish) for release flow.

## License

MIT &copy; [INS-X](https://github.com/ins-x)
