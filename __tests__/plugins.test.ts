/**
 * Module dependencies
 */
import pluginTester from 'babel-plugin-tester/pure';
import redirectImport from '../src/plugins/babel-plugin-redirect-import';
import redirectThisProperty from '../src/plugins/babel-plugin-redirect-this-property';

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

pluginTester({
  pluginName: 'babel-plugin-redirect-this-property',
  plugin: redirectThisProperty,
  pluginOptions: {
    identifierMap: {
      foo: 'bar',
      commit: '$store.commit',
      dispatch: '$store.dispatch',
      state: '$store.state',
      getters: '$store.getters',
      globalState: '$global.state',
      globalGetters: '$global.getters',
      commitGlobal: '$global.commit',
      dispatchGlobal: '$global.dispatch',
    },
  },
  formatResult: r => r,
  tests: [
    {
      title: 'this.foo',
      code: 'this.foo',
      output: 'this.bar;',
    },
    {
      title: 'this.commit',
      code: 'this.commit(\'getUserInfo\');',
      output: 'this.$store.commit(\'getUserInfo\');',
    },
    {
      title: 'this.dispatch',
      code: 'this.dispatch(\'getUserInfo\');',
      output: 'this.$store.dispatch(\'getUserInfo\');',
    },
    {
      title: 'this.state',
      code: 'this.state',
      output: 'this.$store.state;',
    },
    {
      title: 'this.getters',
      code: 'this.getters',
      output: 'this.$store.getters;',
    },
    {
      title: 'this.globalState',
      code: 'this.globalState',
      output: 'this.$global.state;',
    }, ,
    {
      title: 'this.globalGetters',
      code: 'this.globalGetters',
      output: 'this.$global.getters;',
    },
    {
      title: 'this.commitGlobal',
      code: 'this.commitGlobal(\'getUserInfo\');',
      output: 'this.$global.commit(\'getUserInfo\');',
    },
    {
      title: 'this.dispatchGlobal',
      code: 'this.dispatchGlobal(\'getUserInfo\');',
      output: 'this.$global.dispatch(\'getUserInfo\');',
    },
  ],
});
