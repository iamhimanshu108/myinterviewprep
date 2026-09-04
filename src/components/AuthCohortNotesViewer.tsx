import React, { useState, useEffect } from 'react';

// For the JWT decoder
function b64urlDecode(str: string) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4 !== 0) s += '=';
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function readable(ts: number) {
  const d = new Date(ts * 1000);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export const AuthCohortNotesViewer: React.FC = () => {
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

  // JWT Decoder State
  const SAMPLES = {
    valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjNhMWM5NGU3YjJkMDAxMmM5YWI0NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzU2NzAzNDAwLCJleHAiOjE3NTczMDgyMDB9.Jz74pc6s1u5dKsQOWBkuKcfGXT4Mz3IVg2GiJBvDaYU',
    tampered: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjNhMWM5NGU3YjJkMDAxMmM5YWI0NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NjcwMzQwMCwiZXhwIjoxNzU3MzA4MjAwfQ.Jz74pc6s1u5dKsQOWBkuKcfGXT4Mz3IVg2GiJBvDaYU'
  };
  const [jwtInput, setJwtInput] = useState(SAMPLES.valid);
  const [jwtDecodedParts, setJwtDecodedParts] = useState<React.ReactNode[]>([]);

  const decodeToken = () => {
    const raw = jwtInput.trim();
    if (!raw) {
      setJwtDecodedParts([
        <div key="empty" className="ref-decoder-part">
          <div className="ref-decoder-part-head">
            <span className="ref-part-sig">Nothing to decode</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}></span>
          </div>
          <pre className="ref-decoder-part-body">Paste a JWT above, or load one of the sample tokens.</pre>
        </div>
      ]);
      return;
    }

    const parts = raw.split('.');
    if (parts.length !== 3) {
      setJwtDecodedParts([
        <div key="invalid" className="ref-decoder-part">
          <div className="ref-decoder-part-head">
            <span className="ref-part-header">Not a JWT</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}></span>
          </div>
          <pre className="ref-decoder-part-body">{`A JWT has exactly three parts separated by two dots. This string has ${parts.length}.`}</pre>
        </div>
      ]);
      return;
    }

    const decodedNodes: React.ReactNode[] = [];

    // Header
    try {
      const header = JSON.parse(b64urlDecode(parts[0]));
      decodedNodes.push(
        <div key="header" className="ref-decoder-part">
          <div className="ref-decoder-part-head">
            <span className="ref-part-header">Header</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>decoded</span>
          </div>
          <pre className="ref-decoder-part-body">{JSON.stringify(header, null, 2)}</pre>
        </div>
      );
    } catch (e) {
      decodedNodes.push(
        <div key="header-err" className="ref-decoder-part">
          <div className="ref-decoder-part-head">
            <span className="ref-part-header">Header</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>error</span>
          </div>
          <pre className="ref-decoder-part-body">Could not decode this part.</pre>
        </div>
      );
    }

    // Payload
    try {
      const payload = JSON.parse(b64urlDecode(parts[1]));
      let bodyStr = JSON.stringify(payload, null, 2);
      const extra = [];
      if (payload.iat) extra.push('iat  → issued at ' + readable(payload.iat));
      if (payload.exp) {
        const expired = payload.exp * 1000 < Date.now();
        extra.push('exp  → expires ' + readable(payload.exp) + (expired ? '  (already expired)' : ''));
      }
      if (extra.length) bodyStr += '\n\n' + extra.join('\n');
      
      decodedNodes.push(
        <div key="payload" className="ref-decoder-part">
          <div className="ref-decoder-part-head">
            <span className="ref-part-payload">Payload</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>readable by anyone</span>
          </div>
          <pre className="ref-decoder-part-body">{bodyStr}</pre>
        </div>
      );
    } catch (e) {
      decodedNodes.push(
        <div key="payload-err" className="ref-decoder-part">
          <div className="ref-decoder-part-head">
            <span className="ref-part-payload">Payload</span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>error</span>
          </div>
          <pre className="ref-decoder-part-body">Could not decode this part.</pre>
        </div>
      );
    }

    // Signature
    decodedNodes.push(
      <div key="signature" className="ref-decoder-part">
        <div className="ref-decoder-part-head">
          <span className="ref-part-sig">Signature</span>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>needs the secret</span>
        </div>
        <pre className="ref-decoder-part-body">{`${parts[2]}\n\nThe server recomputes this from the header and payload using JWT_SECRET.\nChange one character above and this no longer matches — jwt.verify() throws.`}</pre>
      </div>
    );

    setJwtDecodedParts(decodedNodes);
  };

  useEffect(() => {
    decodeToken();
  }, [jwtInput]);

  // Stepper State
  const [stepIndex, setStepIndex] = useState(0);
  const STEPS = [
    { name: 'Login request', detail: 'The client sends email and password to POST /api/auth/login. This is the only moment the real password travels over the network.', lit: ['n-client', 'n-server', 'a1'] },
    { name: 'Validate, then find the user', detail: 'The server checks the body is usable, then looks the user up by email — with .select("+password") so the stored hash comes along.', lit: ['n-server', 'n-db', 'a2'] },
    { name: 'Compare against the hash', detail: 'The database returns the user document. bcrypt.compare() hashes the typed password with the stored salt and checks for a match. No match → 401.', lit: ['n-server', 'n-db', 'a3'] },
    { name: 'Sign the token', detail: 'Password verified. The server signs a JWT: payload { id, role }, secret from .env, expiresIn 7d. The signature is the hologram.', lit: ['n-server', 'n-token'] },
    { name: 'Hand over the ID card', detail: 'The token goes back to the client, ideally in an httpOnly cookie. Login is finished — steps 1 to 5 will not run again until the token expires.', lit: ['n-server', 'n-client', 'a4', 'n-token'] },
    { name: 'Every request after this', detail: 'From now on the token rides along with each request — automatically as a cookie, or manually in an Authorization header.', lit: ['n-client', 'n-mw', 'a5'] },
    { name: 'The guard checks the card', detail: 'jwt.verify() recomputes the signature and checks the expiry. Valid → req.user = { id, role } and next(). Invalid or missing → 401 and the route never runs.', lit: ['n-mw', 'n-route', 'a6'] }
  ];
  const currentStepInfo = STEPS[stepIndex];
  const isLit = (id: string) => currentStepInfo.lit.includes(id);

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
          <div className="logo">Auth<span className="accent-dot">.</span>101</div>
        </div>

        <div className="ref-nav-group-label">Foundations</div>
        <button onClick={() => scrollToSection('s01')} className={`ref-nav-link ${activeSectionId === 's01' ? 'active' : ''}`}><span className="ref-nav-num">1</span> The problem</button>
        <button onClick={() => scrollToSection('s02')} className={`ref-nav-link ${activeSectionId === 's02' ? 'active' : ''}`}><span className="ref-nav-num">2</span> Authn vs authz</button>
        <button onClick={() => scrollToSection('s03')} className={`ref-nav-link ${activeSectionId === 's03' ? 'active' : ''}`}><span className="ref-nav-num">3</span> Validation</button>

        <div className="ref-nav-group-label">Tokens</div>
        <button onClick={() => scrollToSection('s04')} className={`ref-nav-link ${activeSectionId === 's04' ? 'active' : ''}`}><span className="ref-nav-num">4</span> The ID card</button>
        <button onClick={() => scrollToSection('s05')} className={`ref-nav-link ${activeSectionId === 's05' ? 'active' : ''}`}><span className="ref-nav-num">5</span> Inside a JWT</button>
        <button onClick={() => scrollToSection('s06')} className={`ref-nav-link ${activeSectionId === 's06' ? 'active' : ''}`}><span className="ref-nav-num">6</span> The payload</button>
        <button onClick={() => scrollToSection('s07')} className={`ref-nav-link ${activeSectionId === 's07' ? 'active' : ''}`}><span className="ref-nav-num">7</span> The full flow</button>

        <div className="ref-nav-group-label">Passwords</div>
        <button onClick={() => scrollToSection('s08')} className={`ref-nav-link ${activeSectionId === 's08' ? 'active' : ''}`}><span className="ref-nav-num">8</span> Why we hash</button>
        <button onClick={() => scrollToSection('s09')} className={`ref-nav-link ${activeSectionId === 's09' ? 'active' : ''}`}><span className="ref-nav-num">9</span> bcrypt in practice</button>

        <div className="ref-nav-group-label">Implementation</div>
        <button onClick={() => scrollToSection('s10')} className={`ref-nav-link ${activeSectionId === 's10' ? 'active' : ''}`}><span className="ref-nav-num">10</span> Setup</button>
        <button onClick={() => scrollToSection('s11')} className={`ref-nav-link ${activeSectionId === 's11' ? 'active' : ''}`}><span className="ref-nav-num">11</span> Register route</button>
        <button onClick={() => scrollToSection('s12')} className={`ref-nav-link ${activeSectionId === 's12' ? 'active' : ''}`}><span className="ref-nav-num">12</span> Login route</button>
        <button onClick={() => scrollToSection('s13')} className={`ref-nav-link ${activeSectionId === 's13' ? 'active' : ''}`}><span className="ref-nav-num">13</span> Auth middleware</button>
        <button onClick={() => scrollToSection('s14')} className={`ref-nav-link ${activeSectionId === 's14' ? 'active' : ''}`}><span className="ref-nav-num">14</span> Storing the token</button>

        <div className="ref-nav-group-label">Wrap up</div>
        <button onClick={() => scrollToSection('s15')} className={`ref-nav-link ${activeSectionId === 's15' ? 'active' : ''}`}><span className="ref-nav-num">15</span> Common mistakes</button>
        <button onClick={() => scrollToSection('s16')} className={`ref-nav-link ${activeSectionId === 's16' ? 'active' : ''}`}><span className="ref-nav-num">16</span> Recap &amp; practice</button>
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Cohort · Backend · Session notes</div>
          <h1>Who sent <em>this request?</em></h1>
          <p className="ref-hero-desc">Your server already accepts requests and talks to a database. But every request that arrives looks the same — the server has no idea which human is on the other end. Today we fix that, and then decide what each identified user is allowed to do.</p>
          <div className="ref-hero-tags">
            <span className="ref-hero-tag">Validation</span>
            <span className="ref-hero-tag">Authentication</span>
            <span className="ref-hero-tag">Authorization</span>
            <span className="ref-hero-tag">JWT</span>
            <span className="ref-hero-tag">bcrypt</span>
            <span className="ref-hero-tag">Express + Mongoose</span>
          </div>
        </header>

        {/* ══ 01 ══ */}
        <section className="ref-section-block animate-fade-up" id="s01">
          <div className="ref-section-header">
            <div className="ref-section-num-big">01</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The problem — who sent this request?</div>
              <div className="ref-section-subtitle">Before we write a single line of auth code, feel the problem it solves</div>
            </div>
          </div>

          <p>Three users are using your app right now — A, B and C. All three tap the same button, so all three send the same request to the same route on your server.</p>

          <div className="ref-figure">
            <svg viewBox="0 0 700 250" role="img" aria-label="Three users sending identical requests to one server, which cannot tell them apart">
              <defs>
                <marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6 z" fill="#D4CEBC"></path>
                </marker>
                <marker id="ah-accent" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6 z" fill="#C84B1F"></path>
                </marker>
              </defs>

              <rect className="svg-box-fill" x="20" y="16" width="120" height="46" rx="8"></rect>
              <text className="svg-label" x="80" y="38" textAnchor="middle">User A</text>
              <text className="svg-mono" x="80" y="53" textAnchor="middle">Mumbai</text>

              <rect className="svg-box-fill" x="20" y="96" width="120" height="46" rx="8"></rect>
              <text className="svg-label" x="80" y="118" textAnchor="middle">User B</text>
              <text className="svg-mono" x="80" y="133" textAnchor="middle">Bhopal</text>

              <rect className="svg-box-fill" x="20" y="176" width="120" height="46" rx="8"></rect>
              <text className="svg-label" x="80" y="198" textAnchor="middle">User C</text>
              <text className="svg-mono" x="80" y="213" textAnchor="middle">Indore</text>

              <path className="svg-arrow-live animate-data-flow" d="M146 39 C 220 39, 235 119, 292 119" markerEnd="url(#ah-accent)"></path>
              <path className="svg-arrow-live animate-data-flow" d="M146 119 L 292 119" markerEnd="url(#ah-accent)"></path>
              <path className="svg-arrow-live animate-data-flow" d="M146 199 C 220 199, 235 119, 292 119" markerEnd="url(#ah-accent)"></path>

              <text className="svg-mono-accent" x="215" y="88" textAnchor="middle">POST /api/transfer</text>
              <text className="svg-mono" x="215" y="160" textAnchor="middle">same shape, same headers</text>

              <text className="svg-question" x="330" y="132" textAnchor="middle">?</text>
              <path className="svg-arrow" d="M356 119 L 452 119" markerEnd="url(#ah)"></path>

              <rect className="svg-box-ink" x="460" y="82" width="210" height="74" rx="8"></rect>
              <text className="svg-label-inv" x="565" y="112" textAnchor="middle">Your server</text>
              <text x="565" y="132" textAnchor="middle" style={{fontFamily:'var(--font-ibm)',fontSize:'10px',fill:'rgba(255,255,255,0.45)'}}>3 requests · 0 identities</text>
            </svg>
            <div className="ref-figure-caption">Fig 1 — the server receives requests, not people</div>
          </div>

          <p>The server sees three HTTP requests. It does not see A, B or C. HTTP is <strong>stateless</strong> — the server keeps no memory of who connected last time, and nothing in a plain request says who is holding the phone.</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text"><strong>Stateless</strong> means every request is treated as a brand new stranger. Request number two knows nothing about request number one. If we want the server to recognise a user, the <em>request itself</em> has to carry the proof.</p>
          </div>

          <h3>Why this actually matters</h3>
          <p>Take a banking app. A user asks to transfer ₹60,000:</p>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">Incoming request</span>
              <button onClick={() => handleCopyCode(`POST /api/transfer\nContent-Type: application/json\n\n{\n  "to": "XYZ0001234",\n  "amount": 60000\n}`, 'c1')} className="ref-code-copy-btn">{copiedKey === 'c1' ? 'copied' : 'copy'}</button>
            </div>
<pre className="ref-code-pre"><span className="token-command">POST</span> <span className="token-val">/api/transfer</span>{"\n"}
<span className="token-yaml-key">Content-Type:</span> <span className="token-string">application/json</span>{"\n"}
{"\n"}
{`{`}{"\n"}
{"  "}<span className="token-yaml-key">"to"</span>: <span className="token-string">"XYZ0001234"</span>,{"\n"}
{"  "}<span className="token-yaml-key">"amount"</span>: <span className="token-val">60000</span>{"\n"}
{`}`}{"\n"}
{"\n"}
<span className="token-comment"># Transfer 60,000 to XYZ0001234 — fine.</span>{"\n"}
<span className="token-comment"># But FROM whose account? The request never says.</span></pre>
          </div>

          <p>Money has to leave someone's account. Without identity this endpoint is either useless or catastrophic. The same question shows up everywhere: whose cart is this, whose posts do I return, whose profile is being edited.</p>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">The obvious fix — <strong>send <code>userId</code> in the body</strong> — is the classic beginner trap. The body is written by the client. Anyone can open Postman and put <em>your</em> id in it and empty your account. <strong>Never trust data the client can edit.</strong> Identity must be something the client cannot fake.</p>
          </div>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Definition</div>
            <p className="ref-concept-box-text"><strong>Authentication</strong> is the process of identifying the user who made the request.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-01">
            <p className="ref-quiz-question">Why can't the server simply remember who user A is after their first request?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-01', 0, 'A — Because the database is too slow to store it', false)}
              {renderQuizOption('quiz-01', 1, 'B — Because HTTP is stateless — each request arrives with no memory of the last one', true)}
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
              <div className="ref-section-title">Authentication vs authorization</div>
              <div className="ref-section-subtitle">Two different questions that students mix up in every interview</div>
            </div>
          </div>

          <p>These two words look alike and are constantly confused. They answer completely different questions, and they run one after the other.</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text"><strong>Authentication</strong> asks <em>who are you?</em> &nbsp;·&nbsp; <strong>Authorization</strong> asks <em>are you allowed to do this?</em> You cannot check what someone is allowed to do until you know who they are — so authentication always runs first.</p>
          </div>

          <table className="ref-compare-table">
            <thead>
              <tr><th>What</th><th>Authentication</th><th>Authorization</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-title">The question</td>
                <td className="cell-muted">Who is this user?</td>
                <td className="cell-highlight">Is this user allowed to do it?</td>
              </tr>
              <tr>
                <td className="cell-title">Runs</td>
                <td className="cell-muted">First</td>
                <td className="cell-highlight">After authentication</td>
              </tr>
              <tr>
                <td className="cell-title">Checks</td>
                <td className="cell-muted">Credentials or a valid token</td>
                <td className="cell-highlight">Role, ownership, permissions</td>
              </tr>
              <tr>
                <td className="cell-title">Fails with</td>
                <td className="cell-muted">401 Unauthorized — "I don't know you"</td>
                <td className="cell-highlight">403 Forbidden — "I know you, and no"</td>
              </tr>
              <tr>
                <td className="cell-title">In our app</td>
                <td className="cell-muted">Verifying the token on <code>/api/orders</code></td>
                <td className="cell-highlight">Only <code>role: "admin"</code> may delete a product</td>
              </tr>
            </tbody>
          </table>

          <p>A real example from a college: the guard at the gate checks your ID card and confirms you are a student — that is authentication. Inside, that same card does not open the staff room, because the card says <em>student</em>, not <em>teacher</em> — that is authorization.</p>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text"><strong>401 vs 403</strong> is a favourite interview question. 401 means no valid identity was presented. 403 means the identity is fine, the permission is not.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-02">
            <p className="ref-quiz-question">A logged-in normal user hits <code>DELETE /api/products/12</code>, an admin-only route. What should the server respond?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-02', 0, 'A — 401 Unauthorized, because the request must be blocked', false)}
              {renderQuizOption('quiz-02', 1, 'B — 403 Forbidden, because we know who they are but their role isn\'t allowed', true)}
            </div>
            {quizResults['quiz-02'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-02'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-02'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 03 ══ */}
        <section className="ref-section-block animate-fade-up" id="s03">
          <div className="ref-section-header">
            <div className="ref-section-num-big">03</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Validation — check before you trust</div>
              <div className="ref-section-subtitle">The step that runs before we even ask who you are</div>
            </div>
          </div>

          <p>Before identity, sanity. <strong>Validation</strong> asks a simpler question: is this data even usable? Is the email actually shaped like an email, is the password long enough, is <code>amount</code> a positive number and not the string <code>"sixty thousand"</code>?</p>

          <h4>Order of a protected request</h4>
          <div className="ref-flow-diagram">
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-accent"></div><div className="ref-flow-line"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">Validation</div>
                <div className="ref-flow-desc">Is the incoming data the right shape? → 400 Bad Request</div>
              </div>
            </div>
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-accent"></div><div className="ref-flow-line"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">Authentication</div>
                <div className="ref-flow-desc">Who is sending this? → 401 Unauthorized</div>
              </div>
            </div>
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-accent"></div><div className="ref-flow-line"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">Authorization</div>
                <div className="ref-flow-desc">Is this user allowed here? → 403 Forbidden</div>
              </div>
            </div>
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-green"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">Controller</div>
                <div className="ref-flow-desc">Only now do we touch the database and do the real work.</div>
              </div>
            </div>
          </div>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">controllers/auth.controller.js</span>
              <button onClick={() => handleCopyCode(`const { name, email, password } = req.body;\nif (!name || !email || !password) {\n  return res.status(400).json({ message: "name, email and password are required" });\n}`, 'c2')} className="ref-code-copy-btn">{copiedKey === 'c2' ? 'copied' : 'copy'}</button>
            </div>
<pre className="ref-code-pre"><span className="token-comment">// the simplest possible validation — do it before anything else</span>{"\n"}
<span className="token-yaml-key">const</span> {` { `}<span className="token-val">name</span>, <span className="token-val">email</span>, <span className="token-val">password</span>{` } `}<span className="token-operator">=</span> <span className="token-val">req</span>.<span className="token-val">body</span>;{"\n"}
{"\n"}
<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">name</span> <span className="token-operator">||</span> <span className="token-operator">!</span><span className="token-val">email</span> <span className="token-operator">||</span> <span className="token-operator">!</span><span className="token-val">password</span>) {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">400</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"name, email and password are required"</span>{` } `});{"\n"}
{`}`}{"\n"}
{"\n"}
<span className="token-yaml-key">if</span> (<span className="token-val">password</span>.<span className="token-val">length</span> <span className="token-operator">&lt;</span> <span className="token-val">8</span>) {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">400</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"password must be at least 8 characters"</span>{` } `});{"\n"}
{`}`}{"\n"}
{"\n"}
<span className="token-comment">// In a real project you would not write this by hand for every route.</span>{"\n"}
<span className="token-comment">// Use a schema library — zod, joi or express-validator — as middleware.</span></pre>
          </div>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">The validation you wrote in React is <strong>UX, not security</strong>. Postman, curl and a script never open your form. If the only check lives in the browser, there is effectively no check. <strong>Validate on the server, always.</strong></p>
          </div>

          <div className="ref-quiz-box" id="quiz-03">
            <p className="ref-quiz-question">You already block empty emails in your React form. Do you still need the same check in Express?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-03', 0, 'A — Yes — anyone can bypass the UI and call the API directly', true)}
              {renderQuizOption('quiz-03', 1, 'B — No — it is already handled, checking twice is wasted work', false)}
            </div>
            {quizResults['quiz-03'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-03'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-03'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 04 ══ */}
        <section className="ref-section-block animate-fade-up" id="s04">
          <div className="ref-section-header">
            <div className="ref-section-num-big">04</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The student ID card</div>
              <div className="ref-section-subtitle">The whole token idea, in a story you have already lived</div>
            </div>
          </div>

          <p>Think about joining a school or college.</p>

          <p>First you fill an <strong>admission form</strong> — name, details, documents. The office verifies it and writes you into their register. A few days later they hand you an <strong>ID card</strong>. That card carries your roll number, your class, a photo, an expiry date, and the school's stamp or hologram.</p>

          <p>Now watch what the card does. At the library gate, the computer lab, the swimming pool, the sports club, the ground — you show the card and you are let in. Nobody sends you back to the admission office. Nobody makes you fill the form again. The card <em>is</em> your proof, and every gate can check it on the spot.</p>

          <p>That is exactly what a token does for your server.</p>

          <table className="ref-compare-table">
            <thead>
              <tr><th>At school</th><th>In our backend</th></tr>
            </thead>
            <tbody>
              <tr><td className="cell-title">Filling the admission form</td><td className="cell-highlight">Registration — <code>POST /api/auth/register</code></td></tr>
              <tr><td className="cell-title">Office verifies and records you</td><td className="cell-highlight">Server validates and saves the user in the database</td></tr>
              <tr><td className="cell-title">School issues an ID card</td><td className="cell-highlight">Server signs and issues a JWT</td></tr>
              <tr><td className="cell-title">Roll number printed on the card</td><td className="cell-highlight">The user's <code>id</code> inside the token payload</td></tr>
              <tr><td className="cell-title">Stamp / hologram nobody can copy</td><td className="cell-highlight">The signature, created with a secret only the server has</td></tr>
              <tr><td className="cell-title">Showing the card at the library gate</td><td className="cell-highlight">Sending the token with every request</td></tr>
              <tr><td className="cell-title">Card valid till March 2027</td><td className="cell-highlight"><code>expiresIn</code> — the token stops working after that</td></tr>
              <tr><td className="cell-title">Lost card? Report it, get a new one</td><td className="cell-highlight">Logout / re-login issues a fresh token</td></tr>
            </tbody>
          </table>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text">The gatekeeper never calls the admission office. Everything needed to trust you is <strong>printed on the card itself</strong>, and the hologram proves it is genuine. That is why JWT auth is called <strong>stateless</strong> — the server does not have to store a session for you anywhere.</p>
          </div>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text">Push the analogy one more step and you get authorization for free: a <strong>student card</strong> opens the library, a <strong>teacher card</strong> opens the staff room. Same card system, different role printed on it.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-04">
            <p className="ref-quiz-question">In the ID card analogy, what plays the role of the school's hologram?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-04', 0, 'A — The payload, because it holds the user\'s details', false)}
              {renderQuizOption('quiz-04', 1, 'B — The signature, because only the server\'s secret can produce it', true)}
            </div>
            {quizResults['quiz-04'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-04'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-04'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 05 ══ */}
        <section className="ref-section-block animate-fade-up" id="s05">
          <div className="ref-section-header">
            <div className="ref-section-num-big">05</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Inside a JWT</div>
              <div className="ref-section-subtitle">Three parts, two dots, and one very common misunderstanding</div>
            </div>
          </div>

          <p><strong>JWT</strong> stands for JSON Web Token. It is a long string that looks like random noise, but it is not random at all. Look for the two dots — they split it into three parts.</p>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">A real JWT</span>
              <button onClick={() => handleCopyCode(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjNhMWM5NGU3YjJkMDAxMmM5YWI0NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzU2NzAzNDAwLCJleHAiOjE3NTczMDgyMDB9.Jz74pc6s1u5dKsQOWBkuKcfGXT4Mz3IVg2GiJBvDaYU`, 'c3')} className="ref-code-copy-btn">{copiedKey === 'c3' ? 'copied' : 'copy'}</button>
            </div>
<pre className="ref-code-pre"><span className="token-split-header">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span><span className="token-split-dot">.</span><span className="token-split-payload">eyJpZCI6IjY4ZjNhMWM5NGU3YjJkMDAxMmM5YWI0NSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzU2NzAzNDAwLCJleHAiOjE3NTczMDgyMDB9</span><span className="token-split-dot">.</span><span className="token-split-sig">Jz74pc6s1u5dKsQOWBkuKcfGXT4Mz3IVg2GiJBvDaYU</span>{"\n"}
{"\n"}
<span className="token-comment"># header . payload . signature</span></pre>
          </div>

          <table className="ref-flag-table">
            <thead>
              <tr><th>Part</th><th>Holds</th><th>What it is for</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="ref-flag-name">Header</span></td>
                <td><span className="ref-flag-val">{`{ alg, typ }`}</span></td>
                <td>Which algorithm signed this token. Usually HS256, and the type is JWT.</td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">Payload</span></td>
                <td><span className="ref-flag-val">{`{ id, role, iat, exp }`}</span></td>
                <td>The actual data — the "claims". This is what your server reads to know who the user is.</td>
              </tr>
              <tr>
                <td><span className="ref-flag-name">Signature</span></td>
                <td><span className="ref-flag-val">HMACSHA256(...)</span></td>
                <td>Header + payload signed with your secret key. This is the hologram — proof the token came from your server and was not edited.</td>
              </tr>
            </tbody>
          </table>

          <h3>Decode it yourself</h3>
          <p>The first two parts are just JSON, Base64URL-encoded. No key, no password, no special tool — the browser can read them. Paste any token below and see it open up.</p>

          <div className="ref-decoder">
            <div className="ref-code-header">
              <span className="ref-code-label">JWT decoder — paste a token</span>
              <button onClick={() => setJwtInput('')} className="ref-code-copy-btn">clear</button>
            </div>
            <div className="ref-decoder-body">
              <textarea 
                value={jwtInput}
                onChange={(e) => setJwtInput(e.target.value)}
                className="ref-decoder-input" 
                spellCheck="false" 
                aria-label="JWT to decode"
              />
              <div className="ref-decoder-actions">
                <button className="ref-decoder-btn" onClick={() => setJwtInput(SAMPLES.valid)}>Load student token</button>
                <button className="ref-decoder-btn" onClick={() => setJwtInput(SAMPLES.tampered)}>Load edited token</button>
              </div>
              <div className="ref-decoder-out">
                {jwtDecodedParts}
              </div>
            </div>
          </div>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">Base64URL is <strong>encoding, not encryption</strong>. A JWT is readable by anyone who has it — the user, a browser extension, anyone reading a log file. <strong>Never put a password, OTP, card number or Aadhaar inside a token.</strong></p>
          </div>

          <h3>Then what stops someone editing it?</h3>
          <p>Try it live: press <strong>Load edited token</strong> above. Someone took the student token, changed <code>"role": "student"</code> to <code>"role": "admin"</code>, and re-encoded the payload. It decodes perfectly. It looks like a valid admin token.</p>

          <p>But the signature was calculated from the <em>original</em> header and payload using a secret that only your server knows. Change one character of the payload and the signature no longer matches. When your server runs <code>jwt.verify()</code>, it recomputes the signature and sees the mismatch — the token is rejected.</p>

          <div className="ref-scale-diagram">
            <span className="highlight">Attacker edits payload → role: "admin"</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
            <span className="highlight">Server recomputes signature using its secret</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
            <span className="red" style={{color: 'var(--accent)'}}>Computed signature ≠ signature on the token</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
            <span className="green" style={{color: 'var(--accent2)'}}>jwt.verify() throws → 401 Unauthorized ✅</span>
          </div>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text">A JWT is <strong>readable by everyone, forgeable by no one</strong>. Read access is public. Write access needs the secret. That single line explains almost every JWT rule you will ever be told.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-05">
            <p className="ref-quiz-question">Your teammate says "the payload is safe, it's encrypted". Are they right?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-05', 0, 'A — Yes — you need the secret key to read a JWT payload', false)}
              {renderQuizOption('quiz-05', 1, 'B — No — it is only Base64URL encoded, anyone holding the token can read it', true)}
            </div>
            {quizResults['quiz-05'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-05'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-05'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>

          <div className="ref-quiz-box" id="quiz-05b">
            <p className="ref-quiz-question">An attacker edits the payload of a token they stole. What happens on the server?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-05b', 0, 'A — Signature verification fails, because the signature was made from the original payload', true)}
              {renderQuizOption('quiz-05b', 1, 'B — Nothing — the server trusts whatever the payload says', false)}
            </div>
            {quizResults['quiz-05b'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-05b'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-05b'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 06 ══ */}
        <section className="ref-section-block animate-fade-up" id="s06">
          <div className="ref-section-header">
            <div className="ref-section-num-big">06</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">What goes inside the payload</div>
              <div className="ref-section-subtitle">Keep it small, keep it boring</div>
            </div>
          </div>

          <p>Since the payload is public, the rule writes itself: put in the minimum the server needs to identify the user, and nothing else. In practice that is the user's <strong>id</strong>, and — if you have roles — the <strong>role</strong>.</p>

          <table className="ref-compare-table">
            <thead>
              <tr><th>Field</th><th>Put it in the token?</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td className="cell-title"><code>id</code> / <code>_id</code></td><td className="cell-highlight">Yes</td><td className="cell-muted">The whole point — it tells the server which database document this request belongs to.</td></tr>
              <tr><td className="cell-title"><code>role</code></td><td className="cell-highlight">Yes</td><td className="cell-muted">Lets authorization run without an extra DB call. Not secret information.</td></tr>
              <tr><td className="cell-title"><code>iat</code>, <code>exp</code></td><td className="cell-highlight">Automatic</td><td className="cell-muted">Issued-at and expiry. The library adds these for you when you pass <code>expiresIn</code>.</td></tr>
              <tr><td className="cell-title">Password or its hash</td><td className="cell-muted">Never</td><td className="cell-muted">It would be public. This is the single worst JWT mistake.</td></tr>
              <tr><td className="cell-title">Phone, address, Aadhaar, DOB</td><td className="cell-muted">No</td><td className="cell-muted">Personal data that anyone holding the token could read. Fetch it from the DB when needed.</td></tr>
              <tr><td className="cell-title">Cart, orders, big objects</td><td className="cell-muted">No</td><td className="cell-muted">The token travels with every single request. Keep it light.</td></tr>
            </tbody>
          </table>

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
                  <span className="ref-code-label">utils/token.js (Express)</span>
                  <button onClick={() => handleCopyCode(`const jwt = require("jsonwebtoken");\n\nfunction signToken(user) {\n  return jwt.sign(\n    { id: user._id, role: user.role },\n    process.env.JWT_SECRET,\n    { expiresIn: "7d" }\n  );\n}`, 'c4')} className="ref-code-copy-btn">{copiedKey === 'c4' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">jwt</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">"jsonwebtoken"</span>);{"\n"}
{"\n"}
<span className="token-yaml-key">function</span> <span className="token-command">signToken</span>(<span className="token-val">user</span>) {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-val">jwt</span>.<span className="token-command">sign</span>({"\n"}
{"    "}{` { `}<span className="token-yaml-key">id</span>: <span className="token-val">user</span>.<span className="token-val">_id</span>, <span className="token-yaml-key">role</span>: <span className="token-val">user</span>.<span className="token-val">role</span>{` } `},   <span className="token-comment">// payload — small on purpose</span>{"\n"}
{"    "}<span className="token-val">process</span>.<span className="token-val">env</span>.<span className="token-val">JWT_SECRET</span>,                <span className="token-comment">// secret — never hardcode it</span>{"\n"}
{"    "}{` { `}<span className="token-yaml-key">expiresIn</span>: <span className="token-string">"7d"</span>{` } `}                    <span className="token-comment">// adds iat + exp for you</span>{"\n"}
{"  "});{"\n"}
{`}`}{"\n"}
{"\n"}
<span className="token-val">module</span>.<span className="token-val">exports</span> <span className="token-operator">=</span> {` { `}<span className="token-val">signToken</span>{` } `};</pre>
              </div>
            )}

            {activeLangTab === 'fastapi' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">utils/security.py (using python-jose)</span>
                  <button onClick={() => handleCopyCode(`from datetime import datetime, timedelta\nfrom jose import jwt\nimport os\n\nSECRET_KEY = os.getenv("JWT_SECRET")\nALGORITHM = "HS256"\n\ndef create_access_token(user: dict):\n    expire = datetime.utcnow() + timedelta(days=7)\n    to_encode = {"id": user["id"], "role": user["role"], "exp": expire}\n    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n    return encoded_jwt`, 'c4_fa')} className="ref-code-copy-btn">{copiedKey === 'c4_fa' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">from</span> <span className="token-val">datetime</span> <span className="token-yaml-key">import</span> <span className="token-command">datetime</span>, <span className="token-command">timedelta</span>{"\n"}
<span className="token-yaml-key">from</span> <span className="token-val">jose</span> <span className="token-yaml-key">import</span> <span className="token-command">jwt</span>{"\n"}
<span className="token-yaml-key">import</span> <span className="token-val">os</span>{"\n"}
{"\n"}
<span className="token-val">SECRET_KEY</span> <span className="token-operator">=</span> <span className="token-val">os</span>.<span className="token-command">getenv</span>(<span className="token-string">"JWT_SECRET"</span>){"\n"}
<span className="token-val">ALGORITHM</span> <span className="token-operator">=</span> <span className="token-string">"HS256"</span>{"\n"}
{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">create_access_token</span>(<span className="token-val">user</span>: <span className="token-val">dict</span>):{"\n"}
{"    "}<span className="token-val">expire</span> <span className="token-operator">=</span> <span className="token-command">datetime</span>.<span className="token-command">utcnow</span>() <span className="token-operator">+</span> <span className="token-command">timedelta</span>(<span className="token-val">days</span>=<span className="token-val">7</span>){"\n"}
{"    "}<span className="token-val">to_encode</span> <span className="token-operator">=</span> {`{`}<span className="token-string">"id"</span>: <span className="token-val">user</span>[<span className="token-string">"id"</span>], <span className="token-string">"role"</span>: <span className="token-val">user</span>[<span className="token-string">"role"</span>], <span className="token-string">"exp"</span>: <span className="token-val">expire</span>{`}`}{"\n"}
{"    "}<span className="token-val">encoded_jwt</span> <span className="token-operator">=</span> <span className="token-val">jwt</span>.<span className="token-command">encode</span>(<span className="token-val">to_encode</span>, <span className="token-val">SECRET_KEY</span>, <span className="token-val">algorithm</span>=<span className="token-val">ALGORITHM</span>){"\n"}
    <span className="token-yaml-key">return</span> <span className="token-val">encoded_jwt</span></pre>
              </div>
            )}

            {activeLangTab === 'django' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">views.py (djangorestframework-simplejwt)</span>
                  <button onClick={() => handleCopyCode(`from rest_framework_simplejwt.tokens import RefreshToken\n\ndef get_tokens_for_user(user):\n    refresh = RefreshToken.for_user(user)\n    # Add custom claims\n    refresh['role'] = user.role\n\n    return {\n        'refresh': str(refresh),\n        'access': str(refresh.access_token),\n    }`, 'c4_dj')} className="ref-code-copy-btn">{copiedKey === 'c4_dj' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">from</span> <span className="token-val">rest_framework_simplejwt.tokens</span> <span className="token-yaml-key">import</span> <span className="token-command">RefreshToken</span>{"\n"}
{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">get_tokens_for_user</span>(<span className="token-val">user</span>):{"\n"}
{"    "}<span className="token-val">refresh</span> <span className="token-operator">=</span> <span className="token-val">RefreshToken</span>.<span className="token-command">for_user</span>(<span className="token-val">user</span>){"\n"}
{"\n"}
{"    "}<span className="token-comment"># Add custom claims like role</span>{"\n"}
{"    "}<span className="token-val">refresh</span>[<span className="token-string">'role'</span>] <span className="token-operator">=</span> <span className="token-val">user</span>.<span className="token-val">role</span>{"\n"}
{"\n"}
{"    "}<span className="token-yaml-key">return</span> {`{`}{"\n"}
{"        "}<span className="token-string">'refresh'</span>: <span className="token-command">str</span>(<span className="token-val">refresh</span>),{"\n"}
{"        "}<span className="token-string">'access'</span>: <span className="token-command">str</span>(<span className="token-val">refresh</span>.<span className="token-val">access_token</span>),{"\n"}
    {`}`}</pre>
              </div>
            )}

            {activeLangTab === 'springboot' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">JwtUtils.java (using io.jsonwebtoken)</span>
                  <button onClick={() => handleCopyCode(`import io.jsonwebtoken.Jwts;\nimport io.jsonwebtoken.SignatureAlgorithm;\nimport java.util.Date;\n\npublic String generateToken(User user) {\n    return Jwts.builder()\n        .setSubject(user.getId().toString())\n        .claim("role", user.getRole())\n        .setIssuedAt(new Date())\n        .setExpiration(new Date((new Date()).getTime() + 604800000)) // 7 days\n        .signWith(SignatureAlgorithm.HS256, jwtSecret)\n        .compact();\n}`, 'c4_sb')} className="ref-code-copy-btn">{copiedKey === 'c4_sb' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">import</span> <span className="token-val">io.jsonwebtoken.Jwts</span>;{"\n"}
<span className="token-yaml-key">import</span> <span className="token-val">io.jsonwebtoken.SignatureAlgorithm</span>;{"\n"}
<span className="token-yaml-key">import</span> <span className="token-val">java.util.Date</span>;{"\n"}
{"\n"}
<span className="token-yaml-key">public</span> <span className="token-val">String</span> <span className="token-command">generateToken</span>(<span className="token-val">User</span> <span className="token-val">user</span>) {`{`}{"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">Jwts</span>.<span className="token-command">builder</span>(){"\n"}
{"        "}.<span className="token-command">setSubject</span>(<span className="token-val">user</span>.<span className="token-command">getId</span>().<span className="token-command">toString</span>()){"\n"}
{"        "}.<span className="token-command">claim</span>(<span className="token-string">"role"</span>, <span className="token-val">user</span>.<span className="token-command">getRole</span>()){"\n"}
{"        "}.<span className="token-command">setIssuedAt</span>(<span className="token-yaml-key">new</span> <span className="token-command">Date</span>()){"\n"}
{"        "}.<span className="token-command">setExpiration</span>(<span className="token-yaml-key">new</span> <span className="token-command">Date</span>((<span className="token-yaml-key">new</span> <span className="token-command">Date</span>()).<span className="token-command">getTime</span>() <span className="token-operator">+</span> <span className="token-val">604800000</span>)) <span className="token-comment">// 7 days</span>{"\n"}
{"        "}.<span className="token-command">signWith</span>(<span className="token-val">SignatureAlgorithm</span>.<span className="token-val">HS256</span>, <span className="token-val">jwtSecret</span>){"\n"}
{"        "}.<span className="token-command">compact</span>();{"\n"}
{`}`}{"\n"}
</pre>
              </div>
            )}
          </div>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text">A token is a <strong>photocopy taken at login time</strong>, not a live view of the database. If you promote a user to admin today, their old token still says <code>student</code> until it expires — and if you demote an admin, their old token still says <code>admin</code>. That is exactly why tokens should be short-lived.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-06">
            <p className="ref-quiz-question">A student wants to store the user's phone number in the token to avoid a database call. What do you tell them?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-06', 0, 'A — Don\'t — the payload is public, so personal data must not go in it', true)}
              {renderQuizOption('quiz-06', 1, 'B — Fine — the signature protects everything inside the payload', false)}
            </div>
            {quizResults['quiz-06'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-06'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-06'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 07 ══ */}
        <section className="ref-section-block animate-fade-up" id="s07">
          <div className="ref-section-header">
            <div className="ref-section-num-big">07</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The complete flow, step by step</div>
              <div className="ref-section-subtitle">Walk it forward and backward until the whole class can narrate it</div>
            </div>
          </div>

          <p>Everything so far in one journey. Use the buttons to move through it — one step at a time.</p>

          <div className="ref-stepper" id="auth-stepper">
            <div className="ref-figure">
              <svg viewBox="0 0 700 280" role="img" aria-label="Step by step diagram of the login and protected request flow">
                <g id="n-client" className={isLit('n-client') ? 'svg-lit' : 'svg-dim'}>
                  <rect className="svg-box-fill" x="20" y="40" width="150" height="66" rx="8"></rect>
                  <text className="svg-label" x="95" y="70" textAnchor="middle">Client</text>
                  <text className="svg-mono" x="95" y="88" textAnchor="middle">React app</text>
                </g>

                <g id="n-server" className={isLit('n-server') ? 'svg-lit' : 'svg-dim'}>
                  <rect className="svg-box-ink" x="275" y="40" width="150" height="66" rx="8"></rect>
                  <text className="svg-label-inv" x="350" y="70" textAnchor="middle">Server</text>
                  <text x="350" y="88" textAnchor="middle" style={{fontFamily:'var(--font-ibm)',fontSize:'10px',fill:'rgba(255,255,255,0.45)'}}>Express</text>
                </g>

                <g id="n-db" className={isLit('n-db') ? 'svg-lit' : 'svg-dim'}>
                  <rect className="svg-box-fill" x="530" y="40" width="150" height="66" rx="8"></rect>
                  <text className="svg-label" x="605" y="70" textAnchor="middle">Database</text>
                  <text className="svg-mono" x="605" y="88" textAnchor="middle">users collection</text>
                </g>

                <g id="n-mw" className={isLit('n-mw') ? 'svg-lit' : 'svg-dim'}>
                  <rect className="svg-box-fill" x="275" y="196" width="150" height="60" rx="8"></rect>
                  <text className="svg-label" x="350" y="222" textAnchor="middle">Auth middleware</text>
                  <text className="svg-mono" x="350" y="240" textAnchor="middle">jwt.verify()</text>
                </g>

                <g id="n-route" className={isLit('n-route') ? 'svg-lit' : 'svg-dim'}>
                  <rect className="svg-box-fill" x="530" y="196" width="150" height="60" rx="8"></rect>
                  <text className="svg-label" x="605" y="222" textAnchor="middle">Protected route</text>
                  <text className="svg-mono" x="605" y="240" textAnchor="middle">req.user is ready</text>
                </g>

                <g id="a1" className={isLit('a1') ? 'svg-lit animate-data-flow' : 'svg-dim'}>
                  <path className="svg-arrow-live" d="M176 58 L 268 58" markerEnd="url(#ah-accent)"></path>
                  <text className="svg-mono-accent" x="222" y="48" textAnchor="middle">credentials</text>
                </g>
                <g id="a2" className={isLit('a2') ? 'svg-lit animate-data-flow' : 'svg-dim'}>
                  <path className="svg-arrow-live" d="M431 58 L 523 58" markerEnd="url(#ah-accent)"></path>
                  <text className="svg-mono-accent" x="477" y="48" textAnchor="middle">find user</text>
                </g>
                <g id="a3" className={isLit('a3') ? 'svg-lit' : 'svg-dim'}>
                  <path className="svg-arrow" d="M523 92 L 434 92" markerEnd="url(#ah)"></path>
                  <text className="svg-mono" x="477" y="112" textAnchor="middle">user + hash</text>
                </g>
                <g id="a4" className={isLit('a4') ? 'svg-lit' : 'svg-dim'}>
                  <path className="svg-arrow" d="M268 92 L 179 92" markerEnd="url(#ah)"></path>
                  <text className="svg-mono" x="222" y="112" textAnchor="middle">token</text>
                </g>
                <g id="a5" className={isLit('a5') ? 'svg-lit animate-data-flow' : 'svg-dim'}>
                  <path className="svg-arrow-live" d="M95 112 L 95 226 L 268 226" markerEnd="url(#ah-accent)"></path>
                  <text className="svg-mono-accent" x="180" y="216" textAnchor="middle">token on every request</text>
                </g>
                <g id="a6" className={isLit('a6') ? 'svg-lit' : 'svg-dim'}>
                  <path className="svg-arrow" d="M431 226 L 523 226" markerEnd="url(#ah)"></path>
                  <text className="svg-mono" x="477" y="216" textAnchor="middle">req.user</text>
                </g>
                <g id="n-token" className={isLit('n-token') ? 'svg-lit' : 'svg-dim'}>
                  <rect x="292" y="130" width="116" height="26" rx="13" fill="#C84B1F"></rect>
                  <text x="350" y="147" textAnchor="middle" style={{fontFamily:'var(--font-ibm)',fontSize:'10px',fill:'#FFFFFF'}}>JWT signed</text>
                </g>
              </svg>
            </div>
            <div className="ref-stepper-caption">
              <div className="ref-step-name">{stepIndex + 1} · {currentStepInfo.name}</div>
              <p className="ref-step-detail">{currentStepInfo.detail}</p>
            </div>
            <div className="ref-stepper-controls">
              <button 
                className="ref-stepper-btn" 
                disabled={stepIndex === 0} 
                onClick={() => setStepIndex(s => s - 1)}
              >
                ← Back
              </button>
              <span className="ref-stepper-count">Step <b>{stepIndex + 1}</b> / {STEPS.length}</span>
              <button 
                className="ref-stepper-btn" 
                disabled={stepIndex === STEPS.length - 1} 
                onClick={() => setStepIndex(s => s + 1)}
              >
                Forward →
              </button>
            </div>
          </div>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text">Steps 1 to 5 happen <strong>once</strong>, at login. Steps 6 and 7 happen on <strong>every single request</strong> after that. That difference is the whole reason tokens exist — the password is checked once, the card is shown a thousand times.</p>
          </div>
        </section>

        {/* ══ 08 ══ */}
        <section className="ref-section-block animate-fade-up" id="s08">
          <div className="ref-section-header">
            <div className="ref-section-num-big">08</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Why we hash passwords</div>
              <div className="ref-section-subtitle">The one mistake that can end a product and a career</div>
            </div>
          </div>

          <p>Registration means storing a user in your database. The tempting version looks like this:</p>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">users collection — the dangerous version</span>
            </div>
<pre className="ref-code-pre">{`{`} <span className="token-yaml-key">"email"</span>: <span className="token-string">"riya@gmail.com"</span>,  <span className="token-yaml-key">"password"</span>: <span className="token-string">"riya@1234"</span> {`}`}{"\n"}
{`{`} <span className="token-yaml-key">"email"</span>: <span className="token-string">"aman@gmail.com"</span>,  <span className="token-yaml-key">"password"</span>: <span className="token-string">"sheryians123"</span> {`}`}{"\n"}
{`{`} <span className="token-yaml-key">"email"</span>: <span className="token-string">"neha@gmail.com"</span>,  <span className="token-yaml-key">"password"</span>: <span className="token-string">"sheryians123"</span> {`}`}{"\n"}
{"\n"}
<span className="token-comment"># It works. Login is a simple ===. And it is a disaster waiting to happen.</span></pre>
          </div>

          <h3>Now list everyone who can read that column</h3>
          <ul>
            <li>Anyone who gets a copy of the database — a leak, a stolen backup, a public Mongo instance with no password on it.</li>
            <li>Every developer, intern and DBA on your team, including the one who leaves next month.</li>
            <li>Whatever log, analytics tool or error report accidentally captured a request body.</li>
          </ul>

          <p>And here is the part students underestimate. People reuse passwords. <code>sheryians123</code> is probably also Neha's email password, her Instagram password, maybe her bank password. If your little project leaks, you did not just lose your app's accounts — you handed over other people's lives. That is why this is treated as a serious offence and not a bug.</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">Key Concept</div>
            <p className="ref-concept-box-text"><strong>Hashing is a one-way street.</strong> You can turn a password into a hash, but you cannot turn a hash back into the password. So we never store the password — we store the hash. At login we hash the incoming password again and compare the two hashes. The server itself never knows your real password.</p>
          </div>

          <table className="ref-compare-table">
            <thead>
              <tr><th>What</th><th>Encoding (Base64)</th><th>Encryption (AES)</th><th>Hashing (bcrypt)</th></tr>
            </thead>
            <tbody>
              <tr><td className="cell-title">Reversible?</td><td className="cell-muted">Yes, by anyone</td><td className="cell-muted">Yes, with the key</td><td className="cell-highlight">No, by design</td></tr>
              <tr><td className="cell-title">Needs a key?</td><td className="cell-muted">No</td><td className="cell-muted">Yes</td><td className="cell-highlight">No</td></tr>
              <tr><td className="cell-title">Used for</td><td className="cell-muted">Safe transport of data — JWT parts</td><td className="cell-muted">Data you must read back later</td><td className="cell-highlight">Passwords — you never need them back</td></tr>
            </tbody>
          </table>

          <h3>Why bcrypt and not MD5 or SHA-256</h3>
          <p>MD5 and SHA-256 are hashes too, but they were built to be <em>fast</em>. A modern GPU can try billions of guesses per second against them, and precomputed rainbow tables already contain every common password. Fast is exactly what you do not want here.</p>

          <p>bcrypt is deliberately <strong>slow</strong>, and you control how slow with a cost factor. It also <strong>salts</strong> every password automatically — a random value mixed in before hashing. Look at Aman and Neha, who chose the same password:</p>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">bcrypt.hash("sheryians123", 10) — run twice</span>
            </div>
<pre className="ref-code-pre"><span className="token-comment"># aman</span>{"\n"}
<span className="token-string">$2b$10$GnnIMosW7uaOVRg98b9jOeBlf6ZQb6lmq1cLpTZo9y6fD/SgMypMe</span>{"\n"}
{"\n"}
<span className="token-comment"># neha — same password, completely different hash</span>{"\n"}
<span className="token-string">$2b$10$Ao8zemGb5v7Wbp/o8E.V/eGHZrT0Km.doIcku8ZxQpFNCUojLMqUu</span></pre>
          </div>

          <p>Same input, different output, because each got its own random salt. An attacker cannot spot that two users share a password, and cannot crack a thousand accounts with one precomputed table — every account has to be attacked separately, slowly.</p>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">Never hash on the client, never log a password, and never send the password or its hash back in a response. And do not invent your own hashing scheme — <strong>reversing your own "secret formula" is the first thing an attacker tries.</strong></p>
          </div>

          <div className="ref-quiz-box" id="quiz-08">
            <p className="ref-quiz-question">Two users pick the same password. Why do their bcrypt hashes look completely different?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-08', 0, 'A — Because bcrypt encrypts each one with a different secret key', false)}
              {renderQuizOption('quiz-08', 1, 'B — Because bcrypt mixes a fresh random salt into every hash', true)}
            </div>
            {quizResults['quiz-08'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-08'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-08'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 09 ══ */}
        <section className="ref-section-block animate-fade-up" id="s09">
          <div className="ref-section-header">
            <div className="ref-section-num-big">09</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">bcrypt in practice</div>
              <div className="ref-section-subtitle">Two functions, and what that weird string actually contains</div>
            </div>
          </div>

          <div className="ref-badge ref-badge-accent">Step 1 — Hash on registration</div>
          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">hashing a password</span>
            </div>
<pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">bcrypt</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">"bcryptjs"</span>);{"\n"}
{"\n"}
<span className="token-yaml-key">const</span> <span className="token-val">hashedPassword</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-val">bcrypt</span>.<span className="token-command">hash</span>(<span className="token-val">password</span>, <span className="token-val">10</span>);{"\n"}
<span className="token-comment">//                                         ↑ cost factor (salt rounds)</span>{"\n"}
{"\n"}
<span className="token-comment">// store hashedPassword in the database — never the plain one</span></pre>
          </div>

          <div className="ref-badge ref-badge-green">Step 2 — Compare on login</div>
          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">checking a password</span>
            </div>
<pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">isMatch</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-val">bcrypt</span>.<span className="token-command">compare</span>(<span className="token-val">password</span>, <span className="token-val">user</span>.<span className="token-val">password</span>);{"\n"}
<span className="token-comment">//                                     plain input    stored hash</span>{"\n"}
{"\n"}
<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">isMatch</span>) {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">401</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"invalid email or password"</span>{` } `});{"\n"}
{`}`}{"\n"}
</pre>
          </div>

          <p>Notice we never "decrypt" anything. <code>bcrypt.compare</code> reads the salt out of the stored hash, hashes the incoming password with that same salt, and checks whether the results match.</p>

          <h4>Reading a bcrypt hash</h4>
          <table className="ref-flag-table">
            <thead>
              <tr><th>Segment</th><th>Value in our example</th><th>What it means</th></tr>
            </thead>
            <tbody>
              <tr><td><span className="ref-flag-name">algorithm</span></td><td><span className="ref-flag-val">$2b</span></td><td>Which bcrypt version produced this hash.</td></tr>
              <tr><td><span className="ref-flag-name">cost</span></td><td><span className="ref-flag-val">$10</span></td><td>2<sup>10</sup> rounds of work. Every +1 doubles the time to hash — and to attack.</td></tr>
              <tr><td><span className="ref-flag-name">salt</span></td><td><span className="ref-flag-val">GnnIMosW7uaOVRg98b9jOe</span></td><td>The 22-character random salt, stored right inside the hash so login can reuse it.</td></tr>
              <tr><td><span className="ref-flag-name">hash</span></td><td><span className="ref-flag-val">Blf6ZQb6lmq1cLpTZo9y6fD/SgMypMe</span></td><td>The actual result of hashing password + salt.</td></tr>
            </tbody>
          </table>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text">Cost <strong>10</strong> is a sensible default — roughly 50–100 ms per hash. Slow enough to make brute force painful, fast enough that your login route still feels instant. Do not push it to 20 "for extra security" unless you enjoy 30-second logins.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-09">
            <p className="ref-quiz-question">Where does bcrypt store the salt it used?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-09', 0, 'A — Inside the hash string itself, so compare() can read it back', true)}
              {renderQuizOption('quiz-09', 1, 'B — In a separate salts collection you have to create', false)}
            </div>
            {quizResults['quiz-09'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-09'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-09'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 10 ══ */}
        <section className="ref-section-block animate-fade-up" id="s10">
          <div className="ref-section-header">
            <div className="ref-section-num-big">10</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Setup</div>
              <div className="ref-section-subtitle">Packages, environment variables, and the user model</div>
            </div>
          </div>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">Terminal</span>
            </div>
<pre className="ref-code-pre"><span className="token-command">npm</span> <span className="token-flag">install</span> <span className="token-val">jsonwebtoken bcryptjs cookie-parser dotenv</span></pre>
          </div>

          <table className="ref-flag-table">
            <thead>
              <tr><th>Package</th><th>Used for</th><th>What it gives you</th></tr>
            </thead>
            <tbody>
              <tr><td><span className="ref-flag-name">jsonwebtoken</span></td><td><span className="ref-flag-val">tokens</span></td><td>Creates and verifies JWTs — <code>jwt.sign()</code> and <code>jwt.verify()</code>.</td></tr>
              <tr><td><span className="ref-flag-name">bcryptjs</span></td><td><span className="ref-flag-val">passwords</span></td><td>Hashes passwords and compares them — <code>bcrypt.hash()</code> and <code>bcrypt.compare()</code>.</td></tr>
              <tr><td><span className="ref-flag-name">cookie-parser</span></td><td><span className="ref-flag-val">reading cookies</span></td><td>Fills <code>req.cookies</code> so the middleware can pick the token out of the request.</td></tr>
              <tr><td><span className="ref-flag-name">dotenv</span></td><td><span className="ref-flag-val">secrets</span></td><td>Loads your <code>.env</code> file into <code>process.env</code>.</td></tr>
            </tbody>
          </table>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">.env</span>
            </div>
<pre className="ref-code-pre"><span className="token-yaml-key">PORT</span><span className="token-operator">=</span><span className="token-val">3000</span>{"\n"}
<span className="token-yaml-key">MONGO_URI</span><span className="token-operator">=</span><span className="token-string">mongodb://127.0.0.1:27017/auth-class</span>{"\n"}
<span className="token-yaml-key">JWT_SECRET</span><span className="token-operator">=</span><span className="token-string">a-long-random-string-nobody-can-guess</span></pre>
          </div>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">Your <code>JWT_SECRET</code> is the hologram die. Anyone who has it can mint a token for any user, including an admin. <strong>Keep it in <code>.env</code>, add <code>.env</code> to <code>.gitignore</code>, and never hardcode it or push it to GitHub.</strong></p>
          </div>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">models/user.model.js</span>
            </div>
<pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">mongoose</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">"mongoose"</span>);{"\n"}
{"\n"}
<span className="token-yaml-key">const</span> <span className="token-val">userSchema</span> <span className="token-operator">=</span> <span className="token-yaml-key">new</span> <span className="token-command">mongoose.Schema</span>({`{`}{"\n"}
{"  "}<span className="token-yaml-key">name</span>:     {` { `}<span className="token-yaml-key">type</span>: <span className="token-val">String</span>, <span className="token-yaml-key">required</span>: <span className="token-val">true</span>, <span className="token-yaml-key">trim</span>: <span className="token-val">true</span> {` } `},{"\n"}
{"  "}<span className="token-yaml-key">email</span>:    {` { `}<span className="token-yaml-key">type</span>: <span className="token-val">String</span>, <span className="token-yaml-key">required</span>: <span className="token-val">true</span>, <span className="token-yaml-key">unique</span>: <span className="token-val">true</span>, <span className="token-yaml-key">lowercase</span>: <span className="token-val">true</span> {` } `},{"\n"}
{"  "}<span className="token-yaml-key">password</span>: {` { `}<span className="token-yaml-key">type</span>: <span className="token-val">String</span>, <span className="token-yaml-key">required</span>: <span className="token-val">true</span>, <span className="token-yaml-key">select</span>: <span className="token-val">false</span> {` } `},{"\n"}
{"  "}<span className="token-yaml-key">role</span>:     {` { `}<span className="token-yaml-key">type</span>: <span className="token-val">String</span>, <span className="token-yaml-key">enum</span>: [<span className="token-string">"user"</span>, <span className="token-string">"admin"</span>], <span className="token-yaml-key">default</span>: <span className="token-string">"user"</span> {` } `}{"\n"}
{`}`} , {` { `}<span className="token-yaml-key">timestamps</span>: <span className="token-val">true</span> {` } `});{"\n"}
{"\n"}
<span className="token-val">module</span>.<span className="token-val">exports</span> <span className="token-operator">=</span> <span className="token-val">mongoose</span>.<span className="token-command">model</span>(<span className="token-string">"User"</span>, <span className="token-val">userSchema</span>);</pre>
          </div>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text"><code>select: false</code> on the password means every normal query leaves it out automatically. You cannot leak a hash you never fetched. On login you ask for it explicitly with <code>.select("+password")</code>.</p>
          </div>
        </section>

        {/* ══ 11 ══ */}
        <section className="ref-section-block animate-fade-up" id="s11">
          <div className="ref-section-header">
            <div className="ref-section-num-big">11</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The register route</div>
              <div className="ref-section-subtitle">Filling the admission form</div>
            </div>
          </div>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">controllers/auth.controller.js</span>
            </div>
<pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">bcrypt</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">"bcryptjs"</span>);{"\n"}
<span className="token-yaml-key">const</span> <span className="token-val">User</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">"../models/user.model"</span>);{"\n"}
<span className="token-yaml-key">const</span> {` { `}<span className="token-val">signToken</span>{` } `} <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">"../utils/token"</span>);{"\n"}
{"\n"}
<span className="token-val">module</span>.<span className="token-val">exports</span>.<span className="token-val">register</span> <span className="token-operator">=</span> <span className="token-yaml-key">async</span> (<span className="token-val">req</span>, <span className="token-val">res</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-yaml-key">const</span> {` { `}<span className="token-val">name</span>, <span className="token-val">email</span>, <span className="token-val">password</span>{` } `} <span className="token-operator">=</span> <span className="token-val">req</span>.<span className="token-val">body</span>;{"\n"}
{"\n"}
{"  "}<span className="token-comment">// 1. validate</span>{"\n"}
{"  "}<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">name</span> <span className="token-operator">||</span> <span className="token-operator">!</span><span className="token-val">email</span> <span className="token-operator">||</span> <span className="token-operator">!</span><span className="token-val">password</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">400</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"all fields are required"</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-comment">// 2. is this email already admitted?</span>{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">exists</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-val">User</span>.<span className="token-command">findOne</span>({` { `}<span className="token-val">email</span>{` } `});{"\n"}
{"  "}<span className="token-yaml-key">if</span> (<span className="token-val">exists</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">409</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"email already registered"</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-comment">// 3. hash — the plain password must never reach the database</span>{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">hashedPassword</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-val">bcrypt</span>.<span className="token-command">hash</span>(<span className="token-val">password</span>, <span className="token-val">10</span>);{"\n"}
{"\n"}
{"  "}<span className="token-comment">// 4. create the user (the register entry)</span>{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">user</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-val">User</span>.<span className="token-command">create</span>({` { `}<span className="token-val">name</span>, <span className="token-val">email</span>, <span className="token-yaml-key">password</span>: <span className="token-val">hashedPassword</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-comment">// 5. issue the ID card</span>{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">token</span> <span className="token-operator">=</span> <span className="token-command">signToken</span>(<span className="token-val">user</span>);{"\n"}
{"  "}<span className="token-val">res</span>.<span className="token-command">cookie</span>(<span className="token-string">"token"</span>, <span className="token-val">token</span>, {` { `}<span className="token-yaml-key">httpOnly</span>: <span className="token-val">true</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">201</span>).<span className="token-command">json</span>({`{`}{"\n"}
{"    "}<span className="token-yaml-key">message</span>: <span className="token-string">"registered successfully"</span>,{"\n"}
{"    "}<span className="token-yaml-key">user</span>: {` { `}<span className="token-yaml-key">id</span>: <span className="token-val">user</span>.<span className="token-val">_id</span>, <span className="token-yaml-key">name</span>: <span className="token-val">user</span>.<span className="token-val">name</span>, <span className="token-yaml-key">email</span>: <span className="token-val">user</span>.<span className="token-val">email</span>{` } `}{"\n"}
{"  "}{`}`});                                <span className="token-comment">// ↑ never send the password back</span>{"\n"}
{`}`};</pre>
          </div>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text">Notice the order: <strong>validate → check duplicate → hash → save → issue token</strong>. Every step is cheap protection for the step after it. And <code>409 Conflict</code> is the honest status for "this email already exists", not <code>400</code>.</p>
          </div>
        </section>

        {/* ══ 12 ══ */}
        <section className="ref-section-block animate-fade-up" id="s12">
          <div className="ref-section-header">
            <div className="ref-section-num-big">12</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The login route</div>
              <div className="ref-section-subtitle">Collecting a fresh ID card</div>
            </div>
          </div>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">controllers/auth.controller.js</span>
            </div>
<pre className="ref-code-pre"><span className="token-val">module</span>.<span className="token-val">exports</span>.<span class="token-val">login</span> <span className="token-operator">=</span> <span className="token-yaml-key">async</span> (<span className="token-val">req</span>, <span className="token-val">res</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-yaml-key">const</span> {` { `}<span className="token-val">email</span>, <span className="token-val">password</span>{` } `} <span className="token-operator">=</span> <span className="token-val">req</span>.<span className="token-val">body</span>;{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">email</span> <span className="token-operator">||</span> <span className="token-operator">!</span><span className="token-val">password</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">400</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"email and password are required"</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-comment">// password is select:false in the schema, so ask for it explicitly</span>{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">user</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-val">User</span>.<span className="token-command">findOne</span>({` { `}<span className="token-val">email</span>{` } `}).<span className="token-command">select</span>(<span className="token-string">"+password"</span>);{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">user</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">401</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"invalid email or password"</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">isMatch</span> <span className="token-operator">=</span> <span className="token-yaml-key">await</span> <span className="token-val">bcrypt</span>.<span className="token-command">compare</span>(<span className="token-val">password</span>, <span className="token-val">user</span>.<span className="token-val">password</span>);{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">isMatch</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">401</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"invalid email or password"</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">token</span> <span className="token-operator">=</span> <span className="token-command">signToken</span>(<span className="token-val">user</span>);{"\n"}
{"  "}<span className="token-val">res</span>.<span className="token-command">cookie</span>(<span className="token-string">"token"</span>, <span className="token-val">token</span>, {` { `}<span className="token-yaml-key">httpOnly</span>: <span className="token-val">true</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">200</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"logged in"</span>{` } `});{"\n"}
{`}`};</pre>
          </div>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">Both failures return the same message: <strong>"invalid email or password"</strong>. If you say "user not found" for one and "wrong password" for the other, you have just built a tool that tells an attacker which emails are registered on your platform.</p>
          </div>
        </section>

        {/* ══ 13 ══ */}
        <section className="ref-section-block animate-fade-up" id="s13">
          <div className="ref-section-header">
            <div className="ref-section-num-big">13</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">The auth middleware</div>
              <div className="ref-section-subtitle">The guard at every gate</div>
            </div>
          </div>

          <p>This is where authentication actually pays off. One small middleware sits in front of every protected route, checks the card, and hands the route a ready-made <code>req.user</code>.</p>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">middlewares/auth.middleware.js</span>
            </div>
<pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">jwt</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">"jsonwebtoken"</span>);{"\n"}
{"\n"}
<span className="token-val">module</span>.<span className="token-val">exports</span>.<span className="token-val">isLoggedIn</span> <span className="token-operator">=</span> (<span className="token-val">req</span>, <span className="token-val">res</span>, <span className="token-val">next</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-comment">// the card can arrive as a cookie or an Authorization header</span>{"\n"}
{"  "}<span className="token-yaml-key">const</span> <span className="token-val">token</span> <span className="token-operator">=</span>{"\n"}
{"    "}<span className="token-val">req</span>.<span className="token-val">cookies</span>.<span className="token-val">token</span> <span className="token-operator">||</span> <span className="token-val">req</span>.<span className="token-val">headers</span>.<span class="token-val">authorization</span><span className="token-operator">?.</span><span className="token-command">split</span>(<span class="token-string">" "</span>)[<span className="token-val">1</span>];{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">token</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">401</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"please login first"</span>{` } `});{"\n"}
{"\n"}
{"  "}<span className="token-yaml-key">try</span> {`{`}{"\n"}
{"    "}<span className="token-comment">// verify = recompute the signature and check expiry</span>{"\n"}
{"    "}<span className="token-yaml-key">const</span> <span className="token-val">decoded</span> <span className="token-operator">=</span> <span className="token-val">jwt</span>.<span className="token-command">verify</span>(<span className="token-val">token</span>, <span className="token-val">process</span>.<span className="token-val">env</span>.<span className="token-val">JWT_SECRET</span>);{"\n"}
{"    "}<span className="token-val">req</span>.<span className="token-val">user</span> <span className="token-operator">=</span> <span className="token-val">decoded</span>;        <span className="token-comment">// {` { `}id, role, iat, exp{` } `}</span>{"\n"}
{"    "}<span className="token-command">next</span>();{"\n"}
{"  "}{`}`} <span className="token-yaml-key">catch</span> (<span className="token-val">err</span>) {`{`}{"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">401</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"invalid or expired token"</span>{` } `});{"\n"}
{"  "}{`}`}{"\n"}
{`}`};</pre>
          </div>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">Use <code>jwt.verify()</code>, never <code>jwt.decode()</code>. <strong><code>decode()</code> only reads the payload and checks nothing</strong> — no signature, no expiry. Using it to authenticate means any string a user invents becomes a valid login.</p>
          </div>

          <h3>Adding authorization on top</h3>
          <p>Authentication is done. Now the role check — the same card, a different gate:</p>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">middlewares/role.middleware.js</span>
            </div>
<pre className="ref-code-pre"><span className="token-val">module</span>.<span className="token-val">exports</span>.<span className="token-val">allow</span> <span className="token-operator">=</span> (<span className="token-operator">...</span><span className="token-val">roles</span>) <span className="token-operator">=&gt;</span> (<span className="token-val">req</span>, <span className="token-val">res</span>, <span className="token-val">next</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-yaml-key">if</span> (<span className="token-operator">!</span><span className="token-val">roles</span>.<span className="token-command">includes</span>(<span className="token-val">req</span>.<span className="token-val">user</span>.<span className="token-val">role</span>)){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">res</span>.<span className="token-command">status</span>(<span className="token-val">403</span>).<span className="token-command">json</span>({` { `}<span className="token-yaml-key">message</span>: <span className="token-string">"you are not allowed to do this"</span>{` } `});{"\n"}
{"  "}<span className="token-command">next</span>();{"\n"}
{`}`};</pre>
          </div>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">routes/product.routes.js</span>
            </div>
<pre className="ref-code-pre"><span className="token-comment">// authentication → authorization → controller</span>{"\n"}
<span className="token-val">router</span>.<span className="token-command">delete</span>({"\n"}
{"  "}<span className="token-string">"/products/:id"</span>,{"\n"}
{"  "}<span className="token-val">isLoggedIn</span>,          <span className="token-comment">// who are you?      → 401</span>{"\n"}
{"  "}<span className="token-command">allow</span>(<span className="token-string">"admin"</span>),      <span className="token-comment">// allowed to do it? → 403</span>{"\n"}
{"  "}<span className="token-val">deleteProduct</span>{"\n"}
);{"\n"}
{"\n"}
<span className="token-comment">// inside deleteProduct you can now trust req.user.id — it came from</span>{"\n"}
<span className="token-comment">// a signed token, not from the request body.</span></pre>
          </div>

          <div className="ref-quiz-box" id="quiz-13">
            <p className="ref-quiz-question">Why must the controller use <code>req.user.id</code> instead of <code>req.body.userId</code>?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-13', 0, 'A — req.user.id came from a verified token; the body is written by the client', true)}
              {renderQuizOption('quiz-13', 1, 'B — They are the same, req.user.id is just shorter to type', false)}
            </div>
            {quizResults['quiz-13'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-13'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-13'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 14 ══ */}
        <section className="ref-section-block animate-fade-up" id="s14">
          <div className="ref-section-header">
            <div className="ref-section-num-big">14</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Where the token lives</div>
              <div className="ref-section-subtitle">Two places to keep the card, and why one is safer</div>
            </div>
          </div>

          <table className="ref-compare-table">
            <thead>
              <tr><th>What</th><th>localStorage</th><th>httpOnly cookie</th></tr>
            </thead>
            <tbody>
              <tr><td className="cell-title">Sent automatically</td><td className="cell-muted">No — you attach it by hand on every call</td><td className="cell-highlight">Yes, the browser attaches it</td></tr>
              <tr><td className="cell-title">Readable by JavaScript</td><td className="cell-muted">Yes — so any injected script can steal it</td><td className="cell-highlight">No — JS cannot touch it</td></tr>
              <tr><td className="cell-title">Works with</td><td className="cell-muted">Mobile apps, third-party APIs</td><td className="cell-highlight">Browser apps on your own domain</td></tr>
              <tr><td className="cell-title">Needs care about</td><td className="cell-muted">XSS</td><td className="cell-highlight">CSRF — handled with <code>sameSite</code></td></tr>
            </tbody>
          </table>

          <div className="ref-code-block">
            <div className="ref-code-header">
              <span className="ref-code-label">production cookie options</span>
            </div>
<pre className="ref-code-pre"><span className="token-val">res</span>.<span className="token-command">cookie</span>(<span className="token-string">"token"</span>, <span className="token-val">token</span>, {`{`}{"\n"}
{"  "}<span className="token-yaml-key">httpOnly</span>: <span className="token-val">true</span>,                    <span className="token-comment">// JS cannot read it</span>{"\n"}
{"  "}<span className="token-yaml-key">secure</span>: <span className="token-val">process</span>.<span className="token-val">env</span>.<span className="token-val">NODE_ENV</span> <span className="token-operator">===</span> <span className="token-string">"production"</span>,  <span className="token-comment">// HTTPS only</span>{"\n"}
{"  "}<span className="token-yaml-key">sameSite</span>: <span className="token-string">"lax"</span>,                   <span className="token-comment">// blocks most CSRF</span>{"\n"}
{"  "}<span className="token-yaml-key">maxAge</span>: <span className="token-val">7</span> <span className="token-operator">*</span> <span className="token-val">24</span> <span className="token-operator">*</span> <span className="token-val">60</span> <span className="token-operator">*</span> <span class="token-val">60</span> <span className="token-operator">*</span> <span class="token-val">1000</span>   <span className="token-comment">// 7 days, matching the JWT</span>{"\n"}
{`}`});{"\n"}
{"\n"}
<span className="token-comment">// logout = take the card back</span>{"\n"}
<span className="token-val">res</span>.<span className="token-command">clearCookie</span>(<span className="token-string">"token"</span>);</pre>
          </div>

          <div className="ref-note-box">
            <div className="ref-note-box-icon">💡</div>
            <p className="ref-note-box-text">Here is the honest limitation of stateless auth: because the server stores nothing, it cannot un-issue a token. If someone steals a valid token, it works until it expires — clearing the cookie only clears <em>that browser</em>. The industry answer is short-lived access tokens plus refresh tokens, which is our next session.</p>
          </div>

          <div className="ref-quiz-box" id="quiz-14">
            <p className="ref-quiz-question">Why is an <code>httpOnly</code> cookie safer than <code>localStorage</code> for a browser app?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-14', 0, 'A — Because cookies are encrypted by the browser', false)}
              {renderQuizOption('quiz-14', 1, 'B — Because JavaScript cannot read it, so an injected script cannot steal the token', true)}
            </div>
            {quizResults['quiz-14'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-14'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-14'].isCorrect ? '✓ Correct!' : '✗ Not quite — try reviewing that section.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 15 ══ */}
        <section className="ref-section-block animate-fade-up" id="s15">
          <div className="ref-section-header">
            <div className="ref-section-num-big">15</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Mistakes to avoid</div>
              <div className="ref-section-subtitle">Check your project against this list before you push</div>
            </div>
          </div>

          <table className="ref-compare-table">
            <thead>
              <tr><th>Mistake</th><th>What it costs you</th><th>Do this instead</th></tr>
            </thead>
            <tbody>
              <tr><td className="cell-title">Storing plain passwords</td><td className="cell-muted">One leak exposes every user, and their other accounts too</td><td className="cell-highlight">Always <code>bcrypt.hash(password, 10)</code></td></tr>
              <tr><td className="cell-title">Personal data in the payload</td><td className="cell-muted">Anyone holding the token can read it</td><td className="cell-highlight">Only <code>id</code> and <code>role</code></td></tr>
              <tr><td className="cell-title">Hardcoding <code>JWT_SECRET</code></td><td className="cell-muted">Secret ends up on GitHub; anyone can mint admin tokens</td><td className="cell-highlight"><code>.env</code> plus <code>.gitignore</code></td></tr>
              <tr><td className="cell-title">Using <code>jwt.decode()</code> to authenticate</td><td className="cell-muted">No signature check — auth is completely bypassed</td><td className="cell-highlight"><code>jwt.verify()</code> inside try/catch</td></tr>
              <tr><td className="cell-title">Trusting <code>req.body.userId</code></td><td className="cell-muted">Any user can act as any other user</td><td className="cell-highlight"><code>req.user.id</code> from the middleware</td></tr>
              <tr><td className="cell-title">Tokens that never expire</td><td className="cell-muted">A stolen token is valid forever</td><td className="cell-highlight">Set <code>expiresIn</code>, keep it short</td></tr>
              <tr><td className="cell-title">"User not found" vs "wrong password"</td><td className="cell-muted">Leaks which emails are registered</td><td className="cell-highlight">One message for both</td></tr>
              <tr><td className="cell-title">Returning the user with the hash</td><td className="cell-muted">Ships the hash to the browser for no reason</td><td className="cell-highlight"><code>select: false</code>, send only safe fields</td></tr>
            </tbody>
          </table>
        </section>

        {/* ══ 16 ══ */}
        <section className="ref-section-block animate-fade-up" id="s16">
          <div className="ref-section-header">
            <div className="ref-section-num-big">16</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Recap and practice</div>
              <div className="ref-section-subtitle">What to build before the next class</div>
            </div>
          </div>

          <div className="ref-scale-diagram">
            <span className="highlight">Request arrives — server has no idea who sent it</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
            <span className="highlight">Validate the body</span> — is this data even usable?<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
            <span className="green" style={{color: 'var(--accent2)'}}>Authenticate</span> — verify the token, set req.user (who are you?)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
            <span className="green" style={{color: 'var(--accent2)'}}>Authorize</span> — check the role (are you allowed?)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;↓<br/>
            <span className="green" style={{color: 'var(--accent2)'}}>Controller runs with a trusted identity ✅</span>
          </div>

          <h3>Build this yourself</h3>
          <div className="ref-flow-diagram">
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-accent"></div><div className="ref-flow-line"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">1 — Register and login</div>
                <div className="ref-flow-desc">A fresh Express + Mongoose project with <code>/register</code> and <code>/login</code>. Hash with bcrypt, issue a JWT in an httpOnly cookie. Check in Compass that no plain password was ever saved.</div>
              </div>
            </div>
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-accent"></div><div className="ref-flow-line"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">2 — Protect a route</div>
                <div className="ref-flow-desc">Add <code>GET /profile</code> behind <code>isLoggedIn</code>, returning the logged-in user from <code>req.user.id</code>. Call it in Postman without a token and confirm you get 401.</div>
              </div>
            </div>
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-accent"></div><div className="ref-flow-line"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">3 — Add a role</div>
                <div className="ref-flow-desc">Give one user <code>role: "admin"</code>, add <code>DELETE /products/:id</code> behind <code>allow("admin")</code>, and confirm a normal user gets 403 while the admin gets through.</div>
              </div>
            </div>
            <div className="ref-flow-step">
              <div className="ref-flow-connector"><div className="ref-flow-dot ref-flow-dot-green"></div></div>
              <div className="ref-flow-content">
                <div className="ref-flow-title">4 — Break it on purpose</div>
                <div className="ref-flow-desc">Copy your token into the decoder in section 05, change the role to admin, re-encode it and send it. Watch the server reject it — then explain out loud why.</div>
              </div>
            </div>
          </div>

          <h4>Questions you should be able to answer</h4>
          <ul>
            <li>What is the difference between authentication and authorization, and which status code belongs to each?</li>
            <li>Why is a JWT not secure to put personal data in, even though it is signed?</li>
            <li>Why do we hash passwords instead of encrypting them?</li>
            <li>What does a salt do, and why do two identical passwords produce different hashes?</li>
            <li>What is the difference between <code>jwt.decode()</code> and <code>jwt.verify()</code>?</li>
            <li>Why can't a stateless JWT be cancelled before it expires?</li>
          </ul>
        </section>

      </main>
    </div>
  );
};
