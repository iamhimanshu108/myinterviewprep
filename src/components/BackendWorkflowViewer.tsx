import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Layers, 
  Key, 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Code, 
  FileText, 
  Server, 
  Cpu, 
  Boxes, 
  HelpCircle, 
  ExternalLink
} from 'lucide-react';
import { BackendWorkflowTopic, BackendFramework } from '../types';
import { BACKEND_WORKFLOWS, WorkflowTopicData, WorkflowCodebase } from '../data/backendWorkflowsData';
import { VsCodeSnippet } from './VsCodeSnippet';

interface Props {
  initialTopic?: BackendWorkflowTopic;
  onTopicChange?: (topic: BackendWorkflowTopic) => void;
}

export const BackendWorkflowViewer: React.FC<Props> = ({ initialTopic = 'rest', onTopicChange }) => {
  const [selectedTopic, setSelectedTopic] = useState<BackendWorkflowTopic>(initialTopic);
  const [selectedFramework, setSelectedFramework] = useState<'all' | BackendFramework>('all');
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync state if initialTopic prop updates from parent header
  useEffect(() => {
    if (initialTopic && initialTopic !== selectedTopic) {
      setSelectedTopic(initialTopic);
    }
  }, [initialTopic]);

  const handleSelectTopic = (topic: BackendWorkflowTopic) => {
    setSelectedTopic(topic);
    onTopicChange?.(topic);
  };

  // Stepper state for animated SVG flow
  const [stepIndex, setStepIndex] = useState(0);
  const [isStepperAutoPlaying, setIsStepperAutoPlaying] = useState(false);
  const stepperTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Interactive Quiz state (quizId -> { selectedIndex, isCorrect })
  const [quizResults, setQuizResults] = useState<Record<string, { selectedIndex: number; isCorrect: boolean }>>({});

  const currentTopicData: WorkflowTopicData = BACKEND_WORKFLOWS[selectedTopic];

  // Reset stepper and framework filter when topic changes
  useEffect(() => {
    setSelectedFramework('all');
    setStepIndex(0);
    setIsStepperAutoPlaying(false);
    if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
    if (currentTopicData.sections.length > 0) {
      setActiveSectionId(currentTopicData.sections[0].id);
    }
  }, [selectedTopic]);

  // Stepper auto-play handler
  useEffect(() => {
    if (isStepperAutoPlaying) {
      stepperTimerRef.current = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % currentTopicData.flowSteps.length);
      }, 3500);
    } else {
      if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
    }
    return () => {
      if (stepperTimerRef.current) clearInterval(stepperTimerRef.current);
    };
  }, [isStepperAutoPlaying, currentTopicData.flowSteps.length]);

  // Scrollspy to update active section in sidebar
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

    currentTopicData.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selectedTopic, currentTopicData.sections]);

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
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentStep = currentTopicData.flowSteps[stepIndex] || currentTopicData.flowSteps[0];
  const isLit = (elementId: string) => currentStep.lit.includes(elementId);

  // Group navigation items
  const groupedNav = currentTopicData.sections.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, typeof currentTopicData.sections>);

  // Dynamic framework details helper based on active topic
  const frameworksList = useMemo(() => {
    return Object.entries(currentTopicData.codebases).map(([key, cb]) => {
      let icon = '⚡';
      if (key === 'express') icon = '🟢';
      else if (key === 'springboot') icon = '🍃';
      else if (key === 'fastapi') icon = '⚡';
      else if (key === 'query') icon = '⚛️';
      else if (key === 'auth') icon = '🔒';
      else if (key === 'next') icon = '▲';
      else if (key === 'secure') icon = '🔐';
      else if (key === 'offline') icon = '📦';
      else if (key === 'nav') icon = '🧭';
      else if (key === 'docker') icon = '🐳';
      else if (key === 'actions') icon = '⚙️';
      else if (key === 'nginx') icon = '🛡️';

      return {
        id: key,
        label: cb.frameworkName.split('(')[0].trim(),
        icon,
        lang: cb.language
      };
    });
  }, [currentTopicData]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500/20">
      
      {/* ── LEFT SIDEBAR NAVIGATION ── */}
      <aside className="w-full md:w-64 lg:w-72 bg-slate-950 border-r border-slate-800 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] overflow-y-auto shrink-0 py-6 scrollbar-thin">




        {/* Grouped Chapter Navigation for Active Topic */}
        <nav className="space-y-6" aria-label="Backend Topic Navigation">
          {(Object.keys(groupedNav) as (keyof typeof groupedNav)[]).map((groupName, groupIdx) => {
            const parts = groupName.split(': ');
            const phase = parts[0] || '';
            const title = parts.length > 1 ? parts[1] : '';

            return (
            <div key={groupName} className="relative">
              {/* Timeline Connector */}
              {groupIdx !== Object.keys(groupedNav).length - 1 && (
                <div className="absolute left-[34px] top-8 bottom-[-24px] w-[2px] bg-slate-800/60 z-0"></div>
              )}

              <div className="flex items-center gap-2 px-4 mb-2 z-10 relative">
                <div className="h-5 px-1.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[8px] font-bold font-mono-ref tracking-widest text-orange-500 shadow-sm">
                  {phase.toUpperCase()}
                </div>
                {title && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</div>}
              </div>

              <div className="space-y-0.5 relative z-10">
              {groupedNav[groupName].map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-2 text-left font-sans text-xs transition-colors group relative ${
                      isActive
                        ? 'text-white bg-slate-900/40 font-medium'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/20'
                    }`}
                  >
                    <div className="relative flex items-center justify-center shrink-0 ml-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-ref text-[9px] transition-all border ${
                        isActive
                          ? 'bg-orange-500 border-orange-400 text-white font-bold shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                          : 'bg-slate-950 border-slate-700 text-slate-500 group-hover:border-slate-500 group-hover:text-slate-300'
                      }`}>
                        {item.num}
                      </div>
                    </div>
                    <span className="truncate leading-tight">{item.label}</span>
                  </button>
                );
              })}
              </div>
            </div>
          )})}
        </nav>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 max-w-5xl px-4 sm:px-8 md:px-12 py-8 md:py-12 overflow-x-hidden">
        
        {/* ── SECTION 01: FOUNDATIONS ── */}
        <section id={`${selectedTopic}-01`} className="mb-12 scroll-mt-20">
          <div className="flex items-start gap-4 mb-4">
            <div className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded font-mono-ref text-xs font-bold shrink-0 mt-1">
              PHASE 1
            </div>
            <div>
              <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-white">
                Core Concept &amp; The Architectural Dilemma
              </h3>
              <p className="text-xs text-slate-400">
                {currentTopicData.tagline}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-lg bg-slate-900 border-l-4 border-l-orange-500 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3">
            <p>
              {currentTopicData.subtitle}. Understanding how data and execution flow through each architectural layer is essential for scalable system design and senior technical interviews.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {frameworksList.map((fw) => {
                const cb = currentTopicData.codebases[fw.id];
                return (
                  <div key={fw.id} className="p-3 bg-slate-950/60 rounded border border-slate-800">
                    <div className="text-xs font-bold text-orange-400 flex items-center gap-1.5 mb-1">
                      <span>{fw.icon}</span> {cb?.frameworkName || fw.label}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-3">
                      {cb?.explanation || fw.lang}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 04: INTERACTIVE ANIMATED LIFECYCLE FLOW ── */}
        <section id={`${selectedTopic}-04`} className="mb-14 scroll-mt-20">
          <div className="flex items-start gap-4 mb-4">
            <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded font-mono-ref text-xs font-bold shrink-0 mt-1">
              PHASE 2
            </div>
            <div>
              <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Interactive Request Lifecycle Stepper</span>
                <span className="text-[11px] font-mono-ref font-normal px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Live Animated SVG
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Step forward and backward to see how packets move through each architectural boundary
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
            {/* SVG Diagram Canvas */}
            <div className="p-6 sm:p-8 bg-slate-950 flex flex-col items-center justify-center min-h-[260px]">
              <svg
                viewBox="0 0 820 180"
                className="w-full max-w-3xl h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L6,3 z" fill="#f97316" />
                  </marker>
                  <marker
                    id="arrowhead-dim"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L6,3 z" fill="#475569" />
                  </marker>
                </defs>

                {/* Node 1: Client */}
                <g className={isLit('client') ? 'opacity-100 transition-opacity' : 'opacity-40 transition-opacity'}>
                  <rect x="20" y="50" width="130" height="80" rx="8" fill="#1e293b" stroke={isLit('client') ? '#f97316' : '#334155'} strokeWidth={isLit('client') ? '2' : '1'} />
                  <text x="85" y="85" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HTTP Client</text>
                  <text x="85" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">Browser / Mobile</text>
                </g>

                {/* Arrow 1 */}
                <line
                  x1="150"
                  y1="90"
                  x2="220"
                  y2="90"
                  stroke={isLit('client') && (isLit('router') || isLit('server')) ? '#f97316' : '#334155'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead)"
                  className={isLit('client') ? 'animate-data-flow' : ''}
                />

                {/* Node 2: Router / Gateway */}
                <g className={(isLit('router') || isLit('server')) ? 'opacity-100 transition-opacity' : 'opacity-40 transition-opacity'}>
                  <rect x="225" y="50" width="140" height="80" rx="8" fill="#1e293b" stroke={(isLit('router') || isLit('server')) ? '#f97316' : '#334155'} strokeWidth={(isLit('router') || isLit('server')) ? '2' : '1'} />
                  <text x="295" y="85" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Router / Gateway</text>
                  <text x="295" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">URI &amp; Method Dispatch</text>
                </g>

                {/* Arrow 2 */}
                <line
                  x1="365"
                  y1="90"
                  x2="435"
                  y2="90"
                  stroke={(isLit('router') || isLit('server')) && (isLit('validation') || isLit('middleware') || isLit('crypto') || isLit('service')) ? '#f97316' : '#334155'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead)"
                />

                {/* Node 3: Validation / Middleware / Service */}
                <g className={(isLit('validation') || isLit('middleware') || isLit('service') || isLit('crypto')) ? 'opacity-100 transition-opacity' : 'opacity-40 transition-opacity'}>
                  <rect x="440" y="50" width="150" height="80" rx="8" fill="#1e293b" stroke={(isLit('validation') || isLit('middleware') || isLit('service') || isLit('crypto')) ? '#f97316' : '#334155'} strokeWidth="2" />
                  <text x="515" y="85" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Service &amp; Guard</text>
                  <text x="515" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">DTO / Business Rules</text>
                </g>

                {/* Arrow 3 */}
                <line
                  x1="590"
                  y1="90"
                  x2="660"
                  y2="90"
                  stroke={(isLit('service') || isLit('db') || isLit('token')) ? '#f97316' : '#334155'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead)"
                />

                {/* Node 4: Database / ORM */}
                <g className={(isLit('db') || isLit('token') || isLit('route')) ? 'opacity-100 transition-opacity' : 'opacity-40 transition-opacity'}>
                  <rect x="665" y="50" width="135" height="80" rx="8" fill="#1e293b" stroke={(isLit('db') || isLit('token') || isLit('route')) ? '#f97316' : '#334155'} strokeWidth="2" />
                  <text x="732" y="85" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Database / Token</text>
                  <text x="732" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">SQL / Mongo / State</text>
                </g>
              </svg>
            </div>

            {/* Stepper Controls Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  id="stepper-prev-btn"
                  onClick={() => setStepIndex((prev) => (prev > 0 ? prev - 1 : currentTopicData.flowSteps.length - 1))}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-ref rounded border border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  id="stepper-autoplay-btn"
                  onClick={() => setIsStepperAutoPlaying(!isStepperAutoPlaying)}
                  className={`px-3 py-1.5 text-xs font-mono-ref rounded border flex items-center gap-1.5 transition-colors ${
                    isStepperAutoPlaying
                      ? 'bg-orange-600 text-white border-orange-500'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {isStepperAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isStepperAutoPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>

                <button
                  id="stepper-next-btn"
                  onClick={() => setStepIndex((prev) => (prev + 1) % currentTopicData.flowSteps.length)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-ref rounded border border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <span className="font-mono-ref text-xs text-slate-400">
                  Step {stepIndex + 1} of {currentTopicData.flowSteps.length}
                </span>
              </div>

              {/* Current Step Description */}
              <div className="text-right sm:max-w-md">
                <div className="text-xs font-bold text-orange-400">
                  {currentStep.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {currentStep.detail}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 05: CODEBASES COMPARISON ── */}
        <section id={`${selectedTopic}-06`} className="mb-14 scroll-mt-20">
          <div className="flex items-start gap-4 mb-4">
            <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded font-mono-ref text-xs font-bold shrink-0 mt-1">
              PHASE 3
            </div>
            <div>
              <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Codebases: Complete Real-World Implementation</span>
              </h3>
              <p className="text-xs text-slate-400">
                Understand and compare the exact code implementation for {currentTopicData.title}
              </p>
            </div>
          </div>

          {/* Framework Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900 border border-slate-800 rounded-t-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedFramework('all')}
                className={`px-3 py-1.5 text-xs font-mono-ref rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedFramework === 'all'
                    ? 'bg-orange-500 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Compare All ({frameworksList.length})</span>
              </button>
              {frameworksList.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={`px-3 py-1.5 text-xs font-mono-ref rounded-lg transition-all flex items-center gap-1.5 ${
                    selectedFramework === fw.id
                      ? 'bg-slate-800 text-orange-400 font-semibold border border-orange-500/40 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{fw.icon}</span>
                  <span>{fw.label}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono-ref text-slate-500 hidden sm:block px-2">
              Production Tested Patterns
            </div>
          </div>

          {/* CODE PANELS CONTAINER */}
          <div className="space-y-6">
            {(selectedFramework === 'all'
              ? Object.keys(currentTopicData.codebases)
              : [selectedFramework]
            ).map((fwKey) => {
              const codebase: WorkflowCodebase = currentTopicData.codebases[fwKey];
              if (!codebase) return null;
              return (
                <div
                  key={fwKey}
                  className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl"
                >
                  {/* Colorful VS Code Editor Snippet */}
                  <VsCodeSnippet
                    code={codebase.code}
                    language={codebase.language}
                    filename={`${codebase.frameworkName} • ${codebase.fileLabel}`}
                    className="border-0 rounded-b-none"
                    showMacDots={true}
                    showStatusBar={true}
                    showLineNumbers={true}
                    onCopySuccess={() => setCopiedKey(`${selectedTopic}-${fwKey}`)}
                  />

                  {/* Architecture Breakdown & How to Understand It */}
                  <div className="p-4 bg-slate-900 border-t border-slate-800/80">
                    <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>How to understand this code:</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {codebase.explanation}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {codebase.architectureHighlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 09: SIDE-BY-SIDE ARCHITECTURAL COMPARISON MATRIX ── */}
        <section id={`${selectedTopic}-09`} className="mb-14 scroll-mt-20">
          <div className="flex items-start gap-4 mb-4">
            <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded font-mono-ref text-xs font-bold shrink-0 mt-1">
              PHASE 4
            </div>
            <div>
              <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-white">
                Architectural Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Direct side-by-side comparison of how each layer or framework handles core responsibilities
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-x-auto border border-slate-800 bg-slate-900 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-mono-ref">
                  <th className="p-3.5 font-semibold text-slate-400">Feature</th>
                  {currentTopicData.comparisonColumns ? (
                    currentTopicData.comparisonColumns.map((col) => (
                      <th key={col.key} className={`p-3.5 font-semibold ${col.colorClass}`}>
                        {col.label}
                      </th>
                    ))
                  ) : (
                    <>
                      <th className="p-3.5 font-semibold text-emerald-400">🟢 Express.js</th>
                      <th className="p-3.5 font-semibold text-green-400">🍃 Spring Boot</th>
                      <th className="p-3.5 font-semibold text-teal-400">⚡ FastAPI</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {currentTopicData.comparisonPoints.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-medium text-slate-200 whitespace-nowrap bg-slate-950/40">
                      {row.feature}
                    </td>
                    {currentTopicData.comparisonColumns ? (
                      currentTopicData.comparisonColumns.map((col) => (
                        <td key={col.key} className="p-3.5 text-slate-300">
                          {row[col.key] || '—'}
                        </td>
                      ))
                    ) : (
                      <>
                        <td className="p-3.5 text-slate-300">{row.express}</td>
                        <td className="p-3.5 text-slate-300">{row.springboot}</td>
                        <td className="p-3.5 text-slate-300">{row.fastapi}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 10: INTERACTIVE QUIZ & COMMON MISTAKES ── */}
        <section id={`${selectedTopic}-10`} className="mb-14 scroll-mt-20">
          <div className="flex items-start gap-4 mb-4">
            <div className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded font-mono-ref text-xs font-bold shrink-0 mt-1">
              PHASE 5
            </div>
            <div>
              <h3 className="font-fraunces text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Knowledge Check &amp; Pitfalls</span>
                <HelpCircle className="w-4 h-4 text-orange-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Test your backend mastery and avoid common production vulnerabilities
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Interactive Quiz Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono-ref text-orange-400 uppercase tracking-wider font-semibold">
                    Interactive Quiz
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Instant Feedback
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100 mb-4">
                  {currentTopicData.quiz.question}
                </h4>

                <div className="space-y-2 mb-4">
                  {currentTopicData.quiz.options.map((opt, optIdx) => {
                    const quizState = quizResults[selectedTopic];
                    const isSelected = quizState?.selectedIndex === optIdx;
                    const isCorrectOpt = optIdx === currentTopicData.quiz.correctIndex;
                    let btnStyle = 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700';

                    if (quizState) {
                      if (isCorrectOpt) {
                        btnStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60';
                      } else if (isSelected && !quizState.isCorrect) {
                        btnStyle = 'bg-rose-950/60 text-rose-300 border-rose-500/60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() =>
                          handleQuizAnswer(
                            selectedTopic,
                            optIdx,
                            optIdx === currentTopicData.quiz.correctIndex
                          )
                        }
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-sans transition-all flex items-start gap-2 ${btnStyle}`}
                      >
                        <span className="font-mono-ref font-bold text-slate-500 shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quiz Feedback */}
              {quizResults[selectedTopic] && (
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    quizResults[selectedTopic].isCorrect
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <div className="font-bold mb-1">
                    {quizResults[selectedTopic].isCorrect ? 'Correct!' : 'Incorrect'}
                  </div>
                  <div>{currentTopicData.quiz.explanation}</div>
                </div>
              )}
            </div>

            {/* Common Mistakes & Traps */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-mono-ref text-rose-400 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Production Mistakes</span>
              </div>

              <div className="space-y-3">
                {currentTopicData.commonMistakes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="font-semibold text-rose-300 flex items-center gap-1">
                      <span>✕</span>
                      <span>{item.mistake}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      <strong className="text-slate-300">Consequence:</strong> {item.consequence}
                    </div>
                    <div className="text-emerald-400 text-[11px]">
                      <strong className="text-slate-300">Fix:</strong> {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BEST PRACTICES & SUMMARY ── */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-sm font-semibold font-mono-ref uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Golden Architectural Best Practices for {currentTopicData.title}</span>
          </h4>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-400">
            {currentTopicData.bestPractices.map((bp, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{bp}</span>
              </li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
};
