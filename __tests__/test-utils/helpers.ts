/**
 * Module dependencies
 */
import * as t from '@babel/types';
import { transformSync, declarePlugin } from '../../src';

/**
 * Render babel node
 */
export function renderBabelNode<T extends t.Node>(
  node: T | T[],
): string {
  const result = transformSync('a;', {
    plugins: [
      declarePlugin(() => ({
        visitor: {
          ExpressionStatement(path) {
            // eslint-disable-next-line no-unused-expressions
            Array.isArray(node)
              ? path.replaceWithMultiple(node)
              : path.replaceWith(node);
            // RangeError: unknown: Maximum call stack size exceeded
            // ref: https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#stopping-traversal
            path.stop();
          },
        },
      })),
    ],
  });

  return result.code;
}

/**
 * Strip ansi
 */
export function stripAnsi(str: string) {
  return require('strip-ansi')(str);
}

/**
 * Snapshot a error
 */
export function snapshotError(error: Error) {
  expect(stripAnsi(error.message)).toMatchSnapshot();
}

/**
 * Try catch error and create snapshot for it
 */
export function tryAndSnapshotError(fn: (...args: any[]) => any) {
  try {
    fn();
  } catch (e) {
    console.log(e.message);
    snapshotError(e);
  }
}
