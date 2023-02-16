import pluginTester from 'babel-plugin-tester';
import redirectThisProperty from '../src';

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
    },
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
