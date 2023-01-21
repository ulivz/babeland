/**
 * Module dependencies
 */
import { t, helpers } from '../src';
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
      helpers.getHighlightCodeString(...args),
    ),
  ).toMatchSnapshot();
});

it('HighlightCodeError', () => {
  const error = new helpers.HighlightCodeError(...args);
  expect(
    TestUtils.stripAnsi(error.message),
  ).toMatchSnapshot();
});

describe('buildMemberExpressionByIdentifierHierarchy', () => {
  it('string - a.b', () => {
    expect(
      TestUtils.renderBabelNode(helpers.buildMemberExpressionByIdentifierHierarchy(['a', 'b'])),
    ).toBe('a.b;');
  });

  it('string - a.b.c', () => {
    expect(
      TestUtils.renderBabelNode(helpers.buildMemberExpressionByIdentifierHierarchy(['a', 'b', 'c'])),
    ).toBe('a.b.c;');
  });

  it('identifier - a.b', () => {
    expect(
      TestUtils.renderBabelNode(helpers.buildMemberExpressionByIdentifierHierarchy([
        t.identifier('a'),
        t.identifier('b'),
      ])),
    ).toBe('a.b;');
  });

  it('identifier - a.b', () => {
    expect(
      TestUtils.renderBabelNode(helpers.buildMemberExpressionByIdentifierHierarchy([
        t.identifier('a'),
        t.identifier('b'),
        t.identifier('c'),
      ])),
    ).toBe('a.b.c;');
  });
});
