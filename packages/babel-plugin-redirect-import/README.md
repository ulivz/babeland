<h1 align="center">babel-plugin-redirect-import</h1>

<p align="center">
  Shared babel types and utilities
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

### Table of Contents

- [Quick Start](#quick-start)
- [Options](#options)
  - [importMap](#importmap)
  - [specifierMap](#specifiermap)
- [Example](#example)
  - [Redirect imported module](#redirect-imported-module)
  - [Redirect imported specifier](#redirect-imported-specifier)
  - [Redirect both import specifier and imported module](#redirect-both-import-specifier-and-imported-module)
  - [Redirect unknown imported module](#redirect-unknown-imported-module)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Quick Start

Install:

```bash
npm i babel-plugin-redirect-import -S  # npm
pnpm i babel-plugin-redirect-import -S # pnpm
```

Config plugin in `.babelrc` or `babel-loader`.

```js
{
  "plugins": [["redirect-import", options]]
}
```

## Options

### importMap

- **Type**: `object`
- **Description**: A map to describe import redirection.  
- **Example**:

  ```ts
  {
    importMap: {
      'Foo': 'Bar'
    }
  }
  ```

### specifierMap

- **Type**: `object`
- **Description**: A map to describe import specifier.  
- **Example**: 

  ```ts
  {
    specifierMap: {
      Foo: 'Bar',
    },
  }
  ```

## Example

### Redirect imported module

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

### Redirect imported specifier

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

### Redirect both import specifier and imported module

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

### Redirect unknown imported module

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


## License

MIT &copy; [ULIVZ](https://github.com/ulivz)
