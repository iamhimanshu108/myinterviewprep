import { Question } from '../../types';

export const EXPRESS_QUESTIONS: Question[] = [
  // ==========================================
  // Section I: Core Concepts & Basics
  // ==========================================
  {
    id: 'exp-1',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'What is Express.js?',
    difficulty: 'Beginner',
    summary: 'It is a minimal, fast, and flexible web application framework built on top of Node.js. It simplifies the process of building web applications and APIs by handling routing and middleware execution.',
    explanation: [
      'Minimal & Unopinionated: Express provides a thin layer of fundamental web application features without obscuring Node.js features.',
      'Routing System: Simplifies handling different HTTP methods (GET, POST, PUT, DELETE) and dynamic URL parameters.',
      'Middleware Pipeline: Enables chaining modular functions to inspect, modify, or authenticate requests before reaching endpoints.',
      'Performance: High execution speed with minimal overhead, making it the de-facto standard framework for Node.js REST APIs.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'basic-express.js',
      code: `const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express.js!' });
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});`,
      output: `Server listening on http://localhost:3000`,
      executionSteps: [
        { line: 1, explanation: 'Imports Express framework' },
        { line: 2, explanation: 'Instantiates Express application instance' },
        { line: 4, explanation: 'Registers GET route handler for /api/hello' },
        { line: 8, explanation: 'Binds app to port 3000' }
      ]
    },
    keyPoints: [
      'Fast, unopinionated, minimalist web framework for Node.js.',
      'Handles routing, middleware execution, and HTTP utilities.',
      'Industry standard for building backend RESTful services and APIs.'
    ],
    interviewTip: 'Mention that Express is "unopinionated"—meaning it does not enforce database choices, ORMs, or strict project directory structures.',
    tags: ['Express.js', 'Node.js', 'Basics', 'Web Framework']
  },
  {
    id: 'exp-2',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'How does Express relate to Node.js?',
    difficulty: 'Beginner',
    summary: 'Node.js is the runtime environment that executes JavaScript on the server. Express is a framework that runs inside Node.js, abstracting away the complex, low-level HTTP server configurations into a simpler API.',
    explanation: [
      'Runtime vs Framework: Node.js is the C++/V8 runtime platform. Express is a JavaScript library/framework executed inside the Node.js runtime.',
      'Low-Level Abstraction: Native Node.js http.createServer requires manual URL parsing, stream chunk buffering, manual status codes, and header management.',
      'Express Enhancement: Express sits on top of Node\'s native http module, extending req (IncomingMessage) and res (ServerResponse) with powerful helper methods (res.json, res.status, req.params).',
      'Non-replacement: Express does not replace Node.js; it relies on Node\'s event loop, libuv, and standard APIs to function.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'node-vs-express.js',
      code: `// 1. Native Node.js HTTP Server (Verbose)
const http = require('http');
const nodeServer = http.createServer((req, res) => {
  if (req.url === '/api' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ runtime: 'Node.js' }));
  }
});

// 2. Express.js Server (Clean & Concise)
const express = require('express');
const app = express();
app.get('/api', (req, res) => {
  res.json({ framework: 'Express.js' });
});`,
      output: `Express dramatically reduces boilerplate code compared to native http.`,
      executionSteps: [
        { line: 2, explanation: 'Native http requires manual method and url checking' },
        { line: 12, explanation: 'Express encapsulates routing and header handling into app.get()' }
      ]
    },
    keyPoints: [
      'Node.js is the runtime; Express is the web application framework.',
      'Express extends Node\'s native http.IncomingMessage and http.ServerResponse objects.',
      'Drastically reduces boilerplate for routing, parsing, and sending responses.'
    ],
    interviewTip: 'Explain that Express internally calls Node\'s native http.createServer(app) when you invoke app.listen().',
    tags: ['Node.js', 'Express.js', 'Architecture', 'Comparison']
  },
  {
    id: 'exp-3',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'How do you create a basic Express server?',
    difficulty: 'Beginner',
    summary: 'You initialize the application with const app = express(), define a route like app.get(\'/\', (req, res) => res.send(\'Hello\')), and start listening for traffic using app.listen(3000).',
    explanation: [
      'Step 1 (Import & Initialize): Require or import express, then call express() to create the app instance.',
      'Step 2 (Define Routes): Define HTTP verb methods on the app instance (e.g. app.get, app.post) with path and callback handlers.',
      'Step 3 (Listen): Call app.listen(port, callback) to bind and listen for incoming network connections.',
      'Environment Port: In production, always use process.env.PORT with a fallback to allow hosting platforms (Heroku, AWS, Railway) to set the port.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'server-setup.js',
      code: `const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express Server!');
});

app.listen(PORT, () => {
  console.log(\`Server actively listening on port \${PORT}\`);
});`,
      output: `Server actively listening on port 3000`,
      executionSteps: [
        { line: 2, explanation: 'Initializes Express application' },
        { line: 4, explanation: 'Extracts port from process.env with default fallback' },
        { line: 6, explanation: 'Declares root GET handler' },
        { line: 10, explanation: 'Starts listening on port 3000' }
      ]
    },
    keyPoints: [
      'Initialize with const app = express().',
      'Register endpoints using app.get(), app.post(), etc.',
      'Use process.env.PORT || 3000 for cloud hosting compatibility.'
    ],
    interviewTip: 'Never hardcode the port number in enterprise apps; always read from process.env.PORT to support dynamic container orchestration.',
    tags: ['Setup', 'app.listen', 'Basics', 'Getting Started']
  },
  {
    id: 'exp-4',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'What is the difference between res.send() and res.json()?',
    difficulty: 'Beginner',
    summary: 'res.send() can return various types of responses (strings, objects, buffers) and dynamically sets the Content-Type. res.json() specifically formats the response as JSON and guarantees the Content-Type header is application/json.',
    explanation: [
      'res.send(): Multi-purpose output method. If given a String, it sets Content-Type to text/html; if given a Buffer, application/octet-stream; if given an Object or Array, it delegates to res.json().',
      'res.json(): Explicitly converts non-strings (objects, arrays, null, booleans) to JSON using JSON.stringify(). Always guarantees Content-Type: application/json.',
      'Formatting Options: res.json() formats according to application settings such as "json replacer" and "json spaces" for indented readability.',
      'Best Practice: Always use res.json() in REST APIs for predictability and consistency.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'send-vs-json.js',
      code: `const express = require('express');
const app = express();

// res.send sets Content-Type: text/html
app.get('/html', (req, res) => {
  res.send('<h1>Welcome to my website</h1>');
});

// res.json guarantees Content-Type: application/json
app.get('/api/user', (req, res) => {
  res.json({ id: 101, username: 'Himanshu' });
});`,
      output: `res.send handles HTML/buffers; res.json strictly serializes JSON.`,
      executionSteps: [
        { line: 5, explanation: 'res.send automatically sets text/html for string' },
        { line: 10, explanation: 'res.json formats object with Content-Type: application/json' }
      ]
    },
    keyPoints: [
      'res.send dynamically infers Content-Type based on input.',
      'res.json explicitly formats JSON with Content-Type: application/json.',
      'Always prefer res.json() for RESTful APIs.'
    ],
    interviewTip: 'Passing null or boolean to res.json(null) produces valid JSON "null", whereas res.send(null) can cause unexpected empty body responses.',
    tags: ['res.send', 'res.json', 'HTTP Headers', 'API Design']
  },
  {
    id: 'exp-5',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'How do you serve static files?',
    difficulty: 'Beginner',
    summary: 'You use the built-in middleware express.static(). For example, app.use(express.static(\'public\')) serves files (like CSS, images, and static HTML) straight from the public directory.',
    explanation: [
      'Built-in Middleware: express.static(root, [options]) is the only built-in middleware that shipped with Express out-of-the-box in early versions.',
      'Direct URL Mapping: Files inside the specified directory are accessible relative to the root URL (e.g. public/style.css -> http://localhost:3000/style.css).',
      'Virtual Path Prefix: You can mount static files under a prefix: app.use(\'/static\', express.static(\'public\')).',
      'Absolute Paths: It is safer to use path.join(__dirname, \'public\') to ensure cross-platform path resolution regardless of where node was launched.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'serve-static.js',
      code: `const express = require('express');
const path = require('path');
const app = express();

// Serve files directly from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve files with a virtual path prefix
app.use('/assets', express.static(path.join(__dirname, 'assets')));

console.log('Static asset directories configured.');`,
      output: `Static asset directories configured.`,
      executionSteps: [
        { line: 6, explanation: 'Mounts /public files at root URL' },
        { line: 9, explanation: 'Mounts /assets with virtual prefix /assets/file.png' }
      ]
    },
    keyPoints: [
      'Use built-in express.static() middleware.',
      'Support virtual path prefixes via app.use(\'/prefix\', express.static(\'dir\')).',
      'Always combine with path.join(__dirname, ...) for directory safety.'
    ],
    interviewTip: 'In high-traffic production environments, serve static assets via a CDN (Cloudflare) or Nginx reverse proxy rather than through Node.js.',
    tags: ['Static Files', 'express.static', 'Assets', 'Middleware']
  },
  {
    id: 'exp-6',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'What are route parameters vs. query parameters?',
    difficulty: 'Beginner',
    summary: 'Route parameters (req.params) are dynamic segments in the URL path used to identify specific resources (e.g., /users/:id). Query parameters (req.query) are appended to the end of the URL after a question mark for filtering or sorting (e.g., /users?sort=asc).',
    explanation: [
      'Route Parameters (req.params): Defined in route paths with a colon :paramName (e.g. /users/:userId/posts/:postId). Used to identify required resource entities.',
      'Query Parameters (req.query): Parsed from key-value pairs following the ? in the URL (e.g. /search?q=nodejs&page=2). Used for optional parameters (sorting, pagination, filtering).',
      'Type Casting: Values in both req.params and req.query are received as strings. Numbers and booleans must be explicitly parsed (e.g. parseInt(req.query.page)).',
      'Validation: Always validate both params and query values to guard against injection attacks.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'params-vs-query.js',
      code: `const express = require('express');
const app = express();

// URL: /api/users/42?includePosts=true&limit=5
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;              // "42" (Route parameter)
  const includePosts = req.query.includePosts; // "true" (Query parameter)
  const limit = parseInt(req.query.limit, 10) || 10; // 5

  res.json({ userId, includePosts, limit });
});`,
      output: `Outputs { userId: "42", includePosts: "true", limit: 5 }`,
      executionSteps: [
        { line: 5, explanation: 'req.params.id extracts "42" from the dynamic path' },
        { line: 6, explanation: 'req.query extracts query string values' }
      ]
    },
    keyPoints: [
      'req.params identifies resources via path segments (/users/:id).',
      'req.query provides optional filtering/pagination (/users?page=1).',
      'All extracted parameters are strings by default.'
    ],
    interviewTip: 'Route parameters are part of RESTful resource naming; query parameters should be reserved for optional search and filter operations.',
    tags: ['req.params', 'req.query', 'Routing', 'REST API']
  },
  {
    id: 'exp-7',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'How do you handle incoming JSON payloads or form data?',
    difficulty: 'Beginner',
    summary: 'You use built-in middleware: express.json() to parse incoming JSON bodies, and express.urlencoded({ extended: true }) to parse URL-encoded form data.',
    explanation: [
      'The Need for Parsers: Raw incoming HTTP POST/PUT request bodies arrive as raw readable byte streams. Without parsers, req.body is undefined.',
      'express.json(): Intercepts requests with Content-Type: application/json, parses the JSON string, and populates req.body with a JavaScript object.',
      'express.urlencoded(): Intercepts requests with Content-Type: application/x-www-form-urlencoded (standard HTML forms).',
      'extended: true: Uses the qs library allowing rich nested objects and arrays to be parsed from form submissions.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'body-parsing.js',
      code: `const express = require('express');
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form submissions
app.use(express.urlencoded({ extended: true }));

app.post('/api/register', (req, res) => {
  // req.body is now populated!
  console.log('Received body:', req.body);
  res.status(201).json({ success: true, user: req.body });
});`,
      output: `req.body populated from JSON or form submissions.`,
      executionSteps: [
        { line: 5, explanation: 'express.json parses application/json' },
        { line: 8, explanation: 'express.urlencoded parses form submissions' },
        { line: 12, explanation: 'req.body accessed cleanly in route handler' }
      ]
    },
    keyPoints: [
      'express.json() parses JSON bodies.',
      'express.urlencoded({ extended: true }) parses form data.',
      'Place body-parsing middleware before route declarations.'
    ],
    interviewTip: 'Always configure payload limits like express.json({ limit: "1mb" }) to protect servers against memory-exhaustion denial of service attacks.',
    tags: ['express.json', 'express.urlencoded', 'req.body', 'Middleware']
  },
  {
    id: 'exp-8',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'What is the role of app.listen()?',
    difficulty: 'Beginner',
    summary: 'It binds the application to a specific host and port, effectively launching the Node.js web server to listen for incoming connections.',
    explanation: [
      'Under the Hood: Calling app.listen(...) creates a native Node.js http.Server, registers app as the request handler, and calls server.listen(...).',
      'Identical To: const server = http.createServer(app); server.listen(port).',
      'Returns Server Instance: app.listen() returns the created http.Server instance, which can be used to attach WebSockets (ws / socket.io).',
      'Callback: Optional callback fires when the server has successfully bound to the port and is ready to accept traffic.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'app-listen.js',
      code: `const express = require('express');
const app = express();

// app.listen returns the underlying Node http.Server instance
const server = app.listen(3000, () => {
  const { port } = server.address();
  console.log(\`Server running on port \${port}\`);
});

// Can attach WebSockets directly to the server instance:
// const wss = new WebSocket.Server({ server });`,
      output: `Server running on port 3000`,
      executionSteps: [
        { line: 5, explanation: 'Launches HTTP server and binds to port 3000' },
        { line: 6, explanation: 'Extracts assigned port from server.address()' }
      ]
    },
    keyPoints: [
      'Binds Express app to a port and starts listening for HTTP traffic.',
      'Convenience wrapper for http.createServer(app).listen().',
      'Returns the underlying http.Server instance.'
    ],
    interviewTip: 'When writing automated integration tests with supertest, you do NOT need to call app.listen() because supertest manages ephemeral test ports automatically.',
    tags: ['app.listen', 'http.Server', 'Lifecycle', 'Basics']
  },
  {
    id: 'exp-9',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'What template engines work with Express?',
    difficulty: 'Beginner',
    summary: 'Express supports various template engines like Pug, EJS, and Handlebars. These allow you to generate dynamic HTML on the server by injecting JavaScript variables into markup before sending it to the client.',
    explanation: [
      'Server-Side Rendering (SSR): Template engines dynamically compile HTML templates with server data on each request before returning HTML to the client.',
      'Configuration: Configured via app.set(\'view engine\', \'ejs\') and app.set(\'views\', \'./views\').',
      'res.render(): Compiles and sends the template: res.render(\'index\', { title: \'Home\', user: req.user }).',
      'Popular Engines: EJS (HTML with JS tags), Pug (indentation-based concise syntax), and Handlebars (semantic mustache templates).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'template-engine.js',
      code: `const express = require('express');
const path = require('path');
const app = express();

// Configure template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/profile', (req, res) => {
  // Renders views/profile.ejs with dynamic variables
  res.render('profile', { 
    name: 'Himanshu', 
    role: 'Full Stack Engineer' 
  });
});`,
      output: `Express compiles and delivers server-rendered HTML.`,
      executionSteps: [
        { line: 6, explanation: 'Sets EJS as view engine' },
        { line: 7, explanation: 'Points to views template folder' },
        { line: 11, explanation: 'res.render compiles profile.ejs with injected data' }
      ]
    },
    keyPoints: [
      'Supports EJS, Pug, Handlebars, and Mustache.',
      'Configured with app.set(\'view engine\', \'...\').',
      'res.render() compiles template and injects dynamic server variables.'
    ],
    interviewTip: 'In modern architectures, Express is more commonly used as a headless JSON API server for React/Next.js frontends rather than using server-side template engines.',
    tags: ['Template Engines', 'EJS', 'Pug', 'res.render', 'SSR']
  },
  {
    id: 'exp-10',
    stack: 'express',
    topic: 'Core Concepts & Basics',
    title: 'How does Express handle 404 errors by default?',
    difficulty: 'Beginner',
    summary: 'If a request doesn\'t match any defined route, Express automatically sends a basic "404 Not Found" text response. Developers usually add a catch-all middleware at the bottom of their route stack to send a custom 404 JSON response or HTML page.',
    explanation: [
      'Default Behavior: Express passes the request down the middleware chain. If no middleware or route sends a response, Express sends "Cannot [METHOD] [PATH]" with an HTTP 404 status.',
      'Not an Exception: In Express, a 404 is NOT treated as an error that triggers the 4-parameter error middleware; it is simply the absence of a matching handler.',
      'Custom 404 Handler: Defined by placing a generic middleware (app.use((req, res) => { ... })) at the very bottom of the route stack, just before error handling.',
      'REST Standard: Return a structured JSON response { error: "Resource not found" } with status 404.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'custom-404.js',
      code: `const express = require('express');
const app = express();

// Defined route
app.get('/api/users', (req, res) => res.json({ users: [] }));

// Catch-all 404 handler placed after all valid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: \`Endpoint \${req.originalUrl} not found on this server\`
  });
});`,
      output: `Responds with HTTP 404 JSON for unmatched routes.`,
      executionSteps: [
        { line: 5, explanation: 'Matches defined routes' },
        { line: 8, explanation: 'Catch-all middleware intercepts any unhandled requests and returns 404' }
      ]
    },
    keyPoints: [
      'Default response is "Cannot GET /path" with status 404.',
      '404 is not an exception; it represents unhandled route execution.',
      'Add a catch-all middleware at the bottom of the route stack.'
    ],
    interviewTip: 'Place your 404 handler after all normal routes, but BEFORE your centralized 4-parameter error handler.',
    tags: ['404', 'Error Handling', 'Routing', 'HTTP Status']
  },

  // ==========================================
  // Section II: Middleware & Routing
  // ==========================================
  {
    id: 'exp-11',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What is middleware?',
    difficulty: 'Beginner',
    summary: 'Middleware functions have access to the request (req), response (res), and the next middleware function. They execute code, modify the request/response objects, or terminate the request cycle.',
    explanation: [
      'Signature: function(req, res, next) { ... }.',
      'Responsibilities: Execute arbitrary code, make changes to request/response objects (e.g. attaching req.user), end the request-response cycle, or call next().',
      'Onion Model: Requests pass through middleware functions in sequential order. Each middleware can inspect or alter data before passing it along.',
      'Halting: If a middleware does not call next() and does not end the cycle with res.send/res.json, the request will hang indefinitely until client timeout.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'middleware-concept.js',
      code: `const express = require('express');
const app = express();

// Middleware annotates request with timestamp
const requestTimeTracker = (req, res, next) => {
  req.requestTime = Date.now();
  next(); // Pass control to downstream handler
};

app.use(requestTimeTracker);

app.get('/api/time', (req, res) => {
  res.json({ timestamp: req.requestTime });
});`,
      output: `Middleware attaches requestTime and forwards with next().`,
      executionSteps: [
        { line: 5, explanation: 'Middleware receives req, res, next' },
        { line: 6, explanation: 'Mutates req by attaching requestTime' },
        { line: 7, explanation: 'Calls next() to proceed' }
      ]
    },
    keyPoints: [
      'Access to req, res, and next.',
      'Can mutate request and response objects.',
      'Must call next() or send a response to prevent hanging.'
    ],
    interviewTip: 'Middleware functions are executed in the exact order they are registered with app.use(). Order is critically important.',
    tags: ['Middleware', 'next()', 'Architecture', 'Pipeline']
  },
  {
    id: 'exp-12',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What are the five types of middleware in Express?',
    difficulty: 'Intermediate',
    summary: 'Application-level, Router-level, Error-handling, Built-in (like express.json()), and Third-party (like cors or morgan).',
    explanation: [
      '1. Application-level: Bound directly to the app instance using app.use() or app.METHOD().',
      '2. Router-level: Bound to an instance of express.Router() using router.use() or router.METHOD().',
      '3. Error-handling: Defined with exactly four arguments: (err, req, res, next).',
      '4. Built-in: Included natively with Express (express.json, express.urlencoded, express.static).',
      '5. Third-party: Installed from npm to add functionality (cors, helmet, morgan, cookie-parser).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'five-middleware-types.js',
      code: `const express = require('express');
const cors = require('cors'); // 5. Third-party
const app = express();
const router = express.Router();

// 4. Built-in
app.use(express.json());

// 1. Application-level
app.use((req, res, next) => next());

// 2. Router-level
router.use((req, res, next) => next());

// 3. Error-handling (4 arguments)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});`,
      output: `All 5 Express middleware types configured.`,
      executionSteps: [
        { line: 7, explanation: 'Built-in express.json middleware' },
        { line: 10, explanation: 'Application-level middleware on app' },
        { line: 13, explanation: 'Router-level middleware on router' },
        { line: 16, explanation: 'Error-handling middleware with 4 arguments' }
      ]
    },
    keyPoints: [
      'Application-level, Router-level, Error-handling, Built-in, Third-party.',
      'Error-handling middleware is distinguished by having 4 parameters.',
      'Third-party middleware integrates seamlessly via app.use().'
    ],
    interviewTip: 'Express identifies error middleware by inspecting function.length === 4; declaring only 3 arguments will make Express treat it as regular middleware.',
    tags: ['Middleware Types', 'Architecture', 'Express.js', 'Intermediate']
  },
  {
    id: 'exp-13',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What is the purpose of the next() function?',
    difficulty: 'Beginner',
    summary: 'It passes control to the next middleware function in the stack. If a middleware function does not call next() or end the response cycle (e.g., res.send()), the request will hang indefinitely.',
    explanation: [
      'Flow Control: Informs Express that the current middleware has finished its task and control should pass to the next matching function in the stack.',
      'Passing Arguments: Calling next(\'route\') skips remaining middleware on the current router; calling next(new Error(...)) jumps directly to the error-handling middleware.',
      'Hanging Requests: Omitting next() without calling res.send/res.json leaves the HTTP connection open until the client drops it.',
      'Return Statement: Always use return next() if subsequent code in the middleware should not execute after passing control.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'next-function.js',
      code: `const express = require('express');
const app = express();

const checkAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return next(); // Successfully proceed to next handler
  }
  // Terminate cycle without calling next()
  res.status(401).json({ error: 'Unauthorized' });
};

app.get('/api/dashboard', checkAuth, (req, res) => {
  res.json({ data: 'Secret metrics' });
});`,
      output: `next() controls downstream execution flow.`,
      executionSteps: [
        { line: 6, explanation: 'next() passes control when authorized' },
        { line: 9, explanation: 'res.status(401) terminates cycle when unauthorized' }
      ]
    },
    keyPoints: [
      'Hands off control to the next middleware function.',
      'next(err) routes directly to error handlers.',
      'Always use return next() to avoid executing code after forwarding.'
    ],
    interviewTip: 'A common bug: omitting return next() allows the remaining code in the middleware to continue running, potentially sending duplicate headers.',
    tags: ['next()', 'Middleware', 'Flow Control', 'Basics']
  },
  {
    id: 'exp-14',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What is the difference between app.use() and app.get()?',
    difficulty: 'Beginner',
    summary: 'app.use() applies middleware to a specific path or globally across all routes, regardless of the HTTP method (GET, POST, etc.). app.get() strictly handles HTTP GET requests for an exact path.',
    explanation: [
      'HTTP Method Scope: app.use() executes for ALL HTTP verbs (GET, POST, PUT, DELETE, PATCH, etc.). app.get() strictly handles HTTP GET requests.',
      'Path Matching Scope: app.use(\'/api\', ...) matches any path starting with /api (e.g. /api/users, /api/products/1). app.get(\'/api\', ...) strictly matches the exact path /api.',
      'Primary Usage: app.use() is used for mounting global or scoped middleware and sub-routers; app.get() is used for defining specific read endpoints.',
      'Chaining: Both support multiple callback handlers chained sequentially.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'use-vs-get.js',
      code: `const express = require('express');
const app = express();

// app.use matches ANY method for paths starting with /api
app.use('/api', (req, res, next) => {
  console.log(\`API middleware triggered for \${req.method} \${req.url}\`);
  next();
});

// app.get strictly matches GET requests on /api/users
app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});`,
      output: `app.use matches prefix & all methods; app.get matches exact path & GET.`,
      executionSteps: [
        { line: 5, explanation: 'app.use intercepts any HTTP method starting with /api' },
        { line: 11, explanation: 'app.get executes strictly for GET /api/users' }
      ]
    },
    keyPoints: [
      'app.use handles all HTTP methods (GET, POST, etc.) for path prefixes.',
      'app.get handles only GET requests for exact matching paths.',
      'app.use is for middleware and sub-routers; app.get is for endpoints.'
    ],
    interviewTip: 'app.all() is similar to app.get(), but matches all HTTP methods for an exact path rather than prefix matching like app.use().',
    tags: ['app.use', 'app.get', 'Routing', 'HTTP Methods']
  },
  {
    id: 'exp-15',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What is express.Router()?',
    difficulty: 'Intermediate',
    summary: 'It is a mini Express application used to create modular, mountable route handlers. It helps organize large applications by allowing you to split routes into separate files (e.g., separating user routes from product routes).',
    explanation: [
      'Isolated Routing: An express.Router instance behaves like a miniature Express application capable only of performing middleware and routing functions.',
      'Modularity: Keeps route definitions in separate feature folders (routes/users.js, routes/products.js) instead of stuffing all routes into app.js.',
      'Prefix Mounting: When mounted via app.use(\'/users\', userRouter), all endpoints inside the router automatically inherit the /users prefix.',
      'Router Middleware: Routers can have their own isolated middleware that only runs for routes on that router.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'routes/products.js',
      code: `const express = require('express');
const router = express.Router();

// Router-specific middleware
router.use((req, res, next) => {
  console.log('Products router accessed');
  next();
});

// GET /products/
router.get('/', (req, res) => res.json({ products: [] }));

// GET /products/:id
router.get('/:id', (req, res) => res.json({ id: req.params.id }));

module.exports = router;`,
      output: `Modular router exported for mounting in app.js.`,
      executionSteps: [
        { line: 2, explanation: 'Creates isolated express.Router instance' },
        { line: 5, explanation: 'Attaches router-specific middleware' },
        { line: 11, explanation: 'Defines endpoints relative to router root' }
      ]
    },
    keyPoints: [
      'Acts as a mini Express app for modular routing.',
      'Inherits URL path prefixes when mounted with app.use().',
      'Supports router-specific middleware.'
    ],
    interviewTip: 'Use express.Router({ mergeParams: true }) when nested routers need access to parent route parameters (e.g. /users/:userId/orders/:orderId).',
    tags: ['express.Router', 'Modular Routing', 'Architecture', 'Clean Code']
  },
  {
    id: 'exp-16',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'Why does route definition order matter?',
    difficulty: 'Beginner',
    summary: 'Express evaluates routes sequentially top-to-bottom. If you define a generic route like /users/:id before a specific one like /users/profile, the :id parameter route will incorrectly catch the /profile request.',
    explanation: [
      'Top-to-Bottom Evaluation: Express checks routes and middleware in the exact sequential order they are registered in code.',
      'Pattern Matching: A route defined with a parameter /users/:id matches ANY string in that segment—including static words like "profile" or "settings".',
      'The Conflict: If /users/:id is defined above /users/profile, a request to /users/profile will be captured by /users/:id with req.params.id = "profile".',
      'Best Practice: Always place specific, static routes before dynamic parameterized routes.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'route-order.js',
      code: `const express = require('express');
const app = express();

// 1. Specific route MUST come FIRST
app.get('/users/profile', (req, res) => {
  res.send('User Profile Page');
});

// 2. Dynamic parameterized route comes AFTER
app.get('/users/:id', (req, res) => {
  res.send(\`User Details for ID: \${req.params.id}\`);
});`,
      output: `Specific routes declared first prevent dynamic params from capturing them.`,
      executionSteps: [
        { line: 5, explanation: 'Specific /users/profile evaluated first' },
        { line: 10, explanation: 'Dynamic /users/:id evaluated only if specific route did not match' }
      ]
    },
    keyPoints: [
      'Routes evaluate top-to-bottom in order of declaration.',
      'Dynamic route params (:id) match any string in that segment.',
      'Place specific routes before generic/parameterized routes.'
    ],
    interviewTip: 'A classic bug: developers wonder why /users/profile returns "User 404" because /users/:id was declared first and tried querying database for ID="profile"!',
    tags: ['Route Order', 'Routing', 'req.params', 'Gotchas']
  },
  {
    id: 'exp-17',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'How do you write error-handling middleware?',
    difficulty: 'Intermediate',
    summary: 'Error-handling middleware is unique because it takes exactly four arguments: (err, req, res, next). It must be placed at the very end of all app.use() and route calls to catch errors passed down the chain.',
    explanation: [
      'Four Arguments Requirement: Must declare (err, req, res, next) explicitly. Express checks fn.length === 4 to distinguish error handlers from normal middleware.',
      'Bottom Placement: Must be mounted at the very end of all route handlers and standard middleware in app.js.',
      'Triggering: Triggered when any preceding handler throws an error or calls next(err) with an argument.',
      'Production Sanitization: Log full error stacks on the server, but return clean, safe error messages to clients to prevent leaking database schemas or file paths.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'centralized-error.js',
      code: `const express = require('express');
const app = express();

app.get('/data', (req, res, next) => {
  const err = new Error('Database lookup failed');
  err.statusCode = 500;
  next(err); // Jumps directly to 4-parameter error middleware
});

// Centralized Error Handler (4 arguments!)
app.use((err, req, res, next) => {
  console.error('Internal Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});`,
      output: `Centralized 4-argument error handler intercepts all errors.`,
      executionSteps: [
        { line: 7, explanation: 'next(err) routes directly to error middleware' },
        { line: 11, explanation: '4-param middleware formats sanitized JSON error response' }
      ]
    },
    keyPoints: [
      'Must declare exactly 4 arguments: (err, req, res, next).',
      'Mount at the very bottom of the middleware chain.',
      'Triggered via next(err) or thrown synchronous errors.'
    ],
    interviewTip: 'Even if you don\'t call next inside the error handler, you MUST include next in the function parameter list, or Express won\'t recognize it as an error handler.',
    tags: ['Error Handling', 'Middleware', 'next(err)', 'Best Practices']
  },
  {
    id: 'exp-18',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What happens if you call next() after sending a response?',
    difficulty: 'Intermediate',
    summary: 'It will trigger the next middleware, but since the response has already been sent to the client, attempting to modify headers or send data again will crash the application with an "Error: Cannot set headers after they are sent to the client".',
    explanation: [
      'HTTP Protocol Invariant: HTTP responses can only send headers and a status code once. Once res.send/res.json writes the response, the HTTP transaction is committed.',
      'Calling next() Afterwards: Execution continues down the middleware chain. If a downstream middleware attempts to set a header or send another response, Node throws ERR_HTTP_HEADERS_SENT.',
      'Prevention: Always use return res.json(...) or return next() to ensure execution halts immediately upon sending.',
      'Guard Flag: You can inspect res.headersSent (boolean) to verify if headers have already been transmitted.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'headers-sent-error.js',
      code: `const express = require('express');
const app = express();

app.get('/bug', (req, res, next) => {
  res.json({ message: 'Done' });
  
  // BUG: Calling next() after sending response!
  next(); 
});

app.use((req, res, next) => {
  // Throws: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent
  if (!res.headersSent) {
    res.setHeader('X-Custom', 'Value');
  }
});`,
      output: `Calling next() after sending response causes ERR_HTTP_HEADERS_SENT bugs.`,
      executionSteps: [
        { line: 5, explanation: 'res.json finishes response and sends headers' },
        { line: 8, explanation: 'next() passes control to downstream middleware' },
        { line: 13, explanation: 'res.headersSent check prevents setting headers on finished response' }
      ]
    },
    keyPoints: [
      'HTTP headers can only be sent once per request.',
      'Calling next() after res.send causes ERR_HTTP_HEADERS_SENT.',
      'Always use return res.json() to prevent further code execution.'
    ],
    interviewTip: 'Mention res.headersSent: checking if (res.headersSent) return next(err); is the standard pattern in custom error middleware.',
    tags: ['ERR_HTTP_HEADERS_SENT', 'res.headersSent', 'Bugs', 'HTTP']
  },
  {
    id: 'exp-19',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What is Router-level middleware?',
    difficulty: 'Intermediate',
    summary: 'It works identically to application-level middleware but is bound to a specific instance of express.Router(). This allows you to apply logic (like authentication checks) only to a specific grouping of routes.',
    explanation: [
      'Scoped Execution: Instead of using app.use(), middleware is mounted with router.use().',
      'Targeted Protection: Useful for applying authentication guards or permission checks strictly to protected feature routes (e.g. /admin or /dashboard).',
      'Isolation: Non-admin routes remain completely unaffected by the router-level middleware.',
      'Chaining: Multiple router-level middlewares can be stacked on a single router.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'router-middleware.js',
      code: `const express = require('express');
const app = express();
const adminRouter = express.Router();

// Router-level middleware: Only runs for /admin routes
adminRouter.use((req, res, next) => {
  if (req.headers['x-admin-key'] !== 'secret') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

adminRouter.get('/stats', (req, res) => res.json({ cpu: '22%' }));

// Mount the protected router
app.use('/admin', adminRouter);`,
      output: `Router-level middleware guards only the /admin routes.`,
      executionSteps: [
        { line: 6, explanation: 'adminRouter.use intercepts strictly /admin sub-routes' },
        { line: 15, explanation: 'Mounts router onto /admin' }
      ]
    },
    keyPoints: [
      'Bound to express.Router() via router.use().',
      'Applies only to routes defined on that router.',
      'Ideal for route-group authentication and permission guards.'
    ],
    interviewTip: 'Router-level middleware keeps app.js clean and encapsulates authentication checks with their respective route modules.',
    tags: ['Router-level', 'express.Router', 'Middleware', 'Security']
  },
  {
    id: 'exp-20',
    stack: 'express',
    topic: 'Middleware & Routing',
    title: 'What is the difference between app.route() and app.use()?',
    difficulty: 'Intermediate',
    summary: 'app.route() allows you to chain different HTTP methods for a single route path (e.g., app.route(\'/users\').get(...).post(...)). app.use() is used to mount middleware.',
    explanation: [
      'app.route(path): Creates a single route path instance and allows chaining different HTTP method handlers (.get(), .post(), .put(), .delete()) to avoid duplicate path names.',
      'app.use([path], middleware): Used to mount middleware functions or sub-routers. Does not chain HTTP methods.',
      'DRY Code: app.route() adheres to DRY (Don\'t Repeat Yourself) by declaring the route path once and attaching all CRUD verbs.',
      'Readability: Makes RESTful endpoint declarations clean and centralized.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'app-route-chaining.js',
      code: `const express = require('express');
const app = express();

// app.route chains multiple HTTP methods on a single path
app.route('/api/articles')
  .get((req, res) => {
    res.json({ action: 'Fetch all articles' });
  })
  .post((req, res) => {
    res.status(201).json({ action: 'Create article' });
  })
  .delete((req, res) => {
    res.json({ action: 'Delete all articles' });
  });`,
      output: `app.route chains GET, POST, and DELETE on /api/articles.`,
      executionSteps: [
        { line: 5, explanation: 'app.route(\'/api/articles\') creates chainable route' },
        { line: 6, explanation: 'Attaches GET handler' },
        { line: 9, explanation: 'Attaches POST handler' }
      ]
    },
    keyPoints: [
      'app.route() chains multiple HTTP verbs on the same path.',
      'app.use() mounts middleware functions and routers.',
      'app.route() reduces path redundancy in REST APIs.'
    ],
    interviewTip: 'You can also use router.route(\'/path\') on express.Router instances for clean modular route definitions.',
    tags: ['app.route', 'app.use', 'Chaining', 'Routing']
  },

  // ==========================================
  // Section III: Advanced Concepts, Security & Production
  // ==========================================
  {
    id: 'exp-21',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'How do you handle asynchronous errors in routes?',
    difficulty: 'Intermediate',
    summary: 'Express 4 does not catch errors thrown inside async functions automatically. You must either wrap your async code in try/catch blocks and pass the error via next(err), or use a wrapper package like express-async-errors.',
    explanation: [
      'Express 4 Limitation: Express 4 is synchronous by design; unhandled Promise rejections inside async route handlers escape the Express stack and cause unhandledRejection crashes.',
      'Manual Try/Catch: Wrap every async route handler body in try { ... } catch (err) { next(err); }.',
      'Async Wrapper Utility: Write a simple higher-order function: const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next).',
      'Express 5 Improvement: Express 5 natively catches rejected promises in async handlers automatically without requiring wrappers.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'async-error-handler.js',
      code: `const express = require('express');
const app = express();

// Reusable Higher-Order Function to wrap async handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route using asyncHandler (no manual try/catch needed!)
app.get('/api/users', asyncHandler(async (req, res) => {
  // Thrown error automatically forwarded to next(err)
  const users = await Promise.reject(new Error('Database query timed out'));
  res.json(users);
}));

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});`,
      output: `asyncHandler catches rejected promises and routes to error middleware.`,
      executionSteps: [
        { line: 5, explanation: 'asyncHandler catches rejected promise and invokes catch(next)' },
        { line: 10, explanation: 'Async rejection caught cleanly without unhandledRejection crash' }
      ]
    },
    keyPoints: [
      'Express 4 requires next(err) or asyncHandler wrapper for async routes.',
      'Avoid unhandled promise rejections.',
      'Express 5 natively supports async/await error handling.'
    ],
    interviewTip: 'Demonstrating the 2-line asyncHandler helper function in coding interviews shows deep knowledge of JavaScript closures and Express internals.',
    tags: ['Async/Await', 'Error Handling', 'asyncHandler', 'Promises']
  },
  {
    id: 'exp-22',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'What is CORS and how do you enable it?',
    difficulty: 'Intermediate',
    summary: 'Cross-Origin Resource Sharing (CORS) is a browser security feature that restricts cross-domain HTTP requests. You enable it using the third-party cors middleware, allowing your backend API to accept requests from a frontend hosted on a different domain.',
    explanation: [
      'Same-Origin Policy: Browsers block scripts from reading HTTP responses from a different origin (protocol, domain, or port) unless the server explicitly grants permission.',
      'Preflight Options: Browsers send an HTTP OPTIONS request before complex requests (PUT, DELETE, Authorization headers).',
      'The cors Package: Middleware that automatically attaches Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers.',
      'Security Best Practice: Never use cors({ origin: \'*\' }) with credentials: true in production. Whitelist specific domains.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'cors-setup.js',
      code: `const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: ['https://myapp.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies and auth headers
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));`,
      output: `CORS configured with whitelisted client domains.`,
      executionSteps: [
        { line: 5, explanation: 'Defines allowed origins whitelist' },
        { line: 8, explanation: 'Permits authenticated cookies across origins' },
        { line: 12, explanation: 'Mounts cors middleware' }
      ]
    },
    keyPoints: [
      'CORS is a browser security mechanism, not a server firewall.',
      'Enable via npm install cors.',
      'Whitelist allowed origins and enable credentials when using cookies.'
    ],
    interviewTip: 'CORS only blocks client-side browser fetches; server-to-server calls (e.g. from Postman or another backend) are not subject to CORS.',
    tags: ['CORS', 'Security', 'HTTP Headers', 'Browsers']
  },
  {
    id: 'exp-23',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'How do you secure an Express app?',
    difficulty: 'Intermediate',
    summary: 'Security best practices include using the helmet package to set secure HTTP headers, express-rate-limit to prevent brute-force attacks, sanitizing user inputs to prevent injection attacks, and disabling the X-Powered-By header so attackers don\'t know you are using Express.',
    explanation: [
      'Helmet: Sets defensive HTTP headers (CSP, HSTS, X-Frame-Options against Clickjacking).',
      'Hide Technology: Disable X-Powered-By header: app.disable(\'x-powered-by\').',
      'Rate Limiting: Use express-rate-limit to throttle brute-force login attempts and DDoS.',
      'Input Sanitization: Validate inputs with Zod/Joi, and use express-mongo-sanitize against NoSQL injection.',
      'Data Payload Limits: Limit JSON payload size: express.json({ limit: \'100kb\' }).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'security-hardening.js',
      code: `const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// 1. Hide backend technology stack
app.disable('x-powered-by');

// 2. Attach security headers
app.use(helmet());

// 3. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // 100 requests per IP per 15 minutes
});
app.use('/api/', limiter);

// 4. Body size limit
app.use(express.json({ limit: '50kb' }));`,
      output: `Multi-layered security posture applied to Express app.`,
      executionSteps: [
        { line: 7, explanation: 'Disables revealing X-Powered-By header' },
        { line: 10, explanation: 'Attaches defensive HTTP security headers' },
        { line: 17, explanation: 'Throttles API requests per IP' }
      ]
    },
    keyPoints: [
      'Use helmet to set defensive HTTP headers.',
      'Rate limit sensitive endpoints to block brute-force attacks.',
      'Sanitize all input and enforce payload size limits.'
    ],
    interviewTip: 'Mention OWASP Top 10 security threats and how Helmet, parameterization, and rate limiting mitigate them.',
    tags: ['Security', 'Helmet', 'Rate Limiting', 'Hardening']
  },
  {
    id: 'exp-24',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'How do you authenticate users in Express?',
    difficulty: 'Intermediate',
    summary: 'Most modern APIs use JSON Web Tokens (JWT) attached to the Authorization header, verified via custom middleware. For traditional web apps, session-based authentication using tools like Passport.js and express-session is common.',
    explanation: [
      'Stateless (JWT): Client logs in -> Server signs a JWT with user ID and secret -> Client sends token in Authorization: Bearer <token> header -> Middleware verifies token.',
      'Stateful (Sessions): express-session stores session data in server memory or Redis; client holds a signed sessionId cookie.',
      'Authentication Middleware: Intercepts requests, validates token/session, and attaches the authenticated user object to req.user.',
      'Passport.js: Modular authentication middleware supporting local username/password and OAuth (Google, GitHub).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'auth-middleware.js',
      code: `const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// JWT Authentication Middleware Guard
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload; // Attach user claims to req
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: \`Welcome, user \${req.user.userId}\` });
});`,
      output: `requireAuth middleware secures endpoints via JWT verification.`,
      executionSteps: [
        { line: 6, explanation: 'Extracts Bearer token from Authorization header' },
        { line: 12, explanation: 'jwt.verify decodes and validates signature' },
        { line: 13, explanation: 'Attaches decoded user context to req.user' }
      ]
    },
    keyPoints: [
      'APIs typically use stateless JWT Bearer token authentication.',
      'Attach authenticated context to req.user for downstream handlers.',
      'Store JWTs in HttpOnly cookies for browser clients to prevent XSS.'
    ],
    interviewTip: 'Differentiate between Authentication (identifying who the user is) and Authorization (checking what the user is allowed to do, e.g. role-based access).',
    tags: ['Authentication', 'JWT', 'Security', 'Middleware']
  },
  {
    id: 'exp-25',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'How do you handle file uploads?',
    difficulty: 'Intermediate',
    summary: 'Express cannot parse file uploads out of the box. You use third-party middleware like multer, which parses multipart/form-data requests and saves incoming files directly to the server or streams them to cloud storage.',
    explanation: [
      'Multipart Form Data: File uploads use Content-Type: multipart/form-data, which cannot be parsed by express.json() or express.urlencoded().',
      'Multer Middleware: Standard middleware that extracts file streams and populates req.file (single upload) or req.files (multiple uploads).',
      'Storage Options: MemoryStorage (stores file as Buffer in RAM, ideal for direct upload to AWS S3/Cloudinary) vs DiskStorage (writes directly to local filesystem).',
      'Security: Always validate file extensions, MIME types, and enforce strict fileSize limits.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'multer-upload.js',
      code: `const express = require('express');
const multer = require('multer');
const app = express();

// Configure storage and limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are permitted!'), false);
  }
});

// Single file upload endpoint
app.post('/api/upload', upload.single('avatar'), (req, res) => {
  console.log('File Name:', req.file.originalname);
  console.log('File Buffer size:', req.file.buffer.length);
  res.status(200).json({ success: true });
});`,
      output: `Multer handles multipart file uploads with size and MIME validation.`,
      executionSteps: [
        { line: 6, explanation: 'Configures multer with memoryStorage and 5MB limit' },
        { line: 9, explanation: 'fileFilter restricts upload to image mime types' },
        { line: 15, explanation: 'upload.single("avatar") processes incoming file' }
      ]
    },
    keyPoints: [
      'Requires multer for multipart/form-data parsing.',
      'MemoryStorage for cloud storage, DiskStorage for local files.',
      'Always enforce file size limits and MIME type whitelists.'
    ],
    interviewTip: 'For large uploads, advise using pre-signed S3 URLs so clients upload directly to AWS S3 without consuming Node.js server bandwidth.',
    tags: ['File Upload', 'multer', 'Multipart', 'Buffer']
  },
  {
    id: 'exp-26',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'What is the standard architecture for a large Express app?',
    difficulty: 'Intermediate',
    summary: 'Express is unopinionated and doesn\'t enforce a folder structure. However, developers commonly use the MVC (Model-View-Controller) pattern, or separate concerns by splitting logic into Routes, Controllers, and Services.',
    explanation: [
      'Separation of Concerns: Avoid placing business logic, database queries, and route definitions in a single file.',
      '3-Tier Architecture:',
      '1. Routes: Map HTTP endpoints and apply middleware (auth, validation).',
      '2. Controllers: Extract req data, call services, and send HTTP responses (res.json).',
      '3. Services: Pure business logic (transactions, third-party APIs, calculations).',
      '4. Models / DAOs: Database schemas, migrations, and query operations.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'architecture-pattern.js',
      code: `// 1. Service Layer (Business Logic)
const UserService = {
  async createUser(data) {
    // Database query & business logic
    return { id: 101, ...data };
  }
};

// 2. Controller Layer (HTTP Interface)
const UserController = {
  async register(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
};

// 3. Route Layer (Endpoint Mapping)
// router.post('/users', validateUserDto, UserController.register);`,
      output: `Layered separation: Route -> Controller -> Service -> Model.`,
      executionSteps: [
        { line: 2, explanation: 'Service layer encapsulates database and business rules' },
        { line: 10, explanation: 'Controller layer manages HTTP req and res' }
      ]
    },
    keyPoints: [
      'Express does not enforce structure; 3-tier architecture is best practice.',
      'Separate into Routes -> Controllers -> Services -> Models.',
      'Keeps code modular, testable, and maintainable.'
    ],
    interviewTip: 'Emphasize that controllers should be thin (handling only HTTP) while services should be fat (handling core business logic and reusable across CLI/cron jobs).',
    tags: ['Architecture', 'MVC', 'Design Patterns', 'Enterprise']
  },
  {
    id: 'exp-27',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'What are the pros and cons of Express vs. newer frameworks like NestJS?',
    difficulty: 'Intermediate',
    summary: 'Express is lightweight, flexible, and has a massive ecosystem. However, it lacks built-in architecture, requiring developers to make structural decisions. NestJS is highly opinionated, heavily utilizes TypeScript and decorators out-of-the-box, but has a steeper learning curve.',
    explanation: [
      'Express Pros: Minimal learning curve, immense flexibility, massive npm plugin ecosystem, lightweight footprint, and non-restrictive design.',
      'Express Cons: No standard project architecture, boilerplate required for TypeScript/validation, inconsistency across team codebases.',
      'NestJS Pros: Highly opinionated Angular-inspired architecture, built-in Dependency Injection, TypeScript-first, automated OpenAPI/Swagger generation.',
      'NestJS Cons: Steeper learning curve, heavier boilerplate, higher abstraction overhead.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'express-vs-nestjs.js',
      code: `// Express: Lightweight, functional, minimal
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// NestJS (under the hood can run on Express!):
// @Controller('users')
// export class UsersController {
//   @Get()
//   findAll(): User[] { return this.userService.findAll(); }
// }`,
      output: `Express favors simplicity and freedom; NestJS favors enterprise structure.`,
      executionSteps: [
        { line: 2, explanation: 'Express uses direct, procedural function routing' }
      ]
    },
    keyPoints: [
      'Express: Minimal, flexible, unopinionated.',
      'NestJS: Structured, TypeScript-first, uses Dependency Injection.',
      'NestJS actually uses Express as its default underlying HTTP engine!'
    ],
    interviewTip: 'Highlight that NestJS uses Express by default under the hood (or can be configured with Fastify for extreme throughput).',
    tags: ['Express vs NestJS', 'Frameworks', 'Architecture', 'TypeScript']
  },
  {
    id: 'exp-28',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'How do you test an Express API?',
    difficulty: 'Intermediate',
    summary: 'Developers typically use test runners like Jest or Mocha/Chai for writing assertions, combined with the supertest library to mock HTTP requests directly against the Express app without needing to open a physical network port.',
    explanation: [
      'Exporting App: Separate your route setup (app.js) from the listener (server.js). Export app without calling app.listen().',
      'Supertest: Passes the Express app object directly to supertest(app), which handles synthetic HTTP requests in memory.',
      'Unit Tests: Mock service functions using Jest/Sinon to test controllers in isolation.',
      'Integration Tests: Test real API endpoints end-to-end verifying status codes, headers, and database interactions.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'api.test.js',
      code: `const request = require('supertest');
const express = require('express');

// Express App under test
const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'healthy' }));

// Integration Test with Supertest & Jest
describe('GET /api/health', () => {
  it('should return 200 and healthy status JSON', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.status).toBe('healthy');
  });
});`,
      output: `PASS  api.test.js: GET /api/health passed all assertions.`,
      executionSteps: [
        { line: 1, explanation: 'Imports supertest for synthetic HTTP testing' },
        { line: 11, explanation: 'Simulates GET request against app without physical port' },
        { line: 15, explanation: 'Asserts JSON response payload' }
      ]
    },
    keyPoints: [
      'Separate app.js (routes) from server.js (app.listen) for testability.',
      'Use supertest for in-memory HTTP integration testing.',
      'Combines with Jest, Mocha, or Vitest.'
    ],
    interviewTip: 'Never call app.listen in files imported by test runners, or test suites will fail to terminate due to open socket listeners.',
    tags: ['Testing', 'Supertest', 'Jest', 'Integration Testing']
  },
  {
    id: 'exp-29',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'How do you optimize Express for production?',
    difficulty: 'Intermediate',
    summary: 'Use the compression middleware to gzip responses, place the Node app behind a reverse proxy like Nginx, set the NODE_ENV=production environment variable to boost internal performance, and run the app in cluster mode using PM2 to utilize all available CPU cores.',
    explanation: [
      'NODE_ENV=production: Enables internal view caching, disables verbose error stack logging, and enables optimized code paths in dependencies.',
      'Gzip Compression: Use compression() middleware to shrink response payload sizes by up to 70%.',
      'Reverse Proxy (Nginx): Offload SSL/TLS termination, static file serving, and gzip to Nginx; configure app.set(\'trust proxy\', 1).',
      'Process Manager: Run via PM2 in cluster mode (pm2 start app.js -i max) to leverage all multi-core CPUs.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'production-config.js',
      code: `const express = require('express');
const compression = require('compression');
const app = express();

// Enable Gzip / Deflate compression
app.use(compression());

// Trust first proxy (when behind Nginx, AWS ALB, Cloudflare)
app.set('trust proxy', 1);

// Ensure NODE_ENV is set to production
if (process.env.NODE_ENV === 'production') {
  console.log('Production optimizations enabled.');
}`,
      output: `Production optimizations enabled.`,
      executionSteps: [
        { line: 6, explanation: 'compression() gzips outgoing responses' },
        { line: 9, explanation: 'trust proxy allows reading X-Forwarded-For headers' }
      ]
    },
    keyPoints: [
      'Set NODE_ENV=production.',
      'Use compression() middleware for Gzip/Brotli.',
      'Place behind Nginx reverse proxy and run with PM2 cluster mode.'
    ],
    interviewTip: 'Setting NODE_ENV=production can improve Express rendering performance up to 3x by enabling view caching.',
    tags: ['Production', 'Optimization', 'compression', 'Nginx', 'PM2']
  },
  {
    id: 'exp-30',
    stack: 'express',
    topic: 'Advanced Concepts, Security & Production',
    title: 'How do you manage database connections?',
    difficulty: 'Intermediate',
    summary: 'Connections to databases (like MongoDB via Mongoose or PostgreSQL via Sequelize) are established once at application startup before calling app.listen(). The application then reuses this single connection pool across all incoming HTTP requests.',
    explanation: [
      'Connection Lifecycle: Never connect and disconnect from the database on every HTTP request! Opening connections per-request destroys database throughput.',
      'Singleton / Pool: Open a shared connection pool once during server boot and maintain it throughout the process lifecycle.',
      'Bootstrap Sequencing: Await the database connection before calling app.listen() so incoming requests don\'t hit an uninitialized database.',
      'Graceful Shutdown: Close open connection pools when receiving termination signals (SIGTERM/SIGINT) to avoid dangling locks.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'db-connection-management.js',
      code: `const express = require('express');
const app = express();

// Simulated Database Connection Pool (e.g. pg Pool or mongoose.connect)
async function connectDatabase() {
  console.log('Connecting to database pool...');
  // await mongoose.connect(process.env.MONGO_URI);
  console.log('Database connected successfully.');
}

async function startServer() {
  try {
    // 1. Establish DB connection FIRST
    await connectDatabase();

    // 2. Start accepting HTTP requests ONLY after DB is ready
    app.listen(3000, () => {
      console.log('Server ready on port 3000');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();`,
      output: `Connecting to database pool...
Database connected successfully.
Server ready on port 3000`,
      executionSteps: [
        { line: 13, explanation: 'Awaits database connection pool establishment' },
        { line: 16, explanation: 'Starts listening on port 3000 only after database is connected' }
      ]
    },
    keyPoints: [
      'Connect once on startup; reuse single connection pool.',
      'Await DB connection before calling app.listen().',
      'Cleanly close pool on graceful shutdown (SIGTERM).'
    ],
    interviewTip: 'Explain connection pooling: pools maintain warm, pre-authenticated connections, eliminating the high latency of establishing new TCP/TLS handshakes per query.',
    tags: ['Database', 'Connection Pooling', 'Architecture', 'Bootstrap']
  }
];
