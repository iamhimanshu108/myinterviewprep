import React, { useState, useEffect } from 'react';

export const CrudCohortNotesViewer: React.FC = () => {
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
          <div className="logo">CRUD<span className="accent-dot">.</span>101</div>
        </div>

        <div className="ref-nav-group-label">Foundations</div>
        <button onClick={() => scrollToSection('s01')} className={`ref-nav-link ${activeSectionId === 's01' ? 'active' : ''}`}><span className="ref-nav-num">1</span> What is CRUD?</button>
        <button onClick={() => scrollToSection('s02')} className={`ref-nav-link ${activeSectionId === 's02' ? 'active' : ''}`}><span className="ref-nav-num">2</span> Mapping to SQL</button>
        <button onClick={() => scrollToSection('s03')} className={`ref-nav-link ${activeSectionId === 's03' ? 'active' : ''}`}><span className="ref-nav-num">3</span> Mapping to REST</button>

        <div className="ref-nav-group-label">Database Access</div>
        <button onClick={() => scrollToSection('s04')} className={`ref-nav-link ${activeSectionId === 's04' ? 'active' : ''}`}><span className="ref-nav-num">4</span> Intro to ORMs</button>
        <button onClick={() => scrollToSection('s05')} className={`ref-nav-link ${activeSectionId === 's05' ? 'active' : ''}`}><span className="ref-nav-num">5</span> Code Snippets</button>
      </nav>

      <main className="ref-main-content">
        <header className="ref-hero animate-fade-up">
          <div className="ref-hero-eyebrow">Cohort · Backend · Session notes</div>
          <h1>The lifecycle of <em>data</em></h1>
          <p className="ref-hero-desc">Almost every web application is just a fancy interface over a database. To build them, you need to master the four foundational operations that govern the entire lifecycle of persistent data: Create, Read, Update, and Delete.</p>
          <div className="ref-hero-tags">
            <span className="ref-hero-tag">CRUD</span>
            <span className="ref-hero-tag">SQL</span>
            <span className="ref-hero-tag">ORM</span>
            <span className="ref-hero-tag">Persistence</span>
          </div>
        </header>

        {/* ══ 01 ══ */}
        <section className="ref-section-block animate-fade-up" id="s01">
          <div className="ref-section-header">
            <div className="ref-section-num-big">01</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">What is CRUD?</div>
              <div className="ref-section-subtitle">The four pillars of persistent storage</div>
            </div>
          </div>

          <p>Think about any app you use — Twitter, Instagram, Amazon. What are you actually doing?</p>
          <ul>
            <li>You post a tweet (<strong>Create</strong>).</li>
            <li>You scroll your feed (<strong>Read</strong>).</li>
            <li>You edit your profile bio (<strong>Update</strong>).</li>
            <li>You delete a comment (<strong>Delete</strong>).</li>
          </ul>

          <p>This acronym <strong>CRUD</strong> describes the four basic functions that models should be able to perform, at most, when interacting with a database.</p>
        </section>

        {/* ══ 02 ══ */}
        <section className="ref-section-block animate-fade-up" id="s02">
          <div className="ref-section-header">
            <div className="ref-section-num-big">02</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Mapping to SQL</div>
              <div className="ref-section-subtitle">How CRUD translates to relational databases</div>
            </div>
          </div>

          <p>When you are talking to a relational database (like PostgreSQL or MySQL), you use a language called SQL. The CRUD concepts map perfectly to four specific SQL commands.</p>

          <table className="ref-flag-table">
            <thead>
              <tr><th>CRUD Operation</th><th>SQL Command</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Create</strong></td>
                <td><span className="ref-flag-name">INSERT</span></td>
                <td><code>INSERT INTO users (name) VALUES ('Alice');</code></td>
              </tr>
              <tr>
                <td><strong>Read</strong></td>
                <td><span className="ref-flag-val" style={{color: 'var(--accent2)'}}>SELECT</span></td>
                <td><code>SELECT * FROM users WHERE id = 1;</code></td>
              </tr>
              <tr>
                <td><strong>Update</strong></td>
                <td><span className="ref-flag-val" style={{color: 'var(--val-c)'}}>UPDATE</span></td>
                <td><code>UPDATE users SET name = 'Bob' WHERE id = 1;</code></td>
              </tr>
              <tr>
                <td><strong>Delete</strong></td>
                <td><span className="ref-flag-name" style={{borderColor: 'var(--accent)', color: 'var(--accent)'}}>DELETE</span></td>
                <td><code>DELETE FROM users WHERE id = 1;</code></td>
              </tr>
            </tbody>
          </table>

          <div className="ref-warning-box">
            <div className="ref-warning-box-icon">⚠️</div>
            <p className="ref-warning-box-text">Always remember your <code>WHERE</code> clause! Running an <code>UPDATE</code> or <code>DELETE</code> command without a <code>WHERE</code> clause will update or delete <strong>every single row</strong> in the table.</p>
          </div>
        </section>

        {/* ══ 03 ══ */}
        <section className="ref-section-block animate-fade-up" id="s03">
          <div className="ref-section-header">
            <div className="ref-section-num-big">03</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Mapping to REST APIs</div>
              <div className="ref-section-title">Bridging the gap to the web</div>
            </div>
          </div>

          <p>When building a web backend, your API acts as a translator between the Frontend's HTTP requests and the Database's SQL commands. CRUD is the universal concept that glues them together.</p>

          <table className="ref-compare-table">
            <thead>
              <tr><th>HTTP Method</th><th>CRUD</th><th>SQL Command</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-title">POST</td>
                <td className="cell-highlight">Create</td>
                <td className="cell-muted"><code>INSERT</code></td>
              </tr>
              <tr>
                <td className="cell-title">GET</td>
                <td className="cell-highlight">Read</td>
                <td className="cell-muted"><code>SELECT</code></td>
              </tr>
              <tr>
                <td className="cell-title">PUT / PATCH</td>
                <td className="cell-highlight">Update</td>
                <td className="cell-muted"><code>UPDATE</code></td>
              </tr>
              <tr>
                <td className="cell-title">DELETE</td>
                <td className="cell-highlight">Delete</td>
                <td className="cell-muted"><code>DELETE</code></td>
              </tr>
            </tbody>
          </table>

          <div className="ref-quiz-box" id="quiz-crud-01">
            <p className="ref-quiz-question">If a user clicks "Edit Profile" and submits a new email address, what is the flow of operations?</p>
            <div className="ref-quiz-options">
              {renderQuizOption('quiz-crud-01', 0, 'A — HTTP GET maps to CRUD Read, which executes an INSERT SQL query.', false)}
              {renderQuizOption('quiz-crud-01', 1, 'B — HTTP PATCH maps to CRUD Update, which executes an UPDATE SQL query.', true)}
              {renderQuizOption('quiz-crud-01', 2, 'C — HTTP POST maps to CRUD Create, which executes a SELECT SQL query.', false)}
            </div>
            {quizResults['quiz-crud-01'] && (
              <div className={`ref-quiz-feedback ${quizResults['quiz-crud-01'].isCorrect ? 'correct' : 'incorrect'}`}>
                {quizResults['quiz-crud-01'].isCorrect ? '✓ Exactly! PATCH updates the resource via the UPDATE SQL command.' : '✗ Try again. Think about what operation "Edit" represents.'}
              </div>
            )}
          </div>
        </section>

        {/* ══ 04 ══ */}
        <section className="ref-section-block animate-fade-up" id="s04">
          <div className="ref-section-header">
            <div className="ref-section-num-big">04</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Introduction to ORMs</div>
              <div className="ref-section-subtitle">Object-Relational Mappers</div>
            </div>
          </div>

          <p>Writing raw SQL strings in your code (like <code>db.execute("SELECT * FROM users")</code>) is prone to syntax errors, SQL injection vulnerabilities, and is hard to maintain.</p>

          <p>An <strong>ORM</strong> (or ODM for NoSQL) is a library that lets you query and manipulate data from a database using your preferred programming language's objects and methods.</p>

          <div className="ref-concept-box">
            <div className="ref-concept-box-label">The Translation</div>
            <p className="ref-concept-box-text">
              <strong>Database</strong> ↔️ <strong>Code</strong><br/>
              Table ↔️ Class / Model<br/>
              Row ↔️ Object Instance<br/>
              Column ↔️ Object Property
            </p>
          </div>

          <p>Instead of writing <code>INSERT INTO users (name) VALUES ('Alice')</code>, you simply write <code>User.create({`{ name: 'Alice' }`})</code>. The ORM generates the raw SQL safely and executes it for you.</p>
        </section>

        {/* ══ 05 ══ */}
        <section className="ref-section-block animate-fade-up" id="s05">
          <div className="ref-section-header">
            <div className="ref-section-num-big">05</div>
            <div className="ref-section-header-text">
              <div className="ref-section-title">Code Snippets</div>
              <div className="ref-section-subtitle">Implementing CRUD with modern ORMs</div>
            </div>
          </div>

          <p>Here is how you perform all four CRUD operations using standard ORM libraries in different stacks.</p>

          <div className="mt-6">
            <div className="flex gap-2 mb-2">
              <button 
                onClick={() => setActiveLangTab('express')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'express' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >Express.js (Mongoose)</button>
              <button 
                onClick={() => setActiveLangTab('fastapi')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'fastapi' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >FastAPI (SQLAlchemy)</button>
              <button 
                onClick={() => setActiveLangTab('django')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'django' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >Django ORM</button>
              <button 
                onClick={() => setActiveLangTab('springboot')} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeLangTab === 'springboot' ? 'bg-[var(--accent)] text-white shadow-sm' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >Spring Data JPA</button>
            </div>

            {activeLangTab === 'express' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">controllers/userController.js (Mongoose ODM)</span>
                  <button onClick={() => handleCopyCode(`const User = require('../models/User');\n\n// Create\nconst createUser = async (data) => {\n  return await User.create(data);\n};\n\n// Read\nconst getUser = async (id) => {\n  return await User.findById(id);\n};\n\n// Update\nconst updateUser = async (id, data) => {\n  return await User.findByIdAndUpdate(id, data, { new: true });\n};\n\n// Delete\nconst deleteUser = async (id) => {\n  return await User.findByIdAndDelete(id);\n};`, 'c_ex_crud')} className="ref-code-copy-btn">{copiedKey === 'c_ex_crud' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">const</span> <span className="token-val">User</span> <span className="token-operator">=</span> <span className="token-command">require</span>(<span className="token-string">'../models/User'</span>);{"\n"}
{"\n"}
<span className="token-comment">// Create</span>{"\n"}
<span className="token-yaml-key">const</span> <span className="token-command">createUser</span> <span className="token-operator">=</span> <span className="token-yaml-key">async</span> (<span className="token-val">data</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-yaml-key">await</span> <span className="token-val">User</span>.<span className="token-command">create</span>(<span className="token-val">data</span>);{"\n"}
{`}`};{"\n"}
{"\n"}
<span className="token-comment">// Read</span>{"\n"}
<span className="token-yaml-key">const</span> <span className="token-command">getUser</span> <span className="token-operator">=</span> <span className="token-yaml-key">async</span> (<span className="token-val">id</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-yaml-key">await</span> <span className="token-val">User</span>.<span className="token-command">findById</span>(<span className="token-val">id</span>);{"\n"}
{`}`};{"\n"}
{"\n"}
<span className="token-comment">// Update</span>{"\n"}
<span className="token-yaml-key">const</span> <span className="token-command">updateUser</span> <span className="token-operator">=</span> <span className="token-yaml-key">async</span> (<span className="token-val">id</span>, <span className="token-val">data</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-yaml-key">await</span> <span className="token-val">User</span>.<span className="token-command">findByIdAndUpdate</span>(<span className="token-val">id</span>, <span className="token-val">data</span>, {`{`} <span className="token-yaml-key">new</span>: <span className="token-val">true</span> {`}`});{"\n"}
{`}`};{"\n"}
{"\n"}
<span className="token-comment">// Delete</span>{"\n"}
<span className="token-yaml-key">const</span> <span className="token-command">deleteUser</span> <span className="token-operator">=</span> <span className="token-yaml-key">async</span> (<span className="token-val">id</span>) <span className="token-operator">=&gt;</span> {`{`}{"\n"}
{"  "}<span className="token-yaml-key">return</span> <span className="token-yaml-key">await</span> <span className="token-val">User</span>.<span className="token-command">findByIdAndDelete</span>(<span className="token-val">id</span>);{"\n"}
{`}`};</pre>
              </div>
            )}

            {activeLangTab === 'fastapi' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">crud.py (SQLAlchemy)</span>
                  <button onClick={() => handleCopyCode(`from sqlalchemy.orm import Session\nfrom . import models, schemas\n\n# Create\ndef create_user(db: Session, user: schemas.UserCreate):\n    db_user = models.User(name=user.name)\n    db.add(db_user)\n    db.commit()\n    db.refresh(db_user)\n    return db_user\n\n# Read\ndef get_user(db: Session, user_id: int):\n    return db.query(models.User).filter(models.User.id == user_id).first()\n\n# Update\ndef update_user(db: Session, user_id: int, name: str):\n    db_user = get_user(db, user_id)\n    if db_user:\n        db_user.name = name\n        db.commit()\n        db.refresh(db_user)\n    return db_user\n\n# Delete\ndef delete_user(db: Session, user_id: int):\n    db_user = get_user(db, user_id)\n    if db_user:\n        db.delete(db_user)\n        db.commit()\n    return db_user`, 'c_fa_crud')} className="ref-code-copy-btn">{copiedKey === 'c_fa_crud' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">from</span> <span className="token-val">sqlalchemy.orm</span> <span className="token-yaml-key">import</span> <span className="token-command">Session</span>{"\n"}
<span className="token-yaml-key">from</span> <span className="token-val">.</span> <span className="token-yaml-key">import</span> <span className="token-val">models</span>, <span className="token-val">schemas</span>{"\n"}
{"\n"}
<span className="token-comment"># Create</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">create_user</span>(<span className="token-val">db</span>: <span className="token-val">Session</span>, <span className="token-val">user</span>: <span className="token-val">schemas.UserCreate</span>):{"\n"}
{"    "}<span className="token-val">db_user</span> <span className="token-operator">=</span> <span className="token-val">models.User</span>(<span className="token-val">name</span>=<span className="token-val">user.name</span>){"\n"}
{"    "}<span className="token-val">db</span>.<span className="token-command">add</span>(<span className="token-val">db_user</span>){"\n"}
{"    "}<span className="token-val">db</span>.<span className="token-command">commit</span>(){"\n"}
{"    "}<span className="token-val">db</span>.<span className="token-command">refresh</span>(<span className="token-val">db_user</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">db_user</span>{"\n"}
{"\n"}
<span className="token-comment"># Read</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">get_user</span>(<span className="token-val">db</span>: <span className="token-val">Session</span>, <span className="token-val">user_id</span>: <span className="token-command">int</span>):{"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">db</span>.<span className="token-command">query</span>(<span className="token-val">models.User</span>).<span className="token-command">filter</span>(<span className="token-val">models.User.id</span> <span className="token-operator">==</span> <span className="token-val">user_id</span>).<span className="token-command">first</span>(){"\n"}
{"\n"}
<span className="token-comment"># Update</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">update_user</span>(<span className="token-val">db</span>: <span className="token-val">Session</span>, <span className="token-val">user_id</span>: <span className="token-command">int</span>, <span className="token-val">name</span>: <span className="token-command">str</span>):{"\n"}
{"    "}<span className="token-val">db_user</span> <span className="token-operator">=</span> <span className="token-command">get_user</span>(<span className="token-val">db</span>, <span className="token-val">user_id</span>){"\n"}
{"    "}<span className="token-yaml-key">if</span> <span className="token-val">db_user</span>:{"\n"}
{"        "}<span className="token-val">db_user.name</span> <span className="token-operator">=</span> <span className="token-val">name</span>{"\n"}
{"        "}<span className="token-val">db</span>.<span className="token-command">commit</span>(){"\n"}
{"        "}<span className="token-val">db</span>.<span className="token-command">refresh</span>(<span className="token-val">db_user</span>){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">db_user</span>{"\n"}
{"\n"}
<span className="token-comment"># Delete</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">delete_user</span>(<span className="token-val">db</span>: <span className="token-val">Session</span>, <span className="token-val">user_id</span>: <span className="token-command">int</span>):{"\n"}
{"    "}<span className="token-val">db_user</span> <span className="token-operator">=</span> <span className="token-command">get_user</span>(<span className="token-val">db</span>, <span className="token-val">user_id</span>){"\n"}
{"    "}<span className="token-yaml-key">if</span> <span className="token-val">db_user</span>:{"\n"}
{"        "}<span className="token-val">db</span>.<span className="token-command">delete</span>(<span className="token-val">db_user</span>){"\n"}
{"        "}<span className="token-val">db</span>.<span className="token-command">commit</span>(){"\n"}
    <span className="token-yaml-key">return</span> <span className="token-val">db_user</span></pre>
              </div>
            )}

            {activeLangTab === 'django' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">crud.py (Django ORM)</span>
                  <button onClick={() => handleCopyCode(`from .models import User\n\n# Create\ndef create_user(name):\n    return User.objects.create(name=name)\n\n# Read\ndef get_user(user_id):\n    try:\n        return User.objects.get(id=user_id)\n    except User.DoesNotExist:\n        return None\n\n# Update\ndef update_user(user_id, name):\n    user = get_user(user_id)\n    if user:\n        user.name = name\n        user.save()\n    return user\n\n# Delete\ndef delete_user(user_id):\n    user = get_user(user_id)\n    if user:\n        user.delete()\n    return True`, 'c_dj_crud')} className="ref-code-copy-btn">{copiedKey === 'c_dj_crud' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">from</span> <span className="token-val">.models</span> <span className="token-yaml-key">import</span> <span className="token-command">User</span>{"\n"}
{"\n"}
<span className="token-comment"># Create</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">create_user</span>(<span className="token-val">name</span>):{"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">User.objects</span>.<span className="token-command">create</span>(<span className="token-val">name</span>=<span className="token-val">name</span>){"\n"}
{"\n"}
<span className="token-comment"># Read</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">get_user</span>(<span className="token-val">user_id</span>):{"\n"}
{"    "}<span className="token-yaml-key">try</span>:{"\n"}
{"        "}<span className="token-yaml-key">return</span> <span className="token-val">User.objects</span>.<span className="token-command">get</span>(<span className="token-val">id</span>=<span className="token-val">user_id</span>){"\n"}
{"    "}<span className="token-yaml-key">except</span> <span className="token-val">User.DoesNotExist</span>:{"\n"}
{"        "}<span className="token-yaml-key">return</span> <span className="token-val">None</span>{"\n"}
{"\n"}
<span className="token-comment"># Update</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">update_user</span>(<span className="token-val">user_id</span>, <span className="token-val">name</span>):{"\n"}
{"    "}<span className="token-val">user</span> <span className="token-operator">=</span> <span className="token-command">get_user</span>(<span className="token-val">user_id</span>){"\n"}
{"    "}<span className="token-yaml-key">if</span> <span className="token-val">user</span>:{"\n"}
{"        "}<span className="token-val">user.name</span> <span className="token-operator">=</span> <span className="token-val">name</span>{"\n"}
{"        "}<span className="token-val">user</span>.<span className="token-command">save</span>(){"\n"}
{"    "}<span className="token-yaml-key">return</span> <span className="token-val">user</span>{"\n"}
{"\n"}
<span className="token-comment"># Delete</span>{"\n"}
<span className="token-yaml-key">def</span> <span className="token-command">delete_user</span>(<span className="token-val">user_id</span>):{"\n"}
{"    "}<span className="token-val">user</span> <span className="token-operator">=</span> <span className="token-command">get_user</span>(<span className="token-val">user_id</span>){"\n"}
{"    "}<span className="token-yaml-key">if</span> <span className="token-val">user</span>:{"\n"}
{"        "}<span className="token-val">user</span>.<span className="token-command">delete</span>(){"\n"}
    <span className="token-yaml-key">return</span> <span className="token-val">True</span></pre>
              </div>
            )}

            {activeLangTab === 'springboot' && (
              <div className="ref-code-block mt-0">
                <div className="ref-code-header">
                  <span className="ref-code-label">UserService.java (Spring Data JPA)</span>
                  <button onClick={() => handleCopyCode(`import org.springframework.stereotype.Service;\nimport java.util.Optional;\n\n@Service\npublic class UserService {\n    private final UserRepository repository;\n\n    public UserService(UserRepository repository) {\n        this.repository = repository;\n    }\n\n    // Create\n    public User createUser(User user) {\n        return repository.save(user);\n    }\n\n    // Read\n    public Optional<User> getUser(Long id) {\n        return repository.findById(id);\n    }\n\n    // Update\n    public User updateUser(Long id, User userDetails) {\n        return repository.findById(id).map(user -> {\n            user.setName(userDetails.getName());\n            return repository.save(user);\n        }).orElse(null);\n    }\n\n    // Delete\n    public void deleteUser(Long id) {\n        repository.deleteById(id);\n    }\n}`, 'c_sb_crud')} className="ref-code-copy-btn">{copiedKey === 'c_sb_crud' ? 'copied' : 'copy'}</button>
                </div>
                <pre className="ref-code-pre"><span className="token-yaml-key">import</span> <span className="token-val">org.springframework.stereotype.Service</span>;{"\n"}
<span className="token-yaml-key">import</span> <span className="token-val">java.util.Optional</span>;{"\n"}
{"\n"}
<span className="token-command">@Service</span>{"\n"}
<span className="token-yaml-key">public</span> <span className="token-yaml-key">class</span> <span className="token-val">UserService</span> {`{`}{"\n"}
{"    "}<span className="token-yaml-key">private</span> <span className="token-yaml-key">final</span> <span className="token-val">UserRepository</span> <span className="token-val">repository</span>;{"\n"}
{"\n"}
{"    "}<span className="token-yaml-key">public</span> <span className="token-command">UserService</span>(<span className="token-val">UserRepository</span> <span className="token-val">repository</span>) {`{`}{"\n"}
{"        "}<span className="token-yaml-key">this</span>.<span className="token-val">repository</span> <span className="token-operator">=</span> <span className="token-val">repository</span>;{"\n"}
{"    "}{`}`}{"\n"}
{"\n"}
{"    "}<span className="token-comment">// Create</span>{"\n"}
{"    "}<span className="token-yaml-key">public</span> <span className="token-val">User</span> <span className="token-command">createUser</span>(<span className="token-val">User</span> <span className="token-val">user</span>) {`{`}{"\n"}
{"        "}<span className="token-yaml-key">return</span> <span className="token-val">repository</span>.<span className="token-command">save</span>(<span className="token-val">user</span>);{"\n"}
{"    "}{`}`}{"\n"}
{"\n"}
{"    "}<span className="token-comment">// Read</span>{"\n"}
{"    "}<span className="token-yaml-key">public</span> <span className="token-val">Optional</span>&lt;<span className="token-val">User</span>&gt; <span className="token-command">getUser</span>(<span className="token-val">Long</span> <span className="token-val">id</span>) {`{`}{"\n"}
{"        "}<span className="token-yaml-key">return</span> <span className="token-val">repository</span>.<span className="token-command">findById</span>(<span className="token-val">id</span>);{"\n"}
{"    "}{`}`}{"\n"}
{"\n"}
{"    "}<span className="token-comment">// Update</span>{"\n"}
{"    "}<span className="token-yaml-key">public</span> <span className="token-val">User</span> <span className="token-command">updateUser</span>(<span className="token-val">Long</span> <span className="token-val">id</span>, <span className="token-val">User</span> <span className="token-val">userDetails</span>) {`{`}{"\n"}
{"        "}<span className="token-yaml-key">return</span> <span className="token-val">repository</span>.<span className="token-command">findById</span>(<span className="token-val">id</span>).<span className="token-command">map</span>(<span className="token-val">user</span> <span className="token-operator">-&gt;</span> {`{`}{"\n"}
{"            "}<span className="token-val">user</span>.<span className="token-command">setName</span>(<span className="token-val">userDetails</span>.<span className="token-command">getName</span>());{"\n"}
{"            "}<span className="token-yaml-key">return</span> <span className="token-val">repository</span>.<span className="token-command">save</span>(<span className="token-val">user</span>);{"\n"}
{"        "}{`}`}).<span className="token-command">orElse</span>(<span className="token-val">null</span>);{"\n"}
{"    "}{`}`}{"\n"}
{"\n"}
{"    "}<span className="token-comment">// Delete</span>{"\n"}
{"    "}<span className="token-yaml-key">public</span> <span className="token-yaml-key">void</span> <span className="token-command">deleteUser</span>(<span className="token-val">Long</span> <span className="token-val">id</span>) {`{`}{"\n"}
{"        "}<span className="token-val">repository</span>.<span className="token-command">deleteById</span>(<span className="token-val">id</span>);{"\n"}
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
