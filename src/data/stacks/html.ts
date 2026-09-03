import { Question } from '../../types';

export const HTML_QUESTIONS: Question[] = [
  {
    id: 'html-1',
    stack: 'html',
    topic: 'Semantic HTML & SEO',
    title: 'Why is Semantic HTML critical, and how does it improve Accessibility (a11y) and SEO?',
    difficulty: 'Beginner',
    summary: 'Semantic HTML uses tags that clearly describe their meaning to both browser and developer (<header>, <nav>, <article>, <main>, <footer>) instead of non-semantic <div> and <span>.',
    explanation: [
      'Semantic tags communicate document hierarchy: Screen readers use landmarks (<main>, <nav>, <aside>) to allow visually impaired users to jump directly to primary sections without tabbing through repetitive links.',
      'SEO and Crawler indexing: Search engine bots parse semantic tags to understand the structure and topical importance of content, giving higher priority to <article> and <h1>-<h6> than generic containers.',
      'Built-in keyboard and device behaviors: Native elements like <button> come pre-configured with Space/Enter key listeners, focus rings, and aria-roles, which custom <div> implementations usually lack.'
    ],
    codeExample: {
      language: 'html',
      filename: 'semantic-layout.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Developer Blog</title>
</head>
<body>
  <!-- Header landmark for branding & navigation -->
  <header>
    <h1>Modern Web Dev</h1>
    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/tutorials">Tutorials</a></li>
      </ul>
    </nav>
  </header>

  <!-- Main content landmark for accessibility tools -->
  <main id="content">
    <article>
      <h2>Understanding Semantic HTML</h2>
      <p>Semantic markup provides immediate context...</p>
    </article>
  </main>

  <!-- Footer landmark -->
  <footer>
    <p>&copy; 2026 Developer Blog. All rights reserved.</p>
  </footer>
</body>
</html>`,
      output: `Renders structured document with accessible landmarks for assistive tech.`,
      executionSteps: [
        { line: 9, explanation: '<header> tag defines site branding and landmark region' },
        { line: 11, explanation: '<nav> with aria-label gives screen readers instant landmark navigation' },
        { line: 20, explanation: '<main> represents primary unique document content' },
        { line: 21, explanation: '<article> encapsulates self-contained, distributable composition' }
      ]
    },
    keyPoints: [
      'Landmark elements (<header>, <nav>, <main>, <aside>, <footer>) eliminate div-soup and improve screen reader navigation.',
      '<button> vs <div onClick>: Always use <button> because it supports focusability and Enter/Space triggers natively.',
      'Headings must follow a logical hierarchy: Never skip levels (e.g. <h1> straight to <h4>).'
    ],
    interviewTip: 'When asked about semantic elements, mention that using correct semantic tags provides out-of-the-box keyboard accessibility and WAI-ARIA role mappings without manual ARIA annotations.',
    tags: ['Semantic', 'Accessibility', 'SEO', 'DOM', 'HTML5']
  },
  {
    id: 'html-2',
    stack: 'html',
    topic: 'Script Loading',
    title: 'What is the exact difference between regular <script>, async, and defer?',
    difficulty: 'Intermediate',
    summary: 'Standard scripts block HTML parsing during download and execution. async executes immediately upon download, while defer downloads in parallel and executes in order after DOM parsing finishes.',
    explanation: [
      'Normal <script>: The HTML parser halts completely when encountering the script tag. It fetches the script from the network and executes it synchronously before resuming parsing. This causes screen freezing / parser blocking.',
      '<script async>: The browser downloads the script in the background while continuing to parse HTML. However, the moment the file arrives, parsing pauses while the script executes. Execution order is non-deterministic.',
      '<script defer>: The browser downloads the script in the background without pausing HTML parsing. The script waits until the entire DOM is built (DOMContentLoaded) and executes in the exact order declared in the HTML document.'
    ],
    codeExample: {
      language: 'html',
      filename: 'script-loading.html',
      code: `<!-- 1. Parser Blocking: Pauses DOM parsing until fetched and run -->
<script src="heavy-analytics.js"></script>

<!-- 2. Async: Downloads asynchronously, executes immediately when ready (Order NOT guaranteed) -->
<!-- Best for independent scripts like Ads or Tracking pixels -->
<script async src="https://tracker.example.com/log.js"></script>

<!-- 3. Defer: Downloads asynchronously, executes in order after DOM parsing completes -->
<!-- Best for application bundles and scripts that manipulate DOM -->
<script defer src="app-core.js"></script>
<script defer src="app-features.js"></script>`,
      output: `app-core.js runs FIRST after DOM is built, then app-features.js. tracker runs whenever it finishes downloading.`,
      executionSteps: [
        { line: 2, explanation: 'Regular script stops HTML parser until fetched and executed' },
        { line: 6, explanation: 'async downloads in background, interrupts parser as soon as loaded' },
        { line: 10, explanation: 'defer downloads concurrently, runs only after HTML parsing completes' },
        { line: 11, explanation: 'defer guarantees preserved script execution order' }
      ]
    },
    keyPoints: [
      'defer is almost always preferred for application logic that touches the DOM.',
      'async is ideal for standalone third-party scripts that do not depend on other scripts or the DOM.',
      'Scripts inside <script type="module"> are deferred by default.'
    ],
    interviewTip: 'Emphasize that defer maintains document execution order, whereas async scripts run on a "first come, first served" basis, which can easily break dependency chains if script B depends on script A.',
    tags: ['Scripts', 'async', 'defer', 'Performance', 'DOM Parsing']
  },
  {
    id: 'html-3',
    stack: 'html',
    topic: 'Browser Storage Mechanisms',
    title: 'Compare localStorage, sessionStorage, and Cookies in terms of capacity, lifecycle, and network transmission.',
    difficulty: 'Intermediate',
    summary: 'Cookies store 4KB and travel with every HTTP request. localStorage persists up to 5-10MB across browser restarts. sessionStorage persists only for the active tab session.',
    explanation: [
      'Cookies (4KB): Designed for server-client state management. Every HTTP request sends relevant cookies in the request header, increasing request payload overhead. Can be secured with HttpOnly and SameSite flags.',
      'localStorage (~5MB): Client-only key-value storage that persists indefinitely until cleared explicitly by script or user cache clearing. Never sent to the server automatically.',
      'sessionStorage (~5MB): Scoped strictly to the specific browser tab. Opening a link in a new tab creates a brand new session. Survives page reloads within the same tab, but destroyed when the tab closes.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'storage-comparison.js',
      code: `// 1. Local Storage: Persists across browser reboots
localStorage.setItem('userTheme', 'dark');
console.log('Saved theme:', localStorage.getItem('userTheme'));

// 2. Session Storage: Cleared when tab/window closes
sessionStorage.setItem('currentStep', 'step-3-payment');
console.log('Wizard step:', sessionStorage.getItem('currentStep'));

// 3. Document Cookie: Small payload sent with every HTTP request
document.cookie = "sessionId=xyz987; Secure; SameSite=Strict; max-age=3600";
console.log('Cookies:', document.cookie);`,
      output: `Saved theme: dark
Wizard step: step-3-payment
Cookies: sessionId=xyz987`,
      executionSteps: [
        { line: 2, explanation: 'localStorage saves persistent key-value string to browser storage' },
        { line: 6, explanation: 'sessionStorage saves ephemeral data bound to the specific browser tab' },
        { line: 10, explanation: 'Sets cookie with Secure and SameSite security attributes' }
      ]
    },
    keyPoints: [
      'Cookies: 4KB max, sent over HTTP headers, vulnerable to CSRF if not protected with SameSite=Strict/Lax.',
      'localStorage / sessionStorage: Synchronous blocking APIs; accessing huge datasets can cause main thread lag.',
      'Sensitive auth tokens: Never store sensitive JWTs or session secrets in localStorage due to XSS vulnerability. Prefer HttpOnly cookies.'
    ],
    interviewTip: 'Mention XSS security implications: any JavaScript running on the page (including third-party npm packages or CDNs) can read localStorage. HttpOnly cookies cannot be read by JavaScript, mitigating token theft.',
    tags: ['Storage', 'Cookies', 'localStorage', 'sessionStorage', 'Security']
  }
];
