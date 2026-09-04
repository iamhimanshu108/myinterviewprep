import React, { useState, useEffect } from 'react';

export const MiddlewareCohortNotesViewer: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('s01');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'express' | 'fastapi' | 'django' | 'springboot'>('express');

  // Scroll Spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

    const sections = Array.from(document.querySelectorAll('.ref-section-block'));
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setIsSidebarOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyCode = (text: string, key: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1400);
      });
    }
  };

  // Quiz State
  const [quizResults, setQuizResults] = useState<Record<string, { selectedIndex: number; isCorrect: boolean }>>({});
  
  const handleQuizAnswer = (quizId: string, optionIndex: number, isCorrect: boolean) => {
    if (quizResults[quizId]) return;
    setQuizResults(prev => ({
      ...prev,
      [quizId]: { selectedIndex: optionIndex, isCorrect }
    }));
  };

  const renderQuizOption = (quizId: string, optionIndex: number, text: string, isCorrectOption: boolean) => {
    const result = quizResults[quizId];
    const isSelected = result?.selectedIndex === optionIndex;
    let btnCls = "ref-quiz-option";
    
    if (result) {
      if (isCorrectOption) btnCls += " correct";
      else if (isSelected) btnCls += " incorrect cursor-not-allowed opacity-60";
      else btnCls += " cursor-not-allowed opacity-60";
    }

    return (
      <button 
        className={btnCls} 
        disabled={!!result}
        onClick={() => handleQuizAnswer(quizId, optionIndex, isCorrectOption)}
      >
        {text}
      </button>
    );
  };

  return (
    <div className="ref-theme ref-layout-container">
      {/* ── MOBILE SIDEBAR TOGGLE ── */}
      <div className="md:hidden sticky top-0 z-30 p-3 bg-[var(--sidebar-bg)] flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <span className="font-bold uppercase tracking-widest" style={{fontFamily: 'var(--font-ibm)', fontSize: '10px'}}>Curriculum</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="px-3 py-1.5 border rounded text-xs font-semibold"
          style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', backgroundColor: 'transparent' }}
        >
          {isSidebarOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <nav className={`ref-sidebar ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="ref-nav-brand">
          <div className="logo">Middleware<span className="accent-dot">.</span>101</div>
        </div>

        <div className="ref-nav-group-label">Foundations</div>
        <button onClick={() => scrollToSection('s01')} className={`ref-nav-link ${activeSectionId === 's01' ? 'active' : ''}`}><span className="ref-nav-num">1</span> The Concept</button>
        <button onClick={() => scrollToSection('s02')} className={`ref-nav-link ${activeSectionId === 's02' ? 'active' : ''}`}><span className="ref-nav-num">2</span> The Request Cycle</button>
        <button onClick={() => scrollToSection('s03')} className={`ref-nav-link ${activeSectionId === 's03' ? 'active' : ''}`}><span className="ref-nav-num">3</span> Use Cases</button>

        <div className="ref-nav-group-label">Practical</div>
        <button onClick={() => scrollToSection('s04')} className={`ref-nav-link ${activeSectionId === 's04' ? 'active' : ''}`}><span className="ref-nav-num">4</span> Implementation</button>
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Cohort · Backend · Session notes</div>
          <h1>The man in the <em>middle</em></h1>
          <p className="ref-hero-desc">When a request arrives at your server, it doesn't just teleport to your controller. It runs through a gauntlet of functions called middlewares. They are the bouncers, translators, and loggers of your backend.</p>
          <div className="ref-hero-tags">
            <span className="ref-hero-tag">Middleware</span>
            <span className="ref-hero-tag">Interceptors</span>
            <span className="ref-hero-tag">next()</span>
            <span className="ref-hero-tag">Express</span>
          </div>
        </header>

        {/* ══ 01 ══ */}
        <section className="ref-section-block animate-fade-up" id="s01">
          <div className="ref-section-header">
            <div className="ref-section-num-big">01</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The Concept</div>
              <div className="ref-section-subtitle">The Security Guard Analogy</div>
            </div>
          </div>

          <p>Imagine a VIP nightclub. The VIP lounge is your route handler (e.g. <code>/api/users/profile</code>). But before a guest (the HTTP Request) can enter the lounge, they must get past the security guard at the door.</p>

          <p>The security guard is the <strong>middleware</strong>. The guard can do three things:</p>
          <ol>
            <li><strong>Inspect the guest:</strong> Check if they are carrying a valid VIP pass (Auth Token).</li>
            <li><strong>Modify the guest:</strong> Give them a VIP wristband so the bartender inside knows who they are (Attaching user data to the request).</li>
            <li><strong>Reject the guest:</strong> If they don't have a pass, kick them out immediately (Return a 401 Unauthorized response).</li>
          </ol>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Definition</div>
            <p className="ref-concept-box-text">Middleware is simply a function that has access to the Request object, the Response object, and the <code>next()</code> function in the application's request-response cycle.</p>
          </div>
        </section>

        {/* ══ 02 ══ */}
        <section className="ref-section-block animate-fade-up" id="s02">
          <div className="ref-section-header">
            <div className="ref-section-num-big">02</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The Request-Response Cycle</div>
              <div className="ref-section-subtitle">Passing the baton with next()</div>
            </div>
          </div>

          <p>In most modern frameworks (especially Express.js), middleware functions form a chain. When a request arrives, it goes to Middleware #1. Middleware #1 does its job, and then it must either:</p>
          <ul>
            <li>Call <code>next()</code> to pass control to Middleware #2.</li>
            <li>Send a response back to the client (e.g. <code>res.send()</code>), which breaks the chain.</li>
          </ul>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">If a middleware function does not call <code>next()</code> and does not send a response, the request will hang forever, and the client will eventually get a timeout error.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-mw-01">
            <p className="ref-quiz-question">You wrote an auth middleware. It checks the token, realizes it's invalid, and calls next() anyway. What happens?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-mw-01', 0, 'A — The server automatically throws a 401 Unauthorized error.', false)}
              {renderQuizOption('quiz-mw-01', 1, 'B — The request proceeds to the protected route, creating a security vulnerability.', true)}
              {renderQuizOption('quiz-mw-01', 2, 'C — The request hangs until a timeout occurs.', false)}
            </div>
            {quizResults['quiz-mw-01'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-mw-01'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-mw-01'].isCorrect ? '✓ Exactly! If the token is invalid, you must send a response (res.status(401)) and NOT call next().' : '✗ Try again. Remember what next() does.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 03 ══ */}
        <section className="ref-section-block animate-fade-up" id="s03">
          <div className="ref-section-header">
            <div className="ref-section-num-big">03</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Real-World Use Cases</div>
              <div className="ref-section-title">What do we actually use it for?</div>
            </div>
          </div>

          <p>You use middleware every time you build a backend, even if you don't realize it. Here are the most common examples:</p>

          <table className="ref-compare-table">
            <thead>
              <tr><th>Middleware Type</th><th>What it does</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-title">Logging</td>
                <td className="cell-muted">Records details of every incoming request.</td>
                <td className="cell-highlight"><code>Morgan</code>, <code>Winston</code></td>
              </tr>
              <tr>
                <td className="cell-title">Parsing</td>
                <td className="cell-muted">Reads the raw HTTP body and converts it into a usable Object (like JSON).</td>
                <td className="cell-highlight"><code>express.json()</code></td>
              </tr>
              <tr>
                <td className="cell-title">Authentication</td>
                <td className="cell-muted">Extracts the JWT from headers, verifies it, and attaches user info to <code>req</code>.</td>
                <td className="cell-highlight"><code>verifyToken</code></td>
              </tr>
              <tr>
                <td className="cell-title">CORS</td>
                <td className="cell-muted">Adds headers that tell the browser which domains are allowed to call the API.</td>
                <td className="cell-highlight"><code>cors()</code></td>
              </tr>
              <tr>
                <td className="cell-title">Error Handling</td>
                <td className="cell-muted">A special middleware at the end of the chain that catches any crashes.</td>
                <td className="cell-highlight"><code>errorHandler</code></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ══ 04 ══ */}
        <section className="ref-section-block animate-fade-up" id="s04">
          <div className="ref-section-header">
            <div className="ref-section-num-big">04</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Code Snippets</div>
              <div className="ref-section-subtitle">Implementing a Logger Middleware</div>
            </div>
          </div>

          <p>Here is how you write a simple middleware that logs the HTTP method and URL for every incoming request across different frameworks.</p>

          <div className="mt-6">
            <div className="flex gap-2 mb-2">
              <button 
                onClick={() => setActiveLangTab('express')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'express' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >Express.js</button>
              <button 
                onClick={() => setActiveLangTab('fastapi')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'fastapi' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >FastAPI</button>
              <button 
                onClick={() => setActiveLangTab('django')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'django' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >Django</button>
              <button 
                onClick={() => setActiveLangTab('springboot')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'springboot' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >Spring Boot</button>
            </div>

            {activeLangTab === 'express' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">middlewares/logger.js</span>
                  <button onClick={() => handleCopyCode(`const loggerMiddleware = (req, res, next) => {\n  console.log(\`[LOG] \${req.method} \${req.url}\`);\n  // CRITICAL: You must call next() to pass the baton!\n  next();\n};\n\nmodule.exports = loggerMiddleware;`, 'm_ex')} className="ref-code-copy-btn">{copiedKey === 'm_ex' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-command">loggerMiddleware</span> <span className="token-operator">=</span> (<span className="token-val">req</span>, <span className="token-val">res</span>, <span className="token-val">next</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-val">console</span>.<span className="token-command">log</span>(<span className="token-string">`[LOG] ${`{`}<span className="token-val">req</span>.<span className="token-val">method</span>{`}`} ${`{`}<span className="token-val">req</span>.<span className="token-val">url</span>{`}`}`</span>);{"\n"}
{"  "}<span className="token-comment">// CRITICAL: You must call next() to pass the baton!</span>{"\n"}
{"  "}<span className="token-command">next</span>();{"\n"}
{`}`};{"\n"}
{"\n"}
<span className="token-val">module</span>.<span className="token-val">exports</span> <span className="token-operator">=</span> <span className="token-val">loggerMiddleware</span>;</pre>
              </div>
            )}

            {activeLangTab === 'fastapi' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">main.py</span>
                  <button onClick={() => handleCopyCode(`from fastapi import FastAPI, Request\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def logger_middleware(request: Request, call_next):\n    print(f"[LOG] {request.method} {request.url.path}")\n    # Pass the request to the next middleware or route handler\n    response = await call_next(request)\n    return response`, 'm_fa')} className="ref-code-copy-btn">{copiedKey === 'm_fa' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">from</span> <span className="token-val">fastapi</span> <span className="token-yaml-key">import</span> <span className="token-command">FastAPI</span>, <span className="token-val">Request</span>{"\n"}
{"\n"}
<span className="token-val">app</span> <span className="token-operator">=</span> <span className="token-command">FastAPI</span>(){"\n"}
{"\n"}
<span className="token-command">@app.middleware</span>(<span className="token-string">"http"</span>){"\n"}
<span className="token-yaml-key">async</span> <span className="token-yaml-key">def</span> <span className="token-command">logger_middleware</span>(<span className="token-val">request</span>: <span className="token-val">Request</span>, <span className="token-val">call_next</span>):{"\n"}
{"    "}<span className="token-command">print</span>(<span className="token-string">f"[LOG] {`{`}<span className="token-val">request.method</span>{`}`} {`{`}<span className="token-val">request.url.path</span>{`}`}"</span>){"\n"}
{"    "}<span className="token-comment"># Pass the request to the next middleware or route handler</span>{"\n"}
{"    "}<span className="token-val">response</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-command">call_next</span>(<span className="token-val">request</span>){"\n"}
    <span className="token-yaml-key">return</span> <span className="token-val">response</span></pre>
              </div>
            )}

            {activeLangTab === 'django' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">middleware.py</span>
                  <button onClick={() => handleCopyCode(`class LoggerMiddleware:\n    def __init__(self, get_response):\n        self.get_response = get_response\n\n    def __call__(self, request):\n        print(f"[LOG] {request.method} {request.path}")\n        # Pass the request to the next middleware or view\n        response = self.get_response(request)\n        return response`, 'm_dj')} className="ref-code-copy-btn">{copiedKey === 'm_dj' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">class</span> <span className="token-val">LoggerMiddleware</span>:{"\n"}
{"    "}<span className="token-yaml-key">def</span> <span className="token-command">__init__</span>(<span className="token-val">self</span>, <span className="token-val">get_response</span>):{"\n"}
{"        "}<span className="token-val">self.get_response</span> <span className="token-operator">=</span> <span className="token-val">get_response</span>{"\n"}
{"\n"}
{"    "}<span className="token-yaml-key">def</span> <span className="token-command">__call__</span>(<span className="token-val">self</span>, <span className="token-val">request</span>):{"\n"}
{"        "}<span className="token-command">print</span>(<span className="token-string">f"[LOG] {`{`}<span className="token-val">request.method</span>{`}`} {`{`}<span className="token-val">request.path</span>{`}`}"</span>){"\n"}
{"        "}<span className="token-comment"># Pass the request to the next middleware or view</span>{"\n"}
{"        "}<span className="token-val">response</span> <span className="token-operator">=</span> <span className="token-val">self</span>.<span className="token-command">get_response</span>(<span className="token-val">request</span>){"\n"}
        <span className="token-yaml-key">return</span> <span className="token-val">response</span></pre>
              </div>
            )}

            {activeLangTab === 'springboot' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">LoggerInterceptor.java</span>
                  <button onClick={() => handleCopyCode(`import org.springframework.web.servlet.HandlerInterceptor;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\n\npublic class LoggerInterceptor implements HandlerInterceptor {\n    @Override\n    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {\n        System.out.println("[LOG] " + request.getMethod() + " " + request.getRequestURI());\n        // return true allows the request to proceed\n        return true;\n    }\n}`, 'm_sb')} className="ref-code-copy-btn">{copiedKey === 'm_sb' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">import</span> <span className="token-val">org.springframework.web.servlet.HandlerInterceptor</span>;{"\n"}
<span className="token-yaml-key">import</span> <span className="token-val">jakarta.servlet.http.HttpServletRequest</span>;{"\n"}
<span className="token-yaml-key">import</span> <span className="token-val">jakarta.servlet.http.HttpServletResponse</span>;{"\n"}
{"\n"}
<span className="token-yaml-key">public</span> <span className="token-yaml-key">class</span> <span className="token-val">LoggerInterceptor</span> <span className="token-yaml-key">implements</span> <span className="token-val">HandlerInterceptor</span> {`{`}{"\n"}
{"    "}<span className="token-command">@Override</span>{"\n"}
{"    "}<span className="token-yaml-key">public</span> <span className="token-yaml-key">boolean</span> <span className="token-command">preHandle</span>(<span className="token-val">HttpServletRequest</span> <span className="token-val">request</span>, <span className="token-val">HttpServletResponse</span> <span className="token-val">response</span>, <span className="token-val">Object</span> <span className="token-val">handler</span>) {`{`}{"\n"}
{"        "}<span className="token-val">System.out</span>.<span className="token-command">println</span>(<span className="token-string">"[LOG] "</span> <span className="token-operator">+</span> <span className="token-val">request</span>.<span className="token-command">getMethod</span>() <span className="token-operator">+</span> <span className="token-string">" "</span> <span className="token-operator">+</span> <span className="token-val">request</span>.<span className="token-command">getRequestURI</span>());{"\n"}
{"        "}<span className="token-comment">// return true allows the request to proceed</span>{"\n"}
{"        "}<span className="token-yaml-key">return</span> <span className="token-val">true</span>;{"\n"}
{"    "}{`}`}{"\n"}
{`}`}</pre>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};
