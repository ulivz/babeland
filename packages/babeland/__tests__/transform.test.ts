import { t, declarePluginTuple, declarePlugin } from 'babel-shared';
import { transformSync, transformAsync } from '../src/transform';

const plugins = [
  declarePluginTuple(
    declarePlugin(() => ({
      visitor: {
        BinaryExpression(path) {
          if (path.node.operator !== '===') {
            return;
          }
          path.node.left = t.identifier('sebmck');
          path.node.right = t.identifier('dork');
        },
      },
    })),
  ),
];

it('transformSync', () => {
  const output = transformSync('foo === bar;', {
    plugins,
  });
  expect(output.code).toBe('sebmck === dork;');
});

it('transformAsync', async () => {
  const output = await transformAsync('foo === bar;', {
    plugins,
  });
  expect(output.code).toBe('sebmck === dork;');
});
