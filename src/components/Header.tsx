import React from 'react';
import { TechStack, ViewMode } from '../types';
import { 
  Search, 
  Layers, 
  Bookmark, 
  FileCode, 
  Sparkles,
  ExternalLink,
  X,
  Server
} from 'lucide-react';

interface HeaderProps {
  selectedStack: TechStack;
  onSelectStack: (stack: TechStack) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  bookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  bookmarkedCount: number;
}

export const STACK_CONFIG: Record<
  TechStack,
  { label: string; icon: string; color: string; bg: string; border: string }
> = {
  all: {
    label: 'All Stacks',
    icon: '⚡',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30'
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
  javascript: {
    label: 'JavaScript',
    icon: 'JS',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30'
  },
  node: {
    label: 'Node.js',
    icon: '🟢',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30'
  },
  express: {
    label: 'Express.js',
    icon: '🚂',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30'
  }
};

export const Header: React.FC<HeaderProps> = ({
  selectedStack,
  onSelectStack,
  searchQuery,
  onSearchChange,
  viewMode,
  onChangeViewMode,
  bookmarkedOnly,
  onToggleBookmarkedOnly,
  bookmarkedCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top row: Brand, Search, Mode Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-base">
              ⚡
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-tight">
                Full Stack Interview Prep
              </h1>
              <span className="text-[11px] text-slate-400">
                React • Java • JavaScript • Node.js • Express
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
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

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                id="btn-view-workflow"
                onClick={() => onChangeViewMode('workflow')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'workflow'
                    ? 'bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Server className="w-3.5 h-3.5 text-orange-400" />
                <span>Backend Flow</span>
              </button>

              <button
                id="btn-view-questions"
                onClick={() => onChangeViewMode('questions')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'questions'
                    ? 'bg-slate-800 text-sky-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Questions</span>
              </button>

              <button
                id="btn-view-flashcards"
                onClick={() => onChangeViewMode('flashcards')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'flashcards'
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flashcards</span>
              </button>

              <button
                id="btn-view-files"
                onClick={() => onChangeViewMode('files')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'files'
                    ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Code Files</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Clean Stack Filter Pills & Starred Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-800/80">
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

            <a
              href="/standalone/index.html"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-sky-400 text-xs px-2 py-1 transition-colors"
              title="Open standalone HTML page"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Preview HTML</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
