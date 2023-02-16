import { codeFrameColumns, SourceLocation, BabelCodeFrameOptions } from '@babel/code-frame';
import { Visitor } from '@babel/traverse';

export function defineVisitor<T extends object = object>(visitor: Visitor<T>): Visitor<T> {
  return visitor;
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
