/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechStack, ViewMode, Question, Difficulty, BackendWorkflowTopic } from './types';
import { QUESTIONS_DATA } from './data/questionsData';
import { Header, STACK_CONFIG } from './components/Header';
import { ProgressBanner } from './components/ProgressBanner';
import { QuestionCard } from './components/QuestionCard';
import { FlashcardMode } from './components/FlashcardMode';
import { SeparatedFilesViewer } from './components/SeparatedFilesViewer';
import { InteractiveFlowDiagram } from './components/InteractiveFlowDiagram';
import { BackendWorkflowViewer } from './components/BackendWorkflowViewer';
import { 
  Sparkles, 
  FileCode, 
  BookOpen, 
  Filter, 
  ExternalLink,
  Code,
  Network,
  ChevronUp,
  ChevronDown,
  Database,
  Lock,
  Globe,
  Sliders,
  Boxes,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEY_COMPLETED = 'interview_prep_completed_v3';
const STORAGE_KEY_BOOKMARKS = 'interview_prep_bookmarks_v3';

export default function App() {
  // Navigation & Filtering
  const [selectedStack, setSelectedStack] = useState<TechStack>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('workflow');
  const [backendWorkflowTopic, setBackendWorkflowTopic] = useState<BackendWorkflowTopic>('crud');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [animatedCodeOnly, setAnimatedCodeOnly] = useState<boolean>(false);
  const [showArchitectureDiagram, setShowArchitectureDiagram] = useState<boolean>(true);

  // Persistence States
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Accordion open/close state
  const [openCardIds, setOpenCardIds] = useState<Set<string>>(() => 
    new Set(['react-1', 'java-1', 'js-1', 'node-1', 'exp-1'])
  );

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedIds));
    } catch (e) {
      console.warn('Could not save completedIds to localStorage', e);
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn('Could not save bookmarkedIds to localStorage', e);
    }
  }, [bookmarkedIds]);

  // Handlers for toggles
  const handleToggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCardOpen = (id: string) => {
    setOpenCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenCardIds(new Set(filteredQuestions.map((q) => q.id)));
  };

  const handleCollapseAll = () => {
    setOpenCardIds(new Set());
  };

  const handleResetProgress = () => {
    setCompletedIds([]);
  };

  // Reset topic & difficulty when stack changes
  const handleSelectStack = (stack: TechStack) => {
    setSelectedStack(stack);
    setSelectedTopic('all');
  };

  // Available topics for currently selected stack
  const availableTopics = useMemo(() => {
    const list = selectedStack === 'all' 
      ? QUESTIONS_DATA 
      : QUESTIONS_DATA.filter((q) => q.stack === selectedStack);
    const set = new Set(list.map((q) => q.topic));
    return Array.from(set);
  }, [selectedStack]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      // Stack filter
      if (selectedStack !== 'all' && q.stack !== selectedStack) {
        return false;
      }
      // Topic filter
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
        return false;
      }
      // Bookmark filter
      if (bookmarkedOnly && !bookmarkedIds.includes(q.id)) {
        return false;
      }
      // Animated code only filter
      if (animatedCodeOnly && (!q.codeExample?.executionSteps || q.codeExample.executionSteps.length === 0)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = q.title.toLowerCase().includes(query);
        const inSummary = q.summary.toLowerCase().includes(query);
        const inTopic = q.topic.toLowerCase().includes(query);
        const inTags = q.tags.some((t) => t.toLowerCase().includes(query));
        const inCode = q.codeExample?.code.toLowerCase().includes(query) || false;
        if (!inTitle && !inSummary && !inTopic && !inTags && !inCode) {
          return false;
        }
      }
      return true;
    });
  }, [selectedStack, selectedTopic, selectedDifficulty, bookmarkedOnly, bookmarkedIds, animatedCodeOnly, searchQuery]);

  // Difficulty counts
  const difficultyCounts = useMemo(() => {
    const base = selectedStack === 'all' 
      ? QUESTIONS_DATA 
      : QUESTIONS_DATA.filter((q) => q.stack === selectedStack);

    return {
      all: base.length,
      Beginner: base.filter((q) => q.difficulty === 'Beginner').length,
      Intermediate: base.filter((q) => q.difficulty === 'Intermediate').length,
      Advanced: base.filter((q) => q.difficulty === 'Advanced').length
    };
  }, [selectedStack]);

  // Group filtered questions by stack
  const groupedByStack = useMemo(() => {
    const map: Record<Exclude<TechStack, 'all'>, Question[]> = {
      react: [],
      java: [],
      javascript: [],
      node: [],
      express: []
    };
    filteredQuestions.forEach((q) => {
      map[q.stack].push(q);
    });
    return map;
  }, [filteredQuestions]);

  const allFilteredExpanded = filteredQuestions.length > 0 && filteredQuestions.every((q) => openCardIds.has(q.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/20">
      {/* Global Header */}
      <Header
        selectedStack={selectedStack}
        onSelectStack={handleSelectStack}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        bookmarkedOnly={bookmarkedOnly}
        onToggleBookmarkedOnly={() => setBookmarkedOnly((prev) => !prev)}
        bookmarkedCount={bookmarkedIds.length}
      />

      {/* Main Content Area */}
      {viewMode === 'workflow' ? (
        <div className="flex-1 animate-fade-up">
          <BackendWorkflowViewer initialTopic={backendWorkflowTopic} />
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
          {/* VIEW 1: STANDALONE CODE FILES EXPORTER */}
          {viewMode === 'files' && (
            <div className="animate-fade-up">
              <SeparatedFilesViewer />
            </div>
          )}

        {/* VIEW 2: FLASHCARD QUIZ MODE */}
        {viewMode === 'flashcards' && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-200">
                Flashcards ({filteredQuestions.length})
              </h2>
              <span className="text-xs text-slate-400">
                {completedIds.length} completed
              </span>
            </div>

            <FlashcardMode
              questions={filteredQuestions}
              completedIds={completedIds}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        )}

        {/* VIEW 3: COMPREHENSIVE STUDY LIST */}
        {viewMode === 'questions' && (
          <div className="space-y-4 animate-fade-up">
            {/* Interactive Backend Flow Launcher in current tab */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-400 mb-0.5 font-semibold">
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Backend Architecture Workflows in 3 Codebases</span>
                </div>
                <div className="text-xs text-slate-300">
                  Select a workflow to see and compare full implementations across <strong>Express.js</strong>, <strong>Spring Boot</strong>, and <strong>FastAPI</strong>:
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  id="launcher-crud-btn"
                  onClick={() => {
                    setBackendWorkflowTopic('crud');
                    setViewMode('workflow');
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CRUD Flow</span>
                </button>
                <button
                  id="launcher-auth-btn"
                  onClick={() => {
                    setBackendWorkflowTopic('auth');
                    setViewMode('workflow');
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Auth Flow</span>
                </button>
                <button
                  id="launcher-rest-btn"
                  onClick={() => {
                    setBackendWorkflowTopic('rest');
                    setViewMode('workflow');
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>REST Flow</span>
                </button>
                <button
                  id="launcher-middleware-btn"
                  onClick={() => {
                    setBackendWorkflowTopic('middleware');
                    setViewMode('workflow');
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Middleware Flow</span>
                </button>
              </div>
            </div>

            {/* Overall Progress Banner */}
            <ProgressBanner
              questions={QUESTIONS_DATA}
              completedIds={completedIds}
              onResetProgress={handleResetProgress}
              onExpandAll={handleExpandAll}
              onCollapseAll={handleCollapseAll}
              allExpanded={allFilteredExpanded}
            />

            {/* Architecture Lifecycle Stepper Diagram Toggle */}
            <div className="mb-2">
              <div className="flex items-center justify-between pb-1 mb-2">
                <button
                  onClick={() => setShowArchitectureDiagram(!showArchitectureDiagram)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-sky-400 transition-colors"
                >
                  <Network className="w-3.5 h-3.5 text-sky-400" />
                  <span>Architecture & Request Lifecycle Flow</span>
                  {showArchitectureDiagram ? (
                    <ChevronUp className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {showArchitectureDiagram && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <InteractiveFlowDiagram />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Toolbar: Difficulty Levels & Code Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
              {/* Difficulty Level Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                <span className="text-slate-400 text-xs mr-1 font-medium">Level:</span>

                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedDifficulty === 'all'
                      ? 'bg-slate-800 text-sky-400 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({difficultyCounts.all})
                </button>

                <button
                  onClick={() => setSelectedDifficulty('Beginner')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedDifficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Beginner ({difficultyCounts.Beginner})
                </button>

                <button
                  onClick={() => setSelectedDifficulty('Intermediate')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedDifficulty === 'Intermediate'
                      ? 'bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Intermediate ({difficultyCounts.Intermediate})
                </button>

                <button
                  onClick={() => setSelectedDifficulty('Advanced')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedDifficulty === 'Advanced'
                      ? 'bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Advanced ({difficultyCounts.Advanced})
                </button>
              </div>

              {/* Animated Code Filter Toggle */}
              <button
                type="button"
                onClick={() => setAnimatedCodeOnly((prev) => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border ${
                  animatedCodeOnly
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-medium'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Filter questions with code simulations"
              >
                <Code className="w-3.5 h-3.5 text-sky-400" />
                <span>Code Only</span>
              </button>
            </div>

            {/* Sub-Topic Filter Chips */}
            {availableTopics.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <span className="text-slate-400 shrink-0 text-xs flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-slate-500" />
                  <span>Topic:</span>
                </span>
                <button
                  id="topic-filter-all"
                  onClick={() => setSelectedTopic('all')}
                  className={`px-2.5 py-0.5 rounded text-xs whitespace-nowrap transition-colors border ${
                    selectedTopic === 'all'
                      ? 'bg-slate-800 text-slate-200 border-slate-700 font-medium'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({filteredQuestions.length})
                </button>
                {availableTopics.map((topic) => {
                  const topicCount = QUESTIONS_DATA.filter((q) =>
                    selectedStack === 'all'
                      ? q.topic === topic
                      : q.stack === selectedStack && q.topic === topic
                  ).length;
                  const isSelected = selectedTopic === topic;

                  return (
                    <button
                      key={topic}
                      id={`topic-filter-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-2.5 py-0.5 rounded text-xs whitespace-nowrap transition-colors border ${
                        isSelected
                          ? 'bg-slate-800 text-slate-200 border-slate-700 font-medium'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {topic} ({topicCount})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Questions List Render */}
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-14 bg-slate-900 border border-slate-800 rounded-xl p-6">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-200">No questions match the current filter</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try clearing search keywords or resetting difficulty and topic filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedStack('all');
                    setSelectedTopic('all');
                    setSelectedDifficulty('all');
                    setAnimatedCodeOnly(false);
                    setSearchQuery('');
                    setBookmarkedOnly(false);
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {(['react', 'java', 'javascript', 'node', 'express'] as const).map((stackKey) => {
                  const questionsInStack = groupedByStack[stackKey];
                  if (questionsInStack.length === 0) return null;

                  const cfg = STACK_CONFIG[stackKey];
                  const stackCompletedCount = questionsInStack.filter((q) =>
                    completedIds.includes(q.id)
                  ).length;

                  return (
                    <section key={stackKey} id={`section-${stackKey}`} className="space-y-2.5">
                      {/* Section Stack Header */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{cfg.icon}</span>
                          <h2 className={`text-base font-semibold ${cfg.color}`}>
                            {cfg.label}
                          </h2>
                          <span className="text-xs text-slate-400">
                            ({questionsInStack.length})
                          </span>
                        </div>

                        <div className="text-xs text-slate-400">
                          {stackCompletedCount}/{questionsInStack.length} completed
                        </div>
                      </div>

                      {/* Question Cards in this stack */}
                      <div className="space-y-2.5">
                        {questionsInStack.map((q) => (
                          <QuestionCard
                            key={q.id}
                            question={q}
                            isCompleted={completedIds.includes(q.id)}
                            isBookmarked={bookmarkedIds.includes(q.id)}
                            isOpen={openCardIds.has(q.id)}
                            onToggleOpen={() => handleToggleCardOpen(q.id)}
                            onToggleComplete={() => handleToggleComplete(q.id)}
                            onToggleBookmark={() => handleToggleBookmark(q.id)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Interview Hub</span>
            <span>•</span>
            <span>React, Java, JavaScript, Node.js, Express</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('files')}
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Standalone Files</span>
            </button>

            <a
              href="/standalone/index.html"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>HTML Preview</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
