import React, { useState } from 'react';
import { STANDALONE_HTML, STANDALONE_CSS, STANDALONE_JS, StandaloneFile } from '../data/standaloneFiles';
import { 
  FileCode, 
  Copy, 
  CheckCheck, 
  Download, 
  ExternalLink, 
  FolderDown
} from 'lucide-react';
import { VsCodeSnippet } from './VsCodeSnippet';

export const SeparatedFilesViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const filesMap: Record<'html' | 'css' | 'js', StandaloneFile> = {
    html: STANDALONE_HTML,
    css: STANDALONE_CSS,
    js: STANDALONE_JS
  };

  const currentFile = filesMap[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadSingleFile = (file: StandaloneFile) => {
    const mimeTypes: Record<string, string> = {
      html: 'text/html;charset=utf-8',
      css: 'text/css;charset=utf-8',
      javascript: 'application/javascript;charset=utf-8'
    };
    const mime = mimeTypes[file.language] || 'text/plain';
    const blob = new Blob([file.content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    [STANDALONE_HTML, STANDALONE_CSS, STANDALONE_JS].forEach((file, index) => {
      setTimeout(() => {
        downloadSingleFile(file);
      }, index * 150);
    });
  };

  const lineCount = currentFile.content.split('\n').length;

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Standalone Export
            </h2>
            <p className="text-xs text-slate-400">
              Pure HTML5, CSS3, and Vanilla JavaScript with zero dependencies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-download-all"
            onClick={downloadAllFiles}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-medium text-xs transition-colors"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Download All</span>
          </button>

          <a
            id="btn-preview-standalone"
            href="/standalone/index.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span>Live Preview</span>
          </a>
        </div>
      </div>

      {/* Code Inspector Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        {/* Tab Bar */}
        <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-3 py-2 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <button
              id="tab-btn-html"
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'html'
                  ? 'bg-slate-800 text-sky-400 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              index.html
            </button>

            <button
              id="tab-btn-css"
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'css'
                  ? 'bg-slate-800 text-amber-400 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              style.css
            </button>

            <button
              id="tab-btn-js"
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'js'
                  ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              script.js
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
              {lineCount} lines
            </span>

            <button
              id="btn-download-active-file"
              onClick={() => downloadSingleFile(currentFile)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Colorful VS Code Snippet */}
        <VsCodeSnippet
          code={currentFile.content}
          language={currentFile.language}
          filename={currentFile.filename}
          maxHeight="540px"
          showMacDots={false}
          showStatusBar={true}
          showLineNumbers={true}
          className="border-0 rounded-t-none"
        />
      </div>
    </div>
  );
};
