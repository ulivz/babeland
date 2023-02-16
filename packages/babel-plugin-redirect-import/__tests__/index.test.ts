import pluginTester from 'babel-plugin-tester';
import redirectImport from '../src';

pluginTester({
  title: 'babel-plugin-redirect-import (default)',
  pluginName: 'babel-plugin-redirect-import',
  plugin: redirectImport,
  pluginOptions: {
    importMap: {
      '@ulivz/before': '@ulivz/after',
    },
  },
  formatResult: r => r,
  tests: [
    {
      title: 'default',
      code: 'import { Component } from \'@ulivz/before\';',
      output: 'import { Component } from "@ulivz/after";',
    },
  ],
});

pluginTester({
  title: 'babel-plugin-redirect-import (redirect specifiers)',
  pluginName: 'babel-plugin-redirect-import',
  plugin: redirectImport,
  pluginOptions: {
    importMap: {
      '@ulivz/before': {
        name: '@ulivz/after',
        specifierMap: {
          app: 'App',
        },
      },
    },
  },
  formatResult: r => r,
  tests: [
    {
      title: 'default',
      code: 'import { app } from "@ulivz/before";',
      output: 'import { App } from "@ulivz/after";',
    },
    {
      title: 'custom local specifier',
      code: 'import { app as App } from "@ulivz/before";',
      output: 'import { App } from "@ulivz/after";',
    },
  ],
});

pluginTester({
  title: 'babel-plugin-redirect-import (specifierMap)',
  pluginName: 'babel-plugin-redirect-import',
  plugin: redirectImport,
  pluginOptions: {
    specifierMap: {
      Foo: 'Bar',
    },
  },
  formatResult: r => r,
  tests: [
    {
      title: 'default',
      code: 'import { Foo } from \'foo\';',
      output: 'import { Bar } from \'foo\';',
    },
    {
      title: 'default',
      code: 'import { Foo, Foo2 } from \'foo\';',
      output: 'import { Bar, Foo2 } from \'foo\';',
    },
  ],
});

pluginTester({
  title: 'babel-plugin-redirect-import (specifierMap - with targetImport)',
  pluginName: 'babel-plugin-redirect-import',
  plugin: redirectImport,
  pluginOptions: {
    specifierMap: {
      Store: {
        name: 'Store',
        targetImport: '@ulivz/after-store',
      },
    },
  },
  formatResult: r => r,
  tests: [
    {
      title: 'default',
      code: 'import { Store } from \'../../../common\';',
      output: 'import { Store } from "@ulivz/after-store";',
    },
  ],
});
