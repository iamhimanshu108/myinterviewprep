import React, { useState, useEffect } from 'react';

export const ReactCohortNotesViewer: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('s01');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <div className="logo">React<span className="accent-dot">.</span>101</div>
        </div>

        <div className="ref-nav-group-label">Foundations</div>
        <button onClick={() => scrollToSection('s01')} className={`ref-nav-link ${activeSectionId === 's01' ? 'active' : ''}`}><span className="ref-nav-num">1</span> What is React?</button>
        <button onClick={() => scrollToSection('s02')} className={`ref-nav-link ${activeSectionId === 's02' ? 'active' : ''}`}><span className="ref-nav-num">2</span> Components & Props</button>

        <div className="ref-nav-group-label">Reactivity</div>
        <button onClick={() => scrollToSection('s03')} className={`ref-nav-link ${activeSectionId === 's03' ? 'active' : ''}`}><span className="ref-nav-num">3</span> State & Hooks</button>
        <button onClick={() => scrollToSection('s04')} className={`ref-nav-link ${activeSectionId === 's04' ? 'active' : ''}`}><span className="ref-nav-num">4</span> Virtual DOM</button>
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Cohort · Frontend · Session notes</div>
          <h1>Building <em>User Interfaces</em></h1>
          <p className="ref-hero-desc">React changed the way we build web applications by introducing a component-based architecture and a declarative approach to the DOM.</p>
          <div className="ref-hero-tags">
            <span className="ref-hero-tag">React</span>
            <span className="ref-hero-tag">Components</span>
            <span className="ref-hero-tag">Virtual DOM</span>
            <span className="ref-hero-tag">Hooks</span>
            <span className="ref-hero-tag">JSX</span>
          </div>
        </header>

        {/* ══ 01 ══ */}
        <section className="ref-section-block animate-fade-up" id="s01">
          <div className="ref-section-header">
            <div className="ref-section-num-big">01</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">What is React?</div>
              <div className="ref-section-subtitle">The declarative UI library</div>
            </div>
          </div>

          <p>React is a JavaScript library for building user interfaces. Instead of manually manipulating DOM elements with JavaScript (like `document.getElementById('btn').addEventListener(...)`), you declare what the UI should look like for a given state.</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text">UI is a function of state. You update the state (data), and React automatically updates the DOM to reflect those changes efficiently.</p>
          </div>
        </section>

        {/* ══ 02 ══ */}
        <section className="ref-section-block animate-fade-up" id="s02">
          <div className="ref-section-header">
            <div className="ref-section-num-big">02</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Components and Props</div>
              <div className="ref-section-subtitle">Building blocks of UI</div>
            </div>
          </div>

          <p>Components let you split the UI into independent, reusable pieces. Props (short for properties) are how components pass data to each other, strictly downwards from parent to child.</p>

          <div className="ref-quiz-box" id="quiz-01">
            <p className="ref-quiz-question">Can a child component modify the props it receives from its parent?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-01', 0, 'A — Yes, props are mutable in React', false)}
              {renderQuizOption('quiz-01', 1, 'B — No, props are read-only (immutable)', true)}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
