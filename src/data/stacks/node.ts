import { Question } from '../../types';

export const NODE_QUESTIONS: Question[] = [
  // ==========================================
  // Topic 1: Core Architecture & Runtime Fundamentals
  // ==========================================
  {
    id: 'node-1',
    stack: 'node',
    topic: 'Core Architecture & Runtime Fundamentals',
    title: 'What is Node.js and how does it work?',
    difficulty: 'Beginner',
    summary: 'Node.js is an open-source, cross-platform JavaScript runtime built on Chrome\'s V8 engine. It uses an event-driven, non-blocking I/O model designed to build scalable network applications running on a single thread.',
    explanation: [
      'V8 Engine: Compiles JavaScript source code directly into native machine code rather than interpreting bytecode line-by-line.',
      'Single-Threaded Main Loop: Executes application JavaScript logic on a single main thread, avoiding thread-synchronization deadlocks.',
      'Non-Blocking I/O: Heavy I/O tasks (file reading, network queries) are delegated to the underlying OS or libuv thread pool without pausing the main thread.',
      'Event Demultiplexing: When asynchronous operations finish, callbacks are pushed to the event loop to be executed on the main thread.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'runtime-architecture.js',
      code: `const http = require('http');

// Creates an event-driven HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ runtime: 'Node.js', status: 'non-blocking' }));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
      output: `Server running on port 3000`,
      executionSteps: [
        { line: 1, explanation: 'Loads core native http module' },
        { line: 4, explanation: 'Registers request listener callback on event emitter' },
        { line: 9, explanation: 'Binds server to port 3000 without blocking the process' }
      ]
    },
    keyPoints: [
      'Built on Chrome V8 C++ engine.',
      'Non-blocking, event-driven I/O model.',
      'Ideal for I/O-heavy, data-intensive real-time applications.'
    ],
    interviewTip: 'Emphasize that Node.js is not a framework or library, but an execution runtime environment for JavaScript on the server.',
    tags: ['Architecture', 'Runtime', 'V8', 'Non-blocking I/O']
  },
  {
    id: 'node-2',
    stack: 'node',
    topic: 'Core Architecture & Runtime Fundamentals',
    title: 'Why is Node.js single-threaded, and how does it handle concurrency?',
    difficulty: 'Intermediate',
    summary: 'JavaScript application logic executes on a single main call stack to prevent deadlocks, race conditions, and thread-synchronization bugs. Concurrency is achieved using libuv, which offloads long-running operations (file system, DNS, crypto) to a background worker thread pool while handling network events asynchronously via OS kernel primitives.',
    explanation: [
      'Simplicity & Safety: A single main thread avoids race conditions, locking mechanisms, and memory overhead of spawning thousands of OS threads.',
      'Kernel Delegation: For network sockets (HTTP, TCP), Node delegates listening to OS kernel polling primitives (epoll on Linux, kqueue on macOS, IOCP on Windows).',
      'Thread Pool Delegation: Blocking tasks like filesystem (fs), crypto, and DNS lookups are handed off to libuv\'s background worker threads.',
      'Event Loop Coordination: When background tasks complete, callbacks are queued to the event loop and picked up by the single main thread.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'concurrency-model.js',
      code: `const crypto = require('crypto');

console.log('Start time:', Date.now());

// Offloads hashing to background worker threads concurrently
for (let i = 1; i <= 4; i++) {
  crypto.pbkdf2('secret-password', 'salt', 100000, 64, 'sha512', () => {
    console.log(\`Task \${i} completed at: \${Date.now()}\`);
  });
}

console.log('Main thread continues immediately without waiting!');`,
      output: `Start time: 1700000000000
Main thread continues immediately without waiting!
Task 1 completed at: 1700000000150
Task 2 completed at: 1700000000152
Task 3 completed at: 1700000000155
Task 4 completed at: 1700000000158`,
      executionSteps: [
        { line: 3, explanation: 'Synchronous log outputs immediately on main thread' },
        { line: 7, explanation: 'Offloads 4 crypto hashing tasks across libuv thread pool threads' },
        { line: 12, explanation: 'Main thread continues execution without blocking' },
        { line: 8, explanation: 'All 4 complete nearly concurrently via background threads' }
      ]
    },
    keyPoints: [
      'Single-threaded JavaScript execution context.',
      'Multi-threaded background task processing via libuv and OS primitives.',
      'High concurrency with low memory footprint.'
    ],
    interviewTip: 'Mention that while the JavaScript call stack is single-threaded, Node.js C++ internals are multi-threaded.',
    tags: ['Concurrency', 'Single-threaded', 'Libuv', 'Architecture']
  },
  {
    id: 'node-3',
    stack: 'node',
    topic: 'Core Architecture & Runtime Fundamentals',
    title: 'What is the Reactor Pattern in Node.js?',
    difficulty: 'Intermediate',
    summary: 'An architectural pattern for non-blocking I/O. Incoming requests are passed to an event demultiplexer (libuv). Once a resource completes, an event handler callback is enqueued into the event loop to execute without blocking incoming traffic.',
    explanation: [
      'Core Mechanics: Handles service requests that are delivered concurrently to an application by one or more inputs.',
      'Resources: Non-blocking I/O operations (network socket, file descriptor).',
      'Synchronous Event Demultiplexer: The OS multiplexer (epoll/kqueue) monitors all operations and returns when an event is ready.',
      'Event Queue: When an I/O event is processed, its callback is enqueued into the event loop queue.',
      'Event Loop (Reactor): Dequeues events and triggers the corresponding application handler callbacks.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'reactor-pattern.js',
      code: `const net = require('net');

// Server acts as a Reactor managing multiple client sockets non-blockingly
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // Demultiplexed event handled
    socket.write(\`Echo: \${data}\`);
  });
});

server.listen(8080);`,
      output: `Server listening on 8080`,
      executionSteps: [
        { line: 4, explanation: 'Socket registered with OS event demultiplexer' },
        { line: 5, explanation: 'Incoming data triggers callback via event loop' }
      ]
    },
    keyPoints: [
      'Separates I/O multiplexing from handler execution.',
      'Prevents blocking on concurrent network connections.',
      'Foundation of libuv\'s architecture.'
    ],
    interviewTip: 'Describe the 4 main components: Resources, Event Demultiplexer, Event Queue, and Event Loop.',
    tags: ['Reactor Pattern', 'Design Patterns', 'Libuv', 'Architecture']
  },
  {
    id: 'node-4',
    stack: 'node',
    topic: 'Core Architecture & Runtime Fundamentals',
    title: 'What is the role of Google\'s V8 engine in Node.js?',
    difficulty: 'Beginner',
    summary: 'Written in C++, V8 compiles JavaScript source code directly into native machine code instead of interpreting bytecode line-by-line. It also manages memory allocation and runs automatic garbage collection.',
    explanation: [
      'JIT (Just-In-Time) Compilation: Uses Ignition (interpreter) and TurboFan (optimizing compiler) to translate JavaScript into high-performance native machine code.',
      'Memory Management: Allocates memory on the heap and stack for objects and primitives.',
      'Garbage Collection (GC): Employs generational garbage collection (Scavenge for young generation, Mark-Sweep-Compact for old generation) to reclaim unused memory.',
      'Call Stack: Maintains the single-threaded execution stack for JavaScript function frames.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'v8-memory-stats.js',
      code: `const v8 = require('v8');

// Inspect heap statistics managed by V8
const heapStats = v8.getHeapStatistics();

console.log('Heap Size Limit (MB):', Math.round(heapStats.heap_size_limit / 1024 / 1024));
console.log('Used Heap Size (MB):', Math.round(heapStats.used_heap_size / 1024 / 1024));`,
      output: `Heap Size Limit (MB): 4144
Used Heap Size (MB): 5`,
      executionSteps: [
        { line: 1, explanation: 'Imports native V8 diagnostics module' },
        { line: 4, explanation: 'Queries V8 memory metrics directly from engine' }
      ]
    },
    keyPoints: [
      'Compiles JS directly to machine code using JIT.',
      'Automates memory allocation and garbage collection.',
      'Can be configured using CLI flags like --max-old-space-size.'
    ],
    interviewTip: 'Mention that V8 does NOT provide APIs like setTimeout, fs, or http—Node.js bridges those via libuv and C++ bindings.',
    tags: ['V8', 'Memory', 'Garbage Collection', 'Compilation']
  },
  {
    id: 'node-5',
    stack: 'node',
    topic: 'Core Architecture & Runtime Fundamentals',
    title: 'What is libuv and what is its default thread pool size?',
    difficulty: 'Intermediate',
    summary: 'A multi-platform C library focused on asynchronous I/O that provides the event loop, thread pool, file system operations, and network polling. Its default thread pool size is 4, adjustable up to 1024 using the environment variable UV_THREADPOOL_SIZE=N.',
    explanation: [
      'Platform Abstraction: Unifies Linux (epoll), macOS (kqueue), and Windows (IOCP) into a consistent asynchronous API.',
      'Default Thread Pool Size: By default, libuv spawns 4 worker threads for blocking tasks.',
      'Configuring Thread Pool: Can be adjusted before process startup: UV_THREADPOOL_SIZE=8 node app.js (maximum is 1024).',
      'Thread Assignment: Threads handle filesystem operations, DNS resolution, zlib compression, and crypto operations.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'libuv-threadpool.js',
      code: `// Must be set BEFORE loading any crypto/fs modules!
process.env.UV_THREADPOOL_SIZE = '8';

const crypto = require('crypto');

console.log('Thread pool configured for high concurrency hashing.');`,
      output: `Thread pool configured for high concurrency hashing.`,
      executionSteps: [
        { line: 2, explanation: 'Sets thread pool size to 8 prior to module initialization' }
      ]
    },
    keyPoints: [
      'C library providing event loop and thread pool.',
      'Default pool size is 4; max is 1024.',
      'Must configure UV_THREADPOOL_SIZE before any I/O calls.'
    ],
    interviewTip: 'Setting UV_THREADPOOL_SIZE inside JavaScript code after requiring modules will have no effect because the pool initializes on launch.',
    tags: ['Libuv', 'Thread Pool', 'C++', 'Concurrency']
  },
  {
    id: 'node-6',
    stack: 'node',
    topic: 'Core Architecture & Runtime Fundamentals',
    title: 'Which operations use the libuv thread pool versus OS non-blocking APIs?',
    difficulty: 'Intermediate',
    summary: 'Thread Pool: File system tasks (fs), DNS lookups (dns.lookup), and cryptography hashing (crypto.pbkdf2). OS Non-Blocking Kernel Primitives (epoll/kqueue/IOCP): Network sockets (HTTP, TCP, UDP) and child processes.',
    explanation: [
      'Thread Pool Usage: Operating systems generally lack unified true asynchronous file I/O APIs. Hence, Node uses libuv thread pool for fs, dns.lookup, and CPU-heavy crypto operations.',
      'OS Kernel Non-Blocking: Network sockets are natively asynchronous at the OS level (epoll/kqueue/IOCP). Node handles thousands of network connections without using any worker threads.',
      'dns.lookup vs dns.resolve: dns.lookup uses getaddrinfo(3) in the thread pool (synchronous at OS level), while dns.resolve connects directly to DNS servers via network sockets without threads.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'threadpool-vs-kernel.js',
      code: `const dns = require('dns');
const http = require('http');

// 1. Thread Pool: dns.lookup uses OS getaddrinfo in libuv thread pool
dns.lookup('nodejs.org', (err, address) => {
  console.log('IP resolved via thread pool:', address);
});

// 2. Kernel Non-blocking: HTTP network socket uses epoll/kqueue (no threads)
http.get('http://nodejs.org', (res) => {
  console.log('Network request handled via OS non-blocking socket:', res.statusCode);
});`,
      output: `IP resolved via thread pool: 104.20.22.46
Network request handled via OS non-blocking socket: 301`,
      executionSteps: [
        { line: 5, explanation: 'dns.lookup offloaded to libuv thread pool' },
        { line: 10, explanation: 'http.get offloaded to kernel socket polling' }
      ]
    },
    keyPoints: [
      'Network I/O: Handled by OS kernel primitives without threads.',
      'File & Crypto I/O: Handled by libuv thread pool.',
      'dns.lookup uses thread pool; dns.resolve does not.'
    ],
    interviewTip: 'A common pitfall: heavy dns.lookup calls can starve the thread pool and delay file system reads!',
    tags: ['Thread Pool', 'Kernel APIs', 'epoll', 'DNS']
  },
  {
    id: 'node-7',
    stack: 'node',
    topic: 'Core Architecture & Runtime Fundamentals',
    title: 'Difference between the Browser environment and the Node.js runtime',
    difficulty: 'Beginner',
    summary: 'Browser: Global scope is window/document; access to DOM/BOM; sandboxed from the local file system. Node.js: Global scope is global/process; no DOM/BOM; direct access to the OS, file system (fs), network (net), and processes.',
    explanation: [
      'Global Object: Browser has window, document, and navigator. Node.js has global, process, and Buffer.',
      'DOM / BOM: Browser manipulates UI and web pages. Node.js has no DOM or rendering engine.',
      'System Access: Node.js has direct access to the filesystem (fs), processes, and raw TCP sockets (net). Browsers are sandboxed for security.',
      'Module System: Node.js uses CommonJS and ES Modules; browsers natively support ES Modules via script tags.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'browser-vs-node.js',
      code: `// In Node.js:
console.log(typeof global);      // "object"
console.log(typeof process);     // "object"
console.log(typeof document);    // "undefined"

// Access OS process info
console.log('Node Version:', process.version);
console.log('Platform:', process.platform);`,
      output: `object
object
undefined
Node Version: v20.11.0
Platform: win32`,
      executionSteps: [
        { line: 2, explanation: 'Verifies global and process exist in Node runtime' },
        { line: 4, explanation: 'document is undefined outside browser' }
      ]
    },
    keyPoints: [
      'Node.js runs server-side with OS and file access.',
      'Browsers run client-side with DOM access in a security sandbox.',
      'globalThis is standardized in modern JS to refer to the global object in both.'
    ],
    interviewTip: 'Mention globalThis as the modern ECMAScript standard that resolves to window in browser and global in Node.',
    tags: ['Runtime', 'Browser', 'Node.js', 'Basics']
  },

  // ==========================================
  // Topic 2: Event Loop, Phases & Execution Order
  // ==========================================
  {
    id: 'node-8',
    stack: 'node',
    topic: 'Event Loop, Phases & Execution Order',
    title: 'What are the 6 phases of the Node.js Event Loop?',
    difficulty: 'Intermediate',
    summary: 'Timers: Executes callbacks scheduled by setTimeout() and setInterval(). Pending Callbacks: Executes I/O callbacks deferred from the previous loop iteration. Idle, Prepare: Internal libuv routines. Poll: Retrieves new I/O events and executes their callbacks. Check: Executes callbacks registered with setImmediate(). Close Callbacks: Executes socket and handle close events (e.g., socket.on(\'close\')).',
    explanation: [
      '1. Timers: Checks threshold and executes callbacks from setTimeout() and setInterval().',
      '2. Pending Callbacks: Executes I/O callbacks deferred by system errors (like ECONNREFUSED).',
      '3. Idle, Prepare: Used internally by libuv for housekeeping.',
      '4. Poll: Calculates how long it should block and poll for I/O; executes I/O related callbacks.',
      '5. Check: Executes callbacks registered via setImmediate().',
      '6. Close Callbacks: Executes cleanup callbacks, e.g. socket.on(\'close\', ...).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'event-loop-phases.js',
      code: `const fs = require('fs');

// Phase 1: Timers
setTimeout(() => console.log('1. Timers phase: setTimeout'), 0);

// Phase 5: Check
setImmediate(() => console.log('2. Check phase: setImmediate'));

// Microtask: Runs before next phase
process.nextTick(() => console.log('0. Microtask: process.nextTick'));`,
      output: `0. Microtask: process.nextTick
1. Timers phase: setTimeout
2. Check phase: setImmediate`,
      executionSteps: [
        { line: 10, explanation: 'process.nextTick drains immediately before event loop phase transitions' },
        { line: 4, explanation: 'Timers phase executes setTimeout' },
        { line: 7, explanation: 'Check phase executes setImmediate' }
      ]
    },
    keyPoints: [
      '6 distinct phases: Timers -> Pending -> Idle -> Poll -> Check -> Close.',
      'Poll phase retrieves new I/O events and runs their callbacks.',
      'Microtasks drain between phases before moving forward.'
    ],
    interviewTip: 'Mnemonic: "The Police Is Patrolling Central City" (Timers, Pending, Idle, Poll, Check, Close).',
    tags: ['Event Loop', 'Phases', 'Libuv', 'Timers']
  },
  {
    id: 'node-9',
    stack: 'node',
    topic: 'Event Loop, Phases & Execution Order',
    title: 'process.nextTick() vs. setImmediate() vs. setTimeout(fn, 0)',
    difficulty: 'Intermediate',
    summary: 'process.nextTick(): Runs on the microtask queue immediately after the current operation finishes, before advancing to the next event loop phase. setImmediate(): Runs during the Check phase of the event loop. setTimeout(fn, 0): Runs in the Timers phase once the minimal threshold (~1ms) elapses.',
    explanation: [
      'process.nextTick(): Not technically part of the event loop. It executes on the nextTickQueue right after the current JavaScript operation completes, before the event loop advances.',
      'setImmediate(): Designed to execute a script once the current Poll phase completes, running specifically in the Check phase.',
      'setTimeout(fn, 0): Schedules execution in the Timers phase. Has an OS/engine minimum delay (~1ms).',
      'Relative Priority: process.nextTick() always fires before Promises and event loop phase transitions.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'tick-immediate-timeout.js',
      code: `setTimeout(() => console.log('setTimeout (Timers Phase)'), 0);
setImmediate(() => console.log('setImmediate (Check Phase)'));
process.nextTick(() => console.log('process.nextTick (Microtask)'));
Promise.resolve().then(() => console.log('Promise.then (Microtask)'));`,
      output: `process.nextTick (Microtask)
Promise.then (Microtask)
setTimeout (Timers Phase)
setImmediate (Check Phase)`,
      executionSteps: [
        { line: 3, explanation: 'process.nextTick runs first before any other asynchronous callback' },
        { line: 4, explanation: 'Promise microtask queue drains next' },
        { line: 1, explanation: 'Timers phase executes setTimeout' },
        { line: 2, explanation: 'Check phase executes setImmediate' }
      ]
    },
    keyPoints: [
      'nextTick fires before microtasks and event loop phases.',
      'setImmediate fires in the Check phase.',
      'setTimeout(fn, 0) fires in the Timers phase.'
    ],
    interviewTip: 'Warn that recursively calling process.nextTick will starve the I/O event loop and block all incoming requests.',
    tags: ['process.nextTick', 'setImmediate', 'setTimeout', 'Event Loop']
  },
  {
    id: 'node-10',
    stack: 'node',
    topic: 'Event Loop, Phases & Execution Order',
    title: 'What is the output order of this script?',
    difficulty: 'Advanced',
    summary: 'Output: 3. nextTick, 2. setImmediate, 1. setTimeout. Why: Inside an I/O callback (poll phase), setImmediate is guaranteed to fire before timers on the subsequent Check phase.',
    explanation: [
      'Poll Phase Entry: fs.readFile callback executes in the Poll phase of the event loop.',
      'process.nextTick: Scheduled inside the callback; drains immediately when the current callback completes.',
      'Next Phase Transition: The phase immediately following the Poll phase is the Check phase where setImmediate executes.',
      'Timers Execution: The Timers phase is only reached in the next loop tick, so setTimeout fires last.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'io-callback-order.js',
      code: `const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('1. setTimeout'), 0);
  setImmediate(() => console.log('2. setImmediate'));
  process.nextTick(() => console.log('3. nextTick'));
});`,
      output: `3. nextTick
2. setImmediate
1. setTimeout`,
      executionSteps: [
        { line: 3, explanation: 'fs.readFile finishes: enters Poll phase callback' },
        { line: 6, explanation: 'process.nextTick queued and executes immediately on callback exit' },
        { line: 5, explanation: 'Event loop transitions directly to Check phase: runs setImmediate' },
        { line: 4, explanation: 'Event loop loops back to Timers phase: runs setTimeout' }
      ]
    },
    keyPoints: [
      'Inside I/O callbacks, setImmediate ALWAYS executes before setTimeout.',
      'process.nextTick always drains before the event loop advances to the next phase.',
      'Guaranteed deterministic execution order inside I/O.'
    ],
    interviewTip: 'If this script is run in the main module (outside I/O), the order between setTimeout(fn,0) and setImmediate is non-deterministic based on OS CPU scheduling!',
    tags: ['Event Loop', 'Output Prediction', 'fs.readFile', 'setImmediate']
  },

  // ==========================================
  // Topic 3: Modules, Buffers, Streams & File System
  // ==========================================
  {
    id: 'node-11',
    stack: 'node',
    topic: 'Modules, Buffers, Streams & File System',
    title: 'CommonJS (require) vs. ES Modules (import)',
    difficulty: 'Beginner',
    summary: 'CommonJS (CJS): Synchronous loading at runtime using module.exports and require(). ES Modules (ESM): Asynchronous static loading evaluated at compile-time using export and import.',
    explanation: [
      'CommonJS (CJS): Default legacy system in Node. Evaluated synchronously at runtime. Modules are cached after the first require().',
      'ES Modules (ESM): Standard ECMAScript specification. Statically analyzed before execution, supporting tree-shaking and top-level await.',
      'Variables: CJS includes __dirname and __filename; ESM does not (use import.meta.url).',
      'Interoperability: ESM can import CJS modules via default import, but CJS cannot use require() on ESM without dynamic import().'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'cjs-vs-esm.js',
      code: `// CommonJS (CJS)
// const { add } = require('./math');
// module.exports = { add };

// ES Module (ESM)
// import { add } from './math.js';
// export const multiply = (a, b) => a * b;

console.log('CJS: Synchronous & dynamic');
console.log('ESM: Asynchronous & statically analyzable');`,
      output: `CJS: Synchronous & dynamic
ESM: Asynchronous & statically analyzable`,
      executionSteps: [
        { line: 9, explanation: 'CommonJS uses module.exports and require()' },
        { line: 10, explanation: 'ESM uses export and import with static resolution' }
      ]
    },
    keyPoints: [
      'CommonJS is synchronous; ESM is asynchronous and static.',
      'ESM allows tree-shaking and top-level await.',
      'Enable ESM in Node by setting "type": "module" in package.json or using .mjs extension.'
    ],
    interviewTip: 'Explain how to recreate __dirname in ESM using import.meta.url and fileURLToPath.',
    tags: ['CommonJS', 'ESM', 'Modules', 'require']
  },
  {
    id: 'node-12',
    stack: 'node',
    topic: 'Modules, Buffers, Streams & File System',
    title: 'What are Node.js Buffers and why are they needed?',
    difficulty: 'Intermediate',
    summary: 'Buffers allocate fixed-size chunks of raw binary data in memory outside the V8 heap. They allow Node.js to handle binary assets directly (images, video slices, TCP data frames).',
    explanation: [
      'Purpose: JavaScript originally handled strings well but lacked native binary memory capabilities. Buffers bridge this gap.',
      'Memory Allocation: Allocated directly in raw OS memory outside the V8 garbage-collected heap.',
      'Subclass of Uint8Array: A Buffer is an array of bytes (integers from 0 to 255).',
      'Encoding: Easily converts between UTF-8, base64, hex, and binary formats.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'buffer-basics.js',
      code: `// Create buffer from string
const buf = Buffer.from('Hello Node', 'utf8');
console.log(buf); // Raw byte hex representation
console.log(buf.toString('hex'));
console.log(buf.toString('base64'));

// Allocate fixed size raw memory
const blank = Buffer.alloc(5);
console.log(blank); // <Buffer 00 00 00 00 00>`,
      output: `<Buffer 48 65 6c 6c 6f 20 4e 6f 64 65>
48656c6c6f204e6f6465
SGVsbG8gTm9kZQ==
<Buffer 00 00 00 00 00>`,
      executionSteps: [
        { line: 2, explanation: 'Allocates buffer representing UTF-8 string bytes' },
        { line: 8, explanation: 'Buffer.alloc initializes zero-filled 5-byte memory block' }
      ]
    },
    keyPoints: [
      'Allocated outside V8 heap in raw memory.',
      'Handles binary network streams and file buffers.',
      'Never use deprecated new Buffer(); always use Buffer.from() or Buffer.alloc().'
    ],
    interviewTip: 'Mention Buffer.allocUnsafe(size) is faster because it does not zero-fill, but may contain sensitive residual memory data!',
    tags: ['Buffer', 'Binary Data', 'Memory', 'Performance']
  },
  {
    id: 'node-13',
    stack: 'node',
    topic: 'Modules, Buffers, Streams & File System',
    title: 'What are Streams and what are the 4 main types?',
    difficulty: 'Intermediate',
    summary: 'Collections of data consumed chunk-by-chunk without loading the entire payload into RAM. Readable: fs.createReadStream(). Writable: fs.createWriteStream(). Duplex: Bidirectional (net.Socket). Transform: Modifies chunks as data passes through (zlib.createGzip()).',
    explanation: [
      'Memory Efficiency: Processes gigabytes of data with megabytes of RAM.',
      '1. Readable: Stream from which data can be read (fs.createReadStream, req in HTTP).',
      '2. Writable: Stream to which data can be written (fs.createWriteStream, res in HTTP).',
      '3. Duplex: Both Readable and Writable (e.g., net.Socket, TCP connections).',
      '4. Transform: Duplex stream that modifies or transforms data in flight (e.g., zlib.createGzip, crypto.createCipher).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'stream-types.js',
      code: `const fs = require('fs');
const zlib = require('zlib');

// Transform stream compressing data on-the-fly
const gzip = zlib.createGzip();

console.log('Stream types: Readable, Writable, Duplex, Transform');`,
      output: `Stream types: Readable, Writable, Duplex, Transform`,
      executionSteps: [
        { line: 5, explanation: 'zlib.createGzip creates a Transform stream' }
      ]
    },
    keyPoints: [
      'Consumes and processes data chunk-by-chunk.',
      '4 types: Readable, Writable, Duplex, Transform.',
      'Drastically reduces server RAM requirements.'
    ],
    interviewTip: 'Streams inherit from EventEmitter and emit events: data, end, error, finish, and close.',
    tags: ['Streams', 'Readable', 'Writable', 'Transform', 'Memory']
  },
  {
    id: 'node-14',
    stack: 'node',
    topic: 'Modules, Buffers, Streams & File System',
    title: 'What is Stream Backpressure and how is it solved?',
    difficulty: 'Advanced',
    summary: 'Occurs when a readable stream produces data faster than a writable destination can consume it, risking high memory usage. Handled automatically using .pipe() or the stream.pipeline() helper, which pauses reads until the write buffer empties.',
    explanation: [
      'The Problem: If a fast disk or network connection feeds data faster than a slow destination can write, unwritten data buffers in RAM until the process crashes with Out of Memory.',
      'HighWaterMark: The threshold limit of the internal stream buffer (default 16KB for objects, 64KB for buffers).',
      'drain Event: When writable.write(chunk) returns false, the producer should pause until the writable emits the drain event.',
      'Modern Solution: stream.pipeline(readable, transform, writable, callback) automatically handles backpressure, stream destruction, and clean error cleanup.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'stream-backpressure.js',
      code: `const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// pipeline manages backpressure & errors automatically
pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('input.txt.gz'),
  (err) => {
    if (err) console.error('Pipeline failed:', err.message);
    else console.log('Pipeline succeeded with automatic backpressure!');
  }
);`,
      output: `Pipeline succeeded with automatic backpressure!`,
      executionSteps: [
        { line: 6, explanation: 'stream.pipeline links streams safely with backpressure handling' }
      ]
    },
    keyPoints: [
      'Backpressure prevents fast readers from overwhelming slow writers.',
      'write() returns false when buffer exceeds highWaterMark.',
      'stream.pipeline() is the recommended production solution.'
    ],
    interviewTip: 'Avoid raw .pipe() in production because it does not properly forward errors or close streams if one of them fails; always use stream.pipeline() or pipeline from stream/promises.',
    tags: ['Backpressure', 'Streams', 'pipeline', 'Performance']
  },
  {
    id: 'node-15',
    stack: 'node',
    topic: 'Modules, Buffers, Streams & File System',
    title: 'fs.readFile() vs. fs.createReadStream()',
    difficulty: 'Beginner',
    summary: 'fs.readFile() loads the entire file into RAM before firing the callback; fails with memory errors on large files. fs.createReadStream() streams data in configurable chunks (default 64KB), keeping memory consumption low and constant.',
    explanation: [
      'fs.readFile: Reads the entire file into memory as one monolithic Buffer or string. If you read a 2GB file, your process consumes 2GB of RAM.',
      'fs.createReadStream: Reads the file in 64KB chunks and emits data events sequentially.',
      'Concurrency Impact: Under high concurrent load, fs.readFile can easily exhaust the V8 heap.',
      'Use Case: Use fs.readFile for tiny config files (JSON/env); use fs.createReadStream for uploads, downloads, logs, and video assets.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'readfile-vs-stream.js',
      code: `const fs = require('fs');

// 1. fs.readFile (Loads all into RAM)
fs.readFile('config.json', 'utf8', (err, data) => {
  // console.log('File loaded completely in memory');
});

// 2. fs.createReadStream (Streams chunk-by-chunk)
const stream = fs.createReadStream('large-video.mp4', { highWaterMark: 64 * 1024 });
stream.on('data', (chunk) => {
  // console.log('Processing 64KB chunk:', chunk.length);
});`,
      output: `Streaming keeps memory constant regardless of file size.`,
      executionSteps: [
        { line: 4, explanation: 'fs.readFile buffers entire content in RAM' },
        { line: 9, explanation: 'createReadStream processes 64KB chunks sequentially' }
      ]
    },
    keyPoints: [
      'readFile buffers entire content in RAM.',
      'createReadStream processes data in constant-memory chunks.',
      'Large file reads using readFile risk Heap Out of Memory.'
    ],
    interviewTip: 'Mention that V8 has an array buffer allocation limit (~2-4GB), so attempting fs.readFile on very large files throws a RangeError.',
    tags: ['fs', 'Streams', 'readFile', 'Memory']
  },

  // ==========================================
  // Topic 4: Events, Callbacks & Error Handling
  // ==========================================
  {
    id: 'node-16',
    stack: 'node',
    topic: 'Events, Callbacks & Error Handling',
    title: 'What is the EventEmitter class?',
    difficulty: 'Beginner',
    summary: 'A core module (events) that facilitates event-driven communication via the publisher-subscriber pattern using emitter.on() and emitter.emit().',
    explanation: [
      'Observer Pattern: Allows objects to subscribe to named events and execute callbacks when those events are emitted.',
      'Core Usage: Many native Node.js APIs (HTTP servers, sockets, streams, child processes) inherit from EventEmitter.',
      'Synchronous Execution: Event listeners are executed synchronously in the order they were registered when emitter.emit() is called.',
      'Memory Leaks: By default, warnings are triggered if more than 10 listeners are added to a single event (emitter.setMaxListeners(n)).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'event-emitter-demo.js',
      code: `const EventEmitter = require('events');

const emitter = new EventEmitter();

// Subscribe
emitter.on('paymentSuccess', (id, amount) => {
  console.log(\`Payment confirmed: ID \${id}, Amount: $\${amount}\`);
});

// Publish / Trigger
emitter.emit('paymentSuccess', 1042, 99.50);`,
      output: `Payment confirmed: ID 1042, Amount: $99.5`,
      executionSteps: [
        { line: 3, explanation: 'Instantiates custom EventEmitter' },
        { line: 6, explanation: 'Registers listener callback on "paymentSuccess"' },
        { line: 11, explanation: 'Emits event synchronously; listener fires immediately' }
      ]
    },
    keyPoints: [
      'Implements publisher-subscriber / observer pattern.',
      'Listeners execute synchronously in registration order.',
      'Default limit of 10 listeners per event to prevent memory leaks.'
    ],
    interviewTip: 'If an EventEmitter emits an \'error\' event with no registered listeners, Node.js throws an unhandled exception and exits the process!',
    tags: ['EventEmitter', 'Events', 'Design Patterns', 'PubSub']
  },
  {
    id: 'node-17',
    stack: 'node',
    topic: 'Events, Callbacks & Error Handling',
    title: 'What is an Error-First Callback convention?',
    difficulty: 'Beginner',
    summary: 'The first argument is reserved for an error object (or null on success); result payloads follow: (err, data) => { ... }.',
    explanation: [
      'Standard Signature: (err, result1, result2) => { ... } is universal across native Node.js asynchronous APIs.',
      'Explicit Error Checking: Forces developers to verify if (err) before attempting to access result data.',
      'Null on Success: If the operation succeeds, err is null or undefined.',
      'Promisify Compatibility: Utility util.promisify() relies specifically on error-first signatures to convert legacy callbacks into native Promises.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'error-first-callback.js',
      code: `const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Handled operation error:', err.code);
    return;
  }
  console.log('File content:', data);
});`,
      output: `Handled operation error: ENOENT`,
      executionSteps: [
        { line: 3, explanation: 'fs.readFile called with error-first callback' },
        { line: 4, explanation: 'Checks if err exists before processing' }
      ]
    },
    keyPoints: [
      'First argument is reserved for errors; subsequent arguments hold data.',
      'Promotes defensive, reliable error checking.',
      'Easily wrapped using util.promisify.'
    ],
    interviewTip: 'Remember to return inside the if (err) block to prevent subsequent lines from executing with undefined data.',
    tags: ['Callbacks', 'Error Handling', 'Conventions', 'Basics']
  },
  {
    id: 'node-18',
    stack: 'node',
    topic: 'Events, Callbacks & Error Handling',
    title: 'How do you handle unhandled errors across a Node.js process?',
    difficulty: 'Intermediate',
    summary: 'process.on(\'uncaughtException\', err => { ... }) catches synchronous exceptions escaping try/catch blocks. process.on(\'unhandledRejection\', reason => { ... }) catches rejected Promises lacking a .catch() block.',
    explanation: [
      'uncaughtException: Emitted when an uncaught JavaScript exception bubbles all the way back to the event loop. The application state is corrupted; you should log the error and gracefully exit.',
      'unhandledRejection: Emitted whenever a Promise is rejected and no error handler is attached to the promise within the turn of the event loop.',
      'Exit Requirement: On uncaughtException, always exit the process (process.exit(1)) and let a process manager (PM2, Docker, Kubernetes) restart it safely.',
      'Never Resume on uncaughtException: Continuing after an uncaught exception is dangerous because memory and application state can be indeterminate.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'process-error-handling.js',
      code: `// Catch unhandled Promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Catch synchronous crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err.message);
  process.exit(1); // Clean exit to let PM2 restart worker
});`,
      output: `Centralized process exception listeners configured.`,
      executionSteps: [
        { line: 2, explanation: 'Monitors unhandled rejected Promises globally' },
        { line: 7, explanation: 'Monitors uncaught synchronous exceptions and triggers process exit' }
      ]
    },
    keyPoints: [
      'uncaughtException handles synchronous exceptions.',
      'unhandledRejection handles rejected Promises without .catch.',
      'Always terminate and restart process on uncaughtException.'
    ],
    interviewTip: 'In Node 15+, unhandled promise rejections terminate the process with exit code 1 by default unless an unhandledRejection listener is registered.',
    tags: ['Error Handling', 'process', 'uncaughtException', 'unhandledRejection']
  },

  // ==========================================
  // Topic 5: Multiprocessing, Scaling & Performance
  // ==========================================
  {
    id: 'node-19',
    stack: 'node',
    topic: 'Multiprocessing, Scaling & Performance',
    title: 'child_process vs. cluster vs. worker_threads',
    difficulty: 'Advanced',
    summary: 'child_process: Spawns separate OS processes to execute system commands (exec, spawn, fork). cluster: Forks child Node.js instances (one per CPU core) that share a single server port to distribute traffic. worker_threads: Runs CPU-heavy JavaScript scripts concurrently within the same process, sharing memory via SharedArrayBuffer.',
    explanation: [
      'child_process: Spawns new external OS processes. Communicates via IPC or standard streams (stdin/stdout). Great for executing shell utilities (git, ffmpeg).',
      'cluster: Spawns multiple identical Node.js worker processes (using child_process.fork under the hood). Workers share a single server port (e.g. 3000) using round-robin load distribution. Maximizes multi-core CPU utilization.',
      'worker_threads: Runs multiple threads inside ONE Node.js process with separate V8 instances. Can share memory directly via SharedArrayBuffer. Ideal for CPU-heavy tasks (image processing, encryption, machine learning).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'concurrency-options.js',
      code: `// 1. cluster: Forking processes per CPU core
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(\`Primary process running; forking \${numCPUs} workers\`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  http.createServer((req, res) => res.end('Worker response')).listen(8000);
}`,
      output: `Primary process running; forking 8 workers`,
      executionSteps: [
        { line: 6, explanation: 'Primary process counts available CPU cores' },
        { line: 8, explanation: 'Forks independent worker processes sharing port 8000' }
      ]
    },
    keyPoints: [
      'child_process: Runs external OS commands or scripts.',
      'cluster: Multi-process scaling for web servers across CPU cores.',
      'worker_threads: Multi-threaded CPU computation with shared memory.'
    ],
    interviewTip: 'Use cluster mode for I/O request scaling; use worker_threads for CPU-bound computations (e.g. image resizing or mathematical simulations).',
    tags: ['cluster', 'worker_threads', 'child_process', 'Scaling', 'Multithreading']
  },
  {
    id: 'node-20',
    stack: 'node',
    topic: 'Multiprocessing, Scaling & Performance',
    title: 'What is PM2 and why use it in production?',
    difficulty: 'Intermediate',
    summary: 'A production process manager that provides automatic application restarts on crashes, zero-downtime reloads, built-in load balancing in cluster mode, and resource monitoring.',
    explanation: [
      'Auto-Restart: If an unhandled exception causes a Node.js process to exit, PM2 automatically re-spawns it instantly.',
      'Cluster Mode: Automatically detects available CPU cores and scales your app in cluster mode with pm2 start app.js -i max.',
      'Zero-Downtime Reloads: pm2 reload app reloads worker instances sequentially so user requests are never dropped during deployments.',
      'Monitoring & Logs: Aggregates logs, memory consumption, CPU utilization, and tracks metrics via pm2 monit.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'ecosystem.config.js',
      code: `// PM2 Ecosystem Configuration file
module.exports = {
  apps: [{
    name: 'api-server',
    script: 'app.js',
    instances: 'max',       // Cluster mode across all CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};`,
      output: `PM2 configuration ready for cluster deployment.`,
      executionSteps: [
        { line: 6, explanation: 'Configures maximum cluster workers' },
        { line: 9, explanation: 'Safely restarts worker if memory exceeds 1GB' }
      ]
    },
    keyPoints: [
      'Keeps applications alive 24/7 with auto-restarts.',
      'Built-in cluster mode load balancing.',
      'Supports zero-downtime hot reloads.'
    ],
    interviewTip: 'Differentiate between "pm2 restart" (kills and starts all processes, brief downtime) and "pm2 reload" (sequential zero-downtime reload).',
    tags: ['PM2', 'DevOps', 'Production', 'Cluster', 'Process Management']
  },

  // ==========================================
  // Topic 6: Express.js Architecture & Routing
  // ==========================================
  {
    id: 'node-21',
    stack: 'node',
    topic: 'Express.js Architecture & Routing',
    title: 'Vanilla http module vs. Express.js',
    difficulty: 'Beginner',
    summary: 'Built-in http requires manual URL parsing, header writing, and stream buffering. Express provides unified routing, helper methods (res.json(), res.status()), and a modular middleware pipeline.',
    explanation: [
      'Routing: Native http requires manual if/else regex checks on req.url and req.method. Express has intuitive app.get(), app.post() routing.',
      'Middleware: Express is built entirely around an extensible middleware onion-layer pipeline.',
      'Response Helpers: Express simplifies responses with res.json(), res.send(), and res.status() which automatically set headers and stringify JSON.',
      'Request Parsing: Express integrates body, parameter, and query string parsing out-of-the-box.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'http-vs-express.js',
      code: `const express = require('express');
const app = express();

app.use(express.json());

// Declarative route with status and JSON helpers
app.get('/api/users', (req, res) => {
  res.status(200).json([{ id: 1, name: 'Himanshu' }]);
});

app.listen(3000, () => console.log('Express app listening on 3000'));`,
      output: `Express app listening on 3000`,
      executionSteps: [
        { line: 2, explanation: 'Initializes Express application' },
        { line: 7, explanation: 'Defines clean GET route handler with status and json helpers' }
      ]
    },
    keyPoints: [
      'Express abstracts boilerplate from native http module.',
      'Provides modular routing and middleware pipeline.',
      'Includes response helpers: res.json, res.status, res.sendFile.'
    ],
    interviewTip: 'Express is fundamentally a routing and middleware web framework that sits directly on top of Node\'s native http.Server.',
    tags: ['Express.js', 'http', 'Routing', 'Web Framework']
  },
  {
    id: 'node-22',
    stack: 'node',
    topic: 'Express.js Architecture & Routing',
    title: 'Route Parameters (req.params) vs. Query Parameters (req.query)',
    difficulty: 'Beginner',
    summary: 'req.params: Captures dynamic path segments in routes (e.g., /users/:id -> req.params.id). req.query: Captures key-value pairs following the URL ? mark (e.g., /search?page=2 -> req.query.page).',
    explanation: [
      'Route Parameters (req.params): Defined as named placeholders in the route path prefixed with a colon (:id). Used to identify specific resources.',
      'Query Parameters (req.query): Key-value pairs in the URL query string after ?. Used for optional filtering, sorting, pagination, and searching.',
      'URL Example: GET /users/42?includeDetails=true&sort=asc -> req.params.id is "42", req.query.sort is "asc".',
      'Types: Values extracted from both req.params and req.query are strings by default.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'params-vs-query.js',
      code: `const express = require('express');
const app = express();

// Route param :id + query params ?page=1&limit=10
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const page = req.query.page || 1;
  res.json({ productId, page });
});

console.log('Route & Query parameter handlers configured.');`,
      output: `Route & Query parameter handlers configured.`,
      executionSteps: [
        { line: 5, explanation: 'Extracts dynamic :id from route path' },
        { line: 7, explanation: 'Extracts optional query parameters from req.query' }
      ]
    },
    keyPoints: [
      'req.params identifies specific resources (/items/:id).',
      'req.query handles filtering, sorting, and pagination (/items?sort=desc).',
      'Both return string values that may need parsing to numbers.'
    ],
    interviewTip: 'Always sanitize and validate route parameters before using them in database queries to prevent injection attacks.',
    tags: ['req.params', 'req.query', 'Routing', 'Express.js']
  },
  {
    id: 'node-23',
    stack: 'node',
    topic: 'Express.js Architecture & Routing',
    title: 'How does express.Router() work?',
    difficulty: 'Intermediate',
    summary: 'Creates modular, isolated route handlers in separate files and mounts them onto paths in app.js.',
    explanation: [
      'Modular Routing: Acts as a mini-Express application capable only of performing middleware and routing functions.',
      'Separation of Concerns: Isolates feature routes (auth, users, products) into dedicated files in a routes/ folder.',
      'Route Prefixing: Mounted on the main app using app.use(\'/api/users\', usersRouter), prefixing all router routes automatically.',
      'Router-Level Middleware: Middleware can be applied specifically to a router without affecting the rest of the application.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'routes/users.js',
      code: `const express = require('express');
const router = express.Router();

// Defined route matches /api/users/
router.get('/', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});

// Matches /api/users/:id
router.get('/:id', (req, res) => {
  res.json({ userId: req.params.id });
});

module.exports = router;`,
      output: `Modular router exported successfully.`,
      executionSteps: [
        { line: 2, explanation: 'Creates isolated express.Router instance' },
        { line: 5, explanation: 'Defines endpoints relative to router mounting path' },
        { line: 14, explanation: 'Exports router to be mounted in app.js via app.use' }
      ]
    },
    keyPoints: [
      'Enables modular, maintainable folder structure.',
      'Can apply router-specific middleware.',
      'Prefixes paths cleanly when mounted via app.use().'
    ],
    interviewTip: 'Explain how express.Router({ mergeParams: true }) allows child routers to access params from parent routers (e.g., /users/:userId/posts/:postId).',
    tags: ['express.Router', 'Modular Code', 'Express.js', 'Clean Architecture']
  },

  // ==========================================
  // Topic 7: Express.js Middleware
  // ==========================================
  {
    id: 'node-24',
    stack: 'node',
    topic: 'Express.js Middleware',
    title: 'What is Express Middleware?',
    difficulty: 'Beginner',
    summary: 'Functions with access to req, res, and next(). They can execute code, mutate request objects, terminate cycles, or pass control along the chain.',
    explanation: [
      'Middleware Signature: function(req, res, next) { ... }.',
      'next() Function: Calls the next middleware function in the stack. If next() is not called, the request hangs unless res.send()/res.end() terminates it.',
      'Types of Middleware: Application-level (app.use), Router-level (router.use), Built-in (express.json), Third-party (cors, helmet), and Error-handling (err, req, res, next).',
      'Execution Order: Middleware executes strictly in the sequential order it is registered via app.use().'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'custom-middleware.js',
      code: `const express = require('express');
const app = express();

// Custom logging middleware
app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // Passes control to next handler
});

app.get('/ping', (req, res) => {
  res.send(\`Pong! Request at \${req.requestTime}\`);
});`,
      output: `Middleware configured and chained with next().`,
      executionSteps: [
        { line: 5, explanation: 'Middleware mutates req with requestTime' },
        { line: 8, explanation: 'next() passes control to route handler' }
      ]
    },
    keyPoints: [
      'Access to req, res, and next.',
      'Must either call next() or end the request with a response.',
      'Executes in order of declaration.'
    ],
    interviewTip: 'Passing an argument to next(err) instructs Express to skip all remaining regular middleware and jump directly to the error-handling middleware.',
    tags: ['Middleware', 'Express.js', 'next()', 'Architecture']
  },
  {
    id: 'node-25',
    stack: 'node',
    topic: 'Express.js Middleware',
    title: 'How do you write an Error-Handling Middleware?',
    difficulty: 'Intermediate',
    summary: 'Identified by exactly 4 parameters (err, req, res, next) and mounted at the bottom of the middleware chain after all routes.',
    explanation: [
      'Arity of 4: Express identifies error middleware by inspecting function.length === 4. You must declare all 4 arguments (err, req, res, next), even if next is unused.',
      'Placement: Must be defined AFTER all app.use() and route definitions at the very bottom of the file.',
      'Triggering: Triggered by calling next(err) from any preceding route or middleware, or when an error is thrown inside synchronous handlers.',
      'Production Cleanliness: Return sanitized error messages to clients without leaking sensitive stack traces.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'error-middleware.js',
      code: `const express = require('express');
const app = express();

app.get('/error-test', (req, res, next) => {
  next(new Error('Simulated database failure'));
});

// Centralized Error-Handling Middleware (Must have 4 params!)
app.use((err, req, res, next) => {
  console.error('Logged Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});`,
      output: `Centralized 4-parameter error middleware registered.`,
      executionSteps: [
        { line: 5, explanation: 'Route passes error via next(err)' },
        { line: 9, explanation: '4-argument error middleware catches and formats error response' }
      ]
    },
    keyPoints: [
      'Must declare exactly 4 parameters: (err, req, res, next).',
      'Placed at the bottom of the middleware chain.',
      'Prevents leaking internal stack traces in production.'
    ],
    interviewTip: 'In Express 4, errors thrown inside async functions MUST be caught and passed to next(err). Express 5 automatically handles rejected promises!',
    tags: ['Error Handling', 'Middleware', 'Express.js', 'Best Practices']
  },
  {
    id: 'node-26',
    stack: 'node',
    topic: 'Express.js Middleware',
    title: 'Why do you need express.json() and express.urlencoded()?',
    difficulty: 'Beginner',
    summary: 'They parse incoming request payload bodies (JSON and URL-encoded strings) and attach the resulting object to req.body.',
    explanation: [
      'Raw Stream: In Node.js, incoming HTTP POST/PUT bodies arrive as raw readable byte streams (Chunks of Buffers).',
      'Body Parsing: Without parser middleware, req.body is undefined.',
      'express.json(): Parses incoming requests with Content-Type: application/json and sets req.body to a parsed JavaScript object.',
      'express.urlencoded({ extended: true }): Parses incoming URL-encoded form submissions (application/x-www-form-urlencoded). extended: true uses the qs library for rich nested objects.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'body-parsers.js',
      code: `const express = require('express');
const app = express();

// Middleware to parse JSON payloads
app.use(express.json({ limit: '10mb' }));

// Middleware to parse HTML form submissions
app.use(express.urlencoded({ extended: true }));

app.post('/api/users', (req, res) => {
  console.log('Parsed body:', req.body);
  res.status(201).json({ created: req.body });
});`,
      output: `Body parsers mounted. req.body accessible in POST/PUT routes.`,
      executionSteps: [
        { line: 5, explanation: 'express.json parses application/json payloads' },
        { line: 8, explanation: 'express.urlencoded parses form bodies' }
      ]
    },
    keyPoints: [
      'Populates req.body from raw incoming byte streams.',
      'Replaced external body-parser package in Express 4.16+.',
      'Supports payload size limits ({ limit: "10mb" }) to prevent DoS.'
    ],
    interviewTip: 'Setting size limits on express.json({ limit: "1mb" }) is a critical security best practice against payload-overflow denial-of-service attacks.',
    tags: ['express.json', 'express.urlencoded', 'req.body', 'Middleware']
  },

  // ==========================================
  // Topic 8: Security, Database & Real-Time APIs
  // ==========================================
  {
    id: 'node-27',
    stack: 'node',
    topic: 'Security, Database & Real-Time APIs',
    title: 'What is CORS and how do you configure it in Express?',
    difficulty: 'Intermediate',
    summary: 'Cross-Origin Resource Sharing restricts frontend domains from accessing different backend origins. Handled using the cors package.',
    explanation: [
      'Same-Origin Policy: A browser security mechanism that blocks web pages from making AJAX requests to a different domain, protocol, or port.',
      'CORS Headers: Server responds with headers like Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers to permit access.',
      'Preflight Requests: Browsers send an HTTP OPTIONS request before complex requests (PUT, DELETE, custom headers) to verify server permissions.',
      'cors Package: Standard Express middleware for configuring allowed origins, credentials, and allowed HTTP methods.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'cors-configuration.js',
      code: `const express = require('express');
const cors = require('cors');
const app = express();

// Whitelist configuration
const corsOptions = {
  origin: ['https://mysite.com', 'https://admin.mysite.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies across origins
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));`,
      output: `CORS whitelist policy applied securely.`,
      executionSteps: [
        { line: 6, explanation: 'Defines allowed client origins whitelist' },
        { line: 9, explanation: 'Enables credentials for cookie exchange' },
        { line: 13, explanation: 'Mounts cors middleware globally' }
      ]
    },
    keyPoints: [
      'CORS is enforced by browsers, NOT servers.',
      'Preflight uses HTTP OPTIONS requests.',
      'Never use cors({ origin: "*" }) with credentials: true in production.'
    ],
    interviewTip: 'CORS only applies to browser requests. Server-to-server requests (cURL, Postman, backend microservices) are unaffected by CORS.',
    tags: ['CORS', 'Security', 'HTTP', 'Express.js']
  },
  {
    id: 'node-28',
    stack: 'node',
    topic: 'Security, Database & Real-Time APIs',
    title: 'Essential HTTP security headers with Helmet',
    difficulty: 'Intermediate',
    summary: 'helmet() secures Express apps by setting headers like Content-Security-Policy, X-Frame-Options, and Strict-Transport-Security.',
    explanation: [
      'Security by Default: Express headers reveal sensitive server technology by default (e.g., X-Powered-By: Express).',
      'Helmet Middleware: A collection of 15 smaller middleware functions that set defensive HTTP headers automatically.',
      'Content-Security-Policy (CSP): Restricts sources from which scripts, images, and styles can be loaded, stopping XSS attacks.',
      'X-Frame-Options: Prevents clickjacking by forbidding embedding the page in <iframe> elements.',
      'Strict-Transport-Security (HSTS): Enforces secure HTTPS connections.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'helmet-security.js',
      code: `const express = require('express');
const helmet = require('helmet');
const app = express();

// Mounts 15 security headers automatically
app.use(helmet());

// Removes revealing header
// (app.disable('x-powered-by') is done automatically by helmet)

app.get('/', (req, res) => res.send('Secure headers active'));`,
      output: `Defensive HTTP security headers attached via Helmet.`,
      executionSteps: [
        { line: 6, explanation: 'helmet() attaches CSP, HSTS, X-Frame-Options, and strips X-Powered-By' }
      ]
    },
    keyPoints: [
      'Strips X-Powered-By to conceal backend technology.',
      'Sets X-Frame-Options to prevent Clickjacking.',
      'Configures Content-Security-Policy against Cross-Site Scripting (XSS).'
    ],
    interviewTip: 'Always mount helmet() at the top of your Express middleware chain before any routes are defined.',
    tags: ['Helmet', 'Security', 'Headers', 'XSS', 'Clickjacking']
  },
  {
    id: 'node-29',
    stack: 'node',
    topic: 'Security, Database & Real-Time APIs',
    title: 'Preventing SQL and NoSQL Injection',
    difficulty: 'Intermediate',
    summary: 'SQL: Use parameterized prepared statements or ORMs (Prisma, Sequelize). NoSQL (MongoDB): Sanitize input keys against operators ($gt, $where) using sanitizers like express-mongo-sanitize.',
    explanation: [
      'SQL Injection: Occurs when untrusted user input is directly concatenated into SQL strings. Prevent by using parameterized queries ($1, ? placeholders) or modern ORMs (Prisma, TypeORM).',
      'NoSQL Injection: Attackers send objects containing MongoDB query operators (e.g. { "username": "admin", "password": { "$gt": "" } }) which bypass authentication.',
      'Prevention in Mongo: Use express-mongo-sanitize to strip prohibited $ and . prefixes from req.body and req.params.',
      'Schema Validation: Enforce strict schemas with Mongoose, Joi, or Zod to reject non-string inputs.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'injection-prevention.js',
      code: `// 1. Safe SQL with Parameterized Queries
// pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// 2. Safe NoSQL with express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');
const app = express();

app.use(express.json());
// Strips dangerous keys containing '$' or '.'
app.use(mongoSanitize());

console.log('SQL parameterization & NoSQL sanitization active.');`,
      output: `SQL parameterization & NoSQL sanitization active.`,
      executionSteps: [
        { line: 11, explanation: 'mongoSanitize strips query operators like $gt from input' }
      ]
    },
    keyPoints: [
      'Never concatenate raw strings into database queries.',
      'Use parameterized queries ($1, ?) for SQL.',
      'Sanitize $ and . keys and use schema validators (Zod/Mongoose) for NoSQL.'
    ],
    interviewTip: 'Explain how passing { $ne: null } in a login password field can bypass authentication in naive MongoDB apps.',
    tags: ['Security', 'SQL Injection', 'NoSQL Injection', 'Database']
  },
  {
    id: 'node-30',
    stack: 'node',
    topic: 'Security, Database & Real-Time APIs',
    title: 'WebSockets vs. HTTP Polling',
    difficulty: 'Intermediate',
    summary: 'HTTP Polling: The client repeatedly makes request cycles to check for new data, creating connection overhead. WebSockets (ws, Socket.io): A persistent, bidirectional, full-duplex TCP channel allowing the server to push updates instantly.',
    explanation: [
      'Short Polling: Client sends HTTP requests every X seconds. Causes immense overhead from repeated TCP/TLS handshakes and HTTP header transfers.',
      'Long Polling: Server holds HTTP request open until new data arrives, then responds and closes.',
      'WebSockets: Initiated via an HTTP 101 Switching Protocols upgrade handshake. Establishes a single, persistent, lightweight bidirectional TCP connection.',
      'Use Cases: WebSockets are ideal for real-time chat, multiplayer gaming, financial ticker feeds, and live notifications.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'websocket-server.js',
      code: `const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected via persistent WebSocket');

  // Push updates instantly from server to client
  ws.send(JSON.stringify({ type: 'WELCOME', time: Date.now() }));

  ws.on('message', (message) => {
    console.log(\`Received: \${message}\`);
  });
});`,
      output: `WebSocket server running on port 8080`,
      executionSteps: [
        { line: 3, explanation: 'Instantiates WebSocket server on TCP port 8080' },
        { line: 5, explanation: 'Listens for full-duplex socket connections' },
        { line: 9, explanation: 'Pushes server data directly down socket without polling' }
      ]
    },
    keyPoints: [
      'WebSockets maintain a single persistent TCP connection.',
      'Bi-directional (server can push data without client asking).',
      'Significantly lower bandwidth and latency than HTTP polling.'
    ],
    interviewTip: 'Mention Socket.io provides automatic fallback to long-polling if WebSockets are blocked by proxies or firewalls.',
    tags: ['WebSockets', 'HTTP Polling', 'Real-time', 'Socket.io', 'Networking']
  },

  // ==========================================
  // Topic 9: Production, Security & System Operations (Rapid-Fire 31-50)
  // ==========================================
  {
    id: 'node-31',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is the Node.js REPL?',
    difficulty: 'Beginner',
    summary: 'Read-Eval-Print-Loop interactive shell launched via "node" in the terminal for rapid code prototyping and debugging.',
    explanation: [
      'Read: Accepts user JavaScript input and parses it in memory.',
      'Eval: Executes the parsed data through the V8 engine.',
      'Print: Displays the evaluated return value in the terminal.',
      'Loop: Waits for subsequent inputs until exited (.exit or Ctrl+C twice).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'repl-demo.sh',
      code: `$ node
> const sum = (a, b) => a + b;
undefined
> sum(10, 20)
30
> _ * 2
60`,
      output: `60 (in REPL '_' represents the last evaluated expression)`,
      executionSteps: [
        { line: 1, explanation: 'Launches REPL terminal session' },
        { line: 6, explanation: '_ special variable stores last evaluated result' }
      ]
    },
    keyPoints: [
      'Interactive terminal for testing JavaScript snippets.',
      'Special variable _ holds the result of the last evaluated expression.',
      'Supports auto-completion with Tab.'
    ],
    interviewTip: 'You can programmatically customize and embed the REPL in your own applications using the native "repl" module.',
    tags: ['REPL', 'CLI', 'Tooling', 'Basics']
  },
  {
    id: 'node-32',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is package-lock.json?',
    difficulty: 'Beginner',
    summary: 'Locks exact dependency versions and sub-dependencies to guarantee reproducible installs across environments.',
    explanation: [
      'Version Pinning: While package.json uses semantic version ranges (^1.2.0 or ~1.2.0), package-lock.json pins the exact version (1.2.3) and SHA-512 integrity hashes.',
      'Dependency Tree: Records the full recursive dependency tree of all sub-dependencies.',
      'Reproducibility: Guarantees that every developer and CI/CD server installs the exact identical byte-for-byte packages.',
      'Commit to Git: Must always be checked into version control.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'package-lock-snippet.json',
      code: `{
  "name": "my-app",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/express": {
      "version": "4.19.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.19.2.tgz",
      "integrity": "sha512-5gbiKrKmUY8v..."
    }
  }
}`,
      output: `Locks exact version and cryptographic integrity hash.`,
      executionSteps: [
        { line: 7, explanation: 'Locks express to exactly 4.19.2' },
        { line: 9, explanation: 'Integrity hash verifies package authenticity' }
      ]
    },
    keyPoints: [
      'Pins exact dependency versions and integrity hashes.',
      'Ensures reproducible deployments across team and CI/CD.',
      'Should always be committed to Git.'
    ],
    interviewTip: 'Never delete package-lock.json to solve npm errors; use npm update or inspect peer dependency conflicts properly.',
    tags: ['npm', 'package-lock.json', 'DevOps', 'Dependencies']
  },
  {
    id: 'node-33',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'npm install vs. npm ci',
    difficulty: 'Beginner',
    summary: 'npm install can update minor/patch versions; npm ci performs clean, strict installs directly from package-lock.json.',
    explanation: [
      'npm install: Reads package.json and may update package-lock.json if newer matching semver versions exist. Can modify lock files.',
      'npm ci (Clean Install): Specifically designed for automated CI/CD pipelines. Deletes node_modules completely and installs directly from package-lock.json.',
      'Speed: npm ci is significantly faster because it skips version resolution algorithms.',
      'Strict Check: If package.json and package-lock.json are out of sync, npm ci halts with an error instead of modifying the lock file.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'npm-commands.sh',
      code: `# Local Development (adds/updates packages)
npm install express

# CI/CD Production Pipelines (fast, immutable, clean)
npm ci --only=production`,
      output: `npm ci guarantees strict parity with package-lock.json.`,
      executionSteps: [
        { line: 5, explanation: 'npm ci performs fast, reproducible build in CI/CD' }
      ]
    },
    keyPoints: [
      'npm install can update package-lock.json.',
      'npm ci strictly installs from lockfile without modifying it.',
      'npm ci is faster and deletes node_modules first.'
    ],
    interviewTip: 'Always use npm ci in Dockerfiles and CI/CD pipelines (GitHub Actions, Jenkins) for reliable builds.',
    tags: ['npm', 'npm ci', 'CI/CD', 'DevOps']
  },
  {
    id: 'node-34',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is dotenv?',
    difficulty: 'Beginner',
    summary: 'Loads environment variables from a .env file into process.env.',
    explanation: [
      '12-Factor App: Promotes storing configuration and secrets in environment variables rather than hardcoded in source code.',
      'Functionality: Parses key-value pairs from .env and injects them into process.env.',
      'Security: .env files must be listed in .gitignore to prevent committing secrets to public repositories.',
      'Native Alternative: Node.js v20.6.0+ introduced native support: node --env-file=.env app.js.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'dotenv-usage.js',
      code: `// Loads .env file into process.env
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

console.log('App running on port:', port);`,
      output: `App running on port: 3000`,
      executionSteps: [
        { line: 2, explanation: 'dotenv.config() reads .env and populates process.env' }
      ]
    },
    keyPoints: [
      'Loads variables from .env into process.env.',
      'Never commit .env to source control.',
      'Node 20.6+ supports native --env-file flag.'
    ],
    interviewTip: 'Mention node --env-file=.env index.js to demonstrate awareness of modern Node.js features without third-party dependencies.',
    tags: ['dotenv', 'Configuration', 'Security', 'Environment Variables']
  },
  {
    id: 'node-35',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is a Memory Leak in Node.js?',
    difficulty: 'Intermediate',
    summary: 'Memory retained by unreferenced objects, often caused by uncleared timers, global arrays, or unclosed database connections.',
    explanation: [
      'Unreclaimed Memory: Occurs when allocated memory is no longer needed by the program but is prevented from being garbage collected due to lingering references.',
      'Common Cause 1: Global variables or arrays that continuously append items without cleanup.',
      'Common Cause 2: Forgotten setInterval or setTimeout timers holding references in closures.',
      'Common Cause 3: Uncleared EventEmitter listeners (leads to MaxListenersExceededWarning).',
      'Common Cause 4: Unclosed database connections or HTTP sockets.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'memory-leak-example.js',
      code: `// Memory Leak: Global cache continuously grows unbounded
const leakyCache = [];

function handleRequest(user) {
  leakyCache.push({ user, timestamp: Date.now() }); // Never pruned!
}

// Fix: Use an LRU (Least Recently Used) cache with fixed capacity`,
      output: `Unbounded arrays lead to eventual Heap Out Of Memory crashes.`,
      executionSteps: [
        { line: 5, explanation: 'Unbounded array retains references preventing GC' }
      ]
    },
    keyPoints: [
      'Memory retained despite being no longer needed.',
      'Commonly caused by global state, uncleared timers, and event listeners.',
      'Diagnose using heap snapshots and node --inspect.'
    ],
    interviewTip: 'Use process.memoryUsage().heapUsed to monitor memory growth in production health check endpoints.',
    tags: ['Memory Leak', 'Garbage Collection', 'Performance', 'Diagnostics']
  },
  {
    id: 'node-36',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'How do you debug Node.js?',
    difficulty: 'Beginner',
    summary: 'Launch with node --inspect index.js and connect Chrome DevTools or use VS Code breakpoints.',
    explanation: [
      'Inspect Flag: Running node --inspect index.js starts a WebSocket debugger listener (default port 9229).',
      'Inspect-Brk: node --inspect-brk pauses execution on the very first line before running code.',
      'Chrome DevTools: Open chrome://inspect in browser to attach full graphical DevTools with Profiler and Memory Heap Snapshot tools.',
      'VS Code: Set breakpoints in editor and launch with default Node.js debugger configuration (launch.json).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'debug-command.sh',
      code: `# Start Node app with debugging listening on port 9229
node --inspect app.js

# Break at first line of execution
node --inspect-brk app.js`,
      output: `Debugger listening on ws://127.0.0.1:9229/...`,
      executionSteps: [
        { line: 2, explanation: 'Opens V8 inspector WebSocket port' }
      ]
    },
    keyPoints: [
      'Use node --inspect for live debugging.',
      'Use --inspect-brk to pause at start.',
      'Profile memory and CPU using Chrome DevTools.'
    ],
    interviewTip: 'In production, avoid --inspect without security guards since it allows remote code execution if exposed to the public network.',
    tags: ['Debugging', 'DevTools', 'VS Code', 'Tooling']
  },
  {
    id: 'node-37',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What does app.use() do?',
    difficulty: 'Beginner',
    summary: 'Mounts middleware functions across specified routes or globally for all endpoints.',
    explanation: [
      'Global Mounting: Calling app.use(fn) applies the middleware to every incoming HTTP request.',
      'Path-Specific Mounting: Calling app.use(\'/api\', fn) executes the middleware only for requests whose path begins with /api.',
      'Sub-App & Routers: Can mount entire express.Router instances or sub-applications.',
      'Pipeline Chaining: Multiple middlewares can be specified: app.use(auth, logger).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'app-use-demo.js',
      code: `const express = require('express');
const app = express();

// Global middleware
app.use((req, res, next) => {
  console.log('Global logger');
  next();
});

// Path-specific middleware
app.use('/admin', (req, res, next) => {
  console.log('Admin route guard');
  next();
});`,
      output: `app.use() mounts global or path-scoped middleware.`,
      executionSteps: [
        { line: 5, explanation: 'Mounts middleware globally' },
        { line: 11, explanation: 'Mounts middleware scoped to /admin prefix' }
      ]
    },
    keyPoints: [
      'Mounts middleware globally or on specific path prefixes.',
      'Executes sequentially in order of registration.',
      'Can mount routers and sub-applications.'
    ],
    interviewTip: 'Middleware order matters: middleware declared after route handlers will NOT execute for those routes.',
    tags: ['app.use', 'Middleware', 'Express.js', 'Routing']
  },
  {
    id: 'node-38',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is res.send() vs. res.json()?',
    difficulty: 'Beginner',
    summary: 'res.send() handles strings and buffers; res.json() formats objects explicitly and sets Content-Type: application/json.',
    explanation: [
      'res.send(): Versatile responder. Automatically detects content type: sets text/html for strings, application/octet-stream for buffers, and delegates to res.json() for objects.',
      'res.json(): Explicitly formats the passed payload as JSON (using JSON.stringify) and sets Content-Type: application/json.',
      'Formatting Settings: res.json() respects app settings like \'json replacer\' and \'json spaces\' for pretty-printing.',
      'Best Practice: In REST APIs, always use res.json() for consistency and clarity.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'send-vs-json.js',
      code: `const express = require('express');
const app = express();

// res.send with string -> Content-Type: text/html
app.get('/html', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

// res.json with object -> Content-Type: application/json
app.get('/data', (req, res) => {
  res.json({ status: 'success', code: 200 });
});`,
      output: `res.json guarantees application/json content type.`,
      executionSteps: [
        { line: 6, explanation: 'res.send automatically formats string as text/html' },
        { line: 11, explanation: 'res.json formats object as application/json' }
      ]
    },
    keyPoints: [
      'res.send dynamically infers content type.',
      'res.json explicitly formats and sends JSON.',
      'Always prefer res.json in RESTful JSON APIs.'
    ],
    interviewTip: 'Passing null or undefined to res.json() safely sends null, whereas res.send() might send an empty response.',
    tags: ['res.send', 'res.json', 'HTTP', 'Express.js']
  },
  {
    id: 'node-39',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is res.end()?',
    difficulty: 'Beginner',
    summary: 'Terminates the response process immediately without sending a payload body.',
    explanation: [
      'Origin: Inherited directly from Node.js native http.ServerResponse.prototype.end().',
      'Use Case: Used when you want to complete a response quickly without any data payload, such as a 204 No Content or 404 response.',
      'Stream Finalization: Flushes internal network buffers and signals to the client that the message is complete.',
      'No Content-Type: Does not automatically set headers like res.send() does.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'res-end-demo.js',
      code: `const express = require('express');
const app = express();

// Responding 204 No Content with res.end()
app.delete('/api/items/:id', (req, res) => {
  // Item deleted in DB...
  res.status(204).end();
});`,
      output: `res.end() closes HTTP connection without a response body.`,
      executionSteps: [
        { line: 7, explanation: 'Sets HTTP 204 status and terminates response' }
      ]
    },
    keyPoints: [
      'Inherited from core Node.js http module.',
      'Completes response without body.',
      'Commonly used with HTTP 204 (No Content).'
    ],
    interviewTip: 'Calling res.end() after res.send() or res.json() will throw an ERR_HTTP_HEADERS_SENT error.',
    tags: ['res.end', 'HTTP', 'Express.js', 'Lifecycle']
  },
  {
    id: 'node-40',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is morgan?',
    difficulty: 'Beginner',
    summary: 'HTTP request logger middleware for Express.',
    explanation: [
      'Purpose: Logs every incoming HTTP request details (method, URL, status code, response time, user-agent).',
      'Predefined Formats: Offers presets like \'dev\', \'combined\', \'common\', \'short\', and \'tiny\'.',
      'Production Stream: Can stream logs into rotation log files or monitoring services (Winston, Datadog).',
      'Auditing: Essential for debugging production latency bottlenecks and tracking API traffic.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'morgan-logging.js',
      code: `const express = require('express');
const morgan = require('morgan');
const app = express();

// Mount colored dev logger
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.send('OK'));`,
      output: `GET /api/health 200 4.123 ms - 2`,
      executionSteps: [
        { line: 6, explanation: 'morgan mounts logger middleware formatting requests' }
      ]
    },
    keyPoints: [
      'Standard HTTP request logger middleware.',
      'Preset formats like \'dev\' and \'combined\'.',
      'Can pipe log streams directly to persistent files.'
    ],
    interviewTip: 'In production, use morgan(\'combined\') and pipe output to Winston or Bunyan for JSON structured log ingestion.',
    tags: ['morgan', 'Logging', 'Middleware', 'Observability']
  },
  {
    id: 'node-41',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is JWT?',
    difficulty: 'Intermediate',
    summary: 'JSON Web Token used for stateless authentication, consisting of Header, Payload, and Signature.',
    explanation: [
      'Stateless Auth: The server does not need to store session states in a database. All necessary identity claims are encoded in the token.',
      '3 Parts (Separated by dots):',
      '1. Header: Algorithm & token type (e.g. { alg: "HS256", typ: "JWT" }).',
      '2. Payload: Claims/data (e.g. { userId: 42, role: "admin", exp: 1710000000 }).',
      '3. Signature: Cryptographic hash verifying the token was not tampered with (HMACSHA256(header + "." + payload, secret)).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'jwt-auth.js',
      code: `const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super-secret-key';

// 1. Sign Token
const token = jwt.sign({ userId: 101, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
console.log('Generated JWT:', token);

// 2. Verify Token
const decoded = jwt.verify(token, SECRET_KEY);
console.log('Decoded Payload:', decoded.userId, decoded.role);`,
      output: `Generated JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Decoded Payload: 101 admin`,
      executionSteps: [
        { line: 6, explanation: 'jwt.sign generates encoded token with expiration' },
        { line: 10, explanation: 'jwt.verify validates cryptographic signature' }
      ]
    },
    keyPoints: [
      'Composed of Header, Payload, and Signature.',
      'Stateless authentication without server session storage.',
      'Payload is base64-encoded, NOT encrypted (never store passwords in payload!).'
    ],
    interviewTip: 'Emphasize that JWT payloads can be easily decoded by anyone; never store sensitive data (credit cards, passwords) in a JWT payload.',
    tags: ['JWT', 'Authentication', 'Security', 'Stateless']
  },
  {
    id: 'node-42',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'Where should JWTs be stored in the browser?',
    difficulty: 'Intermediate',
    summary: 'In an HttpOnly, Secure, SameSite cookie to mitigate XSS exposure.',
    explanation: [
      'LocalStorage Vulnerability: Storing JWTs in localStorage or sessionStorage exposes tokens to any malicious script running on the page (Cross-Site Scripting / XSS).',
      'HttpOnly Flag: Prevents JavaScript (document.cookie) from accessing the cookie, blocking XSS token theft.',
      'Secure Flag: Ensures the cookie is only transmitted over encrypted HTTPS connections.',
      'SameSite Flag: Setting SameSite=Strict or SameSite=Lax prevents Cross-Site Request Forgery (CSRF) attacks.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'cookie-storage.js',
      code: `// Express setting secure JWT in HttpOnly cookie
res.cookie('token', token, {
  httpOnly: true, // Inaccessible to JavaScript document.cookie (stops XSS)
  secure: true,   // Transmitted only over HTTPS
  sameSite: 'strict', // Protects against CSRF attacks
  maxAge: 3600000 // 1 hour expiration
});`,
      output: `JWT stored securely in HttpOnly, Secure cookie.`,
      executionSteps: [
        { line: 3, explanation: 'httpOnly: true prevents client-side JS exfiltration' },
        { line: 5, explanation: 'sameSite: strict mitigates CSRF attack vectors' }
      ]
    },
    keyPoints: [
      'Avoid localStorage due to XSS vulnerabilities.',
      'Use HttpOnly cookies to block JavaScript access.',
      'Use Secure and SameSite flags for HTTPS and CSRF protection.'
    ],
    interviewTip: 'If using cookies, remember to implement CSRF protection (like Double Submit Cookie pattern or anti-CSRF tokens) alongside SameSite.',
    tags: ['JWT', 'Cookies', 'XSS', 'CSRF', 'Security']
  },
  {
    id: 'node-43',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'How do you hash passwords?',
    difficulty: 'Intermediate',
    summary: 'Use salted hashing algorithms like bcrypt (bcrypt.hash(password, saltRounds)).',
    explanation: [
      'Never Store Plaintext: Passwords must always be hashed with a one-way cryptographic function.',
      'Salt: A random string generated and prepended to the password before hashing, defeating precomputed rainbow table attacks.',
      'Key Stretching / Work Factor: Algorithms like bcrypt, argon2, or scrypt are deliberately computationally slow to thwart brute-force cracking.',
      'saltRounds: Controls the computational difficulty (default 10 or 12). Each increment doubles the computation time.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'bcrypt-hashing.js',
      code: `const bcrypt = require('bcrypt');

async function hashPassword(plainText) {
  const saltRounds = 10;
  // Automatically generates salt and hashes password
  const hash = await bcrypt.hash(plainText, saltRounds);
  console.log('Secure Hash:', hash);

  // Compare on login
  const isMatch = await bcrypt.compare('mySecurePass123', hash);
  console.log('Password valid:', isMatch);
}

hashPassword('mySecurePass123');`,
      output: `Secure Hash: $2b$10$wE9K2j3P...
Password valid: true`,
      executionSteps: [
        { line: 6, explanation: 'bcrypt.hash creates salted hash with 10 rounds' },
        { line: 10, explanation: 'bcrypt.compare securely verifies password match' }
      ]
    },
    keyPoints: [
      'Always use salted one-way hashing (bcrypt or argon2).',
      'Salt prevents rainbow table lookup attacks.',
      'Adjust work factor (saltRounds) to resist brute-force cracking.'
    ],
    interviewTip: 'Never use fast cryptographic algorithms like MD5 or SHA-256 for password hashing; they are too fast and easily brute-forced by GPUs.',
    tags: ['bcrypt', 'Password Hashing', 'Security', 'Cryptography']
  },
  {
    id: 'node-44',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What are Node.js exit codes 0 and 1?',
    difficulty: 'Beginner',
    summary: '0 means clean, successful process termination; 1 denotes an uncaught fatal exception.',
    explanation: [
      'Exit Code 0: Successful completion without errors (process.exit(0)). Signals to operating system and CI/CD pipelines that task completed cleanly.',
      'Exit Code 1: Uncaught fatal exception. Indicates an unhandled error or explicit failure (process.exit(1)).',
      'Other Common Codes: Code 130 (terminated by Ctrl+C / SIGINT), Code 143 (terminated by SIGTERM), Code 12 (invalid debug argument).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'exit-codes.js',
      code: `if (process.env.DB_CONNECTED) {
  console.log('Ready');
} else {
  console.error('Fatal: Cannot connect to database');
  process.exit(1); // Exits with failure code 1
}`,
      output: `Fatal: Cannot connect to database (process terminates with exit code 1)`,
      executionSteps: [
        { line: 5, explanation: 'process.exit(1) signals abnormal exit to OS' }
      ]
    },
    keyPoints: [
      '0 = Clean, successful exit.',
      '1 = Fatal uncaught error exit.',
      'Process managers check exit codes to trigger restarts.'
    ],
    interviewTip: 'In shell scripts, $? reads the exit code of the last run command (e.g. echo $?).',
    tags: ['process.exit', 'Exit Codes', 'DevOps', 'CLI']
  },
  {
    id: 'node-45',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is path.join() vs. path.resolve()?',
    difficulty: 'Beginner',
    summary: 'join() concatenates path segments; resolve() resolves segments into an absolute path starting from the root working directory.',
    explanation: [
      'path.join(): Concatenates all given path segments together using the platform-specific delimiter (\\ on Windows, / on POSIX) and normalizes the resulting path.',
      'path.resolve(): Resolves a sequence of paths or path segments into an ABSOLUTE path. Processes from right to left, prepending the current working directory (process.cwd()) until an absolute path is formed.',
      'Leading Slash: If path.resolve encounters a leading slash (/), it treats it as the filesystem root.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'path-join-vs-resolve.js',
      code: `const path = require('path');

// path.join simply joins segments
console.log('join:', path.join('/users', 'himanshu', 'docs'));
// Windows: \\users\\himanshu\\docs | POSIX: /users/himanshu/docs

// path.resolve creates absolute path from cwd
console.log('resolve:', path.resolve('users', 'himanshu'));
// E:\\myinterviewprep\\users\\himanshu`,
      output: `join: \\users\\himanshu\\docs
resolve: E:\\myinterviewprep\\users\\himanshu`,
      executionSteps: [
        { line: 4, explanation: 'path.join normalizes and concatenates segments' },
        { line: 8, explanation: 'path.resolve prepends current working directory to create absolute path' }
      ]
    },
    keyPoints: [
      'path.join concatenates segments using OS delimiters.',
      'path.resolve always outputs an absolute path.',
      'Cross-platform safe path handling.'
    ],
    interviewTip: 'Always use path.join() instead of string concatenation (\'/\' + folder) to avoid cross-platform path errors between Windows and Linux.',
    tags: ['path', 'path.join', 'path.resolve', 'Cross-Platform']
  },
  {
    id: 'node-46',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'How does file uploading work in Express?',
    difficulty: 'Intermediate',
    summary: 'Multipart form data is parsed into storage buffers or disk files using middleware like multer.',
    explanation: [
      'multipart/form-data: Standard encoding used by browsers for uploading binary files.',
      'Express Limitation: Built-in express.json and express.urlencoded cannot parse multipart data.',
      'Multer Middleware: Body-parsing middleware that handles multipart form data and adds a file or files object to req.',
      'Storage Options: MemoryStorage (stores files in RAM as Buffer, good for direct S3 upload) vs DiskStorage (saves file directly to local server disk).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'file-upload-multer.js',
      code: `const express = require('express');
const multer = require('multer');
const app = express();

// Store files in memory buffer
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.post('/api/upload', upload.single('avatar'), (req, res) => {
  console.log('Uploaded filename:', req.file.originalname);
  console.log('File size (bytes):', req.file.size);
  res.json({ success: true });
});`,
      output: `Multer handles multipart/form-data with size limits.`,
      executionSteps: [
        { line: 6, explanation: 'Configures memoryStorage with 5MB file size limit' },
        { line: 11, explanation: 'upload.single handles single file from "avatar" field' }
      ]
    },
    keyPoints: [
      'Requires multipart/form-data parsing middleware like multer.',
      'Choose MemoryStorage for cloud uploads (AWS S3) or DiskStorage for local storage.',
      'Always set fileSize limits to protect against DoS attacks.'
    ],
    interviewTip: 'For production architectures, best practice is generating pre-signed S3 URLs so clients upload directly to cloud storage without burdening the Node server.',
    tags: ['multer', 'File Upload', 'Multipart', 'Express.js']
  },
  {
    id: 'node-47',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is rate limiting?',
    difficulty: 'Intermediate',
    summary: 'Restricting repeated requests from a single IP to protect against brute-force and DDoS attacks (e.g., express-rate-limit).',
    explanation: [
      'Security Mechanism: Limits how many requests a single IP address or user account can make within a specified time window.',
      'Protection: Protects login routes from password brute-forcing, prevents scraping, and guards against Denial of Service (DoS).',
      'HTTP 429: Returns HTTP 429 Too Many Requests when the limit threshold is exceeded.',
      'Storage: Small apps can store counts in memory; production distributed clusters store counters in Redis.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'rate-limiter.js',
      code: `const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

// Limit login attempts: 5 requests per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts. Please try again after 15 minutes.' }
});

app.post('/api/login', loginLimiter, (req, res) => {
  res.send('Login endpoint protected against brute force');
});`,
      output: `Rate limiter returns HTTP 429 when max requests exceeded.`,
      executionSteps: [
        { line: 6, explanation: 'Configures 15-minute sliding window with 5 request max' },
        { line: 12, explanation: 'Applies limiter strictly to sensitive login route' }
      ]
    },
    keyPoints: [
      'Restricts requests per IP/user within a time window.',
      'Returns HTTP 429 Too Many Requests.',
      'Use Redis store for distributed multi-instance architectures.'
    ],
    interviewTip: 'If your app is behind a reverse proxy (Nginx, Cloudflare), you must set app.set(\'trust proxy\', 1) so Express reads the real client IP from X-Forwarded-For.',
    tags: ['Rate Limiting', 'Security', 'DDoS', 'Brute Force']
  },
  {
    id: 'node-48',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is connection pooling?',
    difficulty: 'Intermediate',
    summary: 'Maintaining a cache of reusable database connections to prevent connection-creation latency.',
    explanation: [
      'Handshake Overhead: Opening a new database connection for every single HTTP request incurs severe overhead (TCP handshakes, TLS negotiation, authentication).',
      'Connection Pool: Pre-allocates a pool of warm, active database connections (e.g., min: 2, max: 20).',
      'Borrow & Return: An incoming query borrows an idle connection from the pool, executes the query, and releases it back to the pool.',
      'Resource Protection: Protects database servers from crashing by capping the maximum concurrent connections.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'connection-pooling.js',
      code: `const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
  max: 20,                   // Maximum connections in pool
  idleTimeoutMillis: 30000,  // Close idle clients after 30s
  connectionTimeoutMillis: 2000 // Timeout query if connection takes > 2s
});

async function queryUser(id) {
  // Automatically acquires connection, executes, and releases back to pool!
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0];
}`,
      output: `Connection pool manages reusable database connections efficiently.`,
      executionSteps: [
        { line: 4, explanation: 'Initializes pool with max 20 concurrent connections' },
        { line: 12, explanation: 'pool.query automatically acquires and releases connection' }
      ]
    },
    keyPoints: [
      'Reuses existing database connections.',
      'Eliminates TCP/TLS handshake latency on every request.',
      'Caps maximum connections to protect database servers.'
    ],
    interviewTip: 'If using client = await pool.connect(), remember to call client.release() inside a finally block to prevent connection pool exhaustion leaks.',
    tags: ['Connection Pooling', 'Database', 'PostgreSQL', 'Performance']
  },
  {
    id: 'node-49',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'What is graceful shutdown?',
    difficulty: 'Intermediate',
    summary: 'Intercepting OS termination signals (SIGTERM, SIGINT), stopping incoming traffic, and closing open database connections before exiting.',
    explanation: [
      'Abrupt Termination: Sudden process termination drops active client HTTP connections midway and leaves database transactions uncommitted.',
      'Signals: SIGINT (Ctrl+C) and SIGTERM (sent by Docker/Kubernetes/PM2 when stopping a container).',
      'Graceful Steps:',
      '1. Stop accepting new connections: server.close().',
      '2. Finish ongoing in-flight HTTP requests.',
      '3. Cleanly close database connections and file handles.',
      '4. Exit cleanly with process.exit(0).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'graceful-shutdown.js',
      code: `const express = require('express');
const app = express();
const server = app.listen(3000);

function gracefulShutdown(signal) {
  console.log(\`Received \${signal}. Shutting down gracefully...\`);
  
  // Stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed.');
    // Close database connections
    // db.close();
    process.exit(0); // Clean exit
  });

  // Force close after 10s if tasks hang
  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));`,
      output: `Graceful shutdown handlers attached for SIGTERM and SIGINT.`,
      executionSteps: [
        { line: 8, explanation: 'server.close stops new traffic and finishes active requests' },
        { line: 16, explanation: 'Timeout fallback prevents hanging shutdown' }
      ]
    },
    keyPoints: [
      'Listens for SIGTERM and SIGINT OS signals.',
      'Stops accepting new requests while finishing active ones.',
      'Closes database pools before process.exit(0).'
    ],
    interviewTip: 'In Kubernetes deployments, pods receive SIGTERM, wait for terminationGracePeriodSeconds (default 30s), then send SIGKILL if the process hasn\'t exited.',
    tags: ['Graceful Shutdown', 'SIGTERM', 'Kubernetes', 'DevOps']
  },
  {
    id: 'node-50',
    stack: 'node',
    topic: 'Production, Security & System Operations',
    title: 'How does Node.js achieve zero-downtime deployments?',
    difficulty: 'Advanced',
    summary: 'Running instances through a process manager (PM2) or Kubernetes orchestrator using rolling updates to reload workers one-by-one.',
    explanation: [
      'The Problem: Stopping and restarting a single Node.js instance drops traffic during the 2–5 seconds startup time.',
      'Cluster / Rolling Reloads: Using PM2 cluster mode (pm2 reload all) or Kubernetes RollingUpdates.',
      'Process: The orchestrator starts the new version in a new worker process. Once health checks pass (/health returns 200), traffic is directed to it and the old worker is gracefully terminated.',
      'Load Balancer: Reverse proxies (Nginx, AWS ALB) balance traffic seamlessly across active instances.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'zero-downtime.sh',
      code: `# Reloading PM2 in cluster mode without dropping requests:
pm2 reload ecosystem.config.js

# Docker / Kubernetes Rolling Update Strategy:
# maxSurge: 1 (spawns new container before killing old)
# maxUnavailable: 0`,
      output: `Zero-downtime deployment accomplished via rolling cluster worker reloads.`,
      executionSteps: [
        { line: 2, explanation: 'pm2 reload cycles workers sequentially without downtime' }
      ]
    },
    keyPoints: [
      'Sequential rolling reloads across multiple worker instances.',
      'Health check verification before directing user traffic.',
      'Implemented with PM2 cluster mode, Nginx upstream, or Kubernetes.'
    ],
    interviewTip: 'Combine graceful shutdown (handling SIGTERM) with rolling updates to achieve true 100% zero-downtime deployments in production.',
    tags: ['Zero-Downtime', 'Deployment', 'PM2', 'Kubernetes', 'DevOps']
  }
];
