export interface StandaloneFile {
  filename: string;
  language: string;
  description: string;
  content: string;
}

export const STANDALONE_HTML: StandaloneFile = {
  filename: 'index.html',
  language: 'html',
  description: 'Pure semantic HTML5 document linking external style.css and script.js files.',
  content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Full Stack Tech Interview Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Clean Separated CSS Stylesheet -->
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- Top Navigation & Header -->
  <header class="header-container">
    <div class="header-top">
      <div class="brand-badge">
        <div class="brand-icon">⚡</div>
        <div>
          <div class="brand-title">Full Stack Interview Hub</div>
          <div class="brand-tagline">React • Java • JavaScript • Node.js • Express.js</div>
        </div>
      </div>

      <div class="search-box">
        <span class="search-icon-symbol">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="Search questions, hooks, collections..." />
      </div>
    </div>

    <!-- Tech Stack Filter Bar -->
    <nav class="nav-filters">
      <button class="filter-btn active" data-stack="all">🌐 All Questions</button>
      <button class="filter-btn" data-stack="react">⚛️ React.js</button>
      <button class="filter-btn" data-stack="java">☕ Java</button>
      <button class="filter-btn" data-stack="javascript">🟨 JavaScript</button>
      <button class="filter-btn" data-stack="node">🟢 Node.js</button>
      <button class="filter-btn" data-stack="express">🚂 Express.js</button>
    </nav>
  </header>

  <main class="main-wrapper">
    <!-- Progress Indicator Card -->
    <section class="progress-card">
      <div class="progress-header">
        <span>Mastery Progress</span>
        <span id="progressPercent">0%</span>
      </div>
      <div class="progress-bar-bg">
        <div id="progressFill" class="progress-bar-fill"></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.82rem; color:var(--text-dim);">
        <span id="progressCount">0 Questions Mastered</span>
        <span>Click the circle icon to track completed questions in localStorage</span>
      </div>

      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">React</span><span class="stat-val" id="stat-react">0/6</span></div>
        <div class="stat-item"><span class="stat-label">Java</span><span class="stat-val" id="stat-java">0/6</span></div>
        <div class="stat-item"><span class="stat-label">JavaScript</span><span class="stat-val" id="stat-javascript">0/7</span></div>
        <div class="stat-item"><span class="stat-label">Node.js</span><span class="stat-val" id="stat-node">0/4</span></div>
        <div class="stat-item"><span class="stat-label">Express.js</span><span class="stat-val" id="stat-express">0/5</span></div>
      </div>
    </section>

    <!-- Questions grouped by Tech Stack -->
    <!-- (Each question card has data-id, data-stack, collapsible header, code block, and copy button) -->
  </main>

  <!-- Clean Separated JavaScript Controller -->
  <script src="script.js"></script>
</body>
</html>`
};

export const STANDALONE_CSS: StandaloneFile = {
  filename: 'style.css',
  language: 'css',
  description: 'Pure modern CSS3 stylesheet with CSS custom properties, responsive grid, card accordions, and syntax styles.',
  content: `:root {
  --bg-primary: #0a0d14;
  --bg-secondary: #121722;
  --bg-card: #181f2e;
  --bg-card-hover: #1e273a;
  --bg-code: #0b0f19;
  --border-subtle: #232d42;
  --border-active: #3b4763;
  
  --text-main: #f0f4fc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  
  --accent-react: #61dafb;
  --accent-java: #f87171;
  --accent-js: #facc15;
  --accent-node: #4ade80;
  --accent-express: #a78bfa;
  --success: #10b981;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
}

.header-container {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  padding: 16px 24px;
}

.q-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  margin-bottom: 14px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.q-card.is-completed { border-left: 4px solid var(--success); }
.q-card.is-hidden { display: none !important; }

.q-header {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.q-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
  background: var(--bg-secondary);
}

.q-card.is-open .q-body {
  max-height: 3000px;
  border-top: 1px solid var(--border-subtle);
}

.code-container {
  background: var(--bg-code);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  margin: 16px 0;
}

pre {
  padding: 14px 16px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.84rem;
  color: #e2e8f0;
}`
};

export const STANDALONE_JS: StandaloneFile = {
  filename: 'script.js',
  language: 'javascript',
  description: 'Pure modular vanilla JavaScript with event delegation, localStorage state, search filter, and accordion animations.',
  content: `(function () {
  'use strict';

  const STORAGE_KEY = 'interview_prep_completed_v1';
  let currentStack = 'all';
  let searchQuery = '';
  let completedSet = new Set(loadCompleted());

  document.addEventListener('DOMContentLoaded', () => {
    initCards();
    initFilters();
    initSearch();
    updateProgressDisplay();
  });

  function loadCompleted() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedSet)));
    } catch (e) {}
  }

  function initCards() {
    const cards = document.querySelectorAll('.q-card');

    cards.forEach((card) => {
      const id = card.dataset.id;
      const header = card.querySelector('.q-header');
      const checkBtn = card.querySelector('.checkbox-btn');
      const copyBtn = card.querySelector('.copy-btn');

      if (completedSet.has(id)) {
        card.classList.add('is-completed');
        if (checkBtn) checkBtn.classList.add('checked');
      }

      if (header) {
        header.addEventListener('click', (e) => {
          if (e.target.closest('.checkbox-btn')) return;
          card.classList.toggle('is-open');
        });
      }

      if (checkBtn) {
        checkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isNowChecked = !checkBtn.classList.contains('checked');
          if (isNowChecked) {
            checkBtn.classList.add('checked');
            card.classList.add('is-completed');
            completedSet.add(id);
          } else {
            checkBtn.classList.remove('checked');
            card.classList.remove('is-completed');
            completedSet.delete(id);
          }
          saveCompleted();
          updateProgressDisplay();
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const codeEl = card.querySelector('pre code');
          if (!codeEl) return;
          navigator.clipboard.writeText(codeEl.innerText).then(() => {
            copyBtn.innerText = 'Copied!';
            setTimeout(() => { copyBtn.innerText = 'Copy'; }, 1800);
          });
        });
      }
    });
  }

  function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentStack = btn.dataset.stack || 'all';
        applyVisibility();
      });
    });
  }

  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyVisibility();
    });
  }

  function applyVisibility() {
    const cards = document.querySelectorAll('.q-card');
    cards.forEach((card) => {
      const stack = card.dataset.stack;
      const text = card.innerText.toLowerCase();
      const matchesStack = currentStack === 'all' || stack === currentStack;
      const matchesSearch = !searchQuery || text.includes(searchQuery);

      if (matchesStack && matchesSearch) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });
  }

  function updateProgressDisplay() {
    const totalCards = document.querySelectorAll('.q-card').length;
    const completedCount = completedSet.size;
    const percent = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;

    const fillBar = document.getElementById('progressFill');
    const percentText = document.getElementById('progressPercent');
    const countText = document.getElementById('progressCount');

    if (fillBar) fillBar.style.width = percent + '%';
    if (percentText) percentText.innerText = percent + '%';
    if (countText) countText.innerText = \`\${completedCount} of \${totalCards} Questions Mastered\`;
  }
})();`
};
