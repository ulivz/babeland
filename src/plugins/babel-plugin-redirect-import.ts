/**
 * Module dependencies
 */
import { types, t } from '../exports';

export type TargetImport = {
  name: string;
  specifierMap?: Record<string, string>;
}

export type TargetSpecifierImport = {
  name: string;
  targetImport?: string;
}

export interface IPluginOptions {
  importMap?: Record<string, string | TargetImport>;
  specifierMap?: Record<string, string | TargetSpecifierImport>;
}

export interface IPluginState {
  normalizedImportMap?: Record<string, TargetImport>;
  normalizedSpecifierMap?: Record<string, TargetSpecifierImport>;
}

export default types.definePlugin<IPluginOptions, IPluginState>(babel => ({
  name: 'babel-plugin-redirect-import',
  /**
     * Normalize options.
     */
  pre() {
    this.normalizedImportMap = {};
    if (typeof this.opts.importMap === 'object') {
      Object.keys(this.opts.importMap).forEach(importKey => {
        const after = this.opts.importMap[importKey];
        this.normalizedImportMap[importKey] = typeof after === 'string'
          ? { name: after }
          : after;
      });
    }

    this.normalizedSpecifierMap = {};
    if (typeof this.opts.specifierMap === 'object') {
      Object.keys(this.opts.specifierMap).forEach(specifierName => {
        const after = this.opts.specifierMap[specifierName];
        this.normalizedSpecifierMap[specifierName] = typeof after === 'string'
          ? { name: after }
          : after;
      });
    }
  },
  visitor: {
    /**
       * HANDLE:
       *
       * |
       * | -  import { XXX } from 'before';
       * | +  import { XXX } from 'after';
       * |
       */
    ImportDeclaration(path, state) {
      const sourceImportValue = path.node.source.value;
      const targetImport = state.normalizedImportMap[sourceImportValue];
      if (targetImport) {
        /**
           * HANDLE:
           *
           * |
           * | -  import { foo } from 'before';
           * | +  import { bar } from 'before';
           * |
           * | -  import { foo: Foo } from 'before';
           * | +  import { bar } from 'before';
           */
        if (typeof targetImport.specifierMap === 'object') {
          Object.keys(targetImport.specifierMap).forEach(specifierName => {
            const matchedSpecifier: t.ImportSpecifier = findImportSpecifier(path.node.specifiers, specifierName);

            if (matchedSpecifier) {
              const targetSpecifierName = targetImport.specifierMap[specifierName];
              matchedSpecifier.imported = t.identifier(targetSpecifierName);
              matchedSpecifier.local = t.identifier(targetSpecifierName);
            }
          });
        }

        path.node.source.value = targetImport.name;
      } else {
        Object.keys(state.normalizedSpecifierMap).forEach(specifierName => {
          const matchedSpecifier: t.ImportSpecifier = findImportSpecifier(path.node.specifiers, specifierName);
          if (matchedSpecifier) {
            const targetSpecifierImport = state.normalizedSpecifierMap[specifierName];
            if (targetSpecifierImport) {
              matchedSpecifier.imported = t.identifier(targetSpecifierImport.name);
              matchedSpecifier.local = t.identifier(targetSpecifierImport.name);
              if (targetSpecifierImport.targetImport) {
                path.node.source.value = targetSpecifierImport.targetImport;
              }
            }
          }
        });
      }
    },
  },
}));

export function findImportSpecifier(
  specifiers: Array<t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier>,
  specifierName: string,
): t.ImportSpecifier {
  return specifiers.find((s): s is t.ImportSpecifier => t.isImportSpecifier(s)
      && t.isIdentifier(s.imported)
      && s.imported.name === specifierName);
}
