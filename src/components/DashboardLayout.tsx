/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { TechStack, ViewMode, Question, Difficulty, BackendWorkflowTopic } from '../types';
import { QUESTIONS_DATA } from '../data/questionsData';
import { Header, STACK_CONFIG } from './Header';
import { QuestionCard } from './QuestionCard';
import { BackendWorkflowViewer } from './BackendWorkflowViewer';
import { RightTopicNavbar } from './RightTopicNavbar';
import { BookOpen, PanelLeftOpen } from 'lucide-react';

const STORAGE_KEY_COMPLETED = 'interview_prep_completed_v3';
const STORAGE_KEY_BOOKMARKS = 'interview_prep_bookmarks_v3';

export function DashboardLayout() {
  const { topicId, stackId } = useParams();
  const navigate = useNavigate();
  // Navigation & Filtering
  const [selectedStack, setSelectedStack] = useState<TechStack>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('workflow');
  const [backendWorkflowTopic, setBackendWorkflowTopic] = useState<BackendWorkflowTopic>('mvc');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [animatedCodeOnly, setAnimatedCodeOnly] = useState<boolean>(false);
  const [activeNavId, setActiveNavId] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

  // Sync Router URL params to internal state on mount or URL change
  useEffect(() => {
    if (topicId) {
      setViewMode('workflow');
      setBackendWorkflowTopic(topicId as BackendWorkflowTopic);
    } else if (stackId) {
      setViewMode('questions');
      setSelectedStack(stackId as TechStack);
    }
  }, [topicId, stackId]);

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

  // Group filtered questions by stack and topic, sorted Beginner to Advanced
  const { groupedByStackAndTopic, questionNumberMap } = useMemo(() => {
    const DIFFICULTY_ORDER: Record<Difficulty, number> = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3
    };

    const stackKeys: Exclude<TechStack, 'all'>[] = [
      'html',
      'javascript',
      'python',
      'react',
      'java',
      'node',
      'express',
      'typescript',
      'rest',
      'auth',
      'database',
      'middleware',
      'reactnative',
      'devops'
    ];

    const result: Record<Exclude<TechStack, 'all'>, { topic: string; questions: Question[] }[]> = {
      html: [],
      javascript: [],
      python: [],
      react: [],
      java: [],
      node: [],
      express: [],
      typescript: [],
      rest: [],
      auth: [],
      database: [],
      middleware: [],
      reactnative: [],
      devops: []
    };

    const numberMap = new Map<string, number>();
    let counter = 1;

    stackKeys.forEach((stackKey) => {
      const questionsInStack = filteredQuestions.filter((q) => q.stack === stackKey);
      if (questionsInStack.length === 0) return;

      // Group by topic preserving the natural curriculum order
      const topicMap = new Map<string, Question[]>();
      questionsInStack.forEach((q) => {
        if (!topicMap.has(q.topic)) {
          topicMap.set(q.topic, []);
        }
        topicMap.get(q.topic)!.push(q);
      });

      const topicGroups = Array.from(topicMap.entries()).map(([topic, questions]) => ({
        topic,
        questions
      }));

      // Assign sequential question numbers
      topicGroups.forEach((group) => {
        group.questions.forEach((q) => {
          numberMap.set(q.id, counter++);
        });
      });

      result[stackKey] = topicGroups;
    });

    return { groupedByStackAndTopic: result, questionNumberMap: numberMap };
  }, [filteredQuestions]);

  // Scrollspy observer for active topic and questions
  useEffect(() => {
    if (viewMode !== 'questions') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNavId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -70% 0px' }
    );

    const questionElements = document.querySelectorAll('[id^="question-card-"]');
    questionElements.forEach((el) => observer.observe(el));

    const topicElements = document.querySelectorAll('[id^="topic-section-"]');
    topicElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [viewMode, filteredQuestions, groupedByStackAndTopic]);

  const handleSelectQuestion = (questionId: string) => {
    setOpenCardIds((prev) => new Set(prev).add(questionId));
    setActiveNavId(`question-card-${questionId}`);
    const el = document.getElementById(`question-card-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-sky-400');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-sky-400');
      }, 1600);
    }
  };

  const handleSelectTopic = (topicSlug: string) => {
    setActiveNavId(`topic-section-${topicSlug}`);
    const el = document.getElementById(`topic-section-${topicSlug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-5">
          <div className="flex gap-6 xl:gap-8 items-start">
            {/* Left Side Navigation Bar (Topics & Submenu Questions) */}
            {isSidebarVisible ? (
              <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-16 transition-all duration-300">
                <RightTopicNavbar
                  groupedByStackAndTopic={groupedByStackAndTopic}
                  questionNumberMap={questionNumberMap}
                  completedIds={completedIds}
                  activeId={activeNavId}
                  onSelectQuestion={handleSelectQuestion}
                  onSelectTopic={handleSelectTopic}
                  onToggleHide={() => setIsSidebarVisible(false)}
                />
              </aside>
            ) : null}

            {/* Questions Column */}
            <div className="flex-1 min-w-0 space-y-4 animate-fade-up">
              {!isSidebarVisible && (
                <div className="hidden lg:flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setIsSidebarVisible(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sky-400 hover:text-white hover:border-sky-500/50 hover:bg-slate-800/90 transition-all text-xs font-semibold shadow-sm"
                    title="Show Topics sidebar"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                    <span>Show Topics &amp; Questions</span>
                  </button>
                </div>
              )}

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
                <div className="space-y-8">
                  {(['html', 'javascript', 'python', 'react', 'java', 'node', 'express', 'typescript', 'rest', 'auth', 'database', 'middleware', 'reactnative', 'devops'] as const).map((stackKey) => {
                    const topicGroups = groupedByStackAndTopic[stackKey];
                    if (!topicGroups || topicGroups.length === 0) return null;

                    const totalQuestionsInStack = topicGroups.reduce((acc, t) => acc + t.questions.length, 0);
                    const cfg = STACK_CONFIG[stackKey];
                    const stackCompletedCount = topicGroups
                      .flatMap((t) => t.questions)
                      .filter((q) => completedIds.includes(q.id)).length;

                    return (
                      <section key={stackKey} id={`section-${stackKey}`} className="space-y-4">
                        {/* Section Stack Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{cfg.icon}</span>
                            <h2 className={`text-base sm:text-lg font-bold ${cfg.color}`}>
                              {cfg.label}
                            </h2>
                            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {totalQuestionsInStack} Questions
                            </span>
                          </div>

                          <div className="text-xs font-mono text-slate-400">
                            {stackCompletedCount}/{totalQuestionsInStack} completed
                          </div>
                        </div>

                        {/* Topic-Wise Groups */}
                        <div className="space-y-5">
                          {topicGroups.map((group) => {
                            const topicSlug = group.topic.toLowerCase().replace(/[^a-z0-9]/g, '-');
                            return (
                              <div
                                key={group.topic}
                                id={`topic-section-${topicSlug}`}
                                className="bg-slate-900/40 p-3.5 sm:p-4 rounded-xl border border-slate-800/80 space-y-3 scroll-mt-20 transition-colors"
                              >
                                {/* Topic Title Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                                    <h3 className="text-sm sm:text-base font-semibold text-slate-100 tracking-tight">
                                      {group.topic}
                                    </h3>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                                      {group.questions.length} {group.questions.length === 1 ? 'Question' : 'Questions'}
                                    </span>
                                  </div>

                                  {/* Difficulty breakdown pills for this topic */}
                                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
                                      const count = group.questions.filter((q) => q.difficulty === diff).length;
                                      if (count === 0) return null;
                                      const style =
                                        diff === 'Beginner'
                                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 font-medium'
                                          : diff === 'Intermediate'
                                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/25 font-medium'
                                          : 'text-rose-400 bg-rose-500/10 border-rose-500/25 font-medium';
                                      return (
                                        <span key={diff} className={`px-2 py-0.5 rounded border ${style}`}>
                                          {count} {diff}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Question Cards in this topic */}
                                <div className="space-y-2.5">
                                  {group.questions.map((q) => (
                                    <QuestionCard
                                      key={q.id}
                                      question={q}
                                      questionNumber={questionNumberMap.get(q.id)}
                                      isCompleted={completedIds.includes(q.id)}
                                      isBookmarked={bookmarkedIds.includes(q.id)}
                                      isOpen={openCardIds.has(q.id)}
                                      onToggleOpen={() => handleToggleCardOpen(q.id)}
                                      onToggleComplete={() => handleToggleComplete(q.id)}
                                      onToggleBookmark={() => handleToggleBookmark(q.id)}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-slate-300">Interview Master</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Created by</span>
            <a
              href="https://www.iamhimanshu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 font-medium underline underline-offset-2 transition-colors"
            >
              Himanshu
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
