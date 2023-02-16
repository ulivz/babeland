<h1 align="center">babeland</h1>

<p align="center">
  A collection of babel helpers, types, and plugins
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Motivation](#motivation)
  - [I DON'T WANT to install so many `@babel/*` packages](#i-dont-want-to-install-so-many-babel-packages)
  - [Different to `babel-shared`?](#different-to-babel-shared)
- [Install](#install)
- [Example](#example)
  - [Transform JSX](#transform-jsx)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

### I DON'T WANT to install so many `@babel/*` packages

If you frequently use babel to manipulate AST transformations, you may find that you must also install these packages **as well as there types (`@types/babel__*`)**:

- [@babel/types](https://babeljs.io/docs/en/babel-types)
- [@babel/parser](https://babeljs.io/docs/en/babel-parser#babelparserparsecode-options)
- [@babel/traverse](https://babeljs.io/docs/en/babel-traverse)
- [@babel/generator](https://babeljs.io/docs/en/babel-generator)
- ......

That's pretty tedious, so `babeland` brings them all together and can be used in very quickly when you need it.

### Different to `babel-shared`?

`babel-shared` only exports basic types and utilities, while `babeland` exports `parser`, `traverse` and `generator`.

## Install

```bash
npm i babeland -S  # npm
pnpm i babeland -S # pnpm
```

## Example

### Transform JSX

```ts
import { transformSync, declarePluginTuple, declarePlugin } from 'babeland';

const pluginTuple = declarePluginTuple(
  declarePlugin(babal => ({
    name: 'solid',
    inherits: require('@babel/plugin-syntax-jsx').default,
    pre() {
      this.templates = [];
    },
    visitor: {
      JSXElement(path) {
        // Your transform
      },
    },
  })),
  {
    hello: 'world',
  },
);

const input = "<div>Hello, {'Babeland'}</div>";

const output = transformSync(input, {
  plugins: [pluginTuple],
});

console.log('input\n', input);
console.log('output\n', output.code);
```

## License

MIT &copy; [ULIVZ](https://github.com/ulivz)
