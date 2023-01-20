/**
 * Module dependencies
 */
import * as babel from '@babel/core';
import { BabelPlugin } from './types';

/**
  * TODO how can we make that babel does not format code
  */
const DEGAUL_TRANSFORM_OPTIONS: babel.TransformOptions = {
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
  plugins: BabelPlugin[] | Array<[BabelPlugin, object]> | babel.PluginItem[],
): Promise<string | never> {
  const out = await babel.transformAsync(input, {
    ...DEGAUL_TRANSFORM_OPTIONS,
    plugins,
  });
  return out.code;
}

/**
  * Expose `transformSync`.
  */
export function transformSync(
  input: string,
  plugins: BabelPlugin[] | Array<[BabelPlugin, object]> | babel.PluginItem[],
): string {
  const out = babel.transformSync(input, {
    ...DEGAUL_TRANSFORM_OPTIONS,
    plugins,
  });
  return out.code;
}
