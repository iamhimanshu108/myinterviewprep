import { WorkflowTopicData } from '../../types';

export const authWorkflow: WorkflowTopicData = {
    id: 'auth',
    title: 'Authentication & Access Control',
    subtitle: 'Password Hashing, JWT Minting, Cookie Storage, and Guard Middleware',
    tagline: 'Defending stateless HTTP endpoints with cryptographic tokens and bcrypt salting',
    accentColor: '#C84B1F', // Orange/Rust from reference
    tags: ['Stateless', 'bcryptjs', 'JWT HS256', 'httpOnly Cookies', 'AuthN vs AuthZ'],
    sections: [
      { id: 'auth-01', num: 1, label: 'The Problem: Statelessness', group: 'Phase 1: Beginner' },
      { id: 'auth-04', num: 2, label: 'Token Lifecycle & Security Flow', group: 'Phase 2: Intermediate' },
      { id: 'auth-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'auth-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'auth-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],
    flowSteps: [
      {
        name: 'Login Request (POST /login)',
        detail: 'Client submits credentials (email & plaintext password) over TLS/HTTPS. Only moment the password travels over the wire.',
        lit: ['client', 'server', 'arr-client-server']
      },
      {
        name: 'Query User & Salted Hash',
        detail: 'Server queries database by email. Database retrieves user document containing the bcrypt salt + hash string ($2b$10$...).',
        lit: ['server', 'db', 'arr-server-db']
      },
      {
        name: 'bcrypt.compare() Verification',
        detail: 'Server extracts salt from stored hash, hashes incoming password with identical salt, and compares. Mismatch immediately yields 401.',
        lit: ['server', 'crypto', 'arr-server-crypto']
      },
      {
        name: 'Mint & Sign JSON Web Token',
        detail: 'Server signs a compact token with payload { id, role } using server secret (JWT_SECRET) with expiration (e.g. 7d).',
        lit: ['server', 'token', 'arr-server-token']
      },
      {
        name: 'Issue Token via httpOnly Cookie',
        detail: 'Server sends token in httpOnly, secure, sameSite cookie. JavaScript cannot read it, preventing XSS token theft.',
        lit: ['server', 'client', 'arr-server-client']
      },
      {
        name: 'Subsequent Requests & Guard Filter',
        detail: 'Token arrives automatically. Middleware runs jwt.verify(token). If valid, attaches user context and executes endpoint.',
        lit: ['client', 'middleware', 'route', 'arr-client-route']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js (Node / TypeScript)',
        language: 'typescript',
        fileLabel: 'src/middlewares/auth.middleware.ts',
        badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Extend Express Request to hold authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

// 1. Login Handler
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select('+password');
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Sign JWT with payload & secret
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  // Store in secure httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(200).json({ success: true, message: 'Logged in successfully' });
};

// 2. Auth Guard Middleware
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session token' });
  }
};`,
        explanation: 'In Express, login hashes password with bcrypt.compare, issues a JWT, and sets an httpOnly cookie. The isLoggedIn middleware intercepts protected routes, validates the signature via jwt.verify, and sets req.user.',
        architectureHighlights: [
          'bcrypt.compare() protects passwords against timing attacks',
          'Token transmitted inside httpOnly cookie prevents XSS theft',
          'Attaches decoded payload { id, role } onto req.user for downstream controllers',
          'Stateless validation: zero database hits required on protected requests'
        ]
      },
      springboot: {
        framework: 'springboot',
        frameworkName: 'Spring Boot (Spring Security 6)',
        language: 'java',
        fileLabel: 'com.cohort.security.JwtAuthenticationFilter.java',
        badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
        code: `package com.cohort.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final String SECRET_KEY = "mySuperSecretKeyThatIsAtLeast256BitsLong!";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            String role = claims.get("role", String.class);

            // Populate Spring Security Context
            var auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired JWT token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}`,
        explanation: 'Spring Security relies on the Servlet Filter chain. OncePerRequestFilter extracts the Bearer token, verifies signature using io.jsonwebtoken (JJWT), and populates SecurityContextHolder with user authority.',
        architectureHighlights: [
          'SecurityContextHolder provides thread-local user context across all beans',
          'Method-level security enabled via @PreAuthorize("hasRole(\'ADMIN\')")',
          'BCryptPasswordEncoder configured globally in SecurityFilterChain',
          'Standardized Spring Security Filter chain execution'
        ]
      },
      fastapi: {
        framework: 'fastapi',
        frameworkName: 'FastAPI (Python 3.11+ / OAuth2 & Jose)',
        language: 'python',
        fileLabel: 'security/auth.py',
        badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        code: `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

SECRET_KEY = "super-secret-jwt-key"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# 1. Password Verification
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 2. Dependency: Extracts and Verifies Current User
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None:
            raise credentials_exception
        return {"id": user_id, "role": role}
    except JWTError:
        raise credentials_exception

# 3. Usage in Protected Endpoint
# @router.get("/profile")
# async def read_profile(user: dict = Depends(get_current_user)):
#     return {"user": user}`,
        explanation: 'FastAPI integrates OAuth2PasswordBearer with Python-Jose and Passlib. The get_current_user dependency can be injected into any route via Depends(get_current_user), seamlessly populating Swagger UI with an "Authorize" lock button.',
        architectureHighlights: [
          'Automatic interactive Swagger authentication via OAuth2PasswordBearer',
          'Passlib handles automated bcrypt salt generation',
          'FastAPI Dependency Injection automatically intercepts and verifies tokens',
          'Decoupled and reusable get_current_user function'
        ]
      },
      django: {
        framework: 'django',
        frameworkName: 'Django (SimpleJWT)',
        language: 'python',
        fileLabel: 'myapp/views.py',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        code: `from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class ProtectedProfileView(APIView):
    # Enforces JWT authentication middleware globally for this view
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # request.user is automatically populated by SimpleJWT
        return Response({"message": f"Welcome {request.user.username}"})`,
        explanation: 'Django REST Framework uses SimpleJWT to parse the Bearer token and populate request.user.',
        architectureHighlights: [
          'Automatic integration with Django User Model',
          'Token lifecycle management via simplejwt views',
          'Declarative permission_classes for AuthZ'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Password Hashing',
        express: 'bcryptjs / argon2 with manual salt rounds (10-12)',
        springboot: 'BCryptPasswordEncoder bean in Spring Security configuration',
        fastapi: 'passlib.context.CryptContext(schemes=["bcrypt"])'
      },
      {
        feature: 'JWT Verification',
        express: 'jwt.verify(token, secret) in custom Express middleware',
        springboot: 'OncePerRequestFilter parsing claims into SecurityContext',
        fastapi: 'Depends(get_current_user) using python-jose'
      },
      {
        feature: 'Role-Based Guard (AuthZ)',
        express: 'Custom middleware: allow("admin") checking req.user.role',
        springboot: '@PreAuthorize("hasRole(\'ADMIN\')") annotation',
        fastapi: 'Dependency with role check: Depends(require_admin_role)'
      },
      {
        feature: 'Client Integration',
        express: 'Cookie or Bearer token',
        springboot: 'Bearer header (Authorization: Bearer <token>)',
        fastapi: 'Native Swagger OAuth2 password flow + Bearer header'
      }
    ],
    quiz: {
      question: 'Why must you NEVER store user passwords or social security numbers inside a JWT payload?',
      options: [
        'Because the token will become too heavy for HTTP headers',
        'Because JWT payloads are only Base64URL encoded (publicly readable by anyone who inspects the token)',
        'Because bcrypt will fail to sign the payload',
        'Because HTTP 403 status code will be triggered'
      ],
      correctIndex: 1,
      explanation: 'A JWT payload is NOT encrypted! It is merely Base64URL encoded. Anyone who has the token string can decode the JSON payload in any browser. Only the signature requires the secret key.'
    },
    bestPractices: [
      'Store JWTs in httpOnly, Secure, SameSite=Lax cookies to completely eliminate XSS token theft.',
      'Always set an expiration time (expiresIn) on tokens; stateless tokens cannot be revoked before expiry.',
      'Always respond with "Invalid email or password" on login failures to prevent user enumeration attacks.',
      'Keep token payloads small (only userId and role); avoid stuffing huge cart/order objects into it.'
    ],
    commonMistakes: [
      {
        mistake: 'Using jwt.decode() instead of jwt.verify()',
        consequence: 'jwt.decode() skips signature verification entirely, allowing anyone to forge an admin token.',
        solution: 'Always use jwt.verify() which recalculates HMAC-SHA256 with your secret.'
      },
      {
        mistake: 'Storing passwords as plain text or using MD5/SHA256',
        consequence: 'Fast hashing algorithms can be brute-forced at billions of guesses per second via GPU rainbow tables.',
        solution: 'Always use slow, salted cryptographic algorithms such as bcrypt or Argon2.'
      }
    ]
  };
