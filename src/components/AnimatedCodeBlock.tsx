import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CodeExample } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Copy, 
  CheckCheck, 
  Terminal,
  Activity
} from 'lucide-react';
import { highlightToVsCodeLines } from '../lib/highlightVsCode';

interface AnimatedCodeBlockProps {
  codeExample: CodeExample;
}

export const AnimatedCodeBlock: React.FC<AnimatedCodeBlockProps> = ({ codeExample }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);

  const steps = codeExample.executionSteps || [];
  const highlightedLines = useMemo(() => {
    return highlightToVsCodeLines(codeExample.code, codeExample.language);
  }, [codeExample.code, codeExample.language]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeLineNumber = activeStepIndex >= 0 && steps[activeStepIndex] 
    ? steps[activeStepIndex].line 
    : null;

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const delay = (2000 / playbackSpeed);
      timerRef.current = setTimeout(() => {
        setActiveStepIndex((prev) => {
          if (prev + 1 >= steps.length) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, activeStepIndex, steps.length, playbackSpeed]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (steps.length === 0) return;
    if (activeStepIndex === -1) {
      setActiveStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setActiveStepIndex((prev) => (prev + 1) % steps.length);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
    setActiveStepIndex(-1);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(codeExample.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="vscode-editor rounded-xl border border-[#2d2d2d] bg-[#1e1e1e] overflow-hidden shadow-xl transition-all">
      {/* Code Header in VS Code style */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#252526] border-b border-[#2d2d2d] text-xs">
        <div className="flex items-center gap-2.5 font-mono">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 pr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>

          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-t border-t-2 border-[#007acc] bg-[#1e1e1e] text-slate-200 text-xs">
            {isPlaying && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            <span>{codeExample.filename || `snippet.${codeExample.language}`}</span>
          </div>

          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#333333] text-sky-400 border border-[#444444]">
            {codeExample.language}
          </span>
        </div>

        {/* Animation & Copy Controls */}
        <div className="flex items-center gap-1.5">
          {steps.length > 0 && (
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-0.5 text-xs">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleTogglePlay}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-sky-500/15 text-sky-300 hover:bg-sky-500/25'
                }`}
                title={isPlaying ? 'Pause simulation' : 'Simulate step-by-step execution'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? 'Pause' : 'Simulate'}</span>
              </motion.button>

              <button
                type="button"
                onClick={handleStepForward}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                title="Next step"
              >
                <StepForward className="w-3 h-3" />
              </button>

              {activeStepIndex >= 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
                }}
                className="px-1 text-[10px] font-mono text-slate-400 hover:text-slate-200"
                title="Playback speed"
              >
                {playbackSpeed}x
              </button>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Dynamic Step Progress Line */}
      {steps.length > 0 && activeStepIndex >= 0 && (
        <div className="h-0.5 bg-slate-900 overflow-hidden">
          <motion.div
            className="h-full bg-sky-400"
            initial={{ width: '0%' }}
            animate={{ width: `${((activeStepIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}

      {/* Step Explanation Callout with Animation */}
      <AnimatePresence mode="wait">
        {activeStepIndex >= 0 && steps[activeStepIndex] && (
          <motion.div
            key={activeStepIndex}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="bg-sky-950/40 border-b border-sky-500/20 px-3.5 py-2 text-xs text-sky-200 flex items-baseline gap-2"
          >
            <span className="font-mono text-[11px] font-bold text-sky-400 shrink-0 flex items-center gap-1">
              <Activity className="w-3 h-3 text-sky-400 animate-spin" style={{ animationDuration: '4s' }} />
              Step {activeStepIndex + 1}/{steps.length} (Line {steps[activeStepIndex].line}):
            </span>
            <span className="text-slate-200">{steps[activeStepIndex].explanation}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Viewer Area with VS Code Dark+ styling */}
      <div 
        className="overflow-x-auto p-3 text-[12.5px] font-mono scrollbar-thin leading-[1.65]"
        style={{ backgroundColor: '#1e1e1e' }}
      >
        <table className="w-full border-collapse">
          <tbody>
            {highlightedLines.map((line) => {
              const lineNum = line.lineNumber;
              const isHighlighted = activeLineNumber === lineNum;

              return (
                <tr
                  key={lineNum}
                  className={`transition-all duration-150 ${
                    isHighlighted 
                      ? 'bg-[#007acc]/20 shadow-[inset_3px_0_0_0_#007acc]' 
                      : 'hover:bg-[#282828]/60'
                  }`}
                >
                  <td className={`w-9 select-none pr-3 text-right text-[11px] font-mono border-r border-[#2d2d2d] transition-colors ${
                    isHighlighted ? 'text-white font-bold' : 'text-[#6e7681]'
                  }`}>
                    {lineNum}
                  </td>
                  <td 
                    className={`pl-3.5 whitespace-pre font-mono ${
                      isHighlighted ? 'text-white font-medium' : 'text-[#d4d4d4]'
                    }`}
                    dangerouslySetInnerHTML={{ __html: line.html || '&nbsp;' }}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Console Output Box with transition */}
      {(codeExample.output || (activeStepIndex >= 0 && steps[activeStepIndex]?.output)) && (
        <div className="border-t border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mb-1">
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Output:</span>
          </div>
          <motion.pre 
            key={steps[activeStepIndex]?.output || codeExample.output}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto"
          >
            <code>{steps[activeStepIndex]?.output || codeExample.output}</code>
          </motion.pre>
        </div>
      )}
    </div>
  );
};
