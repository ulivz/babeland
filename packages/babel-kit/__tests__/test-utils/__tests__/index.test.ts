/**
 * Module dependencies
 */
import * as t from '@babel/types';
import { TestUtils } from '../index';

describe('renderBabelNode', () => {
  it('t.identifier', () => {
    expect(
      TestUtils.renderBabelNode(
        t.identifier('foo'),
      ),
    ).toBe('foo;');
  });

  it('t.binaryExpression', () => {
    expect(
      TestUtils.renderBabelNode(
        t.binaryExpression('*', t.identifier('foo'), t.identifier('bar')),
      ),
    ).toBe('foo * bar;');
  });
});
