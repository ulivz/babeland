/**
 * Module dependencies
 */
import * as babel from '@babel/core';
import { BabelPlugin } from './types';

/**
  * FIXME: how can we make that babel does not format code
  */
const DEFAULT_TRANSFORM_OPTIONS: babel.TransformOptions = {
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
): Promise<string | null | undefined> {
  const out = await babel.transformAsync(input, {
    ...DEFAULT_TRANSFORM_OPTIONS,
    plugins,
  });
  return out?.code;
}

/**
  * Expose `transformSync`.
  */
export function transformSync(
  input: string,
  plugins: BabelPlugin[] | Array<[BabelPlugin, object]> | babel.PluginItem[],
): string | null | undefined {
  const out = babel.transformSync(input, {
    ...DEFAULT_TRANSFORM_OPTIONS,
    plugins,
  });
  return out?.code;
}
