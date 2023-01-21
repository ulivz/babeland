/**
 * Module dependencies
 */
import { AxmlCodemod, ScriptCodemod } from '../script';

describe('AxmlCodemod', () => {
  it('transformSync', () => {
    const { t } = AxmlCodemod;
    const output = AxmlCodemod.transformSync('<view>App</view>', {
      Node(node) {
        if (t.isTag(node)) {
          node.attribs.foo = 'bar';
        }
      },
    });
    expect(output).toBe('<view foo=\"bar\">App</view>');
  });

  it('transformSync - do not generate', () => {
    const output = AxmlCodemod.transformSync('<view>{{ App }}</view>', {}, false);
    expect(output).toBe(null);
  });
});

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
