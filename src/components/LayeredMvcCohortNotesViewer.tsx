import React, { useState, useEffect } from 'react';

export const LayeredMvcCohortNotesViewer: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('s01');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Scroll Spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

    const sections = Array.from(document.querySelectorAll('.ref-section-block'));
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setIsSidebarOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyCode = (text: string, key: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1400);
      });
    }
  };

  // Quiz State
  const [quizResults, setQuizResults] = useState<Record<string, { selectedIndex: number; isCorrect: boolean }>>({});

  const handleQuizAnswer = (quizId: string, optionIndex: number, isCorrect: boolean) => {
    if (quizResults[quizId]) return;
    setQuizResults(prev => ({
      ...prev,
      [quizId]: { selectedIndex: optionIndex, isCorrect }
    }));
  };

  const renderQuizOption = (quizId: string, optionIndex: number, text: string, isCorrectOption: boolean) => {
    const result = quizResults[quizId];
    const isSelected = result?.selectedIndex === optionIndex;
    let btnCls = "ref-quiz-option";

    if (result) {
      if (isCorrectOption) btnCls += " correct";
      else if (isSelected) btnCls += " incorrect cursor-not-allowed opacity-60";
      else btnCls += " cursor-not-allowed opacity-60";
    }

    return (
      <button
        className={btnCls}
        disabled={!!result}
        onClick={() => handleQuizAnswer(quizId, optionIndex, isCorrectOption)}
      >
        {text}
      </button>
    );
  };

  return (
    <div className="ref-theme ref-layout-container">
      {/* ── MOBILE SIDEBAR TOGGLE ── */}
      <div className="md:hidden sticky top-0 z-30 p-3 bg-[var(--ink)] flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <span className="font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-ibm)', fontSize: '10px' }}>Curriculum</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="px-3 py-1.5 border rounded text-xs font-semibold"
          style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', backgroundColor: 'transparent' }}
        >
          {isSidebarOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <nav className={`ref-sidebar ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="ref-nav-brand">
          <div className="logo">MVC<span className="accent-dot">.</span>101</div>
        </div>

        <div className="ref-nav-group-label">Foundations</div>
        <button onClick={() => scrollToSection('s01')} className={`ref-nav-link ${activeSectionId === 's01' ? 'active' : ''}`}><span className="ref-nav-num">1</span> The problem</button>
        <button onClick={() => scrollToSection('s02')} className={`ref-nav-link ${activeSectionId === 's02' ? 'active' : ''}`}><span className="ref-nav-num">2</span> Layered MVC</button>

        <div className="ref-nav-group-label">Components</div>
        <button onClick={() => scrollToSection('s03')} className={`ref-nav-link ${activeSectionId === 's03' ? 'active' : ''}`}><span className="ref-nav-num">3</span> Routes</button>
        <button onClick={() => scrollToSection('s04')} className={`ref-nav-link ${activeSectionId === 's04' ? 'active' : ''}`}><span className="ref-nav-num">4</span> Controllers</button>
        <button onClick={() => scrollToSection('s05')} className={`ref-nav-link ${activeSectionId === 's05' ? 'active' : ''}`}><span className="ref-nav-num">5</span> Services & Models</button>
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Cohort · Backend · Session notes</div>
          <h1>Architecting <em>Clean Applications</em></h1>
          <p className="ref-hero-desc">When codebases grow, putting everything in one file creates a tangled mess. Layered MVC solves this by giving every piece of code a clear, predictable home.</p>
          <div className="ref-hero-tags">
            <span className="ref-hero-tag">MVC</span>
            <span className="ref-hero-tag">Design Patterns</span>
            <span className="ref-hero-tag">Clean Architecture</span>
            <span className="ref-hero-tag">Services</span>
            <span className="ref-hero-tag">Controllers</span>
          </div>
        </header>

        {/* ══ 01 ══ */}
        <section className="ref-section-block animate-fade-up" id="s01">
          <div className="ref-section-header">
            <div className="ref-section-num-big">01</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The Problem — Spaghetti Code</div>
              <div className="ref-section-subtitle">Why single-file backends fail</div>
            </div>
          </div>

          <p>Imagine putting your database connection, SQL queries, HTTP request validation, and business logic all inside `app.post('/users', ...)`.</p>

          <p>It works for a simple "Hello World" app. But when you need to send welcome emails, check if the username exists, and log the registration metric, that one file becomes thousands of lines of unreadable code.</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text">Separation of Concerns. Code that handles HTTP should not know how to connect to Postgres. Code that validates a password shouldn't be mixed with code that sends emails.</p>
          </div>
        </section>

        {/* ══ 02 ══ */}
        <section className="ref-section-block animate-fade-up" id="s02">
          <div className="ref-section-header">
            <div className="ref-section-num-big">02</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Layered MVC</div>
              <div className="ref-section-subtitle">The standard for backend structure</div>
            </div>
          </div>

          <p>Layered MVC divides your backend into distinct layers, usually looking like this: <b>Routes &rarr; Controllers &rarr; Services &rarr; Models/Data Access</b>.</p>

          <ul className="ref-list">
            <li><b>Routes:</b> Maps an HTTP method and URL to a specific function (Controller).</li>
            <li><b>Controllers:</b> Parses HTTP requests (req.body, req.params), calls the Service, and sends the HTTP response (res.json).</li>
            <li><b>Services:</b> The "Brain" of your app. Holds the core business logic (e.g., checking if user is allowed, calculating discounts). It doesn't know about HTTP!</li>
            <li><b>Models/Repository:</b> Talks directly to the database. Runs SQL or interacts with an ORM.</li>
          </ul>

          <div className="ref-quiz-box" id="quiz-02">
            <p className="ref-quiz-question">Which layer should contain the code that calculates a user's total shopping cart price after applying a discount code?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-02', 0, 'A — The Controller', false)}
              {renderQuizOption('quiz-02', 1, 'B — The Service Layer', true)}
              {renderQuizOption('quiz-02', 2, 'C — The Route', false)}
              {renderQuizOption('quiz-02', 3, 'D — The Model', false)}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
