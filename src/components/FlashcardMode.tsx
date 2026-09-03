import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { STACK_CONFIG } from './Header';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Check, 
  Sparkles,
  Layers,
  Code
} from 'lucide-react';

interface FlashcardModeProps {
  questions: Question[];
  completedIds: string[];
  onToggleComplete: (id: string) => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  questions,
  completedIds,
  onToggleComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  if (questions.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl p-6 animate-fade-up">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-float-pulse" />
        <h3 className="text-sm font-semibold text-slate-200">No questions found</h3>
        <p className="text-xs text-slate-400 mt-1">Try selecting another stack or clearing search filters.</p>
      </div>
    );
  }

  const activeIndex = Math.min(currentIndex, questions.length - 1);
  const q = questions[activeIndex];
  const isDone = completedIds.includes(q.id);
  const stackCfg = STACK_CONFIG[q.stack];

  const handleNext = () => {
    setIsFlipped(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentIndex(randomIndex);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-up">
      {/* Controls Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-300 font-medium">
            Card {activeIndex + 1} of {questions.length}
          </span>
          <div className="w-24 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${((activeIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-shuffle-card"
            onClick={handleShuffle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors active:scale-95"
            title="Shuffle questions"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>

          <span
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
              isDone
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isDone ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>

      {/* 3D Animated Flip Card Container */}
      <div className="perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={q.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -direction * 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative"
          >
            <div
              id="flashcard-interactive-box"
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[350px] sm:min-h-[390px] bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-6 cursor-pointer shadow-xl relative flex flex-col justify-between transition-all select-none group hover:shadow-2xl hover:shadow-sky-500/5"
            >
              {/* Top Card Meta */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${stackCfg.bg} ${stackCfg.color} ${stackCfg.border}`}
                  >
                    {stackCfg.label}
                  </span>

                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60">
                    {q.topic}
                  </span>

                  <span className="text-xs text-slate-500">
                    {q.difficulty}
                  </span>
                </div>

                <motion.div 
                  className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-amber-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
                  <span className="font-medium">{isFlipped ? 'Show Question' : 'Flip to Answer'}</span>
                </motion.div>
              </div>

              {/* Center Content: Animated transition between Question and Answer */}
              <div className="py-6 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
                        <Layers className="w-5 h-5 text-sky-400" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-100 leading-snug max-w-xl mx-auto">
                        {q.title}
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        Click anywhere on the card to reveal the answer
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 text-left overflow-y-auto max-h-[260px] scrollbar-thin pr-1"
                    >
                      <div className="p-3 rounded-lg bg-sky-950/30 border-l-2 border-sky-500 text-slate-200 text-xs sm:text-sm leading-relaxed">
                        <span className="font-semibold text-sky-400 block mb-0.5">Summary:</span>
                        {q.summary}
                      </div>

                      <div className="space-y-1 text-xs text-slate-300 pl-1">
                        {q.explanation.map((item, idx) => (
                          <p key={idx} className="leading-relaxed">
                            • {item}
                          </p>
                        ))}
                      </div>

                      {q.codeExample && (
                        <div className="mt-2 bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-slate-300 overflow-x-auto">
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1 border-b border-slate-800/80 pb-1">
                            <Code className="w-3 h-3 text-sky-400" />
                            <span>{q.codeExample.filename || 'Example Code'}</span>
                          </div>
                          <pre><code>{q.codeExample.code}</code></pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Category: <strong className="text-slate-400 font-normal">{q.topic}</strong></span>
                <span className="font-mono text-[11px] text-amber-400/80">Click card to toggle</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation and Assessment Buttons with scale feedback */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            id="btn-prev-card"
            onClick={handlePrev}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            id="btn-next-card"
            onClick={handleNext}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors shadow-sm"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          id="btn-card-toggle-mastery"
          onClick={() => onToggleComplete(q.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all border shadow-sm ${
            isDone
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400 stroke-[2.5]' : 'text-slate-400'}`} />
          <span>{isDone ? 'Completed' : 'Mark Completed'}</span>
        </motion.button>
      </div>
    </div>
  );
};
