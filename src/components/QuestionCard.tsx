import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { AnimatedCodeBlock } from './AnimatedCodeBlock';
import { 
  Check, 
  Bookmark, 
  ChevronDown, 
  Lightbulb, 
  FileText, 
  CheckCircle2,
  Code
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber?: number;
  isCompleted: boolean;
  isBookmarked: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleComplete: () => void;
  onToggleBookmark: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  isCompleted,
  isBookmarked,
  isOpen,
  onToggleOpen,
  onToggleComplete,
  onToggleBookmark
}) => {

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      id={`question-card-${question.id}`}
      className={`rounded-xl border transition-all overflow-hidden ${
        isCompleted
          ? 'bg-slate-900/90 border-emerald-500/30'
          : isOpen
          ? 'bg-slate-900/95 border-sky-500/30 shadow-lg shadow-sky-500/5'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Question Header */}
      <div
        onClick={onToggleOpen}
        className="p-4 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer select-none"
      >
        <div className="flex items-start gap-3 flex-1">
          {/* Checkbox button with tap scale feedback */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            id={`check-btn-${question.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-all shrink-0 border ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-105'
                : 'bg-slate-950 border-slate-700 text-transparent hover:border-slate-500'
            }`}
            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.button>

          <div className="flex-1 min-w-0">
            {/* Question Title */}
            <h3
              className={`text-sm sm:text-base font-medium leading-snug transition-colors ${
                isCompleted
                  ? 'text-slate-400'
                  : 'text-slate-100'
              }`}
            >
              {questionNumber !== undefined && (
                <span className="font-mono text-sky-400 font-bold mr-2">Q{questionNumber}.</span>
              )}
              {question.title}
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            id={`bookmark-btn-${question.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-amber-400 bg-amber-400/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </motion.button>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`p-1.5 ${isOpen ? 'text-sky-400' : 'text-slate-400'}`}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-800 space-y-4 text-xs sm:text-sm text-slate-300 bg-slate-950/40">
              {/* Summary */}
              <div className="p-3 rounded-lg bg-sky-950/20 border-l-2 border-sky-500 text-slate-200 leading-relaxed">
                <span className="font-semibold text-sky-400 mr-1.5">Summary:</span>
                {question.summary}
              </div>

              {/* Explanation */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Explanation</span>
                </h4>
                <div className="space-y-2 text-slate-300 pl-3 border-l border-slate-800">
                  {question.explanation.map((para, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Code Block */}
              {question.codeExample && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-sky-400" />
                    <span>Code Example</span>
                  </h4>
                  <AnimatedCodeBlock codeExample={question.codeExample} />
                </div>
              )}

              {/* Key Takeaways */}
              {question.keyPoints && question.keyPoints.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Key Points</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {question.keyPoints.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 bg-slate-900 border border-slate-800 p-2 rounded-lg text-slate-300"
                      >
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interview Tip */}
              {question.interviewTip && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-400 mr-1.5">Tip:</span>
                    <span>{question.interviewTip}</span>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
