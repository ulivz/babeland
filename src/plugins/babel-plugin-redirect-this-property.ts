/**
 * Module dependencies
 */
import { Node } from '@babel/core';
import { types, helpers, t, NodePath } from '../exports';

export interface IPluginOptions {
  /**
   * A identifier map to decalare the identifiers that should be reidrected
   *
   * e.g.
   *
   *   { foo: 'a.b' }
   *
   * then
   *
   *   this.foo => this.a.b
   */
  identifierMap: Record<string, string[] | string>;
  /**
   * Declare the identifierthat it is forbidden to use on `this`.
   */
  dangerousIdentifiers?: string[];
}

/**
 * Expose `babel-plugin-redirect-this-property`
 */
export default types.definePlugin<IPluginOptions>(babel => ({
  name: 'babel-plugin-redirect-this-property',
  visitor: {
    VariableDeclaration(path, state) {
      path.node.declarations.forEach(declaration => {
        let thisAlias: string;

        /**
           * HANDLE:
           *
           *   const { foo, bar } = this;
           *   foo('xxx');
           *   bar('xxx');
           *
           * AND:
           *
           *   `foo` should be redirected to `this.a.b` (declared in `identifierMap`)
           *   `bar` should remain unchanged
           */
        let shouldHandleDeclaration: boolean = t.isThisExpression(declaration.init);
        /**
           * HANDLE:
           *
           *   const ctx = this;
           *   const { foo, bar } = ctx;
           *   foo('xxx');
           *   bar('xxx');
           *
           * AND:
           *
           *   `foo` should be redirected to `this.a.b` (declared in `identifierMap`)
           *   `bar` should remain unchanged
           */
        if (!shouldHandleDeclaration) {
          if (t.isIdentifier(declaration.init)) {
            shouldHandleDeclaration = isBindingToThis(path, declaration.init.name);
            thisAlias = declaration.init.name;
          }
        }
        /**
           * const xxx = this;
           */
        if (shouldHandleDeclaration) {
          /**
             * const { foo, bar } = xxx;
             */
          if (t.isObjectPattern(declaration.id)) {
            const removedPropertiesIndexs: number[] = [];
            declaration.id.properties.forEach((property, index) => {
              if (t.isObjectProperty(property)) {
                if (t.isIdentifier(property.key) && t.isIdentifier(property.value)) {
                  /**
                     * Handle dangerous identifiers
                     */
                  handleDangerousIdentifiers(
                    state.opts.dangerousIdentifiers,
                    property.key,
                    state.file.code,
                  );
                  /**
                     * Redirect with identifierMap
                     */
                  const identifierHierarchy = state.opts.identifierMap[property.key.name];
                  if (identifierHierarchy) {
                    /**
                       * WARNING LOG when met: `const { dispatchGlobal: d } = this;`
                       */
                    if (property.key.name !== property.value.name) {
                      console.log(helpers.getHighlightCodeString(state.file.code, property.loc, 'found deconstruct'));
                    }
                    /**
                       * Record properties to be removed.
                       */
                    removedPropertiesIndexs.push(index);
                    /**
                       * INSERT: `const dispatchGlobal = this.$global.dispatch`;
                       */
                    path.insertAfter(
                      t.variableDeclaration('const', [
                        t.variableDeclarator(
                          t.identifier(property.value.name),
                          getThisMemberExpressionByIdentifierHierarchy(identifierHierarchy),
                        ),
                      ]),
                    );
                  }
                }
              }
            });
            if (removedPropertiesIndexs.length > 0) {
              for (let i = removedPropertiesIndexs.length - 1; i >= 0; i--) {
                declaration.id.properties.splice(removedPropertiesIndexs[i], 1);
              }
            }
          }
        }
      });
    },
    MemberExpression(path, state) {
      if (!t.isIdentifier(path.node.property)) {
        return;
      }

      let thisAlias: string;

      /**
         * HANDLE:
         *
         *   this.foo('xx')
         *   this.bar('xx')
         *
         * AND:
         *
         *   `this.foo` should be redirected to `this.a.b` (declared in `identifierMap`)
         *   `this.bar` should remain unchanged
         */
      let shouldHandleExpression: boolean = t.isThisExpression(path.node.object); // => this.bar
      /**
         * HANDLE:
         *
         *   const ctx = this;
         *   ctx.foo('xx')
         *   ctx.bar('xx')
         *
         * AND:
         *
         *   `ctx.foo` should be redirected to `this.a.b` (declared in `identifierMap`)
         *   `ctx.bar` should remain unchanged
         */
      if (!shouldHandleExpression) {
        if (t.isIdentifier(path.node.object)) {
          shouldHandleExpression = isBindingToThis(path, path.node.object.name);
          thisAlias = path.node.object.name;
        }
      }

      if (shouldHandleExpression) {
        /**
           * Handle dangerous identifiers
           */
        handleDangerousIdentifiers(
          state.opts.dangerousIdentifiers,
          path.node.property,
          state.file.code,
        );
        /**
           * Redirect with identifierMap
           */
        const identifierHierarchy = state.opts.identifierMap[path.node.property.name];
        if (identifierHierarchy) {
          path.replaceWith(
            getThisMemberExpressionByIdentifierHierarchy(identifierHierarchy, thisAlias),
          );
        }
      }
    },
  },
}));

/**
 * Handle dangerous identifiers
 */
function handleDangerousIdentifiers(
  dangerousIdentifiers: string[],
  identifier: t.Identifier,
  source: string,
) {
  if (dangerousIdentifiers && dangerousIdentifiers.includes(identifier.name)) {
    throw new helpers.HighlightCodeError(source, identifier.loc, 'Incompatible identifier');
  }
}

/**
 * Check if a ptch is binding to this.
 *
 * @param path
 * @param local
 */
function isBindingToThis<T extends Node>(path: NodePath<T>, local: string) {
  const binding = path.scope.getBinding(local);
  return binding
    && t.isVariableDeclarator(binding.path.node)
    && t.isThisExpression(binding.path.node.init);
}

/**
 * Get this member expression by properties
 *
 * [a]: ME(
 *   this, I(a)
 * )
 *
 * [a, b]: ME(
 *   ME(
 *     this,
 *     I(a),
 *   ),
 *   I(b)
 * )
 *
 * [a, b, c]: ME(
 *   ME(
 *     ME(
 *       this,
 *       I(a)
 *     ),
 *     I(b),
 *   ),
 *   I(c)
 * )
 */
function getThisMemberExpressionByIdentifierHierarchy(
  hierarchy: string | string[],
  thisAlias?: string,
) {
  const normalizedHierarchy = typeof hierarchy === 'string'
    ? hierarchy.split('.')
    : hierarchy;

  if (normalizedHierarchy.length < 1) {
    throw new Error(`Invalid identifier hierarchy: ${hierarchy}`);
  }

  const nodes = [
    thisAlias ? t.identifier(thisAlias) : t.thisExpression(),
    ...normalizedHierarchy.map(i => t.identifier(i)),
  ];

  if (nodes.length === 2) {
    return t.memberExpression(
      nodes[0],
      nodes[1],
    );
  }

  return helpers.buildMemberExpressionByIdentifierHierarchy(nodes);
}
