const fs = require('fs');

const content = `import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Check,
  HelpCircle,
  Layers,
  Boxes
} from 'lucide-react';
import { BackendWorkflowTopic } from '../types';
import { BACKEND_WORKFLOWS } from '../data/backendWorkflowsData';
import { VsCodeSnippet } from './VsCodeSnippet';
import { WorkflowCodebase } from '../types';

interface BackendWorkflowViewerProps {
  selectedTopic: BackendWorkflowTopic;
}

export const BackendWorkflowViewer: React.FC<BackendWorkflowViewerProps> = ({ selectedTopic }) => {
  const currentTopicData = BACKEND_WORKFLOWS[selectedTopic];

  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Flow Stepper State
  const [stepIndex, setStepIndex] = useState(0);
  const [isStepperAutoPlaying, setIsStepperAutoPlaying] = useState(false);
  const stepperTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz State
  const [quizResults, setQuizResults] = useState<Record<string, { selectedIndex: number; isCorrect: boolean }>>({});

  useEffect(() => {
    setSelectedFramework('all');
    setStepIndex(0);
    setIsStepperAutoPlaying(false);
    if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
    if ((currentTopicData?.sections || []).length > 0) {
      setActiveSectionId((currentTopicData?.sections || [])[0].id);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (isStepperAutoPlaying) {
      stepperTimerRef.current = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % (currentTopicData?.flowSteps?.length || 1));
      }, 3500);
    } else {
      if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
    }
    return () => {
      if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
    };
  }, [isStepperAutoPlaying, (currentTopicData?.flowSteps?.length || 1)]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    (currentTopicData?.sections || []).forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selectedTopic, (currentTopicData?.sections || [])]);

  const handleCopyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
    });
  };

  const handleQuizAnswer = (quizId: string, optionIndex: number, isCorrect: boolean) => {
    setQuizResults((prev) => ({
      ...prev,
      [quizId]: { selectedIndex: optionIndex, isCorrect }
    }));
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setIsSidebarOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentStep = (currentTopicData?.flowSteps || [])[stepIndex] || { name: 'No Flow', detail: '', lit: [] };
  const isLit = (elementId: string) => (currentStep?.lit || []).includes(elementId);

  const groupedNav = (currentTopicData?.sections || []).reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, typeof currentTopicData.sections>);

  const frameworksList = React.useMemo(() => {
    return Object.entries((currentTopicData?.codebases || {})).map(([key, cb]: [string, any]) => {
      let icon = "⚡";
      if (key === "express") icon = "🟢";
      else if (key === 'springboot') icon = '🍃';
      else if (key === 'fastapi') icon = '⚡';
      else if (key === 'django') icon = '🐍';
      else if (key === 'react') icon = '⚛️';
      else if (key === 'docker') icon = '🐳';

      return {
        id: key,
        label: cb.frameworkName.split('(')[0].trim(),
        icon,
        lang: cb.language
      };
    });
  }, [currentTopicData]);

  if (!currentTopicData) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 items-center justify-center text-slate-400 font-sans">
        <div className="animate-pulse font-mono-ref tracking-widest text-xs uppercase">Loading Curriculum...</div>
      </div>
    );
  }

  return (
    <div className="ref-theme ref-layout-container">
      {/* ── MOBILE SIDEBAR TOGGLE ── */}
      <div className="md:hidden sticky top-0 z-30 p-3 bg-[var(--ink)] flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <span className="font-bold uppercase tracking-widest" style={{fontFamily: 'var(--font-ibm)', fontSize: '10px'}}>Curriculum</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="px-3 py-1.5 border rounded text-xs font-semibold"
          style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', backgroundColor: 'transparent' }}
        >
          {isSidebarOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <nav className={\`ref-sidebar \${isSidebarOpen ? 'block' : 'hidden'} md:block\`}>
        <div className="ref-nav-brand">
          <div className="logo">{currentTopicData.title.substring(0, 15)}<span className="accent-dot">.</span></div>
          <div className="sub">Interview Master · Flow</div>
        </div>

        {(Object.keys(groupedNav) as (keyof typeof groupedNav)[]).map((groupName) => {
          const parts = String(groupName).split(': ');
          const title = parts.length > 1 ? parts[1] : groupName;
          
          return (
            <div key={groupName}>
              <div className="ref-nav-group-label">{title}</div>
              {groupedNav[groupName].map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={\`ref-nav-link \${isActive ? 'active' : ''}\`}
                  >
                    <span className="ref-nav-num">{item.num}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )
        })}
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Backend Workflow</div>
          <h1>{currentTopicData.title}</h1>
          <p className="ref-hero-desc">{currentTopicData.subtitle}. {currentTopicData.tagline}</p>
          <div className="ref-hero-tags">
            {(currentTopicData.tags || []).map((t, idx) => (
              <span key={idx} className="ref-hero-tag">{t}</span>
            ))}
          </div>
        </header>

        {/* Foundations Section */}
        {currentTopicData.sections?.[0] && (
          <section className="ref-section-block animate-fade-up" id={currentTopicData.sections[0].id}>
            <div className="ref-section-header">
              <div className="ref-section-num-big">01</div>
              <div className="ref-section-header-text">
                <div className="ref-section-title">{currentTopicData.sections[0].label}</div>
                <div className="ref-section-subtitle">{currentTopicData.tagline}</div>
              </div>
            </div>

            <p>{currentTopicData.subtitle}</p>

            <div className="ref-concept-box">
              <div className="ref-concept-box-label">Key Concept</div>
              <p className="ref-concept-box-text">Understanding how data and execution flow through each architectural layer is essential for scalable system design and senior technical interviews.</p>
            </div>
          </section>
        )}

        {/* Flow Stepper Section */}
        {currentTopicData.flowSteps && currentTopicData.flowSteps.length > 0 && currentTopicData.sections?.[1] && (
          <section className="ref-section-block animate-fade-up" id={currentTopicData.sections[1].id}>
            <div className="ref-section-header">
              <div className="ref-section-num-big">02</div>
              <div className="ref-section-header-text">
                <div className="ref-section-title">Lifecycle Diagram</div>
                <div className="ref-section-subtitle">Interactive request lifecycle flow</div>
              </div>
            </div>

            <p>Use the buttons to move through the flow — one step at a time.</p>

            <div className="ref-stepper" id="auth-stepper">
              <div className="ref-figure">
                <svg viewBox="0 0 820 180" role="img" aria-label="Interactive Diagram">
                  <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="var(--accent)" />
                    </marker>
                  </defs>

                  {/* Node 1: Client */}
                  <g className={isLit('client') ? 'svg-lit' : 'svg-dim'}>
                    <rect className="svg-box-ink" x="20" y="50" width="130" height="80" rx="8" />
                    <text className="svg-label-inv" x="85" y="85" textAnchor="middle">Client</text>
                    <text x="85" y="105" textAnchor="middle" style={{fontFamily:'var(--font-ibm)', fontSize:'10px', fill:'rgba(255,255,255,0.45)'}}>Browser / App</text>
                  </g>

                  {/* Arrow 1 */}
                  <line
                    x1="150" y1="90" x2="220" y2="90"
                    stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrowhead)"
                    className={isLit('client') && isLit('router') ? 'svg-lit animate-data-flow' : 'svg-dim'}
                  />

                  {/* Node 2: Router */}
                  <g className={(isLit('router') || isLit('server')) ? 'svg-lit' : 'svg-dim'}>
                    <rect className="svg-box-fill" x="225" y="50" width="140" height="80" rx="8" />
                    <text className="svg-label" x="295" y="85" textAnchor="middle">Router</text>
                    <text className="svg-mono" x="295" y="105" textAnchor="middle">Method Dispatch</text>
                  </g>

                  {/* Arrow 2 */}
                  <line
                    x1="365" y1="90" x2="435" y2="90"
                    stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrowhead)"
                    className={(isLit('router') || isLit('server')) && (isLit('service') || isLit('middleware')) ? 'svg-lit animate-data-flow' : 'svg-dim'}
                  />

                  {/* Node 3: Service */}
                  <g className={(isLit('validation') || isLit('middleware') || isLit('service') || isLit('crypto')) ? 'svg-lit' : 'svg-dim'}>
                    <rect className="svg-box-fill" x="440" y="50" width="150" height="80" rx="8" />
                    <text className="svg-label" x="515" y="85" textAnchor="middle">Service Layer</text>
                    <text className="svg-mono" x="515" y="105" textAnchor="middle">Business Logic</text>
                  </g>

                  {/* Arrow 3 */}
                  <line
                    x1="590" y1="90" x2="660" y2="90"
                    stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrowhead)"
                    className={(isLit('service') && isLit('db')) ? 'svg-lit animate-data-flow' : 'svg-dim'}
                  />

                  {/* Node 4: Database */}
                  <g className={(isLit('db') || isLit('token') || isLit('route')) ? 'svg-lit' : 'svg-dim'}>
                    <rect className="svg-box-fill" x="665" y="50" width="135" height="80" rx="8" />
                    <text className="svg-label" x="732" y="85" textAnchor="middle">Database</text>
                    <text className="svg-mono" x="732" y="105" textAnchor="middle">Persistent State</text>
                  </g>
                </svg>
              </div>
              <div className="ref-stepper-caption">
                <div className="ref-step-name">{stepIndex + 1} · {currentStep.name}</div>
                <p className="ref-step-detail">{currentStep.detail}</p>
              </div>
              <div className="ref-stepper-controls">
                <button 
                  className="ref-stepper-btn" 
                  onClick={() => setStepIndex((prev) => (prev > 0 ? prev - 1 : (currentTopicData?.flowSteps?.length || 1) - 1))}
                >
                  ← Back
                </button>
                <button 
                  className="ref-stepper-btn" 
                  onClick={() => setIsStepperAutoPlaying(!isStepperAutoPlaying)}
                >
                  {isStepperAutoPlaying ? 'Pause' : 'Auto Play'}
                </button>
                <span className="ref-stepper-count">Step <b>{stepIndex + 1}</b> / {currentTopicData.flowSteps.length}</span>
                <button 
                  className="ref-stepper-btn" 
                  onClick={() => setStepIndex((prev) => (prev + 1) % (currentTopicData?.flowSteps?.length || 1))}
                >
                  Forward →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Codebases Section */}
        {currentTopicData.codebases && Object.keys(currentTopicData.codebases).length > 0 && currentTopicData.sections?.[2] && (
          <section className="ref-section-block animate-fade-up" id={currentTopicData.sections[2].id}>
            <div className="ref-section-header">
              <div className="ref-section-num-big">03</div>
              <div className="ref-section-header-text">
                <div className="ref-section-title">Implementation</div>
                <div className="ref-section-subtitle">Real-world codebase examples</div>
              </div>
            </div>

            <div style={{display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap'}}>
               <button
                onClick={() => setSelectedFramework('all')}
                className={\`ref-badge \${selectedFramework === 'all' ? 'ref-badge-accent' : ''}\`}
                style={selectedFramework !== 'all' ? { backgroundColor: 'var(--paper3)', color: 'var(--muted)' } : {}}
              >
                Compare All
              </button>
              {frameworksList.map(fw => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={\`ref-badge \${selectedFramework === fw.id ? 'ref-badge-accent' : ''}\`}
                  style={selectedFramework !== fw.id ? { backgroundColor: 'var(--paper3)', color: 'var(--muted)' } : {}}
                >
                  {fw.icon} {fw.label}
                </button>
              ))}
            </div>

            {(selectedFramework === 'all'
              ? Object.keys(currentTopicData.codebases)
              : [selectedFramework]
            ).map((fwKey) => {
              const codebase = currentTopicData.codebases?.[fwKey];
              if (!codebase) return null;
              return (
                <div key={fwKey} style={{marginBottom: '32px'}}>
                  <div className="ref-code-block">
                    <div className="ref-code-header">
                      <span className="ref-code-label">{codebase.frameworkName} • {codebase.fileLabel}</span>
                      <button className="ref-code-copy-btn" onClick={() => handleCopyCode(codebase.code, fwKey)}>
                        {copiedKey === fwKey ? 'copied' : 'copy'}
                      </button>
                    </div>
                    <pre className="ref-code-pre">
                      {codebase.code}
                    </pre>
                  </div>
                  
                  <div className="ref-note-box">
                    <div className="ref-note-box-icon">💡</div>
                    <p className="ref-note-box-text">
                      <strong>How to understand this code:</strong><br/>
                      {codebase.explanation}
                    </p>
                  </div>
                  
                  <ul>
                    {codebase.architectureHighlights.map((hl, idx) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        )}

        {/* Quizzes & Best Practices */}
        {currentTopicData.quiz && (
          <section className="ref-section-block animate-fade-up" id={currentTopicData.sections?.[currentTopicData.sections.length-1]?.id || 'quiz-section'}>
            <div className="ref-section-header">
              <div className="ref-section-num-big">04</div>
              <div className="ref-section-header-text">
                <div className="ref-section-title">Knowledge Check & Pitfalls</div>
                <div className="ref-section-subtitle">Test your backend mastery</div>
              </div>
            </div>

            <div className="ref-quiz-box">
              <p className="ref-quiz-question">{currentTopicData.quiz.question}</p>
              <div className="ref-quiz-options">
                {currentTopicData.quiz.options.map((opt, optIdx) => {
                  const quizState = quizResults[selectedTopic];
                  const isSelected = quizState?.selectedIndex === optIdx;
                  const isCorrectOpt = optIdx === currentTopicData.quiz!.correctIndex;
                  
                  let btnCls = "ref-quiz-option";
                  if (quizState) {
                    if (isCorrectOpt) btnCls += " correct";
                    else if (isSelected) btnCls += " incorrect";
                  }

                  return (
                    <button
                      key={optIdx}
                      className={btnCls}
                      disabled={!!quizState}
                      onClick={() => handleQuizAnswer(selectedTopic, optIdx, isCorrectOpt)}
                    >
                      {String.fromCharCode(65 + optIdx)} — {opt}
                    </button>
                  );
                })}
              </div>
              {quizResults[selectedTopic] && (
                <div className={\`ref-quiz-feedback \${quizResults[selectedTopic].isCorrect ? 'correct' : 'incorrect'}\`}>
                  {quizResults[selectedTopic].isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                  <span style={{textTransform: 'none', fontFamily: 'var(--font-dm)', fontSize: '13px'}}>{currentTopicData.quiz.explanation}</span>
                </div>
              )}
            </div>

            {currentTopicData.commonMistakes && currentTopicData.commonMistakes.length > 0 && (
              <>
                <h3>Mistakes to avoid</h3>
                <table className="compare-table">
                  <thead>
                    <tr><th>Mistake</th><th>What it costs you</th><th>Do this instead</th></tr>
                  </thead>
                  <tbody>
                    {currentTopicData.commonMistakes.map((m, idx) => (
                      <tr key={idx}>
                        <td className="cell-title">{m.mistake}</td>
                        <td className="cell-muted">{m.consequence}</td>
                        <td className="cell-highlight">{m.solution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {currentTopicData.bestPractices && currentTopicData.bestPractices.length > 0 && (
              <>
                <h3>Golden Architectural Best Practices</h3>
                <div className="ref-concept-box">
                  <div className="ref-concept-box-label">Rules to Live By</div>
                  <ul className="ref-concept-box-text" style={{marginTop: '8px'}}>
                    {currentTopicData.bestPractices.map((bp, idx) => (
                      <li key={idx}>{bp}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
`;
fs.writeFileSync('src/components/BackendWorkflowViewer.tsx', content);
console.log('Successfully wrote BackendWorkflowViewer.tsx!');
`;
fs.writeFileSync('rewrite-viewer.js', scriptContent);
`
