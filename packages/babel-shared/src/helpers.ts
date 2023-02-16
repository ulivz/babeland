import * as t from '@babel/types';
import { BabelPlugin, PluginOptions } from './types';

export function declarePlugin<
  T extends PluginOptions = object,
  U extends object = object
>(fn: BabelPlugin<T, U>): typeof fn {
  return fn;
}

export function declarePluginTuple<T extends PluginOptions = object, U extends object = object>(
  plugin: BabelPlugin<T, U>,
  pluginOptions?: T,
): [BabelPlugin<T, U>, T] {
  return [plugin, pluginOptions || {} as T];
}

/**
 * Expose `buildMemberExpressionByIdentifierHierarchy`.
 */
export function buildMemberExpressionByIdentifierHierarchy(
  hierarchy: Array<string | t.Identifier | t.ThisExpression>,
) {
  const normalizedHierarchy = hierarchy.map(
    path => (typeof path === 'string' ? t.identifier(path) : path),
  );

  let currentMemberExpression: t.MemberExpression;

  for (let i = 1; i <= normalizedHierarchy.length - 1; i++) {
    const left = normalizedHierarchy[i - 1];
    const right = normalizedHierarchy[i];
    if (left && right) {
      currentMemberExpression = t.memberExpression(
        i === 1 ? left : currentMemberExpression!,
        right,
      );
    }
  }

  return currentMemberExpression!;
}
