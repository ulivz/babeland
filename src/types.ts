/**
 * Module dependencies
 */
import * as t from '@babel/types';
import { Visitor } from '@babel/traverse';
import { BabelFile, PluginOptions } from '@babel/core';

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
