<h1 align="center">babel-plugin-redirect-import</h1>

<p align="center">
  A babel plugin to redirect this property declaration
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

### Table of Contents

- [Quick Start](#quick-start)
- [Options](#options)
  - [specifierMap](#specifiermap)
- [Example](#example)
    - [Specify identifiers](#specify-identifiers)
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


### specifierMap

- **Type**: `object`
- **Description**: A map to describe import specifier.  
- **Example**: 

  ```ts
  {
    identifierMap: {
      foo: 'bar',
      baz: 'a.b'
    }
  }
  ```

## Example

#### Specify identifiers

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
