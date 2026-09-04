import { Question } from '../../types';

export const AUTH_QUESTIONS: Question[] = [
  {
    id: 'auth-1',
    stack: 'auth',
    topic: 'Authentication vs Authorization',
    title: 'What is the difference between Authentication and Authorization?',
    difficulty: 'Beginner',
    summary: 'Authentication verifies WHO you are. Authorization verifies WHAT you are allowed to do.',
    explanation: [
      'Authentication (AuthN): The process of verifying a user\'s identity. Usually done via username/password, OTP, or biometrics. (Analogy: Showing your ID at the airport).',
      'Authorization (AuthZ): The process of verifying what resources an authenticated user has access to. (Analogy: Your boarding pass determines which plane you can get on).',
      'In web apps, Authentication typically happens once (logging in), while Authorization happens on every secure request (checking roles/permissions before deleting a post).'
    ],
    keyPoints: [
      '401 Unauthorized actually means "Unauthenticated".',
      '403 Forbidden actually means "Unauthorized".'
    ],
    tags: ['Auth', 'Security', 'Concepts']
  },
  {
    id: 'auth-2',
    stack: 'auth',
    topic: 'Session vs Stateless',
    title: 'How does Session-based Authentication differ from Token-based (Stateless) Authentication?',
    difficulty: 'Beginner',
    summary: 'Session auth stores state on the server (in memory/DB) and a session ID in a cookie. Token auth (JWT) stores state inside the token itself, held by the client.',
    explanation: [
      'Session-Based: User logs in -> Server creates a session in DB/Redis and sends a `session_id` cookie -> Client sends cookie on next request -> Server looks up `session_id` in DB. Pros: Easy to revoke sessions. Cons: Harder to scale horizontally, requires DB lookups on every request.',
      'Token-Based (Stateless): User logs in -> Server creates a cryptographically signed JWT containing user data -> Client stores token and sends it in `Authorization` header -> Server verifies signature mathematically. Pros: Scales infinitely, no DB lookups. Cons: Hard to revoke tokens before they expire.'
    ],
    keyPoints: [
      'Token-based auth is the standard for modern REST APIs and microservices.',
      'Session-based auth is still perfectly fine (and sometimes preferred) for traditional monolithic server-rendered apps (like PHP, Django, Rails).'
    ],
    tags: ['Auth', 'Sessions', 'Tokens', 'Architecture']
  },
  {
    id: 'auth-3',
    stack: 'auth',
    topic: 'JWT (JSON Web Tokens)',
    title: 'How does a JWT work, and what are its three parts?',
    difficulty: 'Intermediate',
    summary: 'A JWT is a stateless, self-contained token used to securely transmit information. It consists of a Header, Payload, and Signature.',
    explanation: [
      'Stateless Auth: Unlike session cookies where the server stores a session ID in a database, a JWT contains all the user data inside the token itself.',
      'Header: Contains metadata (token type and signing algorithm like HMAC SHA256).',
      'Payload (Claims): Contains the actual user data (user ID, roles, expiration date). **Never put passwords or sensitive data here because it is just Base64 encoded, not encrypted!**',
      'Signature: The server hashes the Header + Payload along with a secret key. If a hacker alters the payload, the signature will become invalid.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'jwt-auth.js',
      code: `// Simulating how a server creates and verifies a JWT
const jwt = require('jsonwebtoken');
const SECRET_KEY = "my_super_secret_key";

// 1. User logs in. Server issues a JWT.
const payload = { userId: 123, role: "admin" };
const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

console.log("Token sent to client:", token);
// Output format: xxxxx.yyyyy.zzzzz

// 2. Client sends token in Authorization header. Server verifies it.
try {
  const decoded = jwt.verify(token, SECRET_KEY);
  console.log("Valid token! User ID:", decoded.userId);
} catch (err) {
  console.error("Invalid or expired token!");
}`,
      output: `Valid token! User ID: 123`,
      executionSteps: [
        { line: 7, explanation: 'Server signs the payload using a private secret key only the server knows' },
        { line: 14, explanation: 'Server verifies the token mathematically without checking a database' }
      ]
    },
    keyPoints: [
      'JWTs are Base64 encoded, NOT encrypted. Anyone can decode and read the payload.',
      'The signature guarantees data integrity (the payload wasn\'t tampered with).',
      'Tokens are sent in the HTTP header: `Authorization: Bearer <token>`'
    ],
    interviewTip: 'Interviewers often ask "How do you revoke a JWT?". The correct answer is: You can\'t easily, because they are stateless. You either wait for it to expire, change the server\'s secret key, or maintain a database blacklist (which defeats the purpose of statelessness).',
    tags: ['Auth', 'JWT', 'Security', 'Stateless']
  },
  {
    id: 'auth-4',
    stack: 'auth',
    topic: 'Security Vulnerabilities',
    title: 'Where should you store a JWT on the frontend? What are XSS and CSRF?',
    difficulty: 'Intermediate',
    summary: 'Storing JWTs securely is critical. LocalStorage is vulnerable to XSS. Cookies are vulnerable to CSRF. The industry standard is HttpOnly Secure Cookies.',
    explanation: [
      'LocalStorage (Vulnerable to XSS): Cross-Site Scripting (XSS) happens when a hacker injects malicious JavaScript into your site. If your JWT is in LocalStorage, that JS can easily read it and steal it (`localStorage.getItem("token")`).',
      'HttpOnly Cookies (Vulnerable to CSRF): If you store the JWT in a cookie marked `HttpOnly`, JavaScript CANNOT read it, defeating XSS! However, cookies are automatically sent with every request, opening you up to Cross-Site Request Forgery (CSRF).',
      'CSRF (Cross-Site Request Forgery): A hacker tricks you into clicking a link on their evil site, which sends a request to your bank. Because you are logged in, your browser automatically attaches the HttpOnly cookie, and the bank executes the transfer.',
      'The Solution: Use HttpOnly, Secure, SameSite=Strict cookies to defeat both XSS and CSRF.'
    ],
    keyPoints: [
      'HttpOnly: Prevents JavaScript (XSS) from reading the cookie.',
      'Secure: Ensures the cookie is only sent over HTTPS.',
      'SameSite=Strict: Prevents the browser from sending the cookie if the request originated from a different domain (defeats CSRF).'
    ],
    tags: ['Auth', 'JWT', 'Security', 'XSS', 'CSRF']
  },
  {
    id: 'auth-5',
    stack: 'auth',
    topic: 'Advanced JWT Patterns',
    title: 'Explain the Access Token and Refresh Token pattern.',
    difficulty: 'Advanced',
    summary: 'Because JWTs cannot be easily revoked, we keep their lifespan very short (e.g., 15 mins). We use a long-lived Refresh Token to get new Access Tokens without forcing the user to log in again.',
    explanation: [
      'The Problem: If a hacker steals an access token that lives for 1 year, they have access for a year.',
      'The Solution: Issue two tokens upon login.',
      '1. Access Token: Short-lived (15 minutes). Stateless JWT. Used to access the API.',
      '2. Refresh Token: Long-lived (30 days). Opaque string stored in the database. Used ONLY to request a new Access Token.',
      'If the Access Token expires, the client sends the Refresh Token to the `/refresh` endpoint. The server checks the DB to see if the Refresh Token is still valid/not revoked. If valid, it issues a new Access Token.'
    ],
    codeExample: {
      language: 'javascript',
      filename: 'refresh-flow.js',
      code: `// Express Pseudo-code for /refresh endpoint
app.post('/refresh', async (req, res) => {
    // Refresh token sent securely via HttpOnly cookie
    const refreshToken = req.cookies.refreshToken;
    
    // 1. Check if token exists in DB (revocation check)
    const storedToken = await db.RefreshTokens.findOne({ token: refreshToken });
    if (!storedToken) return res.status(403).send("Invalid token");
    
    // 2. Verify token hasn't expired
    if (storedToken.expiresAt < new Date()) {
        await db.RefreshTokens.delete({ token: refreshToken });
        return res.status(403).send("Expired token. Please log in.");
    }
    
    // 3. Issue new short-lived Access Token
    const newAccessToken = jwt.sign({ userId: storedToken.userId }, SECRET, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
});`,
      output: `New 15-minute access token issued based on the database-backed refresh token.`,
      executionSteps: [
        { line: 7, explanation: 'Unlike access tokens, refresh tokens ARE checked against a database, allowing revocation' },
        { line: 16, explanation: 'A fresh JWT is generated so the user can continue using the app uninterrupted' }
      ]
    },
    keyPoints: [
      'Access tokens optimize for speed (no DB lookups). Refresh tokens optimize for security (ability to revoke).',
      'Refresh Token Rotation: Every time a refresh token is used, issue a NEW refresh token and invalidate the old one. This detects token theft if a hacker tries to use an old one.'
    ],
    interviewTip: 'Mentioning Refresh Token Rotation (RTR) will immediately mark you as a senior developer in security discussions.',
    tags: ['Auth', 'JWT', 'Security', 'Refresh Tokens']
  },
  {
    id: 'auth-6',
    stack: 'auth',
    topic: 'OAuth & OpenID Connect',
    title: 'What is OAuth 2.0? How does it relate to OpenID Connect (OIDC)?',
    difficulty: 'Advanced',
    summary: 'OAuth 2.0 is an authorization framework allowing third-party apps to access data without sharing passwords. OIDC adds an identity layer on top of OAuth to handle authentication.',
    explanation: [
      'OAuth 2.0 (Delegated Authorization): "I grant App X permission to read my Google Contacts, but I am NOT giving App X my Google password." It uses Access Tokens.',
      'The Flaw: OAuth is for AUTHORIZATION. It was never meant for "Log in with Google", but developers misused it for that anyway.',
      'OpenID Connect (OIDC): Built on top of OAuth 2.0 to standardize AUTHENTICATION. It introduces the `id_token` (a JWT), which contains user profile information (name, email) proving WHO the user is.',
      'The Flow: User clicks "Log in with Google" -> Redirected to Google -> User logs in and grants consent -> Redirected back to app with an Authorization Code -> App server exchanges code with Google for an Access Token (OAuth) and an ID Token (OIDC).'
    ],
    keyPoints: [
      'OAuth = Access Token (Authorization).',
      'OIDC = ID Token (Authentication).'
    ],
    tags: ['Auth', 'OAuth', 'OIDC', 'SSO']
  }
];
