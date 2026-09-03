import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Cpu, 
  Database, 
  Server, 
  ShieldCheck, 
  Globe
} from 'lucide-react';

interface DiagramStep {
  name: string;
  subtitle: string;
  detail: string;
  lit: string[]; // IDs of nodes and arrows that should be highlighted
  activeNode: string;
}

const FLOW_STEPS: DiagramStep[] = [
  {
    name: 'Client Initiates Request',
    subtitle: 'React UI / Fetch API',
    detail: 'The browser client sends an HTTP request with payload and headers (Authorization: Bearer <JWT> or credentials) to the backend API.',
    lit: ['n-client', 'a-client-server'],
    activeNode: 'n-client'
  },
  {
    name: 'Express HTTP Router Ingress',
    subtitle: 'Express.js Request Handler',
    detail: 'Express receives the incoming socket connection on port 3000, parses incoming headers, URL params, and streams body JSON.',
    lit: ['n-server', 'a-server-mw'],
    activeNode: 'n-server'
  },
  {
    name: 'Validation & Auth Middleware',
    subtitle: 'jwt.verify() & Schema Guard',
    detail: 'Auth middleware intercepts the request. It extracts token, verifies cryptographic signature, checks expiration, and mounts req.user.',
    lit: ['n-mw', 'a-mw-loop'],
    activeNode: 'n-mw'
  },
  {
    name: 'Node.js Event Loop & Thread Pool',
    subtitle: 'libuv Asynchronous I/O',
    detail: 'Non-blocking I/O delegates asynchronous operations (database queries, crypto hashing via bcrypt) to libuv worker threads.',
    lit: ['n-loop', 'a-loop-db'],
    activeNode: 'n-loop'
  },
  {
    name: 'Database / Microservice Query',
    subtitle: 'MongoDB / PostgreSQL / Spring',
    detail: 'The data layer processes queries using indexed lookups, transactional guarantees, and returns documents or relational recordsets.',
    lit: ['n-db', 'a-db-resp'],
    activeNode: 'n-db'
  },
  {
    name: 'Serialized Response Handshake',
    subtitle: 'res.status(200).json(...)',
    detail: 'Controller packages the data into typed JSON, attaches security and cache headers, and resolves the HTTP connection back to React.',
    lit: ['n-resp', 'a-resp-client', 'n-client'],
    activeNode: 'n-resp'
  }
];

export const InteractiveFlowDiagram: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const step = FLOW_STEPS[currentStepIndex];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        setCurrentStepIndex((prev) => (prev + 1) % FLOW_STEPS.length);
      }, 2600);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, FLOW_STEPS.length - 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const isLit = (id: string) => step.lit.includes(id);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl mb-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block leading-none">
              Full-Stack Architecture Lifecycle
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Interactive request pipeline & event loop stepper
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-sky-500/15 text-sky-300 hover:bg-sky-500/25'
            }`}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title="Reset to step 1"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <div className="h-3 w-px bg-slate-800 mx-0.5" />

          <span className="text-[11px] font-mono text-slate-400 px-1.5">
            Step <strong className="text-sky-400 font-semibold">{currentStepIndex + 1}</strong> / {FLOW_STEPS.length}
          </span>
        </div>
      </div>

      {/* SVG Architectural Visualizer with animated data flows */}
      <div className="p-4 sm:p-6 bg-slate-950/60 overflow-x-auto">
        <svg
          viewBox="0 0 760 210"
          className="w-full min-w-[680px] select-none"
          role="img"
          aria-label="Interactive Full Stack Lifecycle Diagram"
        >
          <defs>
            <marker id="arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="#475569" />
            </marker>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="#38BDF8" />
            </marker>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Connectors / Arrows with animated flow */}
          <g id="a-client-server" className={isLit('a-client-server') ? 'svg-lit' : 'svg-dim'}>
            <path
              d="M125 65 L 185 65"
              className={isLit('a-client-server') ? 'svg-arrow-live stroke-sky-400' : 'stroke-slate-700'}
              strokeWidth="2"
              fill="none"
              markerEnd={isLit('a-client-server') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />
            <text x="155" y="52" textAnchor="middle" className="fill-slate-400 font-mono text-[9px]">
              HTTP GET/POST
            </text>
          </g>

          <g id="a-server-mw" className={isLit('a-server-mw') ? 'svg-lit' : 'svg-dim'}>
            <path
              d="M305 65 L 345 65"
              className={isLit('a-server-mw') ? 'svg-arrow-live stroke-sky-400' : 'stroke-slate-700'}
              strokeWidth="2"
              fill="none"
              markerEnd={isLit('a-server-mw') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />
            <text x="325" y="52" textAnchor="middle" className="fill-slate-400 font-mono text-[9px]">
              Pipeline
            </text>
          </g>

          <g id="a-mw-loop" className={isLit('a-mw-loop') ? 'svg-lit' : 'svg-dim'}>
            <path
              d="M405 95 L 405 130 L 450 130"
              className={isLit('a-mw-loop') ? 'svg-arrow-live stroke-sky-400' : 'stroke-slate-700'}
              strokeWidth="2"
              fill="none"
              markerEnd={isLit('a-mw-loop') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />
            <text x="390" y="120" textAnchor="end" className="fill-slate-400 font-mono text-[9px]">
              next()
            </text>
          </g>

          <g id="a-loop-db" className={isLit('a-loop-db') ? 'svg-lit' : 'svg-dim'}>
            <path
              d="M575 130 L 615 130"
              className={isLit('a-loop-db') ? 'svg-arrow-live stroke-sky-400' : 'stroke-slate-700'}
              strokeWidth="2"
              fill="none"
              markerEnd={isLit('a-loop-db') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />
            <text x="595" y="118" textAnchor="middle" className="fill-slate-400 font-mono text-[9px]">
              Async I/O
            </text>
          </g>

          <g id="a-db-resp" className={isLit('a-db-resp') ? 'svg-lit' : 'svg-dim'}>
            <path
              d="M675 160 L 675 180 L 250 180 L 250 155"
              className={isLit('a-db-resp') ? 'svg-arrow-live stroke-emerald-400' : 'stroke-slate-700'}
              strokeWidth="2"
              fill="none"
              markerEnd={isLit('a-db-resp') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />
            <text x="460" y="174" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px]">
              Resolved Promise (Microtask)
            </text>
          </g>

          <g id="a-resp-client" className={isLit('a-resp-client') ? 'svg-lit' : 'svg-dim'}>
            <path
              d="M190 130 L 70 130 L 70 95"
              className={isLit('a-resp-client') ? 'svg-arrow-live stroke-sky-400' : 'stroke-slate-700'}
              strokeWidth="2"
              fill="none"
              markerEnd={isLit('a-resp-client') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            />
            <text x="130" y="122" textAnchor="middle" className="fill-sky-400 font-mono text-[9px]">
              200 OK JSON
            </text>
          </g>

          {/* Node 1: Client */}
          <g id="n-client" className={isLit('n-client') ? 'svg-lit' : 'svg-dim'}>
            <rect
              x="15"
              y="35"
              width="110"
              height="60"
              rx="8"
              className={`transition-colors ${
                step.activeNode === 'n-client'
                  ? 'stroke-sky-400 stroke-2 fill-[url(#activeGrad)]'
                  : 'stroke-slate-800 fill-slate-900'
              }`}
            />
            <text x="70" y="60" textAnchor="middle" className="font-semibold text-xs fill-slate-100">
              Client
            </text>
            <text x="70" y="78" textAnchor="middle" className="font-mono text-[10px] fill-slate-400">
              React 19 SPA
            </text>
          </g>

          {/* Node 2: Server */}
          <g id="n-server" className={isLit('n-server') ? 'svg-lit' : 'svg-dim'}>
            <rect
              x="190"
              y="35"
              width="115"
              height="60"
              rx="8"
              className={`transition-colors ${
                step.activeNode === 'n-server'
                  ? 'stroke-sky-400 stroke-2 fill-[url(#activeGrad)]'
                  : 'stroke-slate-800 fill-slate-900'
              }`}
            />
            <text x="247" y="60" textAnchor="middle" className="font-semibold text-xs fill-slate-100">
              API Router
            </text>
            <text x="247" y="78" textAnchor="middle" className="font-mono text-[10px] fill-slate-400">
              Express.js
            </text>
          </g>

          {/* Node 3: Auth & Middleware */}
          <g id="n-mw" className={isLit('n-mw') ? 'svg-lit' : 'svg-dim'}>
            <rect
              x="350"
              y="35"
              width="115"
              height="60"
              rx="8"
              className={`transition-colors ${
                step.activeNode === 'n-mw'
                  ? 'stroke-amber-400 stroke-2 fill-amber-500/10'
                  : 'stroke-slate-800 fill-slate-900'
              }`}
            />
            <text x="407" y="60" textAnchor="middle" className="font-semibold text-xs fill-slate-100">
              Middleware
            </text>
            <text x="407" y="78" textAnchor="middle" className="font-mono text-[10px] fill-amber-400">
              Auth & Validation
            </text>
          </g>

          {/* Node 4: Event Loop */}
          <g id="n-loop" className={isLit('n-loop') ? 'svg-lit' : 'svg-dim'}>
            <rect
              x="455"
              y="100"
              width="120"
              height="60"
              rx="8"
              className={`transition-colors ${
                step.activeNode === 'n-loop'
                  ? 'stroke-emerald-400 stroke-2 fill-emerald-500/10'
                  : 'stroke-slate-800 fill-slate-900'
              }`}
            />
            <text x="515" y="125" textAnchor="middle" className="font-semibold text-xs fill-slate-100">
              Event Loop
            </text>
            <text x="515" y="143" textAnchor="middle" className="font-mono text-[10px] fill-emerald-400">
              libuv Non-blocking
            </text>
          </g>

          {/* Node 5: Database */}
          <g id="n-db" className={isLit('n-db') ? 'svg-lit' : 'svg-dim'}>
            <rect
              x="620"
              y="100"
              width="110"
              height="60"
              rx="8"
              className={`transition-colors ${
                step.activeNode === 'n-db'
                  ? 'stroke-rose-400 stroke-2 fill-rose-500/10'
                  : 'stroke-slate-800 fill-slate-900'
              }`}
            />
            <text x="675" y="125" textAnchor="middle" className="font-semibold text-xs fill-slate-100">
              Database
            </text>
            <text x="675" y="143" textAnchor="middle" className="font-mono text-[10px] fill-rose-400">
              Mongo / SQL / Java
            </text>
          </g>

          {/* Node 6: Controller Response */}
          <g id="n-resp" className={isLit('n-resp') ? 'svg-lit' : 'svg-dim'}>
            <rect
              x="190"
              y="105"
              width="115"
              height="50"
              rx="8"
              className={`transition-colors ${
                step.activeNode === 'n-resp'
                  ? 'stroke-sky-400 stroke-2 fill-[url(#activeGrad)]'
                  : 'stroke-slate-800 fill-slate-900'
              }`}
            />
            <text x="247" y="128" textAnchor="middle" className="font-semibold text-xs fill-slate-100">
              Response Writer
            </text>
            <text x="247" y="143" textAnchor="middle" className="font-mono text-[10px] fill-sky-400">
              res.json()
            </text>
          </g>
        </svg>
      </div>

      {/* Stepper Details Box with AnimatePresence */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-1 flex-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">
                0{currentStepIndex + 1}
              </span>
              <h4 className="text-sm font-semibold text-slate-100">
                {step.name}
              </h4>
              <span className="text-xs text-slate-400">
                ({step.subtitle})
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {step.detail}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Step Forward / Backward Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStepIndex === FLOW_STEPS.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-semibold transition-colors"
          >
            <span>Forward</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
