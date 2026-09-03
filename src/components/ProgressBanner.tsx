import React from 'react';
import { motion } from 'motion/react';
import { TechStack, Question } from '../types';
import { STACK_CONFIG } from './Header';
import { CheckCircle2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface ProgressBannerProps {
  questions: Question[];
  completedIds: string[];
  onResetProgress: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  allExpanded: boolean;
}

export const ProgressBanner: React.FC<ProgressBannerProps> = ({
  questions,
  completedIds,
  onResetProgress,
  onExpandAll,
  onCollapseAll,
  allExpanded
}) => {
  const totalQuestions = questions.length;
  const completedCount = questions.filter((q) => completedIds.includes(q.id)).length;
  const percent = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  const stacks: Exclude<TechStack, 'all'>[] = ['react', 'java', 'javascript', 'node', 'express'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-5 shadow-sm">
      {/* Top row: Summary & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-slate-200">
              Completed {completedCount} of {totalQuestions}
            </span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {percent}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <motion.button
            whileTap={{ scale: 0.95 }}
            id="btn-expand-collapse-all"
            onClick={allExpanded ? onCollapseAll : onExpandAll}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {allExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Expand All</span>
              </>
            )}
          </motion.button>

          {completedCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="btn-reset-progress"
              onClick={onResetProgress}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Reset progress"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Progress Bar with smooth animation */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80 mb-3">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Per Stack Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80">
        {stacks.map((st) => {
          const cfg = STACK_CONFIG[st];
          const stackQuestions = questions.filter((q) => q.stack === st);
          const stackCompleted = stackQuestions.filter((q) => completedIds.includes(q.id)).length;
          const stackPct = stackQuestions.length > 0 ? Math.round((stackCompleted / stackQuestions.length) * 100) : 0;

          return (
            <div
              key={st}
              className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 flex flex-col justify-between gap-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">
                  {cfg.label}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {stackCompleted}/{stackQuestions.length}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-sky-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stackPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
