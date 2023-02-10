<h1 align="center">babel-shared</h1>

<p align="center">
    Shared stable types and utilities for babel
</p>

<p align="center">
    <a href="https://npmjs.com/package/babel-shared"><img src="https://img.shields.io/npm/v/babel-shared.svg?style=flat" alt="NPM version"></a> 
    <a href="https://npmjs.com/package/babel-shared"><img src="https://img.shields.io/npm/dm/babel-shared.svg?style=flat" alt="NPM downloads"></a> 
    <a href="https://circleci.com/gh/saojs/babel-shared"><img src="https://img.shields.io/circleci/project/saojs/babel-shared/master.svg?style=flat" alt="Build Status"></a> 
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Motivation](#motivation)
  - [Declare a type-hinted babel plugin](#declare-a-type-hinted-babel-plugin)
  - [Why not `@babel/helper-plugin-utils`？](#why-not-babelhelper-plugin-utils)
  - [I DON'T WANT to install so many `@babel/*` packages](#i-dont-want-to-install-so-many-babel-packages)
- [Install](#install)
- [Guide](#guide)
  - [Type check for plugin options and plugin state](#type-check-for-plugin-options-and-plugin-state)
  - [Linkage between plugin definition and configuration](#linkage-between-plugin-definition-and-configuration)
- [API](#api)
  - [`declarePlugin()`](#declareplugin)
  - [`declarePluginTuple()`](#declareplugintuple)
  - [`t`](#t)
  - [`parse()`](#parse)
  - [`traverse()`](#traverse)
  - [`generate()`](#generate)
- [Built-In Plugins](#built-in-plugins)
  - [babel-plugin-redirect-import](#babel-plugin-redirect-import)
    - [Redirect imported module](#redirect-imported-module)
    - [Redirect imported specifier](#redirect-imported-specifier)
    - [Redirect both import specifier and imported module](#redirect-both-import-specifier-and-imported-module)
    - [Redirect unknown imported module](#redirect-unknown-imported-module)
  - [babel-plugin-redirect-this-property](#babel-plugin-redirect-this-property)
    - [Specifier identifiers](#specifier-identifiers)
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
import { declarePlugin } from 'babel-shared';

export function declarePlugin((babel) => {
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

## Guide

### Type check for plugin options and plugin state

When using [declarePlugin](#declareplugin) or [declarePluginTuple](#declareplugintuple), if you want to enable type check for plugin options and plugin state, you can pass these two generic types:

```ts
import { declarePlugin } from "babel-shared";

interface Options {
  id: string;
}

interface State {
  data: object;
}

const plugin = declarePlugin<Options, State>((babel) => {
  return {
    visitor: {
      VariableDeclaration(path) {
        // Following expressions will have type hints and check.
        this.opts.id;
        /*👆🏻*/
        this.data;
        /*👆🏻*/
      },
    },
  };
});
```

### Linkage between plugin definition and configuration

Suppose you're writing some transform code like this, you'll find plugin configuration does not have type check:

```ts
import { transformSync, declarePlugin } from "babel-shared";

interface Options {
  id: string;
}

interface State {
  foo: object;
}

transformSync("source code", {
  plugins: [
    [
      declarePlugin<Options, State>(() => ({ visitor: {} })),
      { bar: {} },
      /* 👆🏻 wrong types but do not have diagnostics */
    ],
  ],
});
```

With [declarePluginTuple](#declareplugintuple), you'll have strict type check:

```ts
import { transformSync, declarePlugin, declarePluginTuple } from "babel-shared";

interface Options {
  id: string;
}
interface State {
  foo: object;
}

transformSync("source code", {
  plugins: [
    declarePluginTuple<Options, State>(
      declarePlugin<Options, State>(() => ({ visitor: {} })),
      { bar: {} }
      // 👆🏻 Argument of type '{ bar: {}; }' is not assignable to parameter of type 'Options'.
      // Object literal may only specify known properties, and 'bar' does not exist in type 'Options'.
    ),
  ],
});
```

## API

### `declarePlugin()`

- **Description**: A helper function for declare a babel plugin.
- **Type**:

  ```ts
  function declarePlugin<
    T extends PluginOptions = object,
    U extends object = object
  >(fn: BabelPlugin<T, U>): BabelPlugin<T, U>;
  ```

- **Example**:
  - [Declare a type-hinted babel plugin](#declare-a-type-hinted-babel-plugin)
  - [Type check for plugin options and plugin state](#type-check-for-plugin-options-and-plugin-state)

### `declarePluginTuple()`

- **Description**: A helper function for declare a plugin tuple.
- **Type**:

  ```ts
  function declarePluginConfig<
    T extends PluginOptions = object,
    U extends object = object
  >(plugin: BabelPlugin<T, U>, pluginOptions?: T): [BabelPlugin<T, U>, T];
  ```

- **Example**: [Linkage between plugin definition and configuration](#linkage-between-plugin-definition-and-configuration)

### `t`

- **Description**: exports of [@babel/types](https://babeljs.io/docs/en/babel-types).
- **Example**:

  ```ts
  import { t } from "babel-shared";

  if (!t.isIdentifier(path.node.property)) {
    return;
  }
  ```

### `parse()`

- **Description**: `parse()` function from [@babel/parser](https://babeljs.io/docs/en/babel-parser#babelparserparsecode-options).

### `traverse()`

- **Description**: Default exported method of [babel-traverse](https://babeljs.io/docs/en/babel-traverse).

### `generate()`

- **Description**: Default exported method of [babel-generator](https://babeljs.io/docs/en/babel-generator).

## Built-In Plugins

### babel-plugin-redirect-import

#### Redirect imported module

- **Options**:

  ```ts
  {
    importMap: {
      'Foo': 'Bar'
    }
  }
  ```

- **Example**:

  ```ts
  import { Component } from 'before';

        ↓ ↓ ↓ ↓ ↓ ↓

  import { Component } from "after";
  ```

#### Redirect imported specifier

- **Options**:

  ```ts
  {
    specifierMap: {
      Foo: 'Bar',
    },
  }
  ```

- **Example**:

  ```ts
  import { Foo } from 'a-module';

        ↓ ↓ ↓ ↓ ↓ ↓

  import { Bar } from "a-module";
  ```

#### Redirect both import specifier and imported module

- **Options**:

  ```ts
  {
    specifierMap: {
      Foo: {
        name: 'Foo',
        targetImport: 'target',
      },
    },
  }

  ```

- **Example**:

  ```ts
  import { Foo } from "any-module"; // I don't known `any-module`.

        ↓ ↓ ↓ ↓ ↓ ↓

  import { Foo } from "target";
  ```

#### Redirect unknown imported module

If you want to redirect the imported Module based on the Import Specifier, you can try it:

- **Options**:

  ```ts
  `{ 
    importMap: { 
      'before': {
        name: 'after',
        specifierMap: {
          app: 'App',
        },
      },
    } 
  }`; // Plugin Options
  ```

- **Example**:

  ```ts
  import { app } from "before";

        ↓ ↓ ↓ ↓ ↓ ↓

  import { App } from "after";
  ```

### babel-plugin-redirect-this-property

#### Specifier identifiers

- **Options**:

  ```ts
  {
    identifierMap: {
      foo: 'bar',
      baz: 'a.b'
    }
  }
  ```

- **Example**:

  ```ts
  this.foo;
  this.baz;

        ↓ ↓ ↓ ↓ ↓ ↓

  this.bar;
  this.a.b;
  ```

## License

MIT &copy; [ULIVZ](https://github.com/ulivz)
