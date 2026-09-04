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
  },
  // ==========================================
  // TOPIC: Context API & State Management
  // ==========================================
  {
    id: 'react-9',
    stack: 'react',
    topic: 'Context API & State Management',
    title: 'What is the React Context API and when should you use it vs. a state management library?',
    difficulty: 'Intermediate',
    summary: 'Context API provides a way to share values (theme, auth user, locale) across the component tree without prop drilling. It is ideal for low-frequency, global state. For high-frequency updates or complex logic, use Zustand/Redux.',
    explanation: [
      'Prop Drilling Problem: Passing props through 5+ component levels becomes unmaintainable. Context provides a "teleportation" mechanism to make values globally available to any descendant.',
      'Context is NOT a replacement for all global state: Every context update re-renders ALL consumers of that context. If you update auth context on every mouse move, every component reading that context re-renders.',
      'When to use Redux/Zustand: When state is updated frequently (e.g., real-time data), when state logic is complex (many actions, side effects), or when you need time-travel debugging with Redux DevTools.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'context-api.jsx',
      code: `import React, { createContext, useContext, useState } from 'react';

// 1. Create context with default value
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

// 2. Provider wraps the tree and provides the value
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook for type-safe, documented context usage
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// 4. Consumer — no props needed, no matter how deep in the tree!
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      Current: {theme} — Click to toggle
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeToggleButton />
    </ThemeProvider>
  );
}`,
      output: 'ThemeToggleButton accesses theme without receiving any props.',
      executionSteps: [
        { line: 4, explanation: 'createContext creates a context object with a default value (used outside Provider)' },
        { line: 11, explanation: 'Provider\'s value prop is what all consumers receive' },
        { line: 19, explanation: 'Custom hook wraps useContext and adds error guard for missing Provider' },
        { line: 25, explanation: 'Consumer accesses context value without any props passed from parent' }
      ]
    },
    keyPoints: [
      'Split contexts by concern: ThemeContext, AuthContext, LocaleContext — not one giant GlobalContext.',
      'Context re-renders all consumers on every value change — memoize value with useMemo to reduce renders.',
      'React Query / SWR manage server state. Context/Zustand manage client state. Do not mix the two concerns.'
    ],
    interviewTip: 'The most common Context mistake: putting the entire app state in one context. This causes the whole tree to re-render on any change. Split contexts and memoize values to avoid performance issues.',
    tags: ['Context API', 'useContext', 'Prop Drilling', 'State Management', 'Provider']
  },
  {
    id: 'react-10',
    stack: 'react',
    topic: 'Context API & State Management',
    title: 'How does useReducer work and when should you choose it over useState?',
    difficulty: 'Intermediate',
    summary: 'useReducer manages complex state transitions with a (state, action) => newState pure reducer function. Prefer it over useState when next state depends on multiple sub-values or when actions have names that document intent.',
    explanation: [
      'useState limitation: When state has multiple related sub-fields (e.g., { loading, data, error }) and updates are interdependent, managing them with multiple useState calls leads to fragmented, race-condition-prone logic.',
      'useReducer centralizes state logic: The reducer is a pure function — easy to unit test in isolation without rendering. All state transitions happen in one place, making logic predictable and auditable.',
      'dispatch(action): Components dispatch named action objects ({ type: "FETCH_SUCCESS", payload: data }). This self-documents what events the system can handle, similar to Redux.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'use-reducer.jsx',
      code: `import { useReducer } from 'react';

// State shape
const initialState = { loading: false, data: null, error: null };

// Pure reducer — no side effects, just state transitions
function dataReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { loading: true, data: null, error: null };
    case 'FETCH_SUCCESS':
      return { loading: false, data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { loading: false, data: null, error: action.payload };
    default:
      return state;
  }
}

function UserProfile({ userId }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const fetchUser = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await fetch(\`/api/users/\${userId}\`);
      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  };

  if (state.loading) return <p>Loading...</p>;
  if (state.error) return <p>Error: {state.error}</p>;
  return <div>{state.data?.name}</div>;
}`,
      output: 'State transitions are atomic — FETCH_START resets error and data simultaneously.',
      executionSteps: [
        { line: 7, explanation: 'Reducer receives current state and action, returns next state' },
        { line: 9, explanation: 'FETCH_START atomically sets loading=true and clears previous error/data' },
        { line: 21, explanation: 'dispatch sends action to reducer — React re-renders with new state' }
      ]
    },
    keyPoints: [
      'useReducer + useContext is the React built-in alternative to Redux for medium-complexity apps.',
      'Reducers must be pure functions — no side effects, no API calls inside the reducer.',
      'immer\'s produce() can be used inside reducers to write mutating-style logic that produces immutable state.'
    ],
    interviewTip: 'The rule of thumb: use useState for independent simple state. Use useReducer when you have 3+ related state fields, complex transitions, or want to test state logic separately from the component.',
    tags: ['useReducer', 'State Management', 'Reducer', 'dispatch', 'Actions']
  },
  // ==========================================
  // TOPIC: Component Patterns
  // ==========================================
  {
    id: 'react-11',
    stack: 'react',
    topic: 'Component Patterns',
    title: 'What are Higher-Order Components (HOC), Render Props, and Compound Components patterns?',
    difficulty: 'Intermediate',
    summary: 'HOCs are functions wrapping components to inject behavior. Render Props share behavior via function children. Compound Components share implicit state between parent and co-designed child components.',
    explanation: [
      'HOC (Higher-Order Component): A function that takes a component and returns a new enhanced component. Used to inject cross-cutting concerns (auth checks, analytics, data fetching) without modifying the original component.',
      'Render Props: A component receives a function as its children or a prop. The function receives internal state/behavior and returns JSX. Enables extremely flexible code sharing. Now mostly replaced by custom hooks.',
      'Compound Components: Components that work together and share implicit state via Context. Think <Select>, <Select.Option>, <Tabs>, <Tabs.Panel> — the parent manages state, children consume it through context without explicit props.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'component-patterns.jsx',
      code: `import { createContext, useContext, useState } from 'react';

// ========== Compound Components Pattern ==========
const TabsContext = createContext(null);

function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === id ? 'active' : ''}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div>{children}</div> : null;
}

// Attach sub-components to parent for clean API:
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage — reads like natural HTML structure:
function App() {
  return (
    <Tabs defaultTab="overview">
      <Tabs.List>
        <Tabs.Tab id="overview">Overview</Tabs.Tab>
        <Tabs.Tab id="details">Details</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="overview"><p>Overview content</p></Tabs.Panel>
      <Tabs.Panel id="details"><p>Details content</p></Tabs.Panel>
    </Tabs>
  );
}`,
      output: 'Tab switching works with no prop drilling — state shared via Context internally.',
      executionSteps: [
        { line: 6, explanation: 'Tabs manages active tab state and provides it via Context' },
        { line: 20, explanation: 'Tab reads and sets activeTab from Context — no props needed from Tabs' },
        { line: 33, explanation: 'Sub-components attached as static properties for elegant API design' }
      ]
    },
    keyPoints: [
      'HOCs: prefer custom hooks in modern React — they achieve the same goal without wrapper hell.',
      'Compound Components are the best pattern for complex UI components (Select, Modal, Accordion, Tabs).',
      'Render Props are largely replaced by hooks but still appear in libraries like React Final Form and Downshift.'
    ],
    interviewTip: 'For senior interviews: explain the problem each pattern solves and why hooks replaced HOCs and render props for most use cases. But compound components are still the gold standard for stateful UI component libraries.',
    tags: ['HOC', 'Render Props', 'Compound Components', 'Patterns', 'Composition']
  },
  {
    id: 'react-12',
    stack: 'react',
    topic: 'Component Patterns',
    title: 'What is React.forwardRef and useImperativeHandle, and when do you need them?',
    difficulty: 'Advanced',
    summary: 'forwardRef allows parent components to directly access a DOM node or child component\'s imperative API via a ref. useImperativeHandle selectively exposes specific methods rather than the raw DOM node.',
    explanation: [
      'The Problem: Refs do not cross component boundaries automatically. A ref on a custom <Input> component points to the Input function itself, not the underlying <input> DOM node.',
      'React.forwardRef: Wraps your component in a forwardRef call, accepting ref as the second argument and attaching it to the desired DOM element. Essential for building reusable input, modal, and animation components.',
      'useImperativeHandle: Instead of exposing the raw DOM node, expose a curated API object. This is useful for components like video players (expose play/pause/seek), modals (expose open/close), or form instances (expose submit/reset).'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'forward-ref.jsx',
      code: `import { forwardRef, useRef, useImperativeHandle } from 'react';

// ========== Custom Input with forwardRef ==========
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);

  // Expose curated API instead of raw DOM node
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
      inputRef.current.select(); // Also select text on focus
    },
    clear() {
      inputRef.current.value = '';
    },
    getValue() {
      return inputRef.current.value;
    }
  }));

  return <input ref={inputRef} {...props} className="fancy-input" />;
});

// ========== Parent uses the imperative API ==========
function SearchForm() {
  const inputRef = useRef(null);

  const handleReset = () => {
    inputRef.current.clear();   // Calls our custom clear()
    inputRef.current.focus();   // Calls our custom focus()
  };

  return (
    <div>
      <FancyInput ref={inputRef} placeholder="Search..." />
      <button onClick={handleReset}>Reset & Focus</button>
    </div>
  );
}`,
      output: 'Parent can imperatively call .clear() and .focus() on FancyInput without accessing DOM directly.',
      executionSteps: [
        { line: 4, explanation: 'forwardRef receives ref as second argument alongside props' },
        { line: 8, explanation: 'useImperativeHandle replaces what the ref exposes — our curated API instead of DOM node' },
        { line: 27, explanation: 'Parent calls imperative methods via ref — no need to pass callback props' }
      ]
    },
    keyPoints: [
      'forwardRef is required for all custom components that wrap DOM elements and need ref access from parents.',
      'useImperativeHandle should be used sparingly — declarative data flow via props is almost always better.',
      'Common use cases: focus management, scroll position control, media playback, form submit/validation triggers.'
    ],
    interviewTip: 'Mention that overusing imperative refs violates React\'s declarative data flow. Always ask: "can I solve this with state and props?" before reaching for refs and imperative handles.',
    tags: ['forwardRef', 'useImperativeHandle', 'Refs', 'Imperative', 'DOM']
  },
  // ==========================================
  // TOPIC: Hooks Deep Dive (extra questions)
  // ==========================================
  {
    id: 'react-13',
    stack: 'react',
    topic: 'Hooks Deep Dive',
    title: 'What is useRef and what are its two completely different use cases?',
    difficulty: 'Beginner',
    summary: 'useRef returns a mutable container (.current) that persists for the component\'s lifetime without triggering re-renders. It serves two distinct purposes: accessing DOM nodes imperatively, and storing mutable values that survive renders.',
    explanation: [
      'DOM Access: const inputRef = useRef(null); attached to a JSX element gives direct access to the DOM node via inputRef.current. Used for focus management, scroll control, canvas drawing, and measuring element dimensions.',
      'Mutable Persistent Value: useRef stores values that need to persist across renders but should NOT trigger re-renders when changed. Previous value tracking, timer IDs, WebSocket instances, and animation frames are common examples.',
      'Key Difference from useState: Mutating ref.current does not cause a re-render. This is intentional — refs are a "escape hatch" from React\'s reactive system for values that are not part of the rendering output.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'useref-patterns.jsx',
      code: `import { useRef, useEffect, useState } from 'react';

// USE CASE 1: DOM Access
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // Direct DOM manipulation
  }, []);

  return <input ref={inputRef} placeholder="Auto-focused!" />;
}

// USE CASE 2: Storing mutable values (no re-render)
function StopwatchWithRef() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null); // Store timer ID — no re-render needed

  const start = () => {
    // Guard: don't start if already running
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null; // Mutating ref.current — NO re-render!
  };

  return (
    <div>
      <p>Time: {time}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`,
      output: 'Input auto-focuses on mount. Timer stores ID in ref — clearing it does not trigger re-render.',
      executionSteps: [
        { line: 5, explanation: 'useRef(null) creates a container; initial value is null before DOM mounts' },
        { line: 8, explanation: 'After mount, inputRef.current is the actual input DOM node' },
        { line: 17, explanation: 'intervalRef stores the timer ID — mutating it never causes re-renders' },
        { line: 26, explanation: 'Setting intervalRef.current = null is a mutation, not a state update' }
      ]
    },
    keyPoints: [
      'Never read ref.current during render — its value may be stale or null during the render phase.',
      'Previous value pattern: prevValueRef.current = value; inside useEffect after render captures the last rendered value.',
      'For callback refs: attach a function to ref prop to execute logic when DOM node mounts/unmounts.'
    ],
    interviewTip: 'Interviewers often test: "what\'s the difference between useRef and useState for storing a timer ID?" Answer: both persist, but useState triggers re-renders, useRef does not — use ref for values that affect behavior but not what is rendered.',
    tags: ['useRef', 'DOM', 'Mutable Values', 'Hooks', 'Render Cycle']
  },
  {
    id: 'react-14',
    stack: 'react',
    topic: 'Hooks Deep Dive',
    title: 'Explain the useEffect dependency array — what are the rules and common pitfalls?',
    difficulty: 'Intermediate',
    summary: 'The useEffect dependency array tells React when to re-run the effect. Missing dependencies cause stale closures. Excessive dependencies cause unnecessary re-runs. The cleanup function prevents memory leaks.',
    explanation: [
      'No array: Effect runs after every render. Equivalent to componentDidUpdate for every prop/state change.',
      'Empty array []: Effect runs once after initial mount only. Equivalent to componentDidMount. Common source of stale closure bugs when the effect uses values from props/state.',
      'With deps [a, b]: Effect re-runs whenever a or b changes (compared by reference using Object.is). Always include every value from the component scope used inside the effect — the React eslint-plugin-exhaustive-deps rule enforces this.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'useeffect-deps.jsx',
      code: `import { useState, useEffect, useRef } from 'react';

function LiveSearch({ query, onResults }) {
  // ❌ BUG: onResults missing from deps — stale closure!
  // useEffect(() => {
  //   fetchResults(query).then(data => onResults(data));
  // }, [query]);

  // ✅ Include ALL used values in deps array
  useEffect(() => {
    let cancelled = false;

    async function search() {
      const data = await fetchResults(query);
      // Cleanup prevents setting state after unmount or query change
      if (!cancelled) {
        onResults(data);
      }
    }
    search();

    // Cleanup: cancel previous search when query changes
    return () => { cancelled = true; };
  }, [query, onResults]); // ✅ Both values included

  // ✅ Stable ref for callbacks to avoid dep array churn
  const onResultsRef = useRef(onResults);
  useEffect(() => { onResultsRef.current = onResults; });

  useEffect(() => {
    // onResultsRef.current always has the latest callback
    // without needing to add it to the dep array
    fetchResults(query).then(data => onResultsRef.current(data));
  }, [query]); // Only query triggers re-runs
}`,
      output: 'Search fires on query change. Cancelled if query changes again before previous resolves.',
      executionSteps: [
        { line: 10, explanation: 'let cancelled = false acts as a cancellation token for this effect execution' },
        { line: 15, explanation: 'Checks cancelled before calling onResults — prevents stale updates' },
        { line: 19, explanation: 'Cleanup: sets cancelled=true when query changes or component unmounts' }
      ]
    },
    keyPoints: [
      'Functions defined outside useEffect should be in deps or created with useCallback to maintain stable identity.',
      'Object and array literals in deps cause infinite loops — they are new references each render.',
      'useEffectEvent (React 19+) provides a stable callback identity that always reads the latest value.'
    ],
    interviewTip: 'The most common useEffect interview question: "why does this infinite loop?" Answer is almost always: an object/array/function is in the dependency array and gets recreated on every render, triggering the effect again.',
    tags: ['useEffect', 'Dependency Array', 'Cleanup', 'Stale Closures', 'Side Effects']
  },
  // ==========================================
  // TOPIC: Performance & Memoization (extra)
  // ==========================================
  {
    id: 'react-15',
    stack: 'react',
    topic: 'Performance & Memoization',
    title: 'Explain React.memo, useMemo, and useCallback — what exactly do they memoize?',
    difficulty: 'Intermediate',
    summary: 'React.memo prevents re-rendering a component if its props have not changed. useMemo caches the result of an expensive computation. useCallback caches a function reference to maintain stable identity across renders.',
    explanation: [
      'React.memo wraps a component: When the parent re-renders, React skips re-rendering the wrapped child if its props are shallowly equal to the previous render. Does NOT affect state or context changes inside the child.',
      'useMemo(() => compute(a, b), [a, b]): Caches the returned VALUE. Recomputes only when a or b changes. Use for expensive calculations (sorting large arrays, complex filtering, derived data).',
      'useCallback(() => fn(a), [a]): Caches the FUNCTION REFERENCE. Without it, a new function object is created each render — breaking React.memo children that receive this function as a prop.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'memoization.jsx',
      code: `import { useState, useMemo, useCallback, memo } from 'react';

// 1. React.memo — memoized child component
const ExpensiveList = memo(function ExpensiveList({ items, onItemClick }) {
  console.log('ExpensiveList rendering...');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

function Dashboard({ rawData }) {
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);

  // 2. useMemo — cache expensive sort/filter computation
  const processedItems = useMemo(() => {
    console.log('Computing filtered items...');
    return rawData
      .filter(item => item.name.toLowerCase().includes(filter))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rawData, filter]);  // Recomputes ONLY when rawData or filter changes

  // 3. useCallback — stable function reference for memo child
  const handleItemClick = useCallback((id) => {
    console.log('Item clicked:', id);
  }, []); // No deps — function never needs to change

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {/* ExpensiveList won't re-render when only count changes */}
      <ExpensiveList items={processedItems} onItemClick={handleItemClick} />
    </div>
  );
}`,
      output: 'Clicking Count button does not trigger ExpensiveList render — memo + useCallback prevent it.',
      executionSteps: [
        { line: 4, explanation: 'memo wraps ExpensiveList — re-renders only when items or onItemClick changes' },
        { line: 21, explanation: 'useMemo caches the filtered/sorted array — recomputes only when rawData or filter changes' },
        { line: 29, explanation: 'useCallback caches handleItemClick — same reference every render prevents memo invalidation' }
      ]
    },
    keyPoints: [
      'Do NOT prematurely memoize: memoization has cost (memory + comparison). Only add it when profiling shows it helps.',
      'React.memo uses shallow comparison — will not prevent re-renders if props are new object/array references.',
      'useCallback is primarily useful when passing callbacks to memo-wrapped children or as deps of other hooks.'
    ],
    interviewTip: 'A very common anti-pattern: wrapping everything with useMemo/useCallback. Premature optimization adds complexity. Always profile with React DevTools Profiler first, then memoize only identified bottlenecks.',
    tags: ['React.memo', 'useMemo', 'useCallback', 'Memoization', 'Performance']
  },
  // ==========================================
  // TOPIC: Custom Hooks (extra questions)
  // ==========================================
  {
    id: 'react-16',
    stack: 'react',
    topic: 'Custom Hooks',
    title: 'How do you build a custom hook for data fetching with loading, error, and abort support?',
    difficulty: 'Intermediate',
    summary: 'A custom useFetch hook encapsulates the data fetching lifecycle (loading, success, error, abort) into a reusable hook, eliminating duplicated useEffect + useState patterns across components.',
    explanation: [
      'The pattern: Combine useState for state management with useEffect for side effects. The hook returns { data, loading, error } for the component to consume.',
      'Abort Controller: When the URL changes or the component unmounts, cancel the in-flight fetch using AbortController. This prevents state updates on unmounted components and race conditions when requests resolve out of order.',
      'Generic with TypeScript: type the hook with a generic <T> parameter so the returned data is strongly typed for each use case.'
    ],
    codeExample: {
      language: 'tsx',
      filename: 'useFetch.tsx',
      code: `import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Create abort controller for this fetch
    const controller = new AbortController();

    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name === 'AbortError') return; // Ignore cancellation
        setState({ data: null, loading: false, error: err.message });
      });

    // Cleanup: abort previous request when url changes or unmounts
    return () => controller.abort();
  }, [url]);

  return state;
}

// Usage — clean and reusable:
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useFetch<User>(\`/api/users/\${userId}\`);
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{data?.name}</div>;
}`,
      output: 'Fetches user on mount and on userId change. Aborts previous request automatically.',
      executionSteps: [
        { line: 18, explanation: 'AbortController creates a signal to cancel the fetch request' },
        { line: 29, explanation: 'AbortError is ignored — it is expected when cleanup cancels the request' },
        { line: 33, explanation: 'Cleanup function aborts the previous request before the new one starts' }
      ]
    },
    keyPoints: [
      'Custom hooks must start with "use" — this lets React\'s linter enforce the rules of hooks.',
      'Extract complex useEffect logic into custom hooks to keep components clean and focused on rendering.',
      'React Query and SWR replace custom useFetch hooks with caching, deduplication, and background refresh.'
    ],
    interviewTip: 'This pattern demonstrates: custom hooks, TypeScript generics, AbortController, race condition handling, and cleanup — making it one of the most comprehensive interview questions in a single hook.',
    tags: ['Custom Hooks', 'useFetch', 'AbortController', 'Data Fetching', 'TypeScript']
  },
  // ==========================================
  // TOPIC: React 18/19 & Concurrency (extra)
  // ==========================================
  {
    id: 'react-17',
    stack: 'react',
    topic: 'React 18/19 & Concurrency',
    title: 'What is the useTransition hook and how does it differentiate urgent from non-urgent state updates?',
    difficulty: 'Advanced',
    summary: 'useTransition marks state updates as "transitions" — lower-priority, interruptible updates. React can pause them to handle urgent updates (like typing) first, preventing UI freezes during expensive re-renders.',
    explanation: [
      'The Problem: Filtering a 10,000-item list on every keystroke blocks the main thread. Each filter update triggers a synchronous re-render that freezes the input field for 100-200ms.',
      'useTransition: const [isPending, startTransition] = useTransition(). Wrap the slow state update in startTransition(() => setFilteredList(...)). React marks this as interruptible — it can be abandoned if the user types again.',
      'isPending: A boolean that is true while the transition is processing. Use it to show a loading indicator without blocking the urgent input update.'
    ],
    codeExample: {
      language: 'jsx',
      filename: 'use-transition.jsx',
      code: `import { useState, useTransition } from 'react';

const LARGE_LIST = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  name: \`Item \${i}\`,
}));

function SearchableList() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(LARGE_LIST);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    const value = e.target.value;

    // URGENT: Update input immediately — no delay
    setQuery(value);

    // NON-URGENT: Mark as transition — can be interrupted
    startTransition(() => {
      const filtered = LARGE_LIST.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    });
  }

  return (
    <div>
      {/* Input stays responsive — no freezing! */}
      <input value={query} onChange={handleSearch} placeholder="Search 10k items..." />

      {/* Loading indicator while transition is pending */}
      {isPending && <p style={{ opacity: 0.5 }}>Filtering...</p>}

      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}`,
      output: 'Input updates instantly. List filter is debounced by React\'s scheduler — no freezing.',
      executionSteps: [
        { line: 11, explanation: 'useTransition returns [isPending, startTransition]' },
        { line: 16, explanation: 'setQuery is urgent — renders immediately so input stays responsive' },
        { line: 19, explanation: 'startTransition marks setResults as low-priority and interruptible' },
        { line: 30, explanation: 'isPending shows a subtle loading state during the transition' }
      ]
    },
    keyPoints: [
      'useDeferredValue is the hook equivalent for values rather than state setters — defers a value\'s update.',
      'Transitions are not cancellations — they complete eventually. They just yield to higher-priority updates.',
      'React Suspense integration: transitions keep the previous UI visible while the new content loads behind the scenes.'
    ],
    interviewTip: 'useTransition solves the same problem as debouncing but at the React scheduler level — no setTimeout needed. It is tightly integrated with React\'s rendering priority system (Concurrent Mode).',
    tags: ['useTransition', 'Concurrent Mode', 'isPending', 'Interruptible Renders', 'React 18']
  }
];
