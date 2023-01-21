/**
 * Module dependencies
 */
import * as t from '@babel/types';
import { ScriptCodemod } from './codemod';

/**
 * Render babel node
 */
export function renderBabelNode<T extends t.Node>(
  node: T | T[],
): string {
  const result = ScriptCodemod.transformSync('a;', [
    ScriptCodemod.definePluginConfig(
      ScriptCodemod.definePlugin(() => ({
        visitor: {
          ExpressionStatement(path) {
            Array.isArray(node)
              ? path.replaceWithMultiple(node)
              : path.replaceWith(node);
            // RangeError: unknown: Maximum call stack size exceeded
            // ref: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#stopping-traversal
            path.stop();
          },
        },
      })),
    ),
  ]);
  return result | undefined | null;
}

/**
 * Strip ansi
 */
export function stripAnsi(str: string) {
  return require('strip-ansi')(str);
}

/**
 * Snaphot a error
 */
export function snapshotError(error: Error) {
  expect(stripAnsi(error.message)).toMatchSnapshot();
}

/**
 * Try catch error and create snapshot for it
 */
export function tryAndSnapsotError(fn: Function) {
  try {
    fn();
  } catch (e) {
    console.log(e.message);
    snapshotError(e);
  }
}
