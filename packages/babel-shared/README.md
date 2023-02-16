<h1 align="center">babel-shared</h1>

<p align="center">
  Shared babel types and utilities
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Motivation](#motivation)
  - [Declare a type-hinted babel plugin](#declare-a-type-hinted-babel-plugin)
  - [Why not `@babel/helper-plugin-utils`？](#why-not-babelhelper-plugin-utils)
  - [I DON'T WANT to install so many `@babel/*` packages](#i-dont-want-to-install-so-many-babel-packages)
- [Install](#install)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

### Declare a type-hinted babel plugin

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
import { declarePlugin } from "babel-shared";

module.exports = declarePlugin((babel) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        // ...
      },
    },
  };
});
```

### Why not `@babel/helper-plugin-utils`？

[@babel/helper-plugin-utils](https://babeljs.io/docs/en/babel-helper-plugin-utils) is aims to provide clear error messages if a plugin is run on a version of Babel that doesn't have the APIs that the plugin is trying to use. while you can only get its type by installing [@types/babel\_\_helper-plugin-utils](https://www.npmjs.com/package/@types/babel__helper-plugin-utils), and this package has not been updated for many years.

With `babel-shared`, you don't need care the type obsolescence problem.

### I DON'T WANT to install so many `@babel/*` packages

If you frequently use babel to manipulate AST transformations, you may find that you must also install these packages **as well as there types (`@types/babel__*`)**:

- [@babel/types](https://babeljs.io/docs/en/babel-types)
- [@babel/parser](https://babeljs.io/docs/en/babel-parser#babelparserparsecode-options)
- [@babel/traverse](https://babeljs.io/docs/en/babel-traverse)
- [@babel/generator](https://babeljs.io/docs/en/babel-generator)
- ......

That's pretty tedious, so `babel-shared` brings them all together and can be used in very quickly when you need it.

## Install

```bash
npm i babel-shared -S  # npm
pnpm i babel-shared -S # pnpm
```

## License

MIT &copy; [ULIVZ](https://github.com/ulivz)
