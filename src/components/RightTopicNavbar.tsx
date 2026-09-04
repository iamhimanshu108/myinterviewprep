import React, { useState, useEffect } from 'react';
import { TechStack, Question, Difficulty } from '../types';
import { STACK_CONFIG } from './Header';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Compass, 
  ListTree, 
  ArrowUp,
  ChevronsUpDown,
  BookOpen,
  PanelLeftClose,
  Eye,
  EyeOff
} from 'lucide-react';

interface TopicGroup {
  topic: string;
  questions: Question[];
}

interface RightTopicNavbarProps {
  groupedByStackAndTopic: Record<Exclude<TechStack, 'all'>, TopicGroup[]>;
  questionNumberMap: Map<string, number>;
  completedIds: string[];
  activeId: string | null;
  onSelectQuestion: (questionId: string) => void;
  onSelectTopic: (topicSlug: string) => void;
  onToggleHide?: () => void;
}

const DIFFICULTY_DOT: Record<Difficulty, string> = {
  Beginner: 'bg-emerald-400',
  Intermediate: 'bg-amber-400',
  Advanced: 'bg-rose-400'
};

export const RightTopicNavbar: React.FC<RightTopicNavbarProps> = ({
  groupedByStackAndTopic,
  questionNumberMap,
  completedIds,
  activeId,
  onSelectQuestion,
  onSelectTopic,
  onToggleHide
}) => {
  // Track collapsed topics (set of topic strings)
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());

  // Flatten all questions for stats
  const allTopicGroups: TopicGroup[] = (Object.values(groupedByStackAndTopic) as TopicGroup[][]).flat();
  const allQuestions = allTopicGroups.flatMap((tg) => tg.questions);
  const totalQuestions = allQuestions.length;
  const completedCount = allQuestions.filter((q) => completedIds.includes(q.id)).length;
  const progressPercent = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  const toggleTopicCollapse = (topicName: string) => {
    setCollapsedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicName)) {
        next.delete(topicName);
      } else {
        next.add(topicName);
      }
      return next;
    });
  };

  const handleToggleAllSubmenus = () => {
    if (collapsedTopics.size > 0) {
      // Expand all
      setCollapsedTopics(new Set());
    } else {
      // Collapse all
      setCollapsedTopics(new Set(allTopicGroups.map((g) => g.topic)));
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalQuestions === 0) return null;

  return (
    <nav 
      aria-label="Topics and Questions Navigation"
      className="bg-slate-900/75 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-3.5 select-none font-sans"
    >
      {/* Navbar Header */}
      <div className="pb-3 border-b border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <ListTree className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 tracking-tight block">
                Topics &amp; Questions
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {allTopicGroups.length} Topics • {totalQuestions} Questions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleAllSubmenus}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title={collapsedTopics.size > 0 ? "Show all question submenus" : "Hide all question submenus"}
            >
              {collapsedTopics.size > 0 ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>

            {onToggleHide && (
              <button
                onClick={onToggleHide}
                className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                title="Hide sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Progress: {completedCount}/{totalQuestions}</span>
            <span className="text-emerald-400 font-semibold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics & Questions List */}
      <div className="space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 scrollbar-thin">
        {(Object.keys(groupedByStackAndTopic) as (keyof typeof groupedByStackAndTopic)[]).map((stackKey) => {
          const topicGroups = groupedByStackAndTopic[stackKey];
          if (!topicGroups || topicGroups.length === 0) return null;

          const stackCfg = STACK_CONFIG[stackKey];

          return (
            <div key={stackKey} className="space-y-2">
              {/* Stack Header Badge */}
              <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-slate-300">
                <span>{stackCfg.icon}</span>
                <span className={stackCfg.color}>{stackCfg.label}</span>
              </div>

              {/* Topics under this stack */}
              <div className="space-y-2 pl-1 border-l border-slate-800/80 ml-1.5">
                {topicGroups.map((group) => {
                  const topicSlug = group.topic.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  const isCollapsed = collapsedTopics.has(group.topic);
                  const isTopicActive = activeId === `topic-${topicSlug}`;
                  const topicCompletedCount = group.questions.filter((q) => completedIds.includes(q.id)).length;

                  return (
                    <div key={group.topic} className="space-y-1">
                      {/* Topic Item Button */}
                      <div 
                        className={`group flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                          isTopicActive
                            ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                        onClick={() => onSelectTopic(topicSlug)}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                          <span className="truncate text-[11.5px] leading-tight font-medium" title={group.topic}>
                            {group.topic}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                            {topicCompletedCount}/{group.questions.length}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTopicCollapse(group.topic);
                            }}
                            className="p-0.5 text-slate-400 hover:text-slate-200"
                          >
                            {isCollapsed ? (
                              <ChevronRight className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Submenu: Questions under this topic */}
                      {!isCollapsed && (
                        <div className="space-y-0.5 pl-3 border-l border-slate-800/60 ml-2.5 my-1">
                          {group.questions.map((q) => {
                            const qNum = questionNumberMap.get(q.id);
                            const isCompleted = completedIds.includes(q.id);
                            const isQuestionActive = activeId === `question-card-${q.id}`;

                            return (
                              <button
                                key={q.id}
                                onClick={() => onSelectQuestion(q.id)}
                                className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left text-[11px] transition-all ${
                                  isQuestionActive
                                    ? 'bg-sky-500/20 text-sky-200 font-semibold border-l-2 border-sky-400 pl-1.5'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                }`}
                                title={q.title}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                ) : (
                                  <span 
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${DIFFICULTY_DOT[q.difficulty]}`}
                                    title={q.difficulty}
                                  />
                                )}

                                <span className="font-mono text-[10px] text-sky-400/90 shrink-0 font-medium">
                                  Q{qNum}
                                </span>

                                <span className="truncate flex-1">
                                  {q.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Quick Action */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Quick Navigation</span>
        <button
          onClick={handleScrollToTop}
          className="flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors"
        >
          <ArrowUp className="w-3 h-3" />
          <span>Top</span>
        </button>
      </div>
    </nav>
  );
};
