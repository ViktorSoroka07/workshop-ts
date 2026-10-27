// Checks that the lessons' comments say what TypeScript says:
//   `// type: X`   against the editor hover (the TypeScript language service) of that line
//   `// Error: X`  against the first line of the diagnostic TypeScript reports on that same
//                  line once the `@ts-expect-error` (or `@ts-ignore`) above it is removed
// A trailing ` -- reason` or ` (reason)` after either is ignored, a `// type:` on a line of
// its own describes the line above, and `…` in an `// Error:` stands for an elided part.
// Usage: node scripts/check-comments.mjs [tsconfig.json ...]   (no arguments: every topic)
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, relative, resolve } from 'node:path';
import ts from 'typescript';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

const configs =
  process.argv.length > 2
    ? process.argv.slice(2)
    : execFileSync('git', ['ls-files', '*/tsconfig.json'], {
        cwd: ROOT,
        encoding: 'utf8',
      })
        .split('\n')
        .filter(Boolean);

const COMMENT_TAIL = String.raw`(?: -- .*| \(.*\))?$`;
const TYPE_COMMENT = new RegExp(String.raw`// type: (.*?)` + COMMENT_TAIL);
const ERROR_COMMENT = new RegExp(String.raw`// Error: (.*?)` + COMMENT_TAIL);
const DECLARATION =
  /^\s*(?:export\s+)?(?:declare\s+)?(?:const|let|var|type|interface|class|function)\s+[[{]?\s*([A-Za-z_$][\w$]*)/;
// A line that only closes or continues a statement begun above: `});`, `.build();`
const CONTINUATION = /^\s*(?:[)}\]>]|\.[A-Za-z_$][\w$]*\(.*\))[^\w]*$/;

const DIRECTIVE = /\/\/ @ts-(?:expect-error|ignore)/;

const normalize = (text) => text.replace(/\s+/g, ' ').trim();

function quotes(message, comment) {
  if (normalize(comment).replace(/…/g, '').trim() === '') return false;

  const pattern = normalize(comment)
    .split('…')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');

  return new RegExp(`^${pattern}$`).test(normalize(message));
}

function languageService(options, files, transform) {
  return ts.createLanguageService({
    getScriptFileNames: () => files,
    getScriptVersion: () => '1',
    getScriptSnapshot: (file) => {
      if (!existsSync(file)) return undefined;
      const text = readFileSync(file, 'utf8');

      return ts.ScriptSnapshot.fromString(
        files.includes(file) ? transform(text) : text
      );
    },
    getCurrentDirectory: () => ROOT,
    getCompilationSettings: () => options,
    getDefaultLibFileName: (opts) => ts.getDefaultLibFilePath(opts),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  });
}

// Blanks each directive with spaces so every position stays where it was.
const withoutDirectives = (text) =>
  text.replace(new RegExp(`${DIRECTIVE.source}.*$`, 'gm'), (directive) =>
    ' '.repeat(directive.length)
  );

// The hover shows `type X = ...`, `const x: ...` or `(property) x: ...`; keep the type part.
function hoveredType(display) {
  const alias = display.match(/^type [^=]+= ([\s\S]*)$/);

  if (alias) return alias[1];

  const typed = display.match(/^(?:\(\w+\) )?[^:]*?: ([\s\S]*)$/);

  return typed ? typed[1] : display;
}

function hoverPosition(lines, commentLine, sourceFile) {
  let lineIndex = commentLine;
  let code = lines[lineIndex].slice(0, lines[lineIndex].indexOf('// type:'));

  if (code.trim() === '' && lineIndex > 0) {
    lineIndex--;
    code = lines[lineIndex];
  }

  let declarationLine = lineIndex;

  if (!DECLARATION.test(code) && CONTINUATION.test(code)) {
    while (declarationLine > 0 && !DECLARATION.test(lines[declarationLine]))
      declarationLine--;
  }

  const declared = lines[declarationLine].match(DECLARATION);

  if (declared) {
    const column = lines[declarationLine].indexOf(
      declared[1],
      declared[0].length - declared[1].length
    );

    return sourceFile.getPositionOfLineAndCharacter(declarationLine, column);
  }

  const identifiers = [...code.matchAll(/[A-Za-z_$][\w$]*/g)];

  if (identifiers.length === 0) return undefined;

  return sourceFile.getPositionOfLineAndCharacter(
    lineIndex,
    identifiers.at(-1).index
  );
}

let differences = 0;

for (const config of configs) {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    resolve(ROOT, config),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
        );
      },
    }
  );
  const asWritten = languageService(
    parsed.options,
    parsed.fileNames,
    (text) => text
  );
  const stripped = languageService(
    parsed.options,
    parsed.fileNames,
    withoutDirectives
  );
  let checked = 0;
  let differ = 0;

  const report = (file, lineIndex, comment, actual) => {
    differ++;
    console.log(
      `${relative(ROOT, file)}:${lineIndex + 1}\n  comment: ${comment}\n  actual:  ${actual}`
    );
  };

  for (const file of parsed.fileNames.filter(
    (name) => !name.endsWith('.d.ts')
  )) {
    const lines = readFileSync(file, 'utf8').split('\n');
    const sourceFile = asWritten.getProgram().getSourceFile(file);
    const diagnostics = [
      ...stripped.getSyntacticDiagnostics(file),
      ...stripped.getSemanticDiagnostics(file),
    ];

    lines.forEach((line, lineIndex) => {
      const typeComment = line.match(TYPE_COMMENT);

      if (typeComment) {
        checked++;

        const position = hoverPosition(lines, lineIndex, sourceFile);
        const info =
          position === undefined
            ? undefined
            : asWritten.getQuickInfoAtPosition(file, position);
        const actual = info
          ? hoveredType(ts.displayPartsToString(info.displayParts))
          : '(nothing to hover on this line)';

        if (normalize(actual) !== normalize(typeComment[1]))
          report(file, lineIndex, typeComment[1], normalize(actual));
      }

      const errorComment = line.match(ERROR_COMMENT);

      if (errorComment && !/^\s*\/\//.test(line)) {
        checked++;

        const messages = diagnostics
          .filter(
            (diagnostic) =>
              sourceFile.getLineAndCharacterOfPosition(diagnostic.start)
                .line === lineIndex
          )
          .map(
            (diagnostic) =>
              ts
                .flattenDiagnosticMessageText(diagnostic.messageText, '\n')
                .split('\n')[0]
          );

        if (!messages.some((message) => quotes(message, errorComment[1]))) {
          report(
            file,
            lineIndex,
            errorComment[1],
            messages.join(' || ') || '(no error on this line)'
          );
        }
      }
    });
  }

  differences += differ;
  console.log(`-- ${config}: ${checked} comments checked, ${differ} differ`);
}

process.exitCode = differences > 0 ? 1 : 0;
