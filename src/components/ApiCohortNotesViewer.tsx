import React, { useState, useEffect } from 'react';

export const ApiCohortNotesViewer: React.FC = () => {
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
      <div className="md:hidden sticky top-0 z-30 p-3 bg-[var(--ink)] flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2" style={{ color: 'var(--accent)' }}>
          <span className="font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-ibm)', fontSize: '10px' }}>Curriculum</span>
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
          <div className="logo">REST<span className="accent-dot">.</span>101</div>
        </div>

        <div className="ref-nav-group-label">Foundations</div>
        <button onClick={() => scrollToSection('s01')} className={`ref-nav-link ${activeSectionId === 's01' ? 'active' : ''}`}><span className="ref-nav-num">1</span> The problem</button>
        <button onClick={() => scrollToSection('s02')} className={`ref-nav-link ${activeSectionId === 's02' ? 'active' : ''}`}><span className="ref-nav-num">2</span> What is REST?</button>

        <div className="ref-nav-group-label">Mechanics</div>
        <button onClick={() => scrollToSection('s03')} className={`ref-nav-link ${activeSectionId === 's03' ? 'active' : ''}`}><span className="ref-nav-num">3</span> HTTP Methods</button>
        <button onClick={() => scrollToSection('s04')} className={`ref-nav-link ${activeSectionId === 's04' ? 'active' : ''}`}><span className="ref-nav-num">4</span> Status Codes</button>
        <button onClick={() => scrollToSection('s05')} className={`ref-nav-link ${activeSectionId === 's05' ? 'active' : ''}`}><span className="ref-nav-num">5</span> JSON Payload</button>

        <div className="ref-nav-group-label">Implementation</div>
        <button onClick={() => scrollToSection('s06')} className={`ref-nav-link ${activeSectionId === 's06' ? 'active' : ''}`}><span className="ref-nav-num">6</span> Code snippets</button>
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Cohort · Backend · Session notes</div>
          <h1>Speaking a <em>common language</em></h1>
          <p className="ref-hero-desc">Your database is full of valuable data, but a frontend app cannot reach inside it directly. We need a predictable, universal way for frontends to ask for data and for servers to provide it. Welcome to REST APIs.</p>
          <div className="ref-hero-tags">
            <span className="ref-hero-tag">REST</span>
            <span className="ref-hero-tag">HTTP Methods</span>
            <span className="ref-hero-tag">Status Codes</span>
            <span className="ref-hero-tag">JSON</span>
            <span className="ref-hero-tag">Stateless</span>
          </div>
        </header>

        {/* ══ 01 ══ */}
        <section className="ref-section-block animate-fade-up" id="s01">
          <div className="ref-section-header">
            <div className="ref-section-num-big">01</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The problem — why do we need APIs?</div>
              <div className="ref-section-subtitle">Bridging the gap between a client and a database</div>
            </div>
          </div>

          <p>Imagine going to a restaurant. The kitchen has all the ingredients (the database), but you cannot just walk in and cook your own food. You need someone to take your order to the kitchen and bring the prepared food back to you.</p>

          <p>An API (Application Programming Interface) is that waiter. The client (React, iOS, Postman) gives the API an order (an HTTP Request), and the API returns the food (an HTTP Response, usually JSON data).</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text">Clients and servers run in completely different environments. They might be written in different languages (a Swift iOS app talking to a Python server). An API is the standard language they use to communicate.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-01">
            <p className="ref-quiz-question">Can a React frontend securely execute SQL queries directly against your PostgreSQL database?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-01', 0, 'A — Yes, React has built-in database drivers', false)}
              {renderQuizOption('quiz-01', 1, 'B — No, the database credentials would be exposed. An API acts as a secure middleman.', true)}
            </div>
            {quizResults['quiz-01'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-01'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-01'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 02 ══ */}
        <section className="ref-section-block animate-fade-up" id="s02">
          <div className="ref-section-header">
            <div className="ref-section-num-big">02</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">What is REST?</div>
              <div className="ref-section-subtitle">REpresentational State Transfer — Nouns, not Verbs</div>
            </div>
          </div>

          <p>REST is a set of rules (an architectural style) for building APIs. Before REST, developers would name their endpoints whatever they felt like: <code>/getUsers</code>, <code>/createNewUser</code>, <code>/deleteUserById</code>.</p>

          <p>REST says: <strong>Stop using verbs in the URL</strong>. The URL should only represent the <em>Resource</em> (the noun). The verb comes from the HTTP Method.</p>

          <table className="ref-compare-table">
            <thead>
              <tr><th>Action</th><th>Bad Design (RPC style)</th><th>RESTful Design</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-title">Get all users</td>
                <td className="cell-muted"><code>GET /getAllUsers</code></td>
                <td className="cell-highlight"><code>GET /users</code></td>
              </tr>
              <tr>
                <td className="cell-title">Get user with ID 5</td>
                <td className="cell-muted"><code>GET /getUser?id=5</code></td>
                <td className="cell-highlight"><code>GET /users/5</code></td>
              </tr>
              <tr>
                <td className="cell-title">Create new user</td>
                <td className="cell-muted"><code>POST /createNewUser</code></td>
                <td className="cell-highlight"><code>POST /users</code></td>
              </tr>
              <tr>
                <td className="cell-title">Update user 5</td>
                <td className="cell-muted"><code>POST /updateUser/5</code></td>
                <td className="cell-highlight"><code>PUT /users/5</code></td>
              </tr>
              <tr>
                <td className="cell-title">Delete user 5</td>
                <td className="cell-muted"><code>POST /deleteUser?id=5</code></td>
                <td className="cell-highlight"><code>DELETE /users/5</code></td>
              </tr>
            </tbody>
          </table>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">A URL like <code>POST /users/5/delete</code> violates REST principles because it puts an action ("delete") inside the URL path. Use the HTTP <code>DELETE</code> method instead on <code>/users/5</code>.</p>
          </div>
        </section>

        {/* ══ 03 ══ */}
        <section className="ref-section-block animate-fade-up" id="s03">
          <div className="ref-section-header">
            <div className="ref-section-num-big">03</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">HTTP Methods</div>
              <div className="ref-section-title">The verbs of the web</div>
            </div>
          </div>

          <p>If the URL is the noun, the HTTP Method is the verb. These 5 methods cover 99% of what you will ever do in an API.</p>

          <table className="ref-flag-table">
            <thead>
              <tr><th>Method</th><th>Usage</th><th>Idempotent?</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="ref-flag-name">GET</span></td>
                <td>Read data. Never modifies the database.</td>
                <td><span className="ref-flag-val">Yes</span></td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">POST</span></td>
                <td>Create a brand new resource.</td>
                <td><span className="ref-flag-val" style={{ color: 'var(--accent)' }}>No</span></td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">PUT</span></td>
                <td>Replace an entire resource completely.</td>
                <td><span className="ref-flag-val">Yes</span></td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">PATCH</span></td>
                <td>Partially update a resource (e.g. just change email).</td>
                <td><span className="ref-flag-val" style={{ color: 'var(--accent)' }}>No</span> (usually)</td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">DELETE</span></td>
                <td>Remove a resource.</td>
                <td><span className="ref-flag-val">Yes</span></td>
              </tr>
            </tbody>
          </table>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Idempotency</div>
            <p className="ref-concept-box-text">If a method is <strong>idempotent</strong>, doing it 100 times has the same effect as doing it 1 time. <br /><br />Hitting <code>DELETE /users/5</code> 100 times? User 5 is dead once, doing it again changes nothing. Hitting <code>POST /users</code> 100 times? You just created 100 identical users. POST is not idempotent.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-03">
            <p className="ref-quiz-question">Which method should you use if you only want to update a user's avatar, leaving their name and email intact?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-03', 0, 'A — PUT', false)}
              {renderQuizOption('quiz-03', 1, 'B — PATCH', true)}
              {renderQuizOption('quiz-03', 2, 'C — POST', false)}
            </div>
            {quizResults['quiz-03'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-03'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-03'].isCorrect ? '✓ Correct! PATCH is for partial updates. PUT would replace the entire user object.' : '✗ Not quite. PUT replaces the whole object.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 04 ══ */}
        <section className="ref-section-block animate-fade-up" id="s04">
          <div className="ref-section-header">
            <div className="ref-section-num-big">04</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Status Codes</div>
              <div className="ref-section-subtitle">How the server answers back</div>
            </div>
          </div>

          <p>Every HTTP response comes with a 3-digit number. This tells the client immediately if the request succeeded or failed, before even looking at the JSON payload.</p>

          <table className="ref-flag-table">
            <thead>
              <tr><th>Range</th><th>Meaning</th><th>Common Examples</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="ref-flag-name">2xx</span></td>
                <td><span className="ref-flag-val" style={{ color: 'var(--accent2)' }}>Success</span></td>
                <td><strong>200 OK</strong> (read/update success), <strong>201 Created</strong> (POST success), <strong>204 No Content</strong> (DELETE success)</td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">3xx</span></td>
                <td><span className="ref-flag-val" style={{ color: '#5BA4CF' }}>Redirection</span></td>
                <td><strong>301 Moved Permanently</strong>, <strong>304 Not Modified</strong> (Cached)</td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">4xx</span></td>
                <td><span className="ref-flag-val" style={{ color: '#F4A261' }}>Client Error</span> (You messed up)</td>
                <td><strong>400 Bad Request</strong> (validation failed), <strong>401 Unauthorized</strong> (not logged in), <strong>403 Forbidden</strong>, <strong>404 Not Found</strong></td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">5xx</span></td>
                <td><span className="ref-flag-val" style={{ color: 'var(--accent)' }}>Server Error</span> (We messed up)</td>
                <td><strong>500 Internal Server Error</strong> (code crashed), <strong>502 Bad Gateway</strong></td>
              </tr>
            </tbody>
          </table>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text">Never send an error message with a <code>200 OK</code> status! Browsers, proxies, and frontend libraries like React Query rely heavily on these status codes to know if a request succeeded.</p>
          </div>
        </section>

        {/* ══ 05 ══ */}
        <section className="ref-section-block animate-fade-up" id="s05">
          <div className="ref-section-header">
            <div className="ref-section-num-big">05</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">JSON — The language of REST</div>
            </div>
          </div>

          <p>When the client asks for data, the server needs a way to format it. XML used to be popular (SOAP APIs), but today, <strong>JSON</strong> (JavaScript Object Notation) is the absolute standard for REST APIs.</p>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">Example JSON Response</span>
              <button onClick={() => handleCopyCode(`{\n  "id": 5,\n  "name": "Alex",\n  "isActive": true,\n  "roles": ["admin", "editor"]\n}`, 'c_json')} className="ref-code-copy-btn">{copiedKey === 'c_json' ? 'copied' : 'copy'}</button>
            </div>
            <pre className="ref-code-pre">{"\n"}
{"              "}{`{`}{"\n"}
{"              "}<span className="token-yaml-key">"id"</span>: <span className="token-val">5</span>,{"\n"}
{"              "}<span className="token-yaml-key">"name"</span>: <span className="token-string">"Alex"</span>,{"\n"}
{"              "}<span className="token-yaml-key">"isActive"</span>: <span className="token-val">true</span>,{"\n"}
{"              "}<span className="token-yaml-key">"roles"</span>: [<span className="token-string">"admin"</span>, <span className="token-string">"editor"</span>]{"\n"}
{"              "}{`}`}{"\n"}
            </pre>
          </div>
        </section>

        {/* ══ 06 ══ */}
        <section className="ref-section-block animate-fade-up" id="s06">
          <div className="ref-section-header">
            <div className="ref-section-num-big">06</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Code Snippets</div>
              <div className="ref-section-subtitle">How to implement a basic GET and POST endpoint</div>
            </div>
          </div>

          <p>Here is how you define a RESTful resource in different backend frameworks.</p>

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
                  <span className="ref-code-label">routes/users.js</span>
                  <button onClick={() => handleCopyCode(`const express = require('express');\nconst router = express.Router();\n\n// GET /users\nrouter.get('/', (req, res) => {\n  res.status(200).json([{ id: 1, name: 'Alice' }]);\n});\n\n// POST /users\nrouter.post('/', (req, res) => {\n  const newUser = req.body;\n  res.status(201).json({ message: 'Created', user: newUser });\n});\n\nmodule.exports = router;`, 'c_ex')} className="ref-code-copy-btn">{copiedKey === 'c_ex' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">express</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">'express'</span>);{"\n"}
{"                  "}<span className="token-yaml-key">const</span> <span className="token-val">router</span> <span className="token-operator">=</span> <span className="token-val">express</span>.<span className="token-command">Router</span>();{"\n"}
{"\n"}
{"                  "}<span className="token-comment">// GET /users</span>{"\n"}
{"                  "}<span className="token-val">router</span>.<span className="token-command">get</span>(<span className="token-string">'/'</span>, (<span className="token-val">req</span>, <span className="token-val">res</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"                  "}<span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">200</span>).<span className="token-command">json</span>([{` { `}<span className="token-yaml-key">id</span>: <span className="token-val">1</span>, <span className="token-yaml-key">name</span>: <span className="token-string">'Alice'</span>{` } `}]);{"\n"}
{"                  "}{`}`});{"\n"}
{"\n"}
{"                  "}<span className="token-comment">// POST /users</span>{"\n"}
{"                  "}<span className="token-val">router</span>.<span className="token-command">post</span>(<span className="token-string">'/'</span>, (<span className="token-val">req</span>, <span className="token-val">res</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"                  "}<span className="token-yaml-key">const</span> <span className="token-val">newUser</span> <span className="token-operator">=</span> <span className="token-val">req</span>.<span className="token-val">body</span>;{"\n"}
{"                  "}<span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">201</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">'Created'</span>, <span className="token-yaml-key">user</span>: <span className="token-val">newUser</span>{` } `});{"\n"}
{"                  "}{`}`});{"\n"}
{"\n"}
                  <span className="token-val">module</span>.<span className="token-val">exports</span> <span className="token-operator">=</span> <span className="token-val">router</span>;</pre>
              </div>
            )}

            {activeLangTab === 'fastapi' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">main.py</span>
                  <button onClick={() => handleCopyCode(`from fastapi import FastAPI, status\n\napp = FastAPI()\n\n@app.get("/users", status_code=status.HTTP_200_OK)\ndef get_users():\n    return [{"id": 1, "name": "Alice"}]\n\n@app.post("/users", status_code=status.HTTP_201_CREATED)\ndef create_user(user: dict):\n    return {"message": "Created", "user": user}`, 'c_fa')} className="ref-code-copy-btn">{copiedKey === 'c_fa' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">from</span> <span className="token-val">fastapi</span> <span className="token-yaml-key">import</span> <span className="token-command">FastAPI</span>, <span className="token-val">status</span>{"\n"}
{"\n"}
{"                  "}<span className="token-val">app</span> <span className="token-operator">=</span> <span className="token-command">FastAPI</span>(){"\n"}
{"\n"}
{"                  "}<span className="token-command">@app.get</span>(<span className="token-string">"/users"</span>, <span className="token-val">status_code</span>=<span className="token-val">status</span>.<span className="token-val">HTTP_200_OK</span>){"\n"}
{"                  "}<span className="token-yaml-key">def</span> <span className="token-command">get_users</span>():{"\n"}
{"                  "}<span className="token-yaml-key">return</span> [{`{`}<span className="token-string">"id"</span>: <span className="token-val">1</span>, <span className="token-string">"name"</span>: <span className="token-string">"Alice"</span>{`}`}]{"\n"}
{"\n"}
{"                  "}<span className="token-command">@app.post</span>(<span className="token-string">"/users"</span>, <span className="token-val">status_code</span>=<span className="token-val">status</span>.<span className="token-val">HTTP_201_CREATED</span>){"\n"}
{"                  "}<span className="token-yaml-key">def</span> <span className="token-command">create_user</span>(<span className="token-val">user</span>: <span className="token-val">dict</span>):{"\n"}
                  <span className="token-yaml-key">return</span> {`{`}<span className="token-string">"message"</span>: <span className="token-string">"Created"</span>, <span className="token-string">"user"</span>: <span className="token-val">user</span>{`}`}</pre>
              </div>
            )}

            {activeLangTab === 'django' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">views.py (Django REST Framework)</span>
                  <button onClick={() => handleCopyCode(`from rest_framework.decorators import api_view\nfrom rest_framework.response import Response\nfrom rest_framework import status\n\n@api_view(['GET', 'POST'])\ndef user_list(request):\n    if request.method == 'GET':\n        return Response([{"id": 1, "name": "Alice"}], status=status.HTTP_200_OK)\n        \n    elif request.method == 'POST':\n        return Response({"message": "Created", "user": request.data}, status=status.HTTP_201_CREATED)`, 'c_dj')} className="ref-code-copy-btn">{copiedKey === 'c_dj' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">from</span> <span className="token-val">rest_framework.decorators</span> <span className="token-yaml-key">import</span> <span className="token-command">api_view</span>{"\n"}
{"                  "}<span className="token-yaml-key">from</span> <span className="token-val">rest_framework.response</span> <span className="token-yaml-key">import</span> <span className="token-command">Response</span>{"\n"}
{"                  "}<span className="token-yaml-key">from</span> <span className="token-val">rest_framework</span> <span className="token-yaml-key">import</span> <span className="token-val">status</span>{"\n"}
{"\n"}
{"                  "}<span className="token-command">@api_view</span>([<span className="token-string">'GET'</span>, <span className="token-string">'POST'</span>]){"\n"}
{"                  "}<span className="token-yaml-key">def</span> <span className="token-command">user_list</span>(<span className="token-val">request</span>):{"\n"}
{"                  "}<span className="token-yaml-key">if</span> <span className="token-val">request</span>.<span className="token-val">method</span> <span className="token-operator">==</span> <span className="token-string">'GET'</span>:{"\n"}
{"                  "}<span className="token-yaml-key">return</span> <span className="token-command">Response</span>([{`{`}<span className="token-string">"id"</span>: <span className="token-val">1</span>, <span className="token-string">"name"</span>: <span className="token-string">"Alice"</span>{`}`}], <span className="token-val">status</span>=<span className="token-val">status</span>.<span className="token-val">HTTP_200_OK</span>){"\n"}
{"\n"}
{"                  "}<span className="token-yaml-key">elif</span> <span className="token-val">request</span>.<span className="token-val">method</span> <span className="token-operator">==</span> <span className="token-string">'POST'</span>:{"\n"}
                  <span className="token-yaml-key">return</span> <span className="token-command">Response</span>({`{`}<span className="token-string">"message"</span>: <span className="token-string">"Created"</span>, <span className="token-string">"user"</span>: <span className="token-val">request</span>.<span className="token-val">data</span>{`}`}, <span className="token-val">status</span>=<span className="token-val">status</span>.<span className="token-val">HTTP_201_CREATED</span>)</pre>
              </div>
            )}

            {activeLangTab === 'springboot' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">UserController.java</span>
                  <button onClick={() => handleCopyCode(`import org.springframework.web.bind.annotation.*;\nimport org.springframework.http.*;\nimport java.util.List;\n\n@RestController\n@RequestMapping("/users")\npublic class UserController {\n\n    @GetMapping\n    public ResponseEntity<List<User>> getUsers() {\n        return new ResponseEntity<>(List.of(new User(1, "Alice")), HttpStatus.OK);\n    }\n\n    @PostMapping\n    public ResponseEntity<String> createUser(@RequestBody User user) {\n        return new ResponseEntity<>("Created", HttpStatus.CREATED);\n    }\n}`, 'c_sb')} className="ref-code-copy-btn">{copiedKey === 'c_sb' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">import</span> <span className="token-val">org.springframework.web.bind.annotation.*</span>;{"\n"}
{"                  "}<span className="token-yaml-key">import</span> <span className="token-val">org.springframework.http.*</span>;{"\n"}
{"                  "}<span className="token-yaml-key">import</span> <span className="token-val">java.util.List</span>;{"\n"}
{"\n"}
{"                  "}<span className="token-command">@RestController</span>{"\n"}
{"                  "}<span className="token-command">@RequestMapping</span>(<span className="token-string">"/users"</span>){"\n"}
{"                  "}<span className="token-yaml-key">public</span> <span className="token-yaml-key">class</span> <span className="token-val">UserController</span> {`{`}{"\n"}
{"\n"}
{"                  "}<span className="token-command">@GetMapping</span>{"\n"}
{"                  "}<span className="token-yaml-key">public</span> <span className="token-val">ResponseEntity</span>&lt;<span className="token-val">List</span>&lt;<span className="token-val">User</span>&gt;&gt; <span className="token-command">getUsers</span>() {`{`}{"\n"}
{"                  "}<span className="token-yaml-key">return</span> <span className="token-yaml-key">new</span> <span className="token-command">ResponseEntity</span>&lt;&gt;(<span className="token-val">List</span>.<span className="token-command">of</span>(<span className="token-yaml-key">new</span> <span className="token-command">User</span>(<span className="token-val">1</span>, <span className="token-string">"Alice"</span>)), <span className="token-val">HttpStatus</span>.<span className="token-val">OK</span>);{"\n"}
{"                  "}{`}`}{"\n"}
{"\n"}
{"                  "}<span className="token-command">@PostMapping</span>{"\n"}
{"                  "}<span className="token-yaml-key">public</span> <span className="token-val">ResponseEntity</span>&lt;<span className="token-val">String</span>&gt; <span className="token-command">createUser</span>(<span className="token-command">@RequestBody</span> <span className="token-val">User</span> <span className="token-val">user</span>) {`{`}{"\n"}
{"                  "}<span className="token-yaml-key">return</span> <span className="token-yaml-key">new</span> <span className="token-command">ResponseEntity</span>&lt;&gt;(<span className="token-string">"Created"</span>, <span className="token-val">HttpStatus</span>.<span className="token-val">CREATED</span>);{"\n"}
{"                  "}{`}`}{"\n"}
                  {`}`}</pre>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};
