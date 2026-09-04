import { Question } from '../../types';

export const REST_QUESTIONS: Question[] = [
  {
    id: 'rest-1',
    stack: 'rest',
    topic: 'REST Principles & HTTP Basics',
    title: 'What is a REST API and what are its guiding constraints?',
    difficulty: 'Beginner',
    summary: 'REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol, almost always HTTP.',
    explanation: [
      'Client-Server: Separation of concerns. The client handles UI/UX, the server handles data storage and business logic. They can evolve independently.',
      'Statelessness: Each request from client to server must contain all information needed to understand and process the request. The server cannot rely on context stored from previous requests (no server-side sessions).',
      'Uniform Interface: Resources are identified by standard URLs (e.g., /users). Manipulation happens through standard HTTP verbs (GET, POST, PUT, DELETE).',
      'Cacheability: Responses must define themselves as cacheable or not to prevent clients from reusing stale data.',
      'Layered System: A client cannot ordinarily tell whether it is connected directly to the end server or to an intermediary along the way.'
    ],
    codeExample: {
      language: 'http',
      filename: 'rest-example.http',
      code: `### GOOD REST API DESIGN
# Nouns, not verbs. Plural forms. Standard HTTP Methods.

# 1. GET - Retrieve all users
GET https://api.example.com/users HTTP/1.1

# 2. GET - Retrieve specific user by ID
GET https://api.example.com/users/123 HTTP/1.1

# 3. POST - Create a new user (data in body)
POST https://api.example.com/users HTTP/1.1
Content-Type: application/json

{ "name": "Alice", "email": "alice@example.com" }

# 4. DELETE - Remove a user
DELETE https://api.example.com/users/123 HTTP/1.1`,
      output: `200 OK\n201 Created\n204 No Content`,
      executionSteps: [
        { line: 5, explanation: 'GET is safe and idempotent; it only reads data' },
        { line: 11, explanation: 'POST is not idempotent; repeating it creates multiple users' },
        { line: 17, explanation: 'DELETE is idempotent; calling it 10 times results in the same state (user deleted)' }
      ]
    },
    keyPoints: [
      'REST APIs use standard HTTP verbs: GET (Read), POST (Create), PUT/PATCH (Update), DELETE (Destroy).',
      'REST endpoints should be nouns (e.g., /products) rather than verbs (e.g., /getProducts).',
      'Idempotency is crucial: GET, PUT, and DELETE should be safe to call multiple times without changing the final state.'
    ],
    interviewTip: 'A common mistake is thinking REST is a protocol. It is an architectural style. GraphQL and SOAP are alternatives to REST.',
    tags: ['REST', 'HTTP', 'Architecture', 'API Design']
  },
  {
    id: 'rest-2',
    stack: 'rest',
    topic: 'HTTP Methods & Status Codes',
    title: 'What is the difference between PUT and PATCH? When would you use each?',
    difficulty: 'Intermediate',
    summary: 'PUT replaces an entire resource representation. PATCH applies partial modifications to a resource. Both are used for updates, but they handle missing data differently.',
    explanation: [
      'PUT (Total Replacement): When you send a PUT request, you must send the entire object. If you omit a field, the server should set that field to null or its default value. PUT is idempotent.',
      'PATCH (Partial Update): When you send a PATCH request, you only send the fields you want to change. Omitted fields remain untouched on the server. PATCH is technically not guaranteed to be idempotent, but usually is in practice.'
    ],
    codeExample: {
      language: 'json',
      filename: 'put-vs-patch.json',
      code: `// Original Database Record for User 1
{
  "id": 1,
  "name": "John",
  "age": 30,
  "email": "john@example.com"
}

// ==========================================
// SCENARIO 1: PATCH Request (Change age only)
// PATCH /users/1 { "age": 31 }
// Result: 
{
  "id": 1,
  "name": "John",       // Preserved!
  "age": 31,            // Updated!
  "email": "john@example.com" // Preserved!
}

// ==========================================
// SCENARIO 2: PUT Request (Missing email field)
// PUT /users/1 { "name": "John", "age": 31 }
// Result:
{
  "id": 1,
  "name": "John",       // Updated
  "age": 31,            // Updated
  "email": null         // ⚠️ WIPED OUT! PUT replaces the whole object.
}`,
      output: `PATCH keeps omitted fields safe. PUT overwrites missing fields with null.`,
      executionSteps: [
        { line: 11, explanation: 'PATCH payload only contains {"age": 31}' },
        { line: 13, explanation: 'Server merges PATCH payload with existing data' },
        { line: 22, explanation: 'PUT payload replaces the entire document at /users/1' }
      ]
    },
    keyPoints: [
      'Use PUT when you have the full object state (e.g., saving a form where all fields are present).',
      'Use PATCH when updating a single setting or field (e.g., clicking a "Subscribe" toggle).',
      'Both return 200 OK or 204 No Content on success.'
    ],
    interviewTip: 'Interviewers love this question. Emphasize that PUT is idempotent (sending it 5 times replaces the object 5 times with the exact same data), while PATCH is for lightweight partial updates.',
    tags: ['REST', 'HTTP', 'PUT', 'PATCH', 'Methods']
  },
  {
    id: 'rest-3',
    stack: 'rest',
    topic: 'HTTP Methods & Status Codes',
    title: 'Explain the 200, 300, 400, and 500 blocks of HTTP Status Codes.',
    difficulty: 'Beginner',
    summary: 'Status codes immediately tell the client the result of their request. 2xx = Success, 3xx = Redirection, 4xx = Client Error, 5xx = Server Error.',
    explanation: [
      '2xx (Success): The request was received, understood, and accepted. 200 OK (standard), 201 Created (after a POST), 204 No Content (after a DELETE).',
      '3xx (Redirection): The client must take additional action. 301 Moved Permanently, 304 Not Modified (cached).',
      '4xx (Client Error): The client sent a bad request. 400 Bad Request (invalid JSON/syntax), 401 Unauthorized (not logged in), 403 Forbidden (logged in, but lack permissions), 404 Not Found.',
      '5xx (Server Error): The server failed to fulfill a valid request. 500 Internal Server Error (crash/bug), 502 Bad Gateway, 503 Service Unavailable.'
    ],
    keyPoints: [
      '401 vs 403: 401 means "I don\'t know who you are" (Authentication). 403 means "I know who you are, but you can\'t do this" (Authorization).',
      'Do not return 200 OK with an error message in the JSON body. Always use the appropriate 4xx/5xx HTTP status code.'
    ],
    interviewTip: 'Mentioning the difference between 401 (Authentication) and 403 (Authorization) is a massive green flag in interviews.',
    tags: ['HTTP', 'Status Codes', 'API Design']
  },
  {
    id: 'rest-4',
    stack: 'rest',
    topic: 'API Design & Best Practices',
    title: 'How do you handle Pagination and Filtering in a REST API?',
    difficulty: 'Intermediate',
    summary: 'Pagination and filtering prevent the server from sending massive amounts of data at once. They are implemented using URL Query Parameters.',
    explanation: [
      'Pagination: Limit the number of records returned. Usually done with `limit` (how many items to return) and `offset` (how many items to skip) or `page` and `size`.',
      'Filtering: Narrow down results based on criteria. Use query parameters for fields (e.g., `?status=active`).',
      'Sorting: Determine the order of results (e.g., `?sort=-createdAt` for descending).'
    ],
    codeExample: {
      language: 'http',
      filename: 'pagination-example.http',
      code: `### Pagination, Filtering, and Sorting Example

# 1. Basic Pagination (Page 2, 20 items per page)
GET /users?page=2&size=20 HTTP/1.1

# 2. Offset Pagination (Skip 40 items, take 20)
GET /users?offset=40&limit=20 HTTP/1.1

# 3. Filtering and Sorting combined
GET /users?status=active&role=admin&sort=-createdAt HTTP/1.1

### API Response Structure for Pagination
{
  "data": [ ... array of user objects ... ],
  "meta": {
    "totalRecords": 150,
    "currentPage": 2,
    "totalPages": 8,
    "hasNextPage": true
  }
}`,
      output: `JSON response with data payload and metadata block`,
      executionSteps: [
        { line: 4, explanation: 'Query params are used to instruct the server on pagination limits' },
        { line: 10, explanation: 'Multiple filters can be combined using the & symbol' },
        { line: 15, explanation: 'Good APIs return a "meta" object containing pagination details for the frontend' }
      ]
    },
    keyPoints: [
      'Never put pagination or filtering data in the request body for a GET request. GET requests should not have a body.',
      'Cursor-based pagination (e.g., `?after=cursor123`) is more performant for massive datasets than offset pagination.'
    ],
    tags: ['REST', 'Pagination', 'Query Params', 'API Design']
  },
  {
    id: 'rest-5',
    stack: 'rest',
    topic: 'Advanced REST Concepts',
    title: 'What is HATEOAS in REST Architecture?',
    difficulty: 'Advanced',
    summary: 'HATEOAS (Hypermedia As The Engine Of Application State) is the highest level of REST maturity. It means the API response includes hypermedia links that dictate what actions the client can take next.',
    explanation: [
      'State Transitions: Instead of the client hardcoding URLs to perform actions (like deleting an account), the server tells the client what URLs are available based on the current state.',
      'Analogy: Browsing a website. You don\'t type the URL for every page; you click links provided by the HTML. HATEOAS does this for JSON APIs.',
      'Benefits: The server can change its URL structure without breaking clients, and clients don\'t need to know business rules (e.g., a "cancel" link is only provided if an order is pending).'
    ],
    codeExample: {
      language: 'json',
      filename: 'hateoas.json',
      code: `{
  "id": 1234,
  "status": "pending",
  "total": 150.00,
  "items": [...],
  "_links": {
    "self": { "href": "/orders/1234", "method": "GET" },
    "cancel": { "href": "/orders/1234/cancel", "method": "POST" },
    "pay": { "href": "/orders/1234/pay", "method": "POST" }
  }
}

// If the order status was "shipped", the "cancel" and "pay" 
// links would simply not be included in the response by the server.`,
      output: `Client reads _links to dynamically render buttons`,
      executionSteps: [
        { line: 6, explanation: '_links object contains available state transitions' },
        { line: 8, explanation: 'Client knows it can POST to this URL to cancel, without hardcoding the URL' }
      ]
    },
    keyPoints: [
      'HATEOAS makes APIs self-discoverable.',
      'It represents Level 3 of the Richardson Maturity Model for REST APIs.',
      'While powerful, it is rarely implemented in practice due to added complexity on both backend and frontend.'
    ],
    interviewTip: 'Knowing what HATEOAS is proves you have studied REST deeply. Mention the Richardson Maturity Model to really impress.',
    tags: ['REST', 'HATEOAS', 'Architecture', 'Advanced']
  },
  {
    id: 'rest-6',
    stack: 'rest',
    topic: 'API Security & Best Practices',
    title: 'How do you handle API Versioning? What are the pros and cons of each approach?',
    difficulty: 'Intermediate',
    summary: 'API versioning ensures that changes to an API do not break existing clients (like older mobile apps that users haven\'t updated).',
    explanation: [
      '1. URI Versioning (Most Common): Put the version in the URL (e.g., `/api/v1/users`). Easy to understand and cache, but violates the REST principle that a URI should represent a resource, not a version.',
      '2. Header Versioning: Client passes a custom header (e.g., `X-API-Version: 2`). Keeps URLs clean, but harder to test in a browser without tools like Postman.',
      '3. Query Parameter Versioning: Use a query param (e.g., `/api/users?version=2`). Easy to use, but can interfere with caching.',
      '4. Accept Header (Content Negotiation): Client requests a specific version in the Accept header (e.g., `Accept: application/vnd.myapi.v2+json`). This is the most RESTful approach.'
    ],
    keyPoints: [
      'Once an API is public, you cannot remove or rename fields without releasing a new version.',
      'You can safely ADD new fields to an existing response without versioning (clients will just ignore them).',
      'URI versioning (`/v1/`) is the industry standard despite not being purely RESTful.'
    ],
    tags: ['REST', 'Versioning', 'API Design', 'Best Practices']
  },
  {
    id: 'rest-7',
    stack: 'rest',
    topic: 'Advanced REST Concepts',
    title: 'What is Idempotency in HTTP methods? How do you make POST requests safe from duplication?',
    difficulty: 'Advanced',
    summary: 'Idempotency means applying an operation multiple times has the same effect as applying it once. To make non-idempotent methods like POST safe from network retries, we use Idempotency Keys.',
    explanation: [
      'Idempotent Methods: GET, PUT, DELETE. If you DELETE a user, doing it 5 more times just returns 404. The end state is the same.',
      'Non-Idempotent Method: POST. If a client clicks "Checkout" but the network drops the response, they might click it again. The server might charge their credit card twice!',
      'The Solution: Idempotency Keys. The client generates a unique UUID and sends it in a header (e.g., `Idempotency-Key`). The server checks if it has seen this key before. If yes, it returns the cached response of the original successful request instead of processing it again.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'idempotency.js',
      code: `// Express server pseudo-code for Stripe-like Idempotency
app.post('/charge', async (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];
    
    // 1. Check if we already processed this key
    const cachedResponse = await cache.get(idempotencyKey);
    if (cachedResponse) {
        return res.json(cachedResponse); // Return original success
    }
    
    // 2. Process the payment (only happens ONCE)
    const paymentResult = await processPayment(req.body);
    
    // 3. Save the result with the key for 24 hours
    await cache.set(idempotencyKey, paymentResult, '24h');
    
    res.json(paymentResult);
});`,
      output: `First request processes payment. Second request with same key returns cached success.`,
      executionSteps: [
        { line: 3, explanation: 'Client sends a unique UUID in the headers' },
        { line: 6, explanation: 'Server intercepts duplicate retries caused by poor network conditions' },
        { line: 12, explanation: 'Heavy, non-idempotent business logic runs exactly once' }
      ]
    },
    keyPoints: [
      'Network timeouts are ambiguous: the client doesn\'t know if the server failed, or if the response just got lost on the way back.',
      'Idempotency Keys solve the "double-charge" problem in e-commerce and fintech.',
      'Stripe popularized the `Idempotency-Key` header.'
    ],
    interviewTip: 'If asked how to handle payment processing or unreliable networks, mentioning Idempotency Keys is the definitive senior-level answer.',
    tags: ['REST', 'Idempotency', 'Architecture', 'Advanced', 'Fintech']
  },
  {
    id: 'rest-8',
    stack: 'rest',
    topic: 'API Security & Best Practices',
    title: 'Explain Rate Limiting and Throttling in APIs.',
    difficulty: 'Intermediate',
    summary: 'Rate limiting restricts the number of requests a user or IP can make in a given timeframe to prevent abuse, DDoS attacks, and server overload.',
    explanation: [
      'Rate Limiting: Hard cap on requests. E.g., "100 requests per minute per IP". If exceeded, the server returns 429 Too Many Requests.',
      'Throttling: Slowing down requests instead of rejecting them immediately, or limiting bandwidth.',
      'Algorithms: Token Bucket (most common), Leaky Bucket, Fixed Window, Sliding Window.',
      'Headers: Servers communicate limits back to clients using headers like `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.'
    ],
    keyPoints: [
      'Rate limiting is usually handled at the API Gateway layer (like Nginx, AWS API Gateway) or via middleware backed by Redis.',
      'The HTTP status code for hitting a rate limit is 429 (Too Many Requests).'
    ],
    tags: ['REST', 'Security', 'Rate Limiting', 'Performance']
  }
];
