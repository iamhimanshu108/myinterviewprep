/**
 * Full Stack Tech Interview Hub - Pure Vanilla JavaScript Controller
 * Separated Script File: Manages Accordions, Filtering, Search, & Local Persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'interview_prep_completed_v1';

  // State
  let currentStack = 'all';
  let searchQuery = '';
  let completedSet = new Set(loadCompleted());

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initCards();
    initFilters();
    initSearch();
    updateProgressDisplay();
  });

  // Local Storage Helpers
  function loadCompleted() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Could not read from localStorage', e);
      return [];
    }
  }

  function saveCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedSet)));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }

  // Card interactions
  function initCards() {
    const cards = document.querySelectorAll('.q-card');

    cards.forEach((card) => {
      const id = card.dataset.id;
      const header = card.querySelector('.q-header');
      const checkBtn = card.querySelector('.checkbox-btn');
      const copyBtn = card.querySelector('.copy-btn');

      // Restore checked state
      if (completedSet.has(id)) {
        card.classList.add('is-completed');
        if (checkBtn) checkBtn.classList.add('checked');
      }

      // Accordion click
      if (header) {
        header.addEventListener('click', (e) => {
          // If clicking checkbox, do not toggle accordion
          if (e.target.closest('.checkbox-btn')) return;
          card.classList.toggle('is-open');
        });
      }

      // Checkbox click
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

      // Copy code snippet
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const codeEl = card.querySelector('pre code');
          if (!codeEl) return;
          
          navigator.clipboard.writeText(codeEl.innerText).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            copyBtn.style.color = '#38bdf8';
            setTimeout(() => {
              copyBtn.innerText = originalText;
              copyBtn.style.color = '';
            }, 1800);
          });
        });
      }
    });
  }

  // Filter Buttons
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

  // Search Input
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyVisibility();
    });
  }

  // Filter & Search Engine
  function applyVisibility() {
    const cards = document.querySelectorAll('.q-card');
    const sections = document.querySelectorAll('.section-group');

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

    // Toggle section title visibility if all child cards are hidden
    sections.forEach((sec) => {
      const visibleChildren = sec.querySelectorAll('.q-card:not(.is-hidden)');
      sec.style.display = visibleChildren.length > 0 ? '' : 'none';
    });
  }

  // Progress Bar & Counts
  function updateProgressDisplay() {
    const totalCards = document.querySelectorAll('.q-card').length;
    const completedCount = completedSet.size;
    const percent = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;

    const fillBar = document.getElementById('progressFill');
    const percentText = document.getElementById('progressPercent');
    const countText = document.getElementById('progressCount');

    if (fillBar) fillBar.style.width = percent + '%';
    if (percentText) percentText.innerText = percent + '%';
    if (countText) countText.innerText = `${completedCount} of ${totalCards} Questions Mastered`;

    // Update stack counts
    ['react', 'java', 'javascript', 'node', 'express'].forEach((st) => {
      const stackCards = document.querySelectorAll(`.q-card[data-stack="${st}"]`);
      let stackDone = 0;
      stackCards.forEach((c) => {
        if (completedSet.has(c.dataset.id)) stackDone++;
      });
      const el = document.getElementById(`stat-${st}`);
      if (el) el.innerText = `${stackDone}/${stackCards.length}`;
    });
  }
})();
