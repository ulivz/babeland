/**
 * Module dependencies
 */
import * as t from '@babel/types';
import { codeFrameColumns, SourceLocation, BabelCodeFrameOptions } from '@babel/code-frame';
import { Visitor } from '@babel/traverse';
import { BabelPlugin, PluginOptions } from './types';

export function declarePlugin<
  T extends PluginOptions = object,
  U extends object = object
>(fn: BabelPlugin<T, U>): typeof fn {
  return fn;
}

export function defineVisitor<T extends object = object>(visitor: Visitor<T>): Visitor<T> {
  return visitor;
}

export function declarePluginConfig<T extends PluginOptions = object>(
  plugin: BabelPlugin<T>,
  pluginOptions?: T,
): [BabelPlugin<T>, T] {
  return [plugin, pluginOptions || {} as T];
}

/**
 * Expose `getHighlightCodeString`
 */
export function getHighlightCodeString(
  source: string,
  location: SourceLocation,
  message: string,
  options?: BabelCodeFrameOptions,
  correctColumn = true,
): string {
  if (correctColumn && location?.start?.column) {
    location.start.column += 1;
  }

  return codeFrameColumns(
    source,
    location,
    {
      highlightCode: true,
      forceColor: true,
      message,
      linesAbove: 10,
      linesBelow: 2,
      ...(options || {}),
    },
  );
}

/**
 * Expose `HighlightCodeError`
 */
export class HighlightCodeError extends Error {
  constructor(
    source: string,
    location: SourceLocation,
    message: string,
    options?: BabelCodeFrameOptions,
  ) {
    super(message);
    this.message = getHighlightCodeString(
      source,
      location,
      message,
      options,
    );
  }
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
