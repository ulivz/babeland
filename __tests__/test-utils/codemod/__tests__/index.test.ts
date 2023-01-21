/**
 * Module dependencies
 */
import { ScriptCodemod } from '../index';

describe('ScriptCodemod', () => {
  const plugins = [
    ScriptCodemod.definePluginConfig(
      ScriptCodemod.definePlugin(() => ({
        visitor: {
          BinaryExpression(path) {
            if (path.node.operator !== '===') {
              return;
            }
            path.node.left = ScriptCodemod.t.identifier('sebmck');
            path.node.right = ScriptCodemod.t.identifier('dork');
          },
        },
      })),
    ),
  ];

  it('transformSync', () => {
    const output = ScriptCodemod.transformSync('foo === bar;', plugins);
    expect(output).toBe('sebmck === dork;');
  });

  it('transform', async () => {
    const output = await ScriptCodemod.transform('foo === bar;', plugins);
    expect(output).toBe('sebmck === dork;');
  });
});
