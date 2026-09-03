import { Question } from '../../types';

export const NODE_QUESTIONS: Question[] = [
  // ==========================================
  // BEGINNER
  // ==========================================
  {
    id: 'node-1',
    stack: 'node',
    topic: 'Architecture & Non-blocking I/O',
    title: 'What is Node.js, and how does its single-threaded non-blocking I/O model achieve high concurrency?',
    difficulty: 'Beginner',
    summary: 'Node.js is a V8 JavaScript runtime built on an event-driven, non-blocking I/O model that offloads asynchronous I/O tasks to the libuv C library thread pool.',
    explanation: [
      'Single-Threaded Main Loop: JavaScript code executes on a single main thread, avoiding the memory footprint and context-switching overhead of spawning thousands of OS threads for incoming connections.',
      'Non-blocking I/O: When an I/O operation (reading a file, database query, network socket) is initiated, Node does not block the main execution thread. Instead, it delegates the operation to the operating system kernel (epoll/kqueue) or libuv\'s internal worker thread pool.',
      'Event Demultiplexing: Once the I/O completes, libuv enqueues the associated callback into the Node.js event loop, which executes it when the main thread becomes available.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'non-blocking-demo.js',
      code: `const fs = require('fs');

console.log('1: Main thread starts');

// Non-blocking asynchronous file read (offloaded to libuv thread pool)
fs.readFile('large-dataset.csv', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log('3: File read completed (Callback executed)');
});

console.log('2: Main thread continues immediately without waiting');`,
      output: `1: Main thread starts
2: Main thread continues immediately without waiting
3: File read completed (Callback executed)`,
      executionSteps: [
        { line: 1, explanation: 'Node.js loads native fs module' },
        { line: 3, explanation: 'Main thread runs synchronous console.log("1...")' },
        { line: 6, explanation: 'fs.readFile offloads file I/O to libuv thread pool; does NOT block' },
        { line: 11, explanation: 'Main thread immediately continues: prints "2..."' },
        { line: 8, explanation: 'libuv notifies event loop; callback executes on main thread' }
      ]
    },
    keyPoints: [
      'Node.js is ideal for I/O-intensive workloads, not CPU-intensive computations.',
      'Libuv provides a default thread pool of 4 threads (configurable via UV_THREADPOOL_SIZE).',
      'The single thread handles thousands of concurrent socket connections with minimal memory.'
    ],
    interviewTip: 'Emphasize that Node.js is single-threaded from the developer perspective (Call Stack), but multi-threaded under the hood in the C/C++ libuv layer.',
    tags: ['Architecture', 'Libuv', 'Non-blocking I/O', 'Concurrency']
  },
  {
    id: 'node-2',
    stack: 'node',
    topic: 'Modules & Package System',
    title: 'What are the differences between CommonJS (CJS) and ES Modules (ESM) in Node.js?',
    difficulty: 'Beginner',
    summary: 'CommonJS uses synchronous "require()" and "module.exports", evaluated at runtime. ESM uses static "import" and "export", evaluated at compile-time with top-level await.',
    explanation: [
      'Loading Paradigm: CommonJS modules are loaded synchronously at runtime on-demand; you can place require() inside if-statements. ES Modules are statically analyzed before execution, enabling dead code elimination (tree-shaking).',
      'Global Variables: In CJS, every module is automatically wrapped in a function injecting "__dirname", "__filename", "exports", "module", and "require". In ESM, these globals do not exist (derive them via import.meta.url).',
      'Top-level Await: ES Modules support top-level "await" directly in the module body; CommonJS requires wrapping async calls in an async IIFE.',
      'Configuration: Enable ESM in Node by setting "type": "module" in package.json or using the ".mjs" file extension.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'esm-vs-cjs.js',
      code: `// --- 1. CommonJS (CJS) ---
// math-cjs.js:
// const add = (a, b) => a + b;
// module.exports = { add };
// app-cjs.js:
// const { add } = require('./math-cjs');

// --- 2. ES Module (ESM) ---
import path from 'path';
import { fileURLToPath } from 'url';

// In ESM, __dirname is derived via import.meta:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Top-level await is native in ESM!
const configResponse = await fetch('https://api.example.com/health');
console.log('Status:', configResponse.status);`,
      output: 'Status: 200',
      executionSteps: [
        { line: 9, explanation: 'ESM static import evaluated before module execution' },
        { line: 13, explanation: 'Re-derives __dirname from import.meta.url in pure ESM' },
        { line: 17, explanation: 'Executes native top-level await without wrapping IIFE' }
      ]
    },
    keyPoints: [
      'CJS is synchronous and runtime-evaluated; ESM is asynchronous and statically parsed.',
      'ESM allows browser/Node code sharing and bundler tree-shaking.',
      'You can import CJS modules into ESM via "import defaultExport from \'cjs-pkg\'".'
    ],
    interviewTip: 'Mention that attempting to use require() inside an ES Module throws a ReferenceError: require is not defined in ES module scope.',
    tags: ['CommonJS', 'ESM', 'Modules', 'import.meta']
  },

  // ==========================================
  // INTERMEDIATE
  // ==========================================
  {
    id: 'node-3',
    stack: 'node',
    topic: 'Event Loop Phases',
    title: 'Explain the 6 Phases of the Node.js Event Loop and process.nextTick() vs setImmediate().',
    difficulty: 'Intermediate',
    summary: 'The event loop has 6 phases: Timers, Pending I/O, Idle/Prepare, Poll, Check, and Close. process.nextTick() executes immediately after the current operation before any phase transition.',
    explanation: [
      'Event Loop Phases: 1) Timers: executes setTimeout and setInterval callbacks. 2) Pending Callbacks: executes I/O callbacks deferred to the next loop iteration. 3) Idle, Prepare: internal JVM-level chores. 4) Poll: retrieves new I/O events; executes I/O callbacks; blocks if no other callbacks are queued. 5) Check: executes setImmediate() callbacks. 6) Close Callbacks: handles close events (e.g. socket.on("close")).',
      'Microtask Queues: Node has two special microtask queues: "process.nextTick queue" and "Promise resolve queue". They run between every phase of the event loop.',
      'process.nextTick() vs setImmediate(): nextTick() fires immediately after the current synchronous script finishes, before the event loop advances to ANY phase. setImmediate() fires during the Check phase.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'event-loop-phases.js',
      code: `const fs = require('fs');

fs.readFile(__filename, () => {
  // Inside Poll Phase: Check phase ALWAYS runs before next Timers phase
  setTimeout(() => {
    console.log('3: setTimeout (Timers phase)');
  }, 0);

  setImmediate(() => {
    console.log('2: setImmediate (Check phase)');
  });

  process.nextTick(() => {
    console.log('1: process.nextTick (Microtask immediately!)');
  });
});`,
      output: `1: process.nextTick (Microtask immediately!)
2: setImmediate (Check phase)
3: setTimeout (Timers phase)`,
      executionSteps: [
        { line: 3, explanation: 'fs.readFile completes; callback executes inside the Poll phase' },
        { line: 13, explanation: 'process.nextTick callback drains immediately before loop leaves Poll' },
        { line: 9, explanation: 'Loop moves to Check phase; executes setImmediate' },
        { line: 5, explanation: 'Loop wraps around to next iteration Timers phase; executes setTimeout' }
      ]
    },
    keyPoints: [
      'process.nextTick() is not technically part of the event loop; it runs right after the current operation.',
      'Inside an I/O callback, setImmediate() is ALWAYS executed before setTimeout(..., 0).',
      'Avoid recursive process.nextTick() calls because they starve I/O and freeze the event loop.'
    ],
    interviewTip: 'When asked why setImmediate was named that way when process.nextTick is more immediate, mention that this was a historical naming regret in the original Node.js API design.',
    tags: ['Event Loop', 'Libuv', 'nextTick', 'setImmediate', 'Phases']
  },
  {
    id: 'node-4',
    stack: 'node',
    topic: 'Streams & Buffers',
    title: 'How do Node.js Streams and Buffers work, and how do you handle Backpressure?',
    difficulty: 'Intermediate',
    summary: 'Streams process continuous chunks of data without loading entire files into memory. Backpressure occurs when a writable stream cannot keep pace with a faster readable stream.',
    explanation: [
      'Buffer: Raw binary memory allocated outside the V8 heap in native C++ memory for byte manipulation.',
      'Stream Types: 1) Readable (fs.createReadStream), 2) Writable (fs.createWriteStream), 3) Duplex (net.Socket), 4) Transform (zlib.createGzip).',
      'The Memory Problem: Reading a 2GB video file into memory using fs.readFile() will crash the Node process (V8 memory limit). A stream processes the file in small 64KB (highWaterMark) chunks.',
      'Backpressure: When readable stream pushes data faster than the writable stream can write, the internal buffer fills up. stream.write() returns false. The readable stream must pause until the writable stream emits the "drain" event.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'streams-backpressure.js',
      code: `const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

// Safe, modern pipeline handling streams, backpressure & error cleanup
async function compressLargeFile(sourcePath, destPath) {
  try {
    await pipeline(
      fs.createReadStream(sourcePath, { highWaterMark: 64 * 1024 }),
      zlib.createGzip(),
      fs.createWriteStream(destPath)
    );
    console.log('Pipeline succeeded: Compression complete!');
  } catch (err) {
    console.error('Pipeline failed:', err.message);
  }
}`,
      output: 'Pipeline succeeded: Compresses 10GB file using only ~30MB RAM',
      executionSteps: [
        { line: 3, explanation: 'Imports stream/promises pipeline utility' },
        { line: 8, explanation: 'Creates Readable stream with 64KB chunk buffer' },
        { line: 9, explanation: 'Pipes into Transform stream (Gzip compression)' },
        { line: 10, explanation: 'Pipes into Writable stream; pipeline automatically handles drain & backpressure' }
      ]
    },
    keyPoints: [
      'Use stream.pipeline() instead of .pipe() to prevent memory leaks if errors occur.',
      'highWaterMark sets the threshold buffer limit for pause/drain mechanics.',
      'Streams allow processing gigabytes of data with minimal, constant RAM usage.'
    ],
    interviewTip: 'Always recommend stream/promises pipeline() over stream.pipe() because pipeline properly destroys all streams and cleans up file descriptors if an error is thrown.',
    tags: ['Streams', 'Buffers', 'Backpressure', 'pipeline']
  },

  // ==========================================
  // ADVANCED
  // ==========================================
  {
    id: 'node-5',
    stack: 'node',
    topic: 'Scaling: Cluster vs Worker Threads',
    title: 'Compare the Cluster Module and Worker Threads for scaling Node.js applications across multi-core CPUs.',
    difficulty: 'Advanced',
    summary: 'The Cluster module forks multiple independent OS processes sharing one TCP server port. Worker Threads share memory in a single process for CPU-intensive parallel computing.',
    explanation: [
      'Cluster Module (Multi-Process): Forks the primary Node process into N worker processes (typically 1 per CPU core). Each worker has its own V8 instance, event loop, and memory heap (~30-50MB RAM each). They communicate via IPC (Inter-Process Communication) and share incoming TCP server ports via OS socket distribution (round-robin).',
      'Worker Threads (Multi-Threading within 1 Process): Runs multiple V8 isolates in background OS threads within the SAME process. Workers can share memory using SharedArrayBuffer without copying data overhead.',
      'When to use: Use Cluster (or PM2) to scale I/O web servers horizontally across cores. Use Worker Threads to offload CPU-bound calculations (crypto hashing, image resizing, video encoding, AI inference) without blocking the main event loop.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'worker-threads-demo.js',
      code: `const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread: Stays responsive to HTTP requests
  function runHeavyFibonacci(n) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, { workerData: n });
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  }

  runHeavyFibonacci(42).then(result => {
    console.log('Result from worker thread:', result);
  });
} else {
  // Worker thread: Executes CPU-heavy calculation in background
  function fib(n) {
    return n <= 1 ? n : fib(n - 1) + fib(n - 2);
  }
  const computed = fib(workerData);
  parentPort.postMessage(computed);
}`,
      output: 'Result from worker thread: 267914296',
      executionSteps: [
        { line: 3, explanation: 'isMainThread checks if current execution context is the parent process' },
        { line: 7, explanation: 'Spawns new Worker thread passing workerData payload' },
        { line: 17, explanation: 'Background worker thread calculates heavy recursive Fibonacci' },
        { line: 22, explanation: 'parentPort.postMessage sends result back to main thread without blocking event loop' }
      ]
    },
    keyPoints: [
      'Cluster = multiple processes (isolated memory, shared network port, high reliability).',
      'Worker Threads = multiple threads in one process (shared memory, lightweight, CPU tasks).',
      'A crash in one cluster worker does not bring down the entire server.'
    ],
    interviewTip: 'Mention that PM2 is the industry standard process manager that abstracts the Node.js Cluster module for zero-downtime reloads and automatic core clustering.',
    tags: ['Cluster', 'Worker Threads', 'Scaling', 'Multi-core', 'Concurrency']
  },
  {
    id: 'node-6',
    stack: 'node',
    topic: 'Memory Profiling & Event Loop Lag',
    title: 'How do you detect and fix Event Loop Lag and V8 Heap Memory Leaks in production Node.js services?',
    difficulty: 'Advanced',
    summary: 'Event loop lag occurs when synchronous code blocks the Call Stack. Memory leaks arise from unmanaged global caches, dangling event listeners, and closures.',
    explanation: [
      'Measuring Event Loop Lag: Monitor the delta between expected timer execution and actual timer execution using the native "perf_hooks" monitorEventLoopDelay() API.',
      'Heap Memory Leaks: Common culprits include: 1) Unbounded in-memory arrays or maps used as caches. 2) Forgotten event listeners (calling emitter.on() inside request handlers without emitter.off()). 3) Timers holding references to old request scopes.',
      'Debugging Tools: Generate heap snapshots using "--inspect" or "v8.writeHeapSnapshot()". Open Chrome DevTools Memory tab, take 3 snapshots, and use the "Objects allocated between Snapshot 1 and 2" comparison view to identify retained constructor trees.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'event-loop-monitor.js',
      code: `const { monitorEventLoopDelay } = require('perf_hooks');
const v8 = require('v8');

// Sample event loop delay every 10ms with 500ms max
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
  const lagMs = h.mean / 1e6; // Convert nanoseconds to milliseconds
  console.log(\`Current Event Loop Lag: \${lagMs.toFixed(2)}ms\`);
  
  // Alert if lag exceeds 50ms SLA
  if (lagMs > 50) {
    console.warn('WARNING: Event Loop is heavily blocked by synchronous code!');
  }

  // Memory usage monitoring
  const mem = process.memoryUsage();
  console.log(\`Heap Used: \${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB\`);
}, 5000);`,
      output: `Current Event Loop Lag: 1.25ms
Heap Used: 28.45 MB`,
      executionSteps: [
        { line: 5, explanation: 'Enables native C++ histogram for microsecond event loop latency tracking' },
        { line: 9, explanation: 'Calculates mean latency over sampling interval' },
        { line: 17, explanation: 'process.memoryUsage() retrieves V8 heap and RSS memory stats' }
      ]
    },
    keyPoints: [
      'Keep event loop lag below 20-50ms for low-latency web applications.',
      'Never run JSON.parse() on 50MB strings or heavy regex on the main thread.',
      'Use clinic.js (clinic doctor, clinic bubbleprof) for production diagnostics.'
    ],
    interviewTip: 'Mention that Node.js 18+ has native diagnostic reports (process.report.writeReport()) that dump memory graphs, open file descriptors, and OS metrics when triggered by SIGUSR2.',
    tags: ['Memory Leak', 'Profiling', 'Event Loop Lag', 'Production', 'V8']
  }
];
