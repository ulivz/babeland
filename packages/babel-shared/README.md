<h1 align="center">babel-shared</h1>

<p align="center">
  Minimal babel types and utilities
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Motivation](#motivation)
  - [Declare a type-hinted babel plugin](#declare-a-type-hinted-babel-plugin)
  - [Why not `@babel/helper-plugin-utils`？](#why-not-babelhelper-plugin-utils)
  - [Type check for plugin options and plugin state](#type-check-for-plugin-options-and-plugin-state)
  - [Linkage between plugin definition and configuration](#linkage-between-plugin-definition-and-configuration)
- [Install](#install)
- [API](#api)
  - [`declarePlugin()`](#declareplugin)
  - [`declarePluginTuple()`](#declareplugintuple)
  - [`t`](#t)
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
import { declarePlugin } from "babel-shared";
import { transformSync } from "babeland";

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
import { transformSync, declarePlugin, declarePluginTuple } from "babeland";

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

## Install

```bash
npm i babel-shared -S  # npm
pnpm i babel-shared -S # pnpm
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

## License

MIT &copy; [ULIVZ](https://github.com/ulivz)
