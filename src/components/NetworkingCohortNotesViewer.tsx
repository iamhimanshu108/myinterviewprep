import React, { useState, useEffect } from 'react';

export const NetworkingCohortNotesViewer: React.FC = () => {
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
          <div className="logo">NET<span className="accent-dot">.</span>101</div>
        </div>

        <div className="ref-nav-group-label">Foundations</div>
        <button onClick={() => scrollToSection('s01')} className={`ref-nav-link ${activeSectionId === 's01' ? 'active' : ''}`}><span className="ref-nav-num">1</span> OSI Model</button>
        <button onClick={() => scrollToSection('s02')} className={`ref-nav-link ${activeSectionId === 's02' ? 'active' : ''}`}><span className="ref-nav-num">2</span> TCP vs UDP</button>

        <div className="ref-nav-group-label">Protocols</div>
        <button onClick={() => scrollToSection('s03')} className={`ref-nav-link ${activeSectionId === 's03' ? 'active' : ''}`}><span className="ref-nav-num">3</span> DNS</button>
        <button onClick={() => scrollToSection('s04')} className={`ref-nav-link ${activeSectionId === 's04' ? 'active' : ''}`}><span className="ref-nav-num">4</span> HTTP & WebSockets</button>
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Cohort · Systems · Session notes</div>
          <h1>Connecting <em>the World</em></h1>
          <p className="ref-hero-desc">Understanding how packets travel across the internet is crucial for building scalable, resilient backend systems.</p>
          <div className="ref-hero-tags">
            <span className="ref-hero-tag">Networking</span>
            <span className="ref-hero-tag">TCP/IP</span>
            <span className="ref-hero-tag">DNS</span>
            <span className="ref-hero-tag">OSI Model</span>
            <span className="ref-hero-tag">Sockets</span>
          </div>
        </header>

        {/* ══ 01 ══ */}
        <section className="ref-section-block animate-fade-up" id="s01">
          <div className="ref-section-header">
            <div className="ref-section-num-big">01</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">TCP vs UDP</div>
              <div className="ref-section-subtitle">Transport layer protocols</div>
            </div>
          </div>

          <p>Transmission Control Protocol (TCP) is reliable, connection-oriented, and ensures packet delivery order. User Datagram Protocol (UDP) is fast, connectionless, and does not guarantee delivery.</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text">Use TCP for web browsing, emails, and file transfers where data integrity is paramount. Use UDP for live video streaming or gaming where speed is more important than occasional packet loss.</p>
          </div>
          
          <div className="ref-quiz-box" id="quiz-01">
            <p className="ref-quiz-question">Which protocol requires a 3-way handshake to establish a connection before sending data?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-01', 0, 'A — UDP', false)}
              {renderQuizOption('quiz-01', 1, 'B — TCP', true)}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
