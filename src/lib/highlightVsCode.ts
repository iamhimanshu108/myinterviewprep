import Prism from './prismConfig';

export interface HighlightedLine {
  lineNumber: number;
  html: string;
  rawText: string;
}

const CONTROL_FLOW_KEYWORDS = new Set([
  'return',
  'try',
  'catch',
  'finally',
  'throw',
  'await',
  'async',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'yield',
  'import',
  'from',
  'export',
  'default'
]);

// Map framework or language alias to Prism grammar key
export function normalizeLanguage(lang: string): string {
  const l = (lang || 'typescript').toLowerCase().trim();
  if (l === 'ts' || l === 'typescript' || l === 'express') return 'typescript';
  if (l === 'js' || l === 'javascript' || l === 'node') return 'javascript';
  if (l === 'java' || l === 'springboot' || l === 'spring') return 'java';
  if (l === 'py' || l === 'python' || l === 'fastapi') return 'python';
  if (l === 'sql' || l === 'postgres' || l === 'mysql') return 'sql';
  if (l === 'json') return 'json';
  if (l === 'bash' || l === 'sh' || l === 'shell') return 'bash';
  if (l === 'html' || l === 'xml') return 'markup';
  if (l === 'css') return 'css';
  if (l === 'react' || l === 'tsx') return 'tsx';
  if (l === 'jsx') return 'jsx';
  return 'typescript';
}

export function highlightToVsCodeLines(code: string, rawLang: string): HighlightedLine[] {
  if (!code) return [];

  const lang = normalizeLanguage(rawLang);
  const grammar = Prism.languages[lang] || Prism.languages.typescript || Prism.languages.javascript;

  let rawHtml = '';
  try {
    rawHtml = Prism.highlight(code, grammar, lang);
  } catch {
    // Fallback if Prism encounters an unhandled language token
    rawHtml = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 1. Differentiate control-flow keywords (purple in VS Code)
  rawHtml = rawHtml.replace(/<span class="token keyword">([^<]+)<\/span>/g, (match, word) => {
    const trimmed = word.trim();
    if (CONTROL_FLOW_KEYWORDS.has(trimmed)) {
      return `<span class="token keyword token-control">${word}</span>`;
    }
    return match;
  });

  // 2. Object keys before colons (light blue in VS Code)
  rawHtml = rawHtml.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=<span class="token operator">[:=]<\/span>)/g, (match, key) => {
    return `<span class="token property">${key}</span>`;
  });

  // 3. Balance HTML tags across line boundaries
  const rawLines = rawHtml.split('\n');
  const codeLines = code.split('\n');
  const result: HighlightedLine[] = [];
  const openStack: string[] = [];

  // Track rainbow brackets depth across lines
  let bracketDepth = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    let currentLine = '';

    // Reopen any tags that remained unclosed from the previous line
    for (const tag of openStack) {
      currentLine += tag;
    }

    // Process characters or spans in the current line
    const tagRegex = /<(\/?)span([^>]*)>/g;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(line)) !== null) {
      const isClosing = match[1] === '/';
      if (isClosing) {
        openStack.pop();
      } else {
        openStack.push(match[0]);
      }
    }

    currentLine += line;

    // Close any unclosed tags at the end of this line
    for (let j = openStack.length - 1; j >= 0; j--) {
      currentLine += '</span>';
    }

    // 4. Colorize bracket pairs for rainbow brackets effect
    currentLine = currentLine.replace(/(<span class="token punctuation">)?([{}()[\]])(<\/span>)?/g, (_full, openSpan, bracket, closeSpan) => {
      const isClosingBracket = bracket === '}' || bracket === ')' || bracket === ']';
      let depth = bracketDepth;
      if (isClosingBracket && bracketDepth > 0) {
        bracketDepth--;
        depth = bracketDepth;
      } else if (!isClosingBracket) {
        bracketDepth++;
      }
      const colorClass = `vscode-bracket-${depth % 3}`;
      const prefix = openSpan || '';
      const suffix = closeSpan || '';
      return `${prefix}<span class="${colorClass}">${bracket}</span>${suffix}`;
    });

    result.push({
      lineNumber: i + 1,
      html: currentLine,
      rawText: codeLines[i] !== undefined ? codeLines[i] : ''
    });
  }

  return result;
}
