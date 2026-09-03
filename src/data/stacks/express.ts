import { Question } from '../../types';

export const EXPRESS_QUESTIONS: Question[] = [
  // ==========================================
  // BEGINNER
  // ==========================================
  {
    id: 'exp-1',
    stack: 'express',
    topic: 'Middleware Pipeline',
    title: 'How does the Express.js Middleware Pipeline work, and what is the role of next()?',
    difficulty: 'Beginner',
    summary: 'Middleware functions have access to the request (req), response (res), and the next middleware function in the cycle. Invoking next() passes control downstream.',
    explanation: [
      'The Middleware Onion Model: Incoming HTTP requests flow through a linear chain of registered middleware functions. Each function can inspect, modify req/res, end the request cycle (res.json/res.send), or call next().',
      'The Role of next(): Calling next() signals Express to execute the next middleware in the matching route stack. Calling next(err) with an argument bypasses all standard routes and jumps straight to the centralized error handler.',
      'Order of Registration Matters: Middleware executes in the exact order declared with app.use(). If body parsing (express.json()) is declared after a route, req.body will be undefined in that route.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'middleware-chain.js',
      code: `const express = require('express');
const app = express();

// 1. Built-in body parser middleware
app.use(express.json());

// 2. Custom logger middleware
app.use((req, res, next) => {
  req.requestTimestamp = Date.now();
  console.log(\`[\${req.method}] \${req.url}\`);
  // Must call next() or the request hangs forever!
  next();
});

// 3. Route handler middleware
app.get('/api/users', (req, res) => {
  res.json({ success: true, timestamp: req.requestTimestamp });
});

app.listen(3000);`,
      output: `[GET] /api/users
Responds with { success: true, timestamp: 1711920000000 }`,
      executionSteps: [
        { line: 5, explanation: 'express.json() parses incoming JSON buffer into req.body' },
        { line: 8, explanation: 'Custom logger middleware intercepts request and annotates req' },
        { line: 12, explanation: 'next() hands control to the downstream route handler' },
        { line: 16, explanation: 'Route handler terminates request with res.json()' }
      ]
    },
    keyPoints: [
      'Middleware must either send a response (res.send/res.json) or call next(). Otherwise, client requests hang until timeout.',
      'Middleware can mutate req to attach user context, authentication tokens, or timestamps.',
      'next(error) directly invokes 4-parameter error-handling middleware.'
    ],
    interviewTip: 'Interviewers often ask what happens if you call next() after sending res.json(). Mention that Express will throw "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client".',
    tags: ['Middleware', 'next()', 'Pipeline', 'HTTP']
  },
  {
    id: 'exp-2',
    stack: 'express',
    topic: 'Route vs Query Parameters',
    title: 'Explain the difference between req.params, req.query, and req.body in Express.',
    difficulty: 'Beginner',
    summary: 'req.params extracts named URL path segments; req.query parses URL query string parameters; req.body holds parsed HTTP request body payloads.',
    explanation: [
      'req.params: Extracted from path variables defined with colons (e.g. /users/:userId). Used to identify specific resources in RESTful architecture.',
      'req.query: Parsed from URL query strings after the question mark (e.g. /search?term=react&page=2). Used for filtering, pagination, and sorting. Provided natively by Express via query-string/qs.',
      'req.body: Contains the HTTP request body payload (JSON, form data). By default in Express 4.16+, populated using express.json() or express.urlencoded().'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'request-inputs.js',
      code: `const express = require('express');
const app = express();
app.use(express.json());

// Example Request: 
// PUT /api/departments/engineering/employees/42?notify=true
// Body: { "role": "Senior Engineer" }

app.put('/api/departments/:dept/employees/:id', (req, res) => {
  // 1. Path Params: Named route placeholders
  const { dept, id } = req.params; // { dept: 'engineering', id: '42' }

  // 2. Query Params: URL parameters after '?'
  const shouldNotify = req.query.notify === 'true'; // true

  // 3. Body: Parsed JSON payload
  const { role } = req.body; // 'Senior Engineer'

  res.json({ dept, id, role, notified: shouldNotify });
});`,
      output: 'Responds with { dept: "engineering", id: "42", role: "Senior Engineer", notified: true }',
      executionSteps: [
        { line: 9, explanation: 'Express matches route path with :dept and :id parameters' },
        { line: 11, explanation: 'req.params extracts "engineering" and "42"' },
        { line: 14, explanation: 'req.query extracts "?notify=true"' },
        { line: 17, explanation: 'req.body retrieves parsed JSON payload' }
      ]
    },
    keyPoints: [
      'req.params values are always strings (remember to parseInt/Number for numeric IDs).',
      'req.query is built-in; req.body requires express.json() middleware.',
      'Do not put sensitive data (like passwords or API tokens) in req.query because query strings are stored in server access logs and browser history.'
    ],
    interviewTip: 'Always sanitize and cast req.params and req.query when passing into database queries (like Prisma, SQL, or Mongoose) to prevent NoSQL/SQL injection attacks.',
    tags: ['Routing', 'req.params', 'req.query', 'req.body', 'REST']
  },

  // ==========================================
  // INTERMEDIATE
  // ==========================================
  {
    id: 'exp-3',
    stack: 'express',
    topic: 'Centralized Error Handling',
    title: 'How do you design a Centralized Error Handling architecture with custom AppError and async wrappers?',
    difficulty: 'Intermediate',
    summary: 'Centralized error handling uses a 4-parameter error middleware (err, req, res, next) with custom AppError classes and an asyncHandler wrapper to eliminate try/catch repetition.',
    explanation: [
      'The 4-Parameter Error Middleware: Express differentiates error handlers by inspecting function arity (fn.length === 4). Registered at the very end of all routes.',
      'Custom AppError: Extending native Error allows attaching statusCode (e.g. 400, 404, 403), isOperational flags (distinguishing operational bugs from unhandled programmer exceptions), and error codes.',
      'asyncHandler Pattern: In Express 4, unhandled promise rejections inside async route handlers do not automatically forward to the error middleware and crash the process. Wrapping routes in an async wrapper guarantees caught errors invoke next(err).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'error-architecture.js',
      code: `// 1. Custom Operational Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Expected operational error
    Error.captureStackTrace(this, this.constructor);
  }
}

// 2. Async Handler Wrapper (Eliminates repeated try/catch blocks)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 3. Route using the architecture
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await findUserInDb(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ success: true, user });
}));

// 4. Centralized 4-parameter Error Middleware (MUST have 4 arguments)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});`,
      output: 'Responds with uniform JSON error: { success: false, status: 404, message: "User not found" }',
      executionSteps: [
        { line: 2, explanation: 'AppError stores HTTP status code and operational flag' },
        { line: 12, explanation: 'asyncHandler catches rejected promises and routes to next(err)' },
        { line: 19, explanation: 'Throws AppError with status 404' },
        { line: 25, explanation: 'Centralized 4-parameter error handler formats clean JSON response' }
      ]
    },
    keyPoints: [
      'Error middleware MUST define 4 arguments (err, req, res, next); omitting "next" causes Express to treat it as regular middleware.',
      'Place error middleware AFTER all route definitions.',
      'Express 5 natively catches unhandled promise rejections in async routes, but asyncHandler remains standard for Express 4.'
    ],
    interviewTip: 'Distinguish between Operational Errors (bad input, expired JWT, item not found) and Programmer Errors (syntax error, undefined variable, DB network crash). Only expose operational error messages to clients.',
    tags: ['Error Handling', 'Middleware', 'asyncHandler', 'AppError']
  },
  {
    id: 'exp-4',
    stack: 'express',
    topic: 'Security Hardening',
    title: 'How do you secure a production Express.js application against OWASP Top 10 vulnerabilities?',
    difficulty: 'Intermediate',
    summary: 'Production security requires Helmet for HTTP headers, CORS with strict origins, rate limiting against brute force, data sanitization, and parameterized queries.',
    explanation: [
      'Helmet: Sets secure HTTP response headers (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options against Clickjacking, X-Content-Type-Options against MIME-sniffing, and disables X-Powered-By: Express).',
      'CORS (Cross-Origin Resource Sharing): Restrict allowed origins, headers, and credentials to known client frontend domains.',
      'Rate Limiting (express-rate-limit): Prevents Denial-of-Service (DoS) and credential stuffing brute-force attacks by limiting requests per IP window.',
      'Data Sanitization: Guard against NoSQL injection (express-mongo-sanitize) and Cross-Site Scripting / XSS (xss-clean or sanitize-html).'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'security-hardening.js',
      code: `const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. HTTP Header Protection (removes X-Powered-By, sets CSP)
app.use(helmet());

// 2. Strict CORS Configuration
app.use(cors({
  origin: ['https://app.mycompany.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 3. Global Rate Limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Returns RateLimit-* headers
  legacyHeaders: false
});
app.use('/api/', limiter);

// 4. Secure Body Limits (prevents memory payload attacks)
app.use(express.json({ limit: '10kb' }));`,
      output: 'Application protected with enterprise headers and IP rate-limiting',
      executionSteps: [
        { line: 9, explanation: 'helmet() secures 11 HTTP headers by default' },
        { line: 12, explanation: 'cors locks down API access to trusted frontend domain' },
        { line: 19, explanation: 'rateLimit tracks request IP counts in sliding window' },
        { line: 29, explanation: 'express.json limit: "10kb" prevents memory-overflow attacks' }
      ]
    },
    keyPoints: [
      'Always disable "x-powered-by" header so attackers cannot fingerprint the Express server.',
      'Apply stricter rate limiting to auth routes (e.g. 5 attempts per 15 mins for /api/auth/login).',
      'Enforce HTTPS using HSTS (Strict-Transport-Security) via Helmet.'
    ],
    interviewTip: 'Mention Parameter Pollution (hpp module). Attackers can pass ?sort=asc&sort=desc which turns req.query.sort into an array, crashing backend assumptions expecting a string.',
    tags: ['Security', 'Helmet', 'CORS', 'Rate Limiting', 'OWASP']
  },

  // ==========================================
  // ADVANCED
  // ==========================================
  {
    id: 'exp-5',
    stack: 'express',
    topic: '3-Layer Architecture & Scalability',
    title: 'Explain the 3-Layer Architecture pattern (Controller, Service, Repository/DAL) for enterprise Express backends.',
    difficulty: 'Advanced',
    summary: 'The 3-Layer Architecture decouples HTTP transport logic (Controllers), core business logic (Services), and database operations (Repositories/DAL) for maintainability and testability.',
    explanation: [
      'Controller Layer: Interacts directly with Express (req, res, next). Extracts parameters, validates inputs, delegates work to the Service layer, and returns formatted HTTP responses. Controllers contain zero database queries or business rules.',
      'Service Layer: Contains core application business logic (e.g. calculating discounts, validating business state transitions, sending transactional emails, coordinating payments). Completely agnostic of Express req/res objects, making it 100% unit-testable.',
      'Repository / Data Access Layer (DAL): Manages database queries (SQL, Prisma, Mongoose, Redis). Abstracts database driver details from the business services.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'three-layer-architecture.js',
      code: `// --- 1. REPOSITORY LAYER (Data Access) ---
class UserRepository {
  async findById(id) {
    return db.query('SELECT * FROM users WHERE id = $1', [id]);
  }
}

// --- 2. SERVICE LAYER (Pure Business Logic) ---
class UserService {
  constructor(userRepo, emailService) {
    this.userRepo = userRepo;
    this.emailService = emailService;
  }

  async upgradeUserTier(userId, newTier) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    if (user.tier === newTier) throw new AppError('Already on this tier', 400);

    user.tier = newTier;
    await this.userRepo.update(user);
    await this.emailService.sendTierUpgradeEmail(user.email, newTier);
    return user;
  }
}

// --- 3. CONTROLLER LAYER (HTTP Request/Response Handling) ---
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  upgradeTier = asyncHandler(async (req, res) => {
    const { newTier } = req.body;
    const updatedUser = await this.userService.upgradeUserTier(req.params.id, newTier);
    res.status(200).json({ success: true, data: updatedUser });
  });
}`,
      output: 'Clean separation of concerns with testable layers',
      executionSteps: [
        { line: 2, explanation: 'Repository communicates with database driver' },
        { line: 9, explanation: 'Service orchestrates business rules without req/res dependencies' },
        { line: 27, explanation: 'Controller translates HTTP request and delegates to Service' },
        { line: 35, explanation: 'Sends standardized HTTP 200 response' }
      ]
    },
    keyPoints: [
      'Never pass req or res into the Service layer (violates separation of concerns).',
      'Dependency Injection (DI) allows mocking Repositories during Service unit testing.',
      'Facilitates switching databases (e.g. Postgres to MongoDB) without touching business logic.'
    ],
    interviewTip: 'Describe how this architecture adheres to the Single Responsibility Principle (SRP) and enables clean mock testing with Jest without spinning up mock HTTP servers.',
    tags: ['Architecture', 'Clean Code', 'Dependency Injection', 'Scalability']
  },
  {
    id: 'exp-6',
    stack: 'express',
    topic: 'Performance & Caching',
    title: 'How do you optimize Express.js throughput using Compression, ETags, and Redis Caching?',
    difficulty: 'Advanced',
    summary: 'Maximize throughput by enabling Gzip/Brotli compression, utilizing HTTP conditional ETags to prevent redundant bandwidth, and caching database reads in Redis.',
    explanation: [
      'Compression middleware: Automatically compresses response bodies with Gzip or Brotli, reducing JSON payload sizes by up to 70-80% over the wire.',
      'ETags & 304 Not Modified: Express automatically generates ETags for responses. If the client sends "If-None-Match" matching the ETag, Express responds with "304 Not Modified" with an empty body, saving client download time.',
      'Redis Cache-Aside Pattern: Check Redis first before querying the primary database. If cache hits, return immediately in 1-2ms; if cache misses, fetch from database, store in Redis with a TTL (Time To Live), and return.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'caching-and-compression.js',
      code: `const express = require('express');
const compression = require('compression');
const Redis = require('ioredis');

const app = express();
const redis = new Redis(process.env.REDIS_URL);

// 1. Response Compression (Gzip / Brotli)
app.use(compression({
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => compression.filter(req, res)
}));

// 2. Redis Cache Middleware Factory
function cacheRoute(ttlSeconds = 60) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    
    const cacheKey = \`cache:\${req.originalUrl}\`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // Return cached JSON immediately (Cache HIT)
      return res.json(JSON.parse(cachedData));
    }

    // Intercept res.json to populate cache on Cache MISS
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.setex(cacheKey, ttlSeconds, JSON.stringify(body));
      return originalJson(body);
    };
    next();
  };
}

// 3. Cached route
app.get('/api/top-products', cacheRoute(300), async (req, res) => {
  const products = await fetchExpensiveAggregationsFromDb();
  res.json(products);
});`,
      output: 'Decreases database load by 95% and response times from 350ms to 2ms',
      executionSteps: [
        { line: 9, explanation: 'compression middleware hooks into response stream' },
        { line: 16, explanation: 'cacheRoute checks HTTP method and generates unique Redis key' },
        { line: 20, explanation: 'Returns cached response in 2ms on Cache HIT' },
        { line: 28, explanation: 'Stores query result in Redis with 300s TTL on Cache MISS' }
      ]
    },
    keyPoints: [
      'Gzip compression should be offloaded to reverse proxy (Nginx/Cloudflare) if possible in high-scale setups.',
      'Always set TTLs (Time-To-Live) on Redis cache keys to prevent memory saturation.',
      'Remember cache invalidation strategies (e.g. invalidate /api/top-products on product updates).'
    ],
    interviewTip: 'Mention the "Cache Stampede" (dog-piling) problem when a popular key expires and 10,000 simultaneous requests hit the DB at once. Solve it using mutex locks or background pre-warming.',
    tags: ['Performance', 'Redis', 'Caching', 'Compression', 'ETags']
  }
];
