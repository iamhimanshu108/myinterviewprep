import React from 'react';
import { TechStack, ViewMode, BackendWorkflowTopic } from '../types';
import { 
  Search, 
  Layers, 
  Bookmark, 
  X,
  Workflow,
  Globe,
  Database,
  Lock,
  Sliders,
  Smartphone,
  Rocket,
  Atom
} from 'lucide-react';

interface HeaderProps {
  selectedStack: TechStack;
  onSelectStack: (stack: TechStack) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  backendWorkflowTopic: BackendWorkflowTopic;
  onSelectBackendWorkflowTopic: (topic: BackendWorkflowTopic) => void;
  bookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  bookmarkedCount: number;
}

export const STACK_CONFIG: Record<
  TechStack,
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  all: {
    label: 'All',
    icon: '⚡',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30'
  },
  html: {
    label: 'HTML',
    icon: '🌐',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30'
  },
  javascript: {
    label: 'JavaScript',
    icon: 'JS',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  python: {
    label: 'Python',
    icon: '🐍',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30'
  },
  react: {
    label: 'React',
    icon: '⚛️',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  java: {
    label: 'Java',
    icon: '☕',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30'
  },
  node: {
    label: 'NodeJs',
    icon: '🟢',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  express: {
    label: 'Expressjs',
    icon: '🚂',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  typescript: {
    label: 'TypeScript',
    icon: 'TS',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  rest: {
    label: 'REST API',
    icon: '🌍',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30'
  },
  auth: {
    label: 'Auth (JWT)',
    icon: '🔒',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30'
  },
  database: {
    label: 'Database',
    icon: '🗄️',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  middleware: {
    label: 'Middleware',
    icon: '⚙️',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  },
  reactnative: {
    label: 'React Native',
    icon: '📱',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30'
  },
  devops: {
    label: 'DevOps',
    icon: '🚀',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30'
  }
};

export const Header: React.FC<HeaderProps> = ({
  selectedStack,
  onSelectStack,
  searchQuery,
  onSearchChange,
  viewMode,
  onChangeViewMode,
  backendWorkflowTopic,
  onSelectBackendWorkflowTopic,
  bookmarkedOnly,
  onToggleBookmarkedOnly,
  bookmarkedCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Top row: Brand & Primary Two Options (Flow & Question) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/30 to-indigo-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold text-base shadow-sm">
              ⚡
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-tight">
                My Interview Prep
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input (shown primarily in Question mode, or search topics in flow) */}
            {viewMode === 'questions' && (
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs rounded-lg pl-8 pr-7 py-1.5 focus:outline-none focus:border-sky-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* TWO MAIN OPTIONS ON TOP: FLOW & QUESTION */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/90 shadow-inner">
              <button
                id="btn-nav-flow"
                onClick={() => onChangeViewMode('workflow')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'workflow'
                    ? 'bg-gradient-to-r from-orange-500/25 to-amber-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Workflow className="w-3.5 h-3.5 text-orange-400" />
                <span>Flow</span>
              </button>

              <button
                id="btn-nav-question"
                onClick={() => onChangeViewMode('questions')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'questions'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-row: Dynamic based on Flow or Question */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/80">
          {viewMode === 'workflow' ? (
            /* ── IN FLOW MODE: ALL ARCHITECTURAL FLOW TOPICS ── */
            <div className="flex items-center justify-between w-full gap-2 overflow-hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold pr-1 shrink-0">
                  Flows:
                </span>

                {[
                  { id: 'rest' as BackendWorkflowTopic, label: 'REST API', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40' },
                  { id: 'auth' as BackendWorkflowTopic, label: 'AUTH (JWT)', icon: Lock, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
                  { id: 'crud' as BackendWorkflowTopic, label: 'CRUD & DB', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
                  { id: 'middleware' as BackendWorkflowTopic, label: 'Middleware', icon: Sliders, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40' },
                  { id: 'react' as BackendWorkflowTopic, label: 'React (Web)', icon: Atom, color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40' },
                  { id: 'react-native' as BackendWorkflowTopic, label: 'React Native', icon: Smartphone, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/40' },
                  { id: 'devops' as BackendWorkflowTopic, label: 'DevOps & CI/CD', icon: Rocket, color: 'text-pink-400', bg: 'bg-pink-500/20', border: 'border-pink-500/40' },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = backendWorkflowTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`tab-flow-${t.id}`}
                      onClick={() => onSelectBackendWorkflowTopic(t.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border whitespace-nowrap shrink-0 ${
                        isSelected
                          ? `${t.bg} ${t.color} ${t.border} shadow-sm font-semibold`
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── IN QUESTION: HTML, JavaScript, Python, React, Java, NodeJs, Expressjs, TypeScript ── */
            <>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {(Object.keys(STACK_CONFIG) as TechStack[]).map((stackKey) => {
                  const cfg = STACK_CONFIG[stackKey];
                  const isSelected = selectedStack === stackKey;
                  return (
                    <button
                      key={stackKey}
                      id={`filter-stack-${stackKey}`}
                      onClick={() => onSelectStack(stackKey)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors whitespace-nowrap border ${
                        isSelected
                          ? `${cfg.bg} ${cfg.color} ${cfg.border} font-semibold`
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-mono">{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="filter-bookmarked-btn"
                  onClick={onToggleBookmarkedOnly}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors ${
                    bookmarkedOnly
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title="Show bookmarked questions only"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>Starred ({bookmarkedCount})</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
