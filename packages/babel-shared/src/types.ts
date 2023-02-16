import * as t from '@babel/types';
import { Visitor, BabelFile, PluginOptions } from '@babel/core';

export { t, PluginOptions };

export interface PluginPass<T extends PluginOptions> {
  file: BabelFile;
  key: string;
  opts: T;
  cwd: string;
  filename: string;
  [key: string]: unknown;
}

export interface PluginObj<T extends PluginOptions, U extends object = object, S = PluginPass<T> & U> {
  name?: string;
  manipulateOptions?(opts: T, parserOpts: any): void;
  pre?(this: S, file: BabelFile): void;
  visitor: Visitor<S>;
  post?(this: S, file: BabelFile): void;
  inherits?: any;
}

/**
 * Expose type of babel-plugin
 */
export type BabelPlugin<T extends PluginOptions = object, U extends object = object> = (
  babel: { types: typeof t; }
) => PluginObj<T, U>

declare module '@babel/traverse' {
  export interface Hub {
    file: {
      metadata: { [key: string]: any }
    }
  }
  // path.scope.getProgramParent().data.imports
  // @ref: https://github.com/babel/babel/blob/1945bafcf3599292f7ebeccd5c7c2635dd1cb0d5/packages/babel-traverse/src/scope/index.ts#L392
  interface Scope {
    data: { [key: string | symbol]: unknown };
  }
}
