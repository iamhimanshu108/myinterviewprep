import { Question } from '../../types';

export const MIDDLEWARE_QUESTIONS: Question[] = [
  {
    id: 'mw-1',
    stack: 'middleware',
    topic: 'Middleware Basics',
    title: 'What is Middleware in Express.js?',
    difficulty: 'Beginner',
    summary: 'Middleware are functions that execute during the lifecycle of a request to the server. They have access to the request (req), response (res), and the next middleware function (next).',
    explanation: [
      'The Request Pipeline: When a request hits an Express server, it goes through a pipeline of functions before sending a response.',
      'Responsibilities: Middleware can execute any code, make changes to the request/response objects, end the response cycle, or call next() to pass control to the next middleware.',
      'Common Uses: Parsing JSON body, logging requests, authenticating users, handling errors, and CORS.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'middleware-demo.js',
      code: `const express = require('express');
const app = express();

// 1. Global Middleware (Runs on EVERY request)
app.use((req, res, next) => {
    console.log(\`[LOG] \${req.method} request to \${req.url}\`);
    req.customTimestamp = Date.now(); // Modify the request object
    next(); // Move to the next function
});

// 2. Route-Specific Middleware
const checkAuth = (req, res, next) => {
    if (req.headers.authorization === 'secret-token') {
        next(); // User is authenticated, let them proceed
    } else {
        res.status(401).json({ error: "Unauthorized access!" }); // End cycle
    }
};

// 3. Applying middleware to a specific route
app.get('/dashboard', checkAuth, (req, res) => {
    res.send(\`Welcome! Request took \${Date.now() - req.customTimestamp}ms\`);
});`,
      output: `[LOG] GET request to /dashboard\nUnauthorized access! (if token is missing)`,
      executionSteps: [
        { line: 5, explanation: 'Global middleware logs the request and attaches a timestamp' },
        { line: 8, explanation: 'Crucial: next() is called to continue the pipeline' },
        { line: 13, explanation: 'Auth middleware checks a condition and conditionally calls next() or res.send()' },
        { line: 22, explanation: 'Route handler only runs if checkAuth called next()' }
      ]
    },
    keyPoints: [
      'If a middleware does not end the request cycle (e.g., res.send), it MUST call next(), or the request will hang indefinitely.',
      'Order matters! Middleware is executed in the exact order it is defined.'
    ],
    tags: ['Middleware', 'Express', 'Node.js']
  },
  {
    id: 'mw-2',
    stack: 'middleware',
    topic: 'Error Handling',
    title: 'How does Centralized Error Handling middleware work in Express?',
    difficulty: 'Intermediate',
    summary: 'Error-handling middleware catches errors thrown anywhere in the application, preventing the server from crashing and ensuring the client receives a standardized error response.',
    explanation: [
      'The Signature: Error-handling middleware is unique because it takes FOUR arguments: (err, req, res, next). Express recognizes it purely by this arity (number of arguments).',
      'Triggering Errors: To trigger it, you call `next(err)` inside your routes. In asynchronous routes (async/await), unhandled promise rejections will crash the app unless you wrap them in a `try/catch` and pass the error to `next(err)`.',
      'Placement: It must be the absolute LAST `app.use()` statement in your application, after all other routes and middleware.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'error-handling.js',
      code: `app.get('/users/:id', async (req, res, next) => {
    try {
        const user = await db.findById(req.params.id);
        if (!user) throw new Error('UserNotFound');
        res.json(user);
    } catch (err) {
        next(err); // ⚠️ Pass error to the error handler
    }
});

// The Centralized Error Handler (MUST have 4 arguments)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log for debugging

    if (err.message === 'UserNotFound') {
        return res.status(404).json({ error: 'User not found' });
    }

    // Default fallback
    res.status(500).json({ error: 'Internal Server Error' });
});`,
      output: `Standardized JSON error response sent to client`,
      executionSteps: [
        { line: 7, explanation: 'next(err) bypasses all normal routes and jumps straight to the error handler' },
        { line: 12, explanation: 'The 4-argument signature (err, req, res, next) marks this as the Error Handler' }
      ]
    },
    keyPoints: [
      'Express 5.x handles async errors automatically, but in Express 4.x, you MUST use `try/catch` or an async wrapper utility (like `express-async-errors`).',
      'Never expose stack traces (`err.stack`) to the client in production. It poses a massive security risk.'
    ],
    interviewTip: 'Interviewers often ask how Express differentiates between normal middleware and error middleware. The answer is the function signature length (arity): 3 arguments vs 4 arguments.',
    tags: ['Middleware', 'Error Handling', 'Express']
  },
  {
    id: 'mw-3',
    stack: 'middleware',
    topic: 'Security & Third-Party',
    title: 'What is CORS middleware and why do we need it?',
    difficulty: 'Intermediate',
    summary: 'CORS (Cross-Origin Resource Sharing) is a browser security feature. CORS middleware configures the server to tell the browser which external domains are allowed to access the API.',
    explanation: [
      'Same-Origin Policy: By default, browsers prevent a website on `http://localhost:3000` (React) from making API requests to `http://localhost:8000` (Express) because they have different origins (ports).',
      'The Preflight Request: For complex requests, the browser first sends an HTTP `OPTIONS` request (preflight) to ask the server "Am I allowed to do this?".',
      'CORS Middleware: The `cors` NPM package automatically handles the preflight requests and attaches the `Access-Control-Allow-Origin` headers to the responses, granting permission to the browser.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'cors-config.js',
      code: `const cors = require('cors');
const express = require('express');
const app = express();

// BAD: Allows ANY domain to access your API (Security risk in production)
// app.use(cors()); 

// GOOD: Strict CORS configuration
const corsOptions = {
    origin: 'https://my-react-app.com', // Only allow this domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies to be sent cross-origin
};

app.use(cors(corsOptions));`,
      output: `Browser successfully allows frontend to read API response`,
      executionSteps: [
        { line: 10, explanation: 'Restricts access to your specific frontend URL' },
        { line: 13, explanation: 'Required if you are using HttpOnly cookies for authentication' }
      ]
    },
    keyPoints: [
      'CORS is enforced by the BROWSER, not the server. Postman or cURL will bypass CORS entirely.',
      'Setting `origin: "*"` in production is highly discouraged unless building a public API (like weather data).'
    ],
    tags: ['Middleware', 'CORS', 'Security', 'Express']
  },
  {
    id: 'mw-4',
    stack: 'middleware',
    topic: 'Advanced Architecture',
    title: 'How do you write a Middleware Factory function?',
    difficulty: 'Advanced',
    summary: 'A middleware factory is a function that takes configuration arguments and returns a middleware function. This allows you to create dynamic, reusable middleware.',
    explanation: [
      'The Pattern: Instead of hardcoding logic, you write a function that returns the `(req, res, next)` function.',
      'Use Case: Role-Based Access Control (RBAC). Instead of writing separate middleware for `checkAdmin`, `checkManager`, and `checkUser`, you write one `requireRole(role)` factory.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'middleware-factory.js',
      code: `// The Middleware Factory
const requireRole = (requiredRole) => {
    // Returns the actual middleware function
    return (req, res, next) => {
        const user = req.user; // Assuming auth middleware set this earlier
        
        if (user && user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ error: \`Requires \${requiredRole} privileges\` });
        }
    };
};

// Usage in Routes
app.delete('/users/:id', requireRole('admin'), (req, res) => {
    // Only admins reach this code
});

app.post('/articles', requireRole('author'), (req, res) => {
    // Only authors reach this code
});`,
      output: `Reusable, configurable middleware applied cleanly to routes`,
      executionSteps: [
        { line: 2, explanation: 'Outer function accepts configuration parameters' },
        { line: 4, explanation: 'Inner function has access to the req/res cycle AND the outer parameters via closure' }
      ]
    },
    keyPoints: [
      'Many popular Express packages (like `cors()`, `express.json()`, `helmet()`) are actually middleware factories.',
      'This pattern relies heavily on JavaScript Closures.'
    ],
    tags: ['Middleware', 'Design Patterns', 'Advanced', 'Closures']
  }
];
