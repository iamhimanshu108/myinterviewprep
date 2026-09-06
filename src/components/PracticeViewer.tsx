import React, { useState, useEffect } from 'react';
import { ListTree, ChevronDown, ChevronRight, Eye, EyeOff, Terminal } from 'lucide-react';
import { TechStack } from '../types';
import { PRACTICE_DATA } from '../data/practiceData';

interface PracticeViewerProps {
  selectedStack: TechStack;
}

export const PracticeViewer: React.FC<PracticeViewerProps> = ({ selectedStack }) => {
  const currentData = PRACTICE_DATA[selectedStack] || [];
  
  const [activeSectionId, setActiveSectionId] = useState<string>(currentData[0]?.sections[0]?.id || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());
  const [revealedSolutions, setRevealedSolutions] = useState<Set<string>>(new Set());

  const toggleTopicCollapse = (topicName: string) => {
    setCollapsedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicName)) next.delete(topicName);
      else next.add(topicName);
      return next;
    });
  };

  const handleToggleAllSubmenus = () => {
    if (collapsedTopics.size > 0) {
      setCollapsedTopics(new Set());
    } else {
      setCollapsedTopics(new Set(currentData.map((g) => g.group)));
    }
  };

  // Flatten all sections to easily navigate between them
  const ALL_SECTIONS = currentData.flatMap((group) => 
    group.sections.map(section => ({ ...section, groupTitle: group.group }))
  );

  const activeSectionIndex = ALL_SECTIONS.findIndex(s => s.id === activeSectionId);
  const activeSection = ALL_SECTIONS[activeSectionIndex !== -1 ? activeSectionIndex : 0];

  const handleNext = () => {
    if (activeSectionIndex < ALL_SECTIONS.length - 1) {
      setActiveSectionId(ALL_SECTIONS[activeSectionIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionId(ALL_SECTIONS[activeSectionIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setIsSidebarOpen(false);
    setRevealedSolutions(new Set()); // Reset solutions when changing topics
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSolution = (qId: string) => {
    setRevealedSolutions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const renderCodeText = (text: string) => {
    // Replace markdown backticks with styled code tags
    return text.split(/(`[^`]+`)/).map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="text-emerald-300 bg-emerald-900/30 px-1.5 py-0.5 rounded text-sm font-mono border border-emerald-500/20 whitespace-pre-wrap">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  let globalSectionIdx = 0;

  if (currentData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50 shadow-inner">
          <Terminal className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-200 mb-2 font-display tracking-tight">
          No Practice Questions Yet
        </h2>
        <p className="text-slate-400 max-w-sm mb-6 text-sm">
          We are working hard to add practice questions for this stack. Please check back later!
        </p>
      </div>
    );
  }

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

      <nav 
        aria-label="Topics and Questions Navigation"
        className={`bg-slate-900/75 backdrop-blur-md border border-slate-800 shadow-xl select-none font-sans overflow-y-auto ${isSidebarOpen ? 'block' : 'hidden'} md:block sticky top-0 h-screen scrollbar-hide flex flex-col`}
      >
        {/* Navbar Header */}
        <div className="p-4 border-b border-slate-800/80 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ListTree className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 tracking-tight block">
                  Practice Topics
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentData.length} Groups • {ALL_SECTIONS.length} Sections
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleAllSubmenus}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title={collapsedTopics.size > 0 ? "Show all groups" : "Hide all groups"}
            >
              {collapsedTopics.size > 0 ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="p-3 space-y-1 overflow-y-auto flex-1">
          {currentData.map((group, groupIdx) => {
            const isExpanded = !collapsedTopics.has(group.group);
            return (
              <div key={groupIdx} className="mb-2">
                <button
                  onClick={() => toggleTopicCollapse(group.group)}
                  className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-slate-800/50 rounded-lg group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    )}
                    <span className="text-[13px] font-bold text-slate-300 group-hover:text-slate-200">
                      {group.group}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded-md border border-slate-800">
                    {group.sections.length}
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="mt-1 ml-3 border-l border-slate-800/80 pl-2 space-y-0.5">
                    {group.sections.map((section) => {
                      globalSectionIdx++;
                      const isActive = activeSectionId === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all text-left group ${
                            isActive 
                              ? 'bg-emerald-500/10 text-emerald-300 font-semibold' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
                          }`}
                        >
                          <span className="text-[12px] truncate max-w-[160px]">{section.title}</span>
                          <span className="text-[10px] opacity-60 ml-2 shrink-0 bg-slate-950 px-1.5 rounded border border-slate-800/60">{globalSectionIdx}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <main className="ref-main-content pb-32">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Comprehensive Practice Sets</div>
          <h1>📑 JavaScript <em>Interview Prep</em></h1>
          
          <div className="mt-8 bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 md:p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="text-emerald-400">⚡</span> Instructions
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>Try to solve all questions by yourself first.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>Do not use ChatGPT or AI tools for the coding part.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>You can take help only for understanding concepts or explanations, not for getting the code directly.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>Focus on logic building because that is the most important skill in programming.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>Even if your code is not perfect, try your best before asking for help.</span>
              </li>
            </ul>
            <p className="mt-5 text-sm text-slate-400 italic border-l-2 border-emerald-500/30 pl-4 py-1">
              The more you practice on your own, the faster your JavaScript skills will improve.
            </p>
          </div>
        </header>

        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black tracking-tight text-emerald-400">{activeSection.groupTitle}</h2>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>
          
          <section key={activeSection.id} className="ref-section-block animate-fade-up">
            <div className="ref-section-header mb-6">
              <div className="ref-section-num-big">{String(activeSectionIndex + 1).padStart(2, '0')}</div>
              <div className="ref-section-header-text">
                <div className="ref-section-title text-xl sm:text-2xl font-bold text-slate-100">{activeSection.title}</div>
                <div className="ref-section-subtitle text-slate-400 mt-1">{activeSection.questions.length} questions</div>
              </div>
            </div>

            <div className="space-y-4">
              {activeSection.questions.map((qObj, qIdx) => {
                const qId = `${activeSection.id}-${qIdx}`;
                const isRevealed = revealedSolutions.has(qId);
                return (
                  <div key={qIdx} className="group relative flex items-start gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700 transition-colors flex-col sm:flex-row">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 text-sm font-semibold shrink-0 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors mt-1">
                      {qIdx + 1}
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      <p className="text-slate-300 leading-relaxed text-[15px] pt-1.5 whitespace-pre-wrap">
                        {renderCodeText(qObj.q)}
                      </p>
                      
                      {isRevealed && (
                        <div className="mt-4 overflow-hidden rounded-lg border border-slate-700/50 bg-[#1e1e1e] animate-fade-in-down">
                          <div className="flex items-center px-3 py-1.5 bg-slate-800/50 border-b border-slate-700/50">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Solution</span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-300 leading-relaxed">
                            {qObj.a}
                          </pre>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleSolution(qId)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all self-start sm:self-auto mt-2 sm:mt-1 ${
                        isRevealed 
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300'
                      }`}
                    >
                      {isRevealed ? 'Hide Solution' : 'Show Solution'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={activeSectionIndex === 0}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeSectionIndex === 0 
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              &larr; Previous Topic
            </button>
            <div className="text-slate-500 text-sm font-medium">
              Page {activeSectionIndex + 1} of {ALL_SECTIONS.length}
            </div>
            <button
              onClick={handleNext}
              disabled={activeSectionIndex === ALL_SECTIONS.length - 1}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeSectionIndex === ALL_SECTIONS.length - 1 
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              Next Topic &rarr;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
