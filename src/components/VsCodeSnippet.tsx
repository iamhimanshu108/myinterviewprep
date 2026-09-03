import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  WrapText, 
  Terminal, 
  FileCode, 
  Sparkles,
  GitBranch,
  CheckCheck
} from 'lucide-react';
import { highlightToVsCodeLines } from '../lib/highlightVsCode';

interface VsCodeSnippetProps {
  code: string;
  language: string;
  filename?: string;
  activeLineNumber?: number | null;
  maxHeight?: string;
  showLineNumbers?: boolean;
  showStatusBar?: boolean;
  showMacDots?: boolean;
  className?: string;
  initialWrap?: boolean;
  highlightedLines?: number[];
  onCopySuccess?: () => void;
}

export const VsCodeSnippet: React.FC<VsCodeSnippetProps> = ({
  code,
  language,
  filename,
  activeLineNumber = null,
  maxHeight,
  showLineNumbers = true,
  showStatusBar = true,
  showMacDots = true,
  className = '',
  initialWrap = false,
  highlightedLines = [],
  onCopySuccess
}) => {
  const [copied, setCopied] = useState(false);
  const [isWrap, setIsWrap] = useState(initialWrap);

  const lines = useMemo(() => {
    return highlightToVsCodeLines(code, language);
  }, [code, language]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Derive display filename and icon
  const langKey = (language || 'typescript').toLowerCase();
  const defaultFilename = useMemo(() => {
    if (filename) return filename;
    if (langKey.includes('java')) return 'ProductController.java';
    if (langKey.includes('py') || langKey.includes('fastapi')) return 'routes.py';
    if (langKey.includes('ts') || langKey.includes('express')) return 'controller.ts';
    if (langKey.includes('js') || langKey.includes('node')) return 'server.js';
    if (langKey.includes('react') || langKey.includes('tsx')) return 'Component.tsx';
    if (langKey.includes('sql')) return 'query.sql';
    if (langKey.includes('json')) return 'data.json';
    return `snippet.${language}`;
  }, [filename, langKey, language]);

  const langBadge = useMemo(() => {
    if (langKey.includes('java')) return { name: 'Java', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
    if (langKey.includes('py') || langKey.includes('fastapi')) return { name: 'Python', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    if (langKey.includes('ts') || langKey.includes('express')) return { name: 'TypeScript', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    if (langKey.includes('react') || langKey.includes('tsx')) return { name: 'TSX', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    if (langKey.includes('sql')) return { name: 'SQL', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    return { name: language.toUpperCase(), color: 'bg-slate-700/50 text-slate-300 border-slate-600/40' };
  }, [langKey, language]);

  return (
    <div 
      className={`vscode-editor rounded-xl border border-[#2d2d2d] overflow-hidden shadow-2xl transition-all ${className}`}
      style={{ backgroundColor: '#1e1e1e' }}
    >
      {/* ── VS CODE WINDOW & TAB HEADER BAR ── */}
      <div 
        className="flex items-center justify-between border-b border-[#2d2d2d] px-3 py-1.5 select-none"
        style={{ backgroundColor: '#252526' }}
      >
        <div className="flex items-center gap-3">
          {/* macOS / VS Code Window Control Buttons */}
          {showMacDots && (
            <div className="flex items-center gap-1.5 pr-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] inline-block shadow-sm" />
            </div>
          )}

          {/* Active File Tab in VS Code style */}
          <div 
            className="flex items-center gap-2 px-3 py-1 text-xs font-mono rounded-t border-t-2 border-[#007acc] text-[#e0e0e0] shadow-inner"
            style={{ backgroundColor: '#1e1e1e' }}
          >
            <span className={`text-[10px] font-bold px-1 py-0.5 rounded border ${langBadge.color}`}>
              {langBadge.name}
            </span>
            <span className="text-slate-200 font-medium tracking-wide">
              {defaultFilename}
            </span>
          </div>
        </div>

        {/* Editor Actions Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsWrap(!isWrap)}
            title={isWrap ? 'Disable wrap' : 'Enable word wrap'}
            className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 font-mono ${
              isWrap 
                ? 'bg-[#007acc]/20 text-[#38bdf8] border border-[#007acc]/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#333333]'
            }`}
          >
            <WrapText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{isWrap ? 'Wrap On' : 'Wrap'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy code to clipboard"
            className="px-2.5 py-1 rounded bg-[#2d2d2d] hover:bg-[#383838] text-slate-300 hover:text-white border border-[#404040] text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── CODE EDITOR BODY & GUTTER ── */}
      <div 
        className="overflow-x-auto text-[13px] leading-[1.65] font-mono scrollbar-thin scrollbar-thumb-slate-700"
        style={{ 
          backgroundColor: '#1e1e1e',
          maxHeight: maxHeight || 'none'
        }}
      >
        <div className="min-w-full py-2.5">
          {lines.map((line) => {
            const isStepActive = activeLineNumber === line.lineNumber;
            const isCustomHighlighted = highlightedLines.includes(line.lineNumber);
            const isLineActive = isStepActive || isCustomHighlighted;

            return (
              <div
                key={line.lineNumber}
                className={`group flex items-start transition-colors duration-100 ${
                  isStepActive 
                    ? 'bg-[#007acc]/20 shadow-[inset_3px_0_0_0_#007acc]' 
                    : isCustomHighlighted
                    ? 'bg-[#ffd700]/10 shadow-[inset_3px_0_0_0_#ffd700]'
                    : 'hover:bg-[#282828]/60'
                }`}
              >
                {/* Line Number Gutter */}
                {showLineNumbers && (
                  <div
                    className={`w-12 select-none pr-3 text-right text-[11.5px] font-mono shrink-0 transition-colors ${
                      isLineActive 
                        ? 'text-white font-bold' 
                        : 'text-[#6e7681] group-hover:text-[#a0a0a0]'
                    }`}
                  >
                    {line.lineNumber}
                  </div>
                )}

                {/* Highlighted Code Line */}
                <div
                  className={`flex-1 pr-4 pl-3 font-mono ${
                    isWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
                  } ${isLineActive ? 'text-white' : 'text-[#d4d4d4]'}`}
                  dangerouslySetInnerHTML={{
                    __html: line.html || '&nbsp;'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AUTHENTIC VS CODE STATUS BAR ── */}
      {showStatusBar && (
        <div 
          className="flex items-center justify-between px-3 py-1 text-[11px] font-mono select-none border-t border-[#2d2d2d] text-slate-400"
          style={{ backgroundColor: '#181818' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 hover:text-slate-200 cursor-default">
              <GitBranch className="w-3 h-3 text-[#007acc]" />
              <span>main*</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">0 Errors</span>
              <span className="text-amber-400">0 Warnings</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="hidden sm:inline">Ln {lines.length}, Col 1</span>
            <span className="hidden sm:inline">Spaces: 2</span>
            <span>UTF-8</span>
            <span>LF</span>
            <span className="font-semibold text-slate-300">{langBadge.name}</span>
            <div className="flex items-center gap-1 text-emerald-400" title="Prettier Formatted">
              <Check className="w-3 h-3" />
              <span className="text-[10px]">Prettier</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
