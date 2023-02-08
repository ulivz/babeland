/**
 * Module dependencies
 */
import { transformSync, transform } from '../src/transform';
import { declarePluginConfig, declarePlugin } from '../src/helpers';
import { t } from '../src/types';

const plugins = [
  declarePluginConfig(
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
  const output = transformSync('foo === bar;', plugins);
  expect(output).toBe('sebmck === dork;');
});

it('transform', async () => {
  const output = await transform('foo === bar;', plugins);
  expect(output).toBe('sebmck === dork;');
});
