## Namespaces

### When Would You Use Namespaces Over Modules?

- Legacy Codebases: If you’re working with an older TypeScript or JavaScript project that heavily uses namespaces, it might be easier to continue with namespaces for consistency and to avoid refactoring the whole codebase at once.

- Single File Applications: If you’re writing a small script or a small application that doesn’t require complex file structures, namespaces might still be a quick way to organize your code without worrying about imports and exports.

- Global Libraries or Shims: In some cases, you might want to use namespaces to define global variables or polyfills for environments where modules are not supported, such as in some older browsers or non-module environments.

- Avoiding Circular Dependencies: In complex module-based systems, circular dependencies can occasionally arise. While modules can manage circular dependencies more cleanly, some developers might use namespaces to side-step this problem in smaller codebases.

### Key Drawbacks of Using Namespaces:

- Global Namespace Pollution: Because namespaces add everything into the global namespace, they can cause naming conflicts with other parts of your program, which could lead to hard-to-debug issues.

- No Modularization: Unlike modules, namespaces don't allow easy importing and exporting from separate files, so you can end up with huge files that are hard to manage as your code grows.

- Compatibility Issues: Modern JavaScript tooling (like bundlers and ES modules) expects module-based code, so namespaces can be incompatible with current toolchains.

- Limited to TypeScript: Namespaces are a TypeScript-specific feature and not part of modern JavaScript. If you want your code to be portable and easily converted to standard JavaScript, modules are the better choice.
