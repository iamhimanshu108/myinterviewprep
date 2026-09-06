import React from 'react';
import { Binary, Type, Shield, FileCode2, Zap, LayoutTemplate } from 'lucide-react';

export const TypescriptCohortNotesViewer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6 pb-20 font-sans text-slate-300">
      
      {/* Header */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Binary className="w-48 h-48 text-blue-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Binary className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">TypeScript Fundamentals</h1>
              <p className="text-sm font-mono text-blue-400">Static typing for JavaScript at scale</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static types, 
            interfaces, generics, and powerful tooling (like autocomplete and refactoring) to help catch errors at compile time rather than runtime.
          </p>
        </div>
      </div>

      {/* Core Concepts */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Type System & Safety
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Static Typing vs Dynamic</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              JavaScript is dynamic—types are checked at runtime. TypeScript checks types at compile time (`tsc`), 
              catching typos, missing arguments, and undefined properties before the code even runs.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-emerald-400">// TS catches this immediately</span><br/>
              <span className="text-blue-400">let</span> name<span className="text-slate-400">: string = </span><span className="text-amber-300">"Alice"</span>;<br/>
              <span className="text-rose-400 line-through">name = 42;</span> <span className="text-slate-500">// Error!</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Type Inference</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              TypeScript is smart enough to guess your types most of the time without you explicitly writing them. 
              This is called Type Inference, and it keeps code clean.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
              <span className="text-blue-400">const</span> age = <span className="text-purple-400">25</span>;<br/>
              <span className="text-slate-500">// TS knows 'age' is a number!</span><br/>
              <span className="text-rose-400 line-through">age.toUpperCase();</span> <span className="text-slate-500">// Error!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface vs Type */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Type className="w-5 h-5 text-amber-400" />
          Interfaces vs Types
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800">
            <p className="text-sm text-slate-400">
              Both `interface` and `type` can describe the shape of an object. However, they have different use cases and capabilities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-5">
              <h3 className="font-semibold text-amber-400 mb-2 flex items-center gap-1.5 text-sm">
                <LayoutTemplate className="w-4 h-4" /> Interfaces
              </h3>
              <ul className="space-y-2 text-sm text-slate-300 list-disc pl-4 marker:text-slate-600">
                <li>Best for defining object shapes (OOP style).</li>
                <li>Supports <b>Declaration Merging</b> (re-declaring an interface merges them).</li>
                <li>Used heavily in public APIs and library definitions.</li>
              </ul>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-sky-400 mb-2 flex items-center gap-1.5 text-sm">
                <FileCode2 className="w-4 h-4" /> Type Aliases
              </h3>
              <ul className="space-y-2 text-sm text-slate-300 list-disc pl-4 marker:text-slate-600">
                <li>Can define unions (`A | B`), intersections (`A & B`), and primitives.</li>
                <li>Cannot be merged; trying to re-declare throws an error.</li>
                <li>Best for complex functional type transformations and mapped types.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          Advanced Superpowers
        </h2>
        
        <div className="space-y-3">
          {/* Generics */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Generics (&lt;T&gt;)</h3>
            <p className="text-sm text-slate-400 mb-3">Generics allow you to write reusable code that works with a variety of types rather than a single one, acting like variables for types.</p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs overflow-x-auto">
              <span className="text-emerald-400">// Function that returns whatever type you give it</span><br/>
              <span className="text-blue-400">function</span> identity&lt;<span className="text-purple-400">T</span>&gt;(arg: <span className="text-purple-400">T</span>): <span className="text-purple-400">T</span> {'{'}<br/>
              &nbsp;&nbsp;<span className="text-blue-400">return</span> arg;<br/>
              {'}'}<br/>
              <span className="text-blue-400">const</span> num = identity&lt;<span className="text-purple-400">number</span>&gt;(<span className="text-amber-400">42</span>);
            </div>
          </div>

          {/* Utility Types */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Utility Types</h3>
            <p className="text-sm text-slate-400 mb-2">TypeScript provides built-in transformations for your types.</p>
            <ul className="text-sm text-slate-400 space-y-1 list-disc pl-4 marker:text-slate-600">
              <li><code className="text-sky-300 bg-slate-800 px-1 rounded">Partial&lt;T&gt;</code> - Makes all properties optional.</li>
              <li><code className="text-sky-300 bg-slate-800 px-1 rounded">Pick&lt;T, Keys&gt;</code> - Creates a new type picking only specific keys.</li>
              <li><code className="text-sky-300 bg-slate-800 px-1 rounded">Omit&lt;T, Keys&gt;</code> - Creates a new type excluding specific keys.</li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  );
};
