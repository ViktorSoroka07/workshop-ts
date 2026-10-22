## Modules

ES modules in TypeScript. Covers `import`/`export` syntax, default and named exports, re-exports and barrel files, path aliases with `paths` in tsconfig, and module resolution strategies.

### Lesson files

1. **Named Exports and Imports** (`01-namedExports/`) — inline vs list exports, rename on export/import, namespace imports
   - `api.ts` — the module that exports
   - `usage.ts` — demonstrates importing from `api.ts`
2. **Default Exports vs Named Exports** (`02-defaultExport/`) — syntax, trade-offs, why named exports are preferred
   - `logger.ts` — default export of a class + named exports
   - `usage.ts` — imports with different names, shows the naming problem
3. **Re-exports and Barrel Files** (`03-reExportsAndBarrelFiles/`) — `export *`, barrel pattern, circular dependency gotchas
   - `services/` — auth, user, notification services with an `index.ts` barrel
   - `usage.ts` — imports everything through the barrel
4. **Type-Only Imports and Exports** (`04-typeOnlyImports/`) — `import type`, inline type imports, `verbatimModuleSyntax`
   - `types.ts` — type definitions + a runtime value
   - `usage.ts` — demonstrates `import type` vs regular import, `@ts-expect-error` on value usage
5. **Dynamic Imports** (`05-dynamicImports/`) — `import()` for code splitting, conditional loading, feature flags
   - `heavy.ts` — module loaded on demand
   - `usage.ts` — dynamic import with conditions and feature flags
6. **Path Aliases** (`06-pathAliases/`) — tsconfig `paths`, `@app/*` convention, bundler/runtime sync
7. **Module Resolution Strategies** (`07-moduleResolution/`) — Node10 vs Node16 vs Bundler, `package.json` exports
   - `User/` — barrel file re-exports, dynamic imports, `import type`

### Supporting files

- `types.ts` — shared type definitions imported via `@app/types` alias
- `utils/` — barrel file, path alias usage
