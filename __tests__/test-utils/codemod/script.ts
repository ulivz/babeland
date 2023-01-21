/**
 * Module dependencies
 */
import * as babel from '@babel/core';
import { t, types } from '../../../src';

const { definePlugin, definePluginConfig, defineVisitor } = types;

export { t };

export { definePlugin, definePluginConfig, defineVisitor };

/**
 * TODO babel transform 有没有办法不 format code
 */
const baseCodemodOptions: babel.TransformOptions = {
  /**
   * do not enable config file
   */
  configFile: false,
  /**
   * do not read babelrc
   */
  babelrc: false,

  compact: false,

  /**
   * enable typescript
   */
  parserOpts: {
    sourceType: 'module',
    plugins: [
      'typescript',
    ],
  },
};

/**
 * Expose `transform`.
 */
export async function transform(
  input: string,
  plugins: types.BabelPlugin[] | Array<[types.BabelPlugin, object]> | babel.PluginItem[],
): Promise<string | never> {
  const out = await babel.transformAsync(input, {
    ...baseCodemodOptions,
    plugins,
  });
  return out.code;
}

/**
 * Expose `transformSync`.
 */
export function transformSync(
  input: string,
  plugins: types.BabelPlugin[] | Array<[types.BabelPlugin, object]> | babel.PluginItem[],
) {
  const out = babel.transformSync(input, {
    ...baseCodemodOptions,
    plugins,
  });
  return out.code;
}
