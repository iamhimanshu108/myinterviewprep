import { Question } from '../../types';

export const REACT_QUESTIONS: Question[] = [
  // ==========================================
  // BEGINNER
  // ==========================================
  {
    id: 'react-1',
    stack: 'react',
    topic: 'Virtual DOM & JSX',
    title: 'What is the Virtual DOM, and how does React\'s Reconciliation diffing algorithm work?',
    difficulty: 'Beginner',
    summary: 'The Virtual DOM is an in-memory lightweight representation of the real DOM tree. React diffs it against the previous render to compute minimal DOM mutations.',
    explanation: [
      'The Virtual DOM (VDOM) is a plain JavaScript object representing the UI tree. Directly modifying the browser DOM is computationally expensive due to recalculating styles, layout reflows, and painting.',
      'During re-renders, React generates a new Virtual DOM tree and runs its Reconciliation diffing heuristic with two core assumptions: 1) Two elements of different types will produce different trees, and 2) Child lists can be tracked efficiently with unique "key" props.',
      'Once differences are computed, React updates only the changed browser DOM nodes in a batched commit phase.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'virtual-dom-diff.jsx',
      code: `// React creates a lightweight virtual representation:
const element = {
  type: 'button',
  props: {
    className: 'btn-primary',
    children: 'Click Me'
  }
};

// Keys help the diffing algorithm match existing DOM nodes:
function TodoList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        // Key prevents destroying and re-mounting the entire list
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}`,
      output: 'Renders list efficiently by preserving matched keys',
      executionSteps: [
        { line: 2, explanation: 'React generates plain JavaScript object tree representing the UI' },
        { line: 11, explanation: 'TodoList component receives updated items array' },
        { line: 16, explanation: 'React uses item.id keys to match old nodes to new nodes in O(n) time' }
      ]
    },
    keyPoints: [
      'Virtual DOM minimizes expensive browser reflow and repaint cycles.',
      'Heuristic diffing runs in linear O(n) time instead of traditional tree diffing O(n³).',
      'Keys must be stable, unique, and predictable (avoid using array indices if list order changes).'
    ],
    interviewTip: 'Always mention that keys must be unique among siblings, not globally. Explain that using array index as keys causes subtle state bugs when items are deleted, prepended, or re-sorted.',
    tags: ['Virtual DOM', 'Reconciliation', 'Diffing', 'Keys']
  },
  {
    id: 'react-2',
    stack: 'react',
    topic: 'State vs Props',
    title: 'What is the fundamental difference between Props and State, and why is data flow unidirectional?',
    difficulty: 'Beginner',
    summary: 'Props are read-only external inputs passed from parent to child, while State is local, mutable internal memory managed within the component.',
    explanation: [
      'Props (short for properties) represent external parameters. A child component must never mutate its props directly; React enforces pure functions with respect to props.',
      'State is internal to the component, holding values that change over time in response to user events, timers, or network responses. Changing state triggers a re-render.',
      'Unidirectional Data Flow: Data flows strictly downward from parent to child via props. Child components notify parents of changes by invoking callback functions passed down as props.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'props-vs-state.jsx',
      code: `import React, { useState } from 'react';

// Parent manages mutable state
function ParentCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Total: {count}</p>
      {/* Downward data flow via props, upward event via callback */}
      <CounterButton label="Increment" onAction={() => setCount(c => c + 1)} />
    </div>
  );
}

// Child is pure: reads props, invokes callback
function CounterButton({ label, onAction }) {
  return <button onClick={onAction}>{label}</button>;
}`,
      output: 'Counter increments smoothly obeying unidirectional flow',
      executionSteps: [
        { line: 5, explanation: 'State initialized with count = 0 in Parent' },
        { line: 11, explanation: 'Passes immutable props label and onAction callback to child' },
        { line: 18, explanation: 'Button click triggers callback, mutating parent state' }
      ]
    },
    keyPoints: [
      'Props: Read-only, passed from parent, configures component.',
      'State: Owned and managed locally, triggers re-render when changed via setter.',
      'One-way data binding guarantees predictable debuggability and prevents circular state updates.'
    ],
    interviewTip: 'Mention "lifting state up" when two sibling components need to share or coordinate the same state.',
    tags: ['Props', 'State', 'Unidirectional Flow', 'Lifting State']
  },
  {
    id: 'react-3',
    stack: 'react',
    topic: 'Controlled vs Uncontrolled',
    title: 'What are Controlled versus Uncontrolled Components in React forms, and when should you use each?',
    difficulty: 'Beginner',
    summary: 'Controlled components have their form values governed directly by React state, while uncontrolled components keep form data in the DOM and access it via refs.',
    explanation: [
      'Controlled Components: The input value is tied to React state via the "value" prop, and updated synchronously on every keystroke via the "onChange" handler. React is the single source of truth.',
      'Uncontrolled Components: The DOM holds the form element state. You access values imperatively when submitted using a React "useRef". You can set an initial value via "defaultValue".',
      'When to choose: Use controlled components for instant validation, conditional submit buttons, and dynamic inputs. Use uncontrolled components for simpler forms, large forms where re-rendering on every keypress causes lag, or file inputs (<input type="file" /> which is always uncontrolled in React).'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'controlled-uncontrolled.jsx',
      code: `import { useState, useRef } from 'react';

// 1. Controlled: React state is single source of truth
function ControlledInput() {
  const [email, setEmail] = useState('');
  return (
    <input 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      placeholder="Instant validation" 
    />
  );
}

// 2. Uncontrolled: DOM holds the value, accessed via ref on submit
function UncontrolledInput() {
  const fileRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected file:', fileRef.current.files[0]?.name);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} />
      <button type="submit">Upload</button>
    </form>
  );
}`,
      output: 'Controlled re-renders on keystroke; Uncontrolled pulls data on submit',
      executionSteps: [
        { line: 5, explanation: 'useState stores input text in React state' },
        { line: 9, explanation: 'onChange intercepts keystroke and synchronizes React state' },
        { line: 17, explanation: 'useRef creates a stable reference to the underlying DOM node' },
        { line: 20, explanation: 'Reads DOM element property imperatively without re-rendering' }
      ]
    },
    keyPoints: [
      'Controlled: Value bound to state, onChange updates state, single source of truth.',
      'Uncontrolled: Form data stored in DOM, retrieved via useRef or FormData.',
      'File input <input type="file" /> is always uncontrolled because its value is read-only in the browser.'
    ],
    interviewTip: 'Mention React Hook Form as a popular library that leverages uncontrolled components with refs to deliver ultra-fast performance without keystroke re-renders.',
    tags: ['Forms', 'Controlled', 'Uncontrolled', 'useRef']
  },

  // ==========================================
  // INTERMEDIATE
  // ==========================================
  {
    id: 'react-4',
    stack: 'react',
    topic: 'Hooks Deep Dive',
    title: 'Explain the difference between useEffect and useLayoutEffect, and how cleanup functions work.',
    difficulty: 'Intermediate',
    summary: 'useEffect runs asynchronously after the browser paints, avoiding blocking visual rendering. useLayoutEffect runs synchronously after DOM mutations but before the browser paints.',
    explanation: [
      'useEffect is non-blocking. React updates the DOM, the browser paints the screen, and then useEffect fires. This is optimal for network calls, event subscriptions, and timer setups.',
      'useLayoutEffect is synchronous. It runs immediately after React mutates the DOM but before the browser paints pixels on screen. Use it when measuring DOM element sizes or mutating the DOM visually to prevent visual flickering.',
      'Cleanup Function: Returned from the effect function, cleanup runs before the component unmounts and before re-running the effect on subsequent renders. It prevents memory leaks from subscriptions, event listeners, and timers.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'useLayoutEffect-demo.jsx',
      code: `import { useState, useEffect, useLayoutEffect, useRef } from 'react';

function Tooltip({ targetRect }) {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // useLayoutEffect runs BEFORE paint: Prevents visible UI flicker
  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const { height } = tooltipRef.current.getBoundingClientRect();
      // Position tooltip directly above target before browser draws screen
      setPosition({ top: targetRect.top - height - 8, left: targetRect.left });
    }
  }, [targetRect]);

  // useEffect runs AFTER paint: Suitable for subscriptions
  useEffect(() => {
    const handleResize = () => console.log('Resizing');
    window.addEventListener('resize', handleResize);
    // Cleanup runs before next effect & on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={tooltipRef} style={{ top: position.top, left: position.left }}>Tooltip</div>;
}`,
      output: 'Tooltip positions cleanly with zero visual stutter',
      executionSteps: [
        { line: 8, explanation: 'useLayoutEffect executes synchronously after React writes DOM' },
        { line: 10, explanation: 'Measures rendered element height via getBoundingClientRect' },
        { line: 12, explanation: 'Sets coordinate state before browser paints to prevent flicker' },
        { line: 20, explanation: 'Cleanup function removes window listener to prevent memory leak' }
      ]
    },
    keyPoints: [
      'useEffect: Asynchronous, after browser paint (default choice for 99% of effects).',
      'useLayoutEffect: Synchronous, before browser paint (use for measurements/flicker prevention).',
      'Always clean up event listeners, AbortControllers, and intervals inside the returned cleanup.'
    ],
    interviewTip: 'Warn that useLayoutEffect blocks browser rendering and can degrade performance if it contains heavy computations.',
    tags: ['Hooks', 'useEffect', 'useLayoutEffect', 'Lifecycle']
  },
  {
    id: 'react-5',
    stack: 'react',
    topic: 'Performance & Memoization',
    title: 'How do React.memo, useMemo, and useCallback optimize performance, and when is memoization anti-pattern?',
    difficulty: 'Intermediate',
    summary: 'React.memo memoizes components against prop equality; useMemo memoizes computed values; useCallback memoizes function instances. Overusing them adds memory and comparison overhead.',
    explanation: [
      'React.memo: Higher-order component that skips re-rendering a component if its incoming props are shallowly equal (Object.is).',
      'useMemo: Caches the calculated return value of an expensive computation across renders unless specified dependencies change.',
      'useCallback: Caches a function definition instance across renders. Useful when passing callbacks to optimized children wrapped in React.memo to prevent reference instability.',
      'When NOT to use: Trivial computations (like string formatting or array filtering of < 100 items), or wrapping functions passed to un-memoized native HTML tags (<button onClick={useCallback(...)}> is wasted overhead).'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'memoization-best-practices.jsx',
      code: `import React, { useState, useMemo, useCallback } from 'react';

// Child only re-renders if onSelect reference changes
const RowItem = React.memo(({ item, onSelect }) => {
  console.log('Rendering RowItem:', item.id);
  return <div onClick={() => onSelect(item.id)}>{item.name}</div>;
});

function ItemList({ items }) {
  const [filter, setFilter] = useState('');

  // 1. useMemo: Avoids expensive re-sorting on unrelated state changes
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.score - b.score);
  }, [items]);

  // 2. useCallback: Preserves stable reference for React.memo child
  const handleSelect = useCallback((id) => {
    console.log('Selected:', id);
  }, []); // Stable forever

  return (
    <div>
      {sortedItems.map(item => (
        <RowItem key={item.id} item={item} onSelect={handleSelect} />
      ))}
    </div>
  );
}`,
      output: 'RowItem components skip re-rendering when parent re-renders',
      executionSteps: [
        { line: 4, explanation: 'React.memo wraps child component for shallow prop comparison' },
        { line: 15, explanation: 'useMemo caches sorted array reference unless items array changes' },
        { line: 20, explanation: 'useCallback keeps handleSelect function memory address stable' },
        { line: 27, explanation: 'RowItem receives identical props, completely bypassing re-render' }
      ]
    },
    keyPoints: [
      'React.memo checks props shallowly; custom comparator can be passed as second argument.',
      'useCallback(fn, deps) is syntactic sugar for useMemo(() => fn, deps).',
      'Premature memoization adds memory allocation overhead and dependency array comparison costs.'
    ],
    interviewTip: 'State clearly that in React, re-rendering is fast by default. Memoization is only needed for expensive calculations or to preserve referential equality for child memo wrappers.',
    tags: ['Performance', 'useMemo', 'useCallback', 'React.memo']
  },
  {
    id: 'react-6',
    stack: 'react',
    topic: 'Custom Hooks',
    title: 'How do you build a resilient Custom Hook with AbortController for race condition protection?',
    difficulty: 'Intermediate',
    summary: 'Custom hooks extract reusable stateful logic. Using AbortController cancels in-flight HTTP requests when dependencies change or the component unmounts.',
    explanation: [
      'A custom hook is a standard JavaScript function whose name begins with "use" and which can call other React hooks.',
      'Network Race Conditions: If a user rapidly switches between tabs or filters, older fetch requests might resolve after newer ones, overwriting fresh data with stale responses.',
      'Using an "AbortController" inside useEffect sends an abort signal when the dependency changes or unmounts, guaranteeing clean network state.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'useFetch.js',
      code: `import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(\`HTTP error \${response.status}\`);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Abort active fetch if url changes or component unmounts
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}`,
      output: 'Cancels stale in-flight requests cleanly without state leaks',
      executionSteps: [
        { line: 9, explanation: 'Instantiates fresh AbortController per effect run' },
        { line: 14, explanation: 'Attaches controller.signal to standard fetch options' },
        { line: 19, explanation: 'Catches AbortError quietly to avoid erroneous error alerts' },
        { line: 29, explanation: 'Cleanup triggers controller.abort() when url updates or unmounts' }
      ]
    },
    keyPoints: [
      'Custom hooks must start with "use" so ESLint rules for hooks can enforce hook safety.',
      'Each call to a custom hook has completely isolated state.',
      'AbortController eliminates race conditions and avoids "Can\'t perform state update on unmounted component" warnings.'
    ],
    interviewTip: 'Emphasize error handling for err.name === "AbortError" so cancelled requests are not erroneously treated as backend server failures.',
    tags: ['Custom Hooks', 'AbortController', 'Networking', 'Async']
  },

  // ==========================================
  // ADVANCED
  // ==========================================
  {
    id: 'react-7',
    stack: 'react',
    topic: 'React 18/19 & Concurrency',
    title: 'How does React\'s Fiber Architecture enable Concurrent Features like useTransition and useDeferredValue?',
    difficulty: 'Advanced',
    summary: 'Fiber rewrote React\'s reconciler into an incremental, interruptible work-loop using linked-list fiber nodes, enabling concurrent rendering and priority lanes.',
    explanation: [
      'Legacy Stack Reconciler: In React 15 and earlier, reconciliation was recursive and synchronous. Once a render began, the main thread was blocked until the entire tree finished, causing input lag on large apps.',
      'Fiber Reconciler: Each React element corresponds to a "Fiber" node forming a doubly-linked tree (child, sibling, return). React processes work in small units, pausing to yield back to the browser for user interactions.',
      'Priority Lanes: Urgent updates (typing, clicking) have high priority. Non-urgent updates (filtering a 5,000 item list) can be wrapped in "useTransition" or "useDeferredValue" to run at lower priority without freezing the UI.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'concurrent-useTransition.jsx',
      code: `import { useState, useTransition, useDeferredValue } from 'react';

function SearchDashboard({ largeDataset }) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e) => {
    // 1. High Priority (Urgent): Update text input immediately
    const nextVal = e.target.value;
    setQuery(nextVal);

    // 2. Low Priority (Transition): Heavy list filtering can be interrupted
    startTransition(() => {
      // If user types another character, this work yields immediately
      filterLargeDataset(nextVal);
    });
  };

  // Alternative: useDeferredValue delays updating the downstream prop
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={handleInputChange} />
      {isPending && <span className="spinner">Filtering items...</span>}
      <HeavyList query={deferredQuery} />
    </div>
  );
}`,
      output: 'Input remains butter-smooth at 60 FPS while heavy list renders in background',
      executionSteps: [
        { line: 5, explanation: 'useTransition hook returns isPending flag and startTransition wrapper' },
        { line: 10, explanation: 'Immediate state update guarantees instant typing feedback' },
        { line: 13, explanation: 'startTransition marks heavy computation as interruptible lane' },
        { line: 19, explanation: 'useDeferredValue gracefully defers heavy child rendering' }
      ]
    },
    keyPoints: [
      'Fiber architecture makes rendering interruptible, suspendable, and resumeable.',
      'useTransition lets you mark state updates as non-blocking transitions.',
      'useDeferredValue accepts a value and returns a copy that defers until urgent renders settle.'
    ],
    interviewTip: 'Explain that useTransition manages the state setter, whereas useDeferredValue manages the derived value when you don\'t have direct control over the state setter (e.g. props from external library).',
    tags: ['Fiber', 'Concurrent React', 'useTransition', 'useDeferredValue']
  },
  {
    id: 'react-8',
    stack: 'react',
    topic: 'Error Boundaries & SSR',
    title: 'How do Error Boundaries work, and what are Hydration Mismatches in Server-Side Rendering?',
    difficulty: 'Advanced',
    summary: 'Error Boundaries catch JavaScript errors in child component trees to display a fallback UI. Hydration mismatches occur when the server-rendered HTML differs from client-generated DOM.',
    explanation: [
      'Error Boundaries: React class components implementing "static getDerivedStateFromError" and "componentDidCatch". They catch render phase, lifecycle, and constructor errors in their children, preventing the entire app from crashing to a blank white screen.',
      'Limitations of Error Boundaries: They do NOT catch errors in asynchronous code (e.g. setTimeout or fetch), event handlers (e.g. onClick), or during Server-Side Rendering.',
      'Hydration Mismatch: During SSR, the server sends pre-rendered HTML. On the client, React "hydrates" by attaching event listeners to the existing DOM. If browser-only values (like window.innerWidth, Date.now(), or localStorage) differ between server and client, React logs a hydration mismatch warning.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'error-boundary-and-hydration.jsx',
      code: `import React from 'react';

// Error Boundary (must be a Class component in React)
export class SafeBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to telemetry service (Sentry, Datadog)
    console.error('Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h3>Something went wrong</h3>
          <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
      output: 'Catches render errors gracefully and isolates crash to the component subtree',
      executionSteps: [
        { line: 8, explanation: 'static getDerivedStateFromError returns fallback state' },
        { line: 13, explanation: 'componentDidCatch fires side effects like telemetry logging' },
        { line: 18, explanation: 'Renders isolated fallback UI without crashing the whole app' }
      ]
    },
    keyPoints: [
      'Error boundaries must be Class components because functional hooks lack componentDidCatch equivalent.',
      'Wrap distinct modules (e.g. Sidebar, Feed, Navigation) in separate boundaries for resilience.',
      'Avoid hydration mismatches by ensuring server and initial client render outputs are identical.'
    ],
    interviewTip: 'When asked why error boundaries cannot catch event handler errors, explain that event handlers run outside the React render loop. Catch event errors with standard try/catch blocks.',
    tags: ['Error Boundary', 'SSR', 'Hydration', 'Resilience']
  }
];
