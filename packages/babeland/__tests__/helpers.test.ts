/**
 * Module dependencies
 */
import { t, getHighlightCodeString, HighlightCodeError, buildMemberExpressionByIdentifierHierarchy } from '../src';
import { TestUtils } from './test-utils';

const args = [
  `
const foo = 'bar';
`,
  {
    start: {
      line: 2,
      column: 5,
    },
    end: {
      line: 2,
      column: 7,
    },
  },
  'error',
] as const;

it('getHighlightCodeString', () => {
  expect(
    TestUtils.stripAnsi(
      getHighlightCodeString(...args),
    ),
  ).toMatchSnapshot();
});

it('HighlightCodeError', () => {
  const error = new HighlightCodeError(...args);
  expect(
    TestUtils.stripAnsi(error.message),
  ).toMatchSnapshot();
});

describe('buildMemberExpressionByIdentifierHierarchy', () => {
  it('string - a.b', () => {
    expect(
      TestUtils.renderBabelNode(buildMemberExpressionByIdentifierHierarchy(['a', 'b'])),
    ).toBe('a.b;');
  });

  it('string - a.b.c', () => {
    expect(
      TestUtils.renderBabelNode(buildMemberExpressionByIdentifierHierarchy(['a', 'b', 'c'])),
    ).toBe('a.b.c;');
  });

  it('identifier - a.b', () => {
    expect(
      TestUtils.renderBabelNode(buildMemberExpressionByIdentifierHierarchy([
        t.identifier('a'),
        t.identifier('b'),
      ])),
    ).toBe('a.b;');
  });

  it('identifier - a.b', () => {
    expect(
      TestUtils.renderBabelNode(buildMemberExpressionByIdentifierHierarchy([
        t.identifier('a'),
        t.identifier('b'),
        t.identifier('c'),
      ])),
    ).toBe('a.b.c;');
  });
});
