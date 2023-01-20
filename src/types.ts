/**
 * Module dependencies
 */
import * as BabelTypes from '@babel/types';
import { Visitor } from '@babel/traverse';
import { BabelFile, PluginOptions } from '@babel/core';

export interface PluginPass<T extends PluginOptions> {
  file: BabelFile;
  key: string;
  opts: T;
  cwd: string;
  filename: string;
  [key: string]: unknown;
}

export interface PluginObj<T extends PluginOptions, U extends object = {}, S = PluginPass<T> & U> {
  name?: string;
  manipulateOptions?(opts: any, parserOpts: any): void;
  pre?(this: S, file: BabelFile): void;
  visitor: Visitor<S>;
  post?(this: S, file: BabelFile): void;
  inherits?: any;
}

/**
 * Expose type of babel-plugin
 */
export type BabelPlugin<T extends PluginOptions = {}, U extends object = {}> = (
  babel: { types: typeof BabelTypes; }
) => PluginObj<T, U>

export function definePlugin<
  T extends PluginOptions = {},
  U extends object = {}
>(fn: BabelPlugin<T, U>): typeof fn {
  return fn;
}

export function defineVisitor<T extends object = {}>(visitor: Visitor<T>): Visitor<T> {
  return visitor;
}

export function definePluginConfig<T extends PluginOptions = {}>(
  plugin: BabelPlugin<T>,
  pluginOptions?: T,
): [BabelPlugin<T>, T] {
  return [plugin, pluginOptions || {} as T];
}
