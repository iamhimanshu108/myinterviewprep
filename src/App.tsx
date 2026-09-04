/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechStack, ViewMode, Question, Difficulty, BackendWorkflowTopic } from './types';
import { QUESTIONS_DATA } from './data/questionsData';
import { Header, STACK_CONFIG } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { BackendWorkflowViewer } from './components/BackendWorkflowViewer';
import { BookOpen } from 'lucide-react';

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

  // Reset topic & difficulty when stack changes
  const handleSelectStack = (stack: TechStack) => {
    setSelectedStack(stack);
    setSelectedTopic('all');
  };

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

  // Group filtered questions by stack
  const groupedByStack = useMemo(() => {
    const map: Record<Exclude<TechStack, 'all'>, Question[]> = {
      html: [],
      javascript: [],
      python: [],
      react: [],
      java: [],
      node: [],
      express: [],
      typescript: []
    };
    filteredQuestions.forEach((q) => {
      if (map[q.stack]) {
        map[q.stack].push(q);
      }
    });
    return map;
  }, [filteredQuestions]);

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
        backendWorkflowTopic={backendWorkflowTopic}
        onSelectBackendWorkflowTopic={(topic) => setBackendWorkflowTopic(topic)}
        bookmarkedOnly={bookmarkedOnly}
        onToggleBookmarkedOnly={() => setBookmarkedOnly((prev) => !prev)}
        bookmarkedCount={bookmarkedIds.length}
      />

      {/* Main Content Area */}
      {viewMode === 'workflow' ? (
        <div className="flex-1 animate-fade-up">
          <BackendWorkflowViewer 
            initialTopic={backendWorkflowTopic} 
            onTopicChange={setBackendWorkflowTopic}
          />
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
          <div className="space-y-4 animate-fade-up">
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
                {(['html', 'javascript', 'python', 'react', 'java', 'node', 'express', 'typescript'] as const).map((stackKey) => {
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
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-slate-300">Interview Hub</span>
            <span>•</span>
            <span>React, Java, JavaScript, Node.js, Express</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Express.js • Spring Boot • FastAPI Architecture Workflows</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
