import { BackendWorkflowTopic, BackendFramework } from '../types';

export interface WorkflowCodebase {
  framework: BackendFramework;
  frameworkName: string;
  language: string;
  fileLabel: string;
  badgeColor: string;
  code: string;
  explanation: string;
  architectureHighlights: string[];
}

export interface FlowStep {
  name: string;
  detail: string;
  lit: string[];
}

export interface WorkflowSection {
  id: string;
  num: number;
  label: string;
  group: 'Foundations' | 'Lifecycle' | 'Architecture' | 'Implementation' | 'Wrap up';
}

export interface WorkflowTopicData {
  id: BackendWorkflowTopic;
  title: string;
  subtitle: string;
  tagline: string;
  accentColor: string;
  tags: string[];
  sections: WorkflowSection[];
  flowSteps: FlowStep[];
  codebases: Record<BackendFramework, WorkflowCodebase>;
  comparisonPoints: {
    feature: string;
    express: string;
    springboot: string;
    fastapi: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  bestPractices: string[];
  commonMistakes: {
    mistake: string;
    consequence: string;
    solution: string;
  }[];
}

export const BACKEND_WORKFLOWS: Record<BackendWorkflowTopic, WorkflowTopicData> = {
  // ─────────────────────────────────────────────────────────────
  // 1. CRUD WORKFLOW
  // ─────────────────────────────────────────────────────────────
  crud: {
    id: 'crud',
    title: 'CRUD Operations & Data Layer',
    subtitle: 'Create, Read, Update, Delete across Request, Service, and ORM Layers',
    tagline: 'How real-world backends accept, validate, persist, mutate, and delete entities',
    accentColor: '#10B981', // Emerald
    tags: ['POST 201', 'GET 200', 'PUT vs PATCH', 'DELETE 204', 'ORM / JPA', 'Transactions'],
    sections: [
      { id: 'crud-01', num: 1, label: 'The CRUD Cycle', group: 'Foundations' },
      { id: 'crud-02', num: 2, label: 'HTTP Verbs & Status Codes', group: 'Foundations' },
      { id: 'crud-03', num: 3, label: 'PUT vs PATCH', group: 'Foundations' },
      { id: 'crud-04', num: 4, label: 'Interactive CRUD Pipeline', group: 'Lifecycle' },
      { id: 'crud-05', num: 5, label: '3-Tier Layered Architecture', group: 'Architecture' },
      { id: 'crud-06', num: 6, label: 'Express.js Implementation', group: 'Implementation' },
      { id: 'crud-07', num: 7, label: 'Spring Boot Implementation', group: 'Implementation' },
      { id: 'crud-08', num: 8, label: 'FastAPI Implementation', group: 'Implementation' },
      { id: 'crud-09', num: 9, label: 'Cross-Framework Comparison', group: 'Wrap up' },
      { id: 'crud-10', num: 10, label: 'Common CRUD Bugs', group: 'Wrap up' },
    ],
    flowSteps: [
      {
        name: 'Incoming HTTP Request',
        detail: 'Client sends POST/GET/PUT/DELETE to /api/products with JSON payload or route params.',
        lit: ['client', 'router', 'arr-client-router']
      },
      {
        name: 'Schema & DTO Validation',
        detail: 'The incoming body is validated against schema contracts (Zod, Pydantic, or @Valid). Invalid fields immediately return 400 Bad Request.',
        lit: ['router', 'validation', 'arr-router-val']
      },
      {
        name: 'Service Layer Business Logic',
        detail: 'Controller forwards clean DTO to Service layer. Handles stock checks, price calculations, and transaction coordination.',
        lit: ['validation', 'service', 'arr-val-service']
      },
      {
        name: 'Database Query / Mutation',
        detail: 'Service triggers Repository/ORM (Mongoose, JPA, or SQLAlchemy) to query or commit changes to MongoDB or PostgreSQL.',
        lit: ['service', 'db', 'arr-service-db']
      },
      {
        name: 'Status Code & Response Serialization',
        detail: 'Database returns the persisted entity. The framework serializes it to JSON and sends the exact HTTP status (201 Created, 200 OK, 204 No Content).',
        lit: ['db', 'service', 'client', 'arr-db-client']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js (Node / TypeScript)',
        language: 'typescript',
        fileLabel: 'src/controllers/product.controller.ts',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        code: `import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '../models/Product';
import { z } from 'zod';

// 1. Validation Schema
const CreateProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  category: z.string().default('General')
});

// CREATE: POST /api/products -> 201 Created
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateProductSchema.parse(req.body);
    const product = await ProductModel.create(validatedData);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error); // Forward to global error handler
  }
};

// READ ALL: GET /api/products?category=tech -> 200 OK
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: String(category) } : {};
    const products = await ProductModel.find(filter).limit(50);
    return res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// READ ONE: GET /api/products/:id -> 200 OK or 404
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// UPDATE: PUT /api/products/:id -> 200 OK
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE: DELETE /api/products/:id -> 204 No Content
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    return res.status(204).send(); // 204: No Content in response body
  } catch (error) {
    next(error);
  }
};`,
        explanation: 'In Express, you explicitly parse inputs, query your database (Mongoose / Prisma), and manually call res.status(201).json() or res.status(204).send(). Error propagation relies on passing errors to next(error).',
        architectureHighlights: [
          'Direct control over req and res streams',
          'Explicit HTTP status code specification',
          'Centralized error boundary via next(error)',
          'Lightweight middleware-based schema validation (Zod)'
        ]
      },
      springboot: {
        framework: 'springboot',
        frameworkName: 'Spring Boot (Java 21 / Spring 3)',
        language: 'java',
        fileLabel: 'com.cohort.controller.ProductController.java',
        badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
        code: `package com.cohort.controller;

import com.cohort.dto.ProductRequest;
import com.cohort.model.Product;
import com.cohort.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // CREATE: POST /api/products -> 201 Created
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        Product created = productService.createProduct(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // READ ALL: GET /api/products?category=tech -> 200 OK
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category) {
        List<Product> products = productService.getProducts(category);
        return ResponseEntity.ok(products);
    }

    // READ ONE: GET /api/products/{id} -> 200 OK
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getById(id); // Throws ResourceNotFoundException if missing
        return ResponseEntity.ok(product);
    }

    // UPDATE: PUT /api/products/{id} -> 200 OK
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        Product updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    // DELETE: DELETE /api/products/{id} -> 204 No Content
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}`,
        explanation: 'Spring Boot uses strict dependency injection, typed DTO annotations (@Valid, @RequestBody), and declarative HTTP response entities (ResponseEntity<Product>). Exceptions like ResourceNotFoundException are caught globally by @RestControllerAdvice.',
        architectureHighlights: [
          'Automatic DTO mapping & Bean validation (@NotNull, @Positive)',
          'Spring Data JPA provides automatic CRUD repository queries',
          'Declarative status codes via @ResponseStatus(HttpStatus.NO_CONTENT)',
          'Strict separation of Controller -> Service -> Repository'
        ]
      },
      fastapi: {
        framework: 'fastapi',
        frameworkName: 'FastAPI (Python 3.11+ / Async)',
        language: 'python',
        fileLabel: 'routers/products.py',
        badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        code: `from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
from database import get_db
import crud_service, models

router = APIRouter(prefix="/api/products", tags=["Products"])

# 1. Pydantic DTO Schemas
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    price: float = Field(..., gt=0.0)
    category: str = "General"

class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True

# CREATE: POST /api/products -> 201 Created
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    return crud_service.create_product(db=db, item=payload)

# READ ALL: GET /api/products?category=tech -> 200 OK
@router.get("/", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return crud_service.get_all_products(db=db, category=category)

# READ ONE: GET /api/products/{id} -> 200 OK or 404
@router.get("/{product_id}", response_model=ProductResponse)
async def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = crud_service.get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

# UPDATE: PUT /api/products/{id} -> 200 OK
@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, payload: ProductCreate, db: Session = Depends(get_db)):
    updated = crud_service.update_product(db=db, product_id=product_id, item=payload)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return updated

# DELETE: DELETE /api/products/{id} -> 204 No Content
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    deleted = crud_service.delete_product(db=db, product_id=product_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return None`,
        explanation: 'FastAPI uses Python type hints and Pydantic models for automatic JSON serialization, input validation, and automatic OpenAPI (Swagger) documentation. Database sessions are injected via Depends(get_db).',
        architectureHighlights: [
          'Automatic OpenAPI/Swagger generation at /docs',
          'Pydantic handles serialization & schema validation simultaneously',
          'Dependency injection via Depends(get_db)',
          'Clear HTTP status codes in route decorators'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Schema Validation',
        express: 'External library (Zod / Joi / express-validator)',
        springboot: 'Built-in Jakarta Bean Validation (@Valid, @NotNull)',
        fastapi: 'Native Pydantic type annotations with auto OpenAPI docs'
      },
      {
        feature: 'Database Layer',
        express: 'Mongoose (Mongo) or Prisma / Drizzle / TypeORM (SQL)',
        springboot: 'Spring Data JPA / Hibernate with automated interfaces',
        fastapi: 'SQLAlchemy / SQLModel / Tortoise ORM with async support'
      },
      {
        feature: 'Status Code Handling',
        express: 'Manual: res.status(201).json(data)',
        springboot: 'ResponseEntity.status(HttpStatus.CREATED).body(data)',
        fastapi: 'Decorator: @router.post(status_code=status.HTTP_201_CREATED)'
      },
      {
        feature: 'Missing Entity (404)',
        express: 'if (!item) return res.status(404).json(...)',
        springboot: 'throw new ResourceNotFoundException("...") with @ExceptionHandler',
        fastapi: 'raise HTTPException(status_code=404, detail="...")'
      }
    ],
    quiz: {
      question: 'When successfully deleting a resource in a RESTful CRUD API, what is the most standard HTTP status code?',
      options: [
        '200 OK with message: "Deleted successfully"',
        '204 No Content with an empty response body',
        '201 Created',
        '202 Accepted'
      ],
      correctIndex: 1,
      explanation: 'HTTP 204 No Content indicates that the action was successfully enacted and no content needs to be returned in the response payload.'
    },
    bestPractices: [
      'Always return 201 Created for POST that generates a new ID, and return the newly generated record.',
      'Always use 204 No Content for DELETE endpoints to save network bandwidth.',
      'Differentiate PUT (full replacement of resource) vs PATCH (partial attribute mutation).',
      'Never execute raw database queries directly in the route handler; maintain a clean Service/Repository layer.'
    ],
    commonMistakes: [
      {
        mistake: 'Returning 200 OK for entity creation instead of 201 Created',
        consequence: 'Clients and API gateways cannot distinguish between a read query and a state mutation.',
        solution: 'Always set HTTP 201 Created for successful resource insertions.'
      },
      {
        mistake: 'Sending status 200 with { error: "Not found" } in the body',
        consequence: 'HTTP clients, monitoring tools, and Axios interpret it as a successful response.',
        solution: 'Use proper HTTP status codes (404 Not Found, 400 Bad Request) so clients trigger error branches.'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. AUTH WORKFLOW
  // ─────────────────────────────────────────────────────────────
  auth: {
    id: 'auth',
    title: 'Authentication & Access Control',
    subtitle: 'Password Hashing, JWT Minting, Cookie Storage, and Guard Middleware',
    tagline: 'Defending stateless HTTP endpoints with cryptographic tokens and bcrypt salting',
    accentColor: '#C84B1F', // Orange/Rust from reference
    tags: ['Stateless', 'bcryptjs', 'JWT HS256', 'httpOnly Cookies', 'AuthN vs AuthZ'],
    sections: [
      { id: 'auth-01', num: 1, label: 'The Problem: Statelessness', group: 'Foundations' },
      { id: 'auth-02', num: 2, label: 'Authentication vs Authorization', group: 'Foundations' },
      { id: 'auth-03', num: 3, label: 'Why We Hash Passwords', group: 'Foundations' },
      { id: 'auth-04', num: 4, label: 'The Student ID Card (JWT)', group: 'Lifecycle' },
      { id: 'auth-05', num: 5, label: 'Step-by-Step Auth Flow', group: 'Lifecycle' },
      { id: 'auth-06', num: 6, label: 'Express.js Implementation', group: 'Implementation' },
      { id: 'auth-07', num: 7, label: 'Spring Boot Implementation', group: 'Implementation' },
      { id: 'auth-08', num: 8, label: 'FastAPI Implementation', group: 'Implementation' },
      { id: 'auth-09', num: 9, label: 'Cross-Framework Comparison', group: 'Wrap up' },
      { id: 'auth-10', num: 10, label: 'Security Traps & Quizzes', group: 'Wrap up' },
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
  },

  // ─────────────────────────────────────────────────────────────
  // 3. REST WORKFLOW
  // ─────────────────────────────────────────────────────────────
  rest: {
    id: 'rest',
    title: 'RESTful Architecture & Standards',
    subtitle: 'Resource-Oriented URI Design, HTTP Verbs, Idempotency, and Negotiation',
    tagline: 'Designing maintainable, scalable, standardized REST APIs across languages',
    accentColor: '#3B82F6', // Blue
    tags: ['Resource URIs', 'Idempotency', 'HTTP 200/201/204/400/404', 'Query Filtering', 'HATEOAS'],
    sections: [
      { id: 'rest-01', num: 1, label: 'REST Core Principles', group: 'Foundations' },
      { id: 'rest-02', num: 2, label: 'URI Naming: Nouns over Verbs', group: 'Foundations' },
      { id: 'rest-03', num: 3, label: 'Safe vs Idempotent Methods', group: 'Foundations' },
      { id: 'rest-04', num: 4, label: 'HTTP Status Codes Matrix', group: 'Lifecycle' },
      { id: 'rest-05', num: 5, label: 'Interactive REST Dispatcher', group: 'Lifecycle' },
      { id: 'rest-06', num: 6, label: 'Express.js Implementation', group: 'Implementation' },
      { id: 'rest-07', num: 7, label: 'Spring Boot Implementation', group: 'Implementation' },
      { id: 'rest-08', num: 8, label: 'FastAPI Implementation', group: 'Implementation' },
      { id: 'rest-09', num: 9, label: 'Cross-Framework Comparison', group: 'Wrap up' },
      { id: 'rest-10', num: 10, label: 'REST Anti-Patterns', group: 'Wrap up' },
    ],
    flowSteps: [
      {
        name: 'Client URI & Method Dispatch',
        detail: 'Client issues a request targeting a noun-based resource identifier: GET /api/v1/orders/89/items.',
        lit: ['client', 'router', 'arr-client-router']
      },
      {
        name: 'Content Negotiation & Headers',
        detail: 'Server checks Content-Type (application/json) and Accept headers to negotiate output format.',
        lit: ['router', 'negotiation', 'arr-router-neg']
      },
      {
        name: 'Idempotency & Safety Check',
        detail: 'GET/HEAD are safe (read-only). PUT/DELETE are idempotent (1 call = N calls). POST is non-idempotent.',
        lit: ['negotiation', 'controller', 'arr-neg-ctrl']
      },
      {
        name: 'Uniform JSON Envelope',
        detail: 'Controller shapes response with standard payload, metadata (pagination, counts), and HATEOAS navigational links.',
        lit: ['controller', 'serializer', 'arr-ctrl-serial']
      },
      {
        name: 'Standard HTTP Status Output',
        detail: 'Server replies with semantically accurate status code (200, 201, 204, 400, 404, 409, 500).',
        lit: ['serializer', 'client', 'arr-serial-client']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js (Node / TypeScript)',
        language: 'typescript',
        fileLabel: 'src/routes/api.v1.routes.ts',
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        code: `import { Router, Request, Response } from 'express';

const router = Router();

// REST Principle 1: Nouns, not verbs!
// BAD: /api/getUserOrders, /api/createOrder
// GOOD: GET /api/v1/users/:userId/orders, POST /api/v1/orders

// Nested Resource: GET /api/v1/users/:userId/orders?status=shipped&page=1&limit=10
router.get('/users/:userId/orders', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status, page = '1', limit = '10' } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  // Query database with pagination and filters
  const [orders, total] = await Promise.all([
    OrderModel.find({ userId, ...(status ? { status } : {}) })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    OrderModel.countDocuments({ userId })
  ]);

  // REST Standard JSON envelope with metadata
  return res.status(200).json({
    data: orders,
    meta: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum
    },
    links: {
      self: \`/api/v1/users/\${userId}/orders?page=\${pageNum}\`,
      next: pageNum * limitNum < total ? \`/api/v1/users/\${userId}/orders?page=\${pageNum + 1}\` : null
    }
  });
});

export default router;`,
        explanation: 'Express lets you build RESTful endpoints by organizing routes with resource hierarchy (/users/:userId/orders) and reading query parameters for pagination, filtering, and sorting.',
        architectureHighlights: [
          'Nested sub-resource routing expresses parent-child domain relationships',
          'Standardized pagination envelope with metadata and hypermedia links',
          'Stateless query string parameters for filtering (?status=shipped)',
          'Strict avoidance of verb-based URI paths'
        ]
      },
      springboot: {
        framework: 'springboot',
        frameworkName: 'Spring Boot (Spring Web / HATEOAS)',
        language: 'java',
        fileLabel: 'com.cohort.controller.UserOrderRestController.java',
        badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
        code: `package com.cohort.controller;

import com.cohort.dto.OrderResponse;
import com.cohort.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;

@RestController
@RequestMapping("/api/v1")
public class UserOrderRestController {

    private final OrderService orderService;

    public UserOrderRestController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Nested REST Resource: GET /api/v1/users/{userId}/orders
    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<Page<OrderResponse>> getUserOrders(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<OrderResponse> page = orderService.findUserOrders(userId, status, pageable);
        return ResponseEntity.ok(page);
    }

    // Create Order with Location Header: POST /api/v1/orders -> 201 Created
    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest req) {
        OrderResponse created = orderService.createOrder(req);
        URI location = URI.create("/api/v1/orders/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }
}`,
        explanation: 'Spring Boot leverages Pageable for built-in REST pagination and provides ResponseEntity.created(URI) to automatically set the HTTP Location header pointing to the newly created REST resource.',
        architectureHighlights: [
          'Automatic Pageable handles page, size, and sort query parameters',
          'ResponseEntity.created(location) sets RFC-compliant Location header',
          'Declarative @PathVariable and @RequestParam type conversion',
          'Clean REST API resource representation'
        ]
      },
      fastapi: {
        framework: 'fastapi',
        frameworkName: 'FastAPI (Python 3.11+ / APIRouter)',
        language: 'python',
        fileLabel: 'routers/rest_orders.py',
        badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        code: `from fastapi import APIRouter, Query, status, Response
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["REST Orders"])

class OrderItem(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str

class PaginatedOrders(BaseModel):
    items: List[OrderItem]
    total: int
    page: int
    limit: int

# Nested Resource: GET /api/v1/users/{user_id}/orders
@router.get("/users/{user_id}/orders", response_model=PaginatedOrders)
async def get_user_orders(
    user_id: int,
    status: Optional[str] = Query(None, description="Filter by status (pending, shipped)"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    # Retrieve paginated items from database
    orders, total = await order_service.get_orders(user_id, status, page, limit)
    return PaginatedOrders(items=orders, total=total, page=page, limit=limit)

# Create Order: POST /api/v1/orders -> 201 Created with Location Header
@router.post("/orders", status_code=status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate, response: Response):
    new_order = await order_service.create(payload)
    response.headers["Location"] = f"/api/v1/orders/{new_order.id}"
    return new_order`,
        explanation: 'FastAPI uses Pydantic models with Query validation (ge=1, le=100). The Response object allows directly attaching standard REST headers such as Location.',
        architectureHighlights: [
          'Query parameters with built-in constraints (page ge=1, limit le=100)',
          'Automated OpenAPI documentation of query filters and responses',
          'RFC-compliant Location header injection via response.headers',
          'Strongly-typed paginated envelope structures'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Pagination',
        express: 'Manual calculation: skip((page-1)*limit).limit(limit)',
        springboot: 'Built-in Pageable and Page<T> interface with Spring Data',
        fastapi: 'Pydantic Paginated model with Query(ge=1, le=100)'
      },
      {
        feature: 'Resource Location Header',
        express: 'res.setHeader("Location", `/api/orders/${id}`)',
        springboot: 'ResponseEntity.created(URI.create(...)).body(dto)',
        fastapi: 'response.headers["Location"] = f"/api/orders/{id}"'
      },
      {
        feature: 'URI Versioning',
        express: 'Router prefix: app.use("/api/v1", v1Router)',
        springboot: '@RequestMapping("/api/v1/...") on controller',
        fastapi: 'APIRouter(prefix="/api/v1")'
      },
      {
        feature: 'Documentation',
        express: 'External tools (Swagger UI Express / TSOA)',
        springboot: 'SpringDoc OpenAPI / Swagger integration',
        fastapi: '100% native automated Swagger UI at /docs and ReDoc at /redoc'
      }
    ],
    quiz: {
      question: 'Which of the following URIs follows true RESTful conventions for updating a user profile?',
      options: [
        'POST /api/updateUserProfile?id=42',
        'PATCH /api/v1/users/42',
        'GET /api/users/edit/42',
        'POST /api/doUserUpdate/42'
      ],
      correctIndex: 1,
      explanation: 'REST URIs must be nouns representing resources (/api/v1/users/42). The HTTP method (PATCH or PUT) tells the server what action to perform.'
    },
    bestPractices: [
      'Use plural nouns for collections (e.g. /api/v1/users, not /api/v1/user).',
      'Use sub-resources for relational hierarchy (e.g. /users/5/orders, not /getOrdersForUser5).',
      'Use proper HTTP verbs: GET (safe/read), POST (create), PUT (replace), PATCH (modify), DELETE (remove).',
      'Never put verbs in your URI paths.'
    ],
    commonMistakes: [
      {
        mistake: 'Using GET requests to delete or mutate data (e.g. GET /api/users/delete/5)',
        consequence: 'Web crawlers, browsers pre-fetching pages, and CDNs will accidentally delete records.',
        solution: 'Always use DELETE or POST/PATCH for state mutations.'
      },
      {
        mistake: 'Using PUT when only modifying a single field',
        consequence: 'PUT semantically replaces the ENTIRE resource, potentially wiping out omitted fields.',
        solution: 'Use PATCH for partial updates, and PUT only for complete document replacements.'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 4. MIDDLEWARE WORKFLOW
  // ─────────────────────────────────────────────────────────────
  middleware: {
    id: 'middleware',
    title: 'Middleware & Pipeline Interceptors',
    subtitle: 'Request-Response Lifecycle, Logging, Rate Limiting, CORS, and Global Error Handlers',
    tagline: 'Intercepting and transforming requests before they reach your controller logic',
    accentColor: '#8B5CF6', // Purple
    tags: ['Next() Chain', 'Filter Chain', 'CORS', 'Rate Limiting', 'Global Exception Handler'],
    sections: [
      { id: 'mw-01', num: 1, label: 'What is Middleware?', group: 'Foundations' },
      { id: 'mw-02', num: 2, label: 'The Pipeline Concept (Onion Model)', group: 'Foundations' },
      { id: 'mw-03', num: 3, label: 'Order of Execution Matters', group: 'Foundations' },
      { id: 'mw-04', num: 4, label: 'Interactive Middleware Stepper', group: 'Lifecycle' },
      { id: 'mw-05', num: 5, label: 'Error Handling Middleware', group: 'Architecture' },
      { id: 'mw-06', num: 6, label: 'Express.js Implementation', group: 'Implementation' },
      { id: 'mw-07', num: 7, label: 'Spring Boot Implementation', group: 'Implementation' },
      { id: 'mw-08', num: 8, label: 'FastAPI Implementation', group: 'Implementation' },
      { id: 'mw-09', num: 9, label: 'Cross-Framework Comparison', group: 'Wrap up' },
      { id: 'mw-10', num: 10, label: 'Middleware Pitfalls', group: 'Wrap up' },
    ],
    flowSteps: [
      {
        name: 'Inbound Request & Timing Logger',
        detail: 'Request enters server socket. The first middleware records timestamp, HTTP method, client IP, and URL path.',
        lit: ['socket', 'logger', 'arr-socket-logger']
      },
      {
        name: 'CORS & Security Headers',
        detail: 'Sets Access-Control-Allow-Origin, Content-Security-Policy, and validates origin domain.',
        lit: ['logger', 'cors', 'arr-logger-cors']
      },
      {
        name: 'Rate Limiter & DDoS Shield',
        detail: 'Inspects client IP against Redis token bucket. If threshold exceeded, immediately halts pipeline with 429 Too Many Requests.',
        lit: ['cors', 'ratelimit', 'arr-cors-rate']
      },
      {
        name: 'Body Parser & JSON Deserializer',
        detail: 'Buffers raw incoming network stream and parses it into a usable JSON object.',
        lit: ['ratelimit', 'bodyparser', 'arr-rate-body']
      },
      {
        name: 'Authentication Guard Interceptor',
        detail: 'Checks credentials/token. If invalid, short-circuits with 401. If valid, attaches user and calls next().',
        lit: ['bodyparser', 'authguard', 'arr-body-auth']
      },
      {
        name: 'Route Handler & Global Error Boundary',
        detail: 'Controller executes. If any synchronous or async exception occurs, the error bubbles directly to the centralized Error Middleware.',
        lit: ['authguard', 'controller', 'errorhandler', 'arr-auth-ctrl']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js (Node / TypeScript)',
        language: 'typescript',
        fileLabel: 'src/middlewares/pipeline.ts',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        code: `import express, { Request, Response, NextFunction } from 'express';

const app = express();

// 1. Logging Middleware (Calculates request duration)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`[\${req.method}] \${req.originalUrl} - \${res.statusCode} (\${duration}ms)\`);
  });
  next(); // CRITICAL: Pass control to next middleware in chain!
});

// 2. Built-in Body Parser Middleware
app.use(express.json({ limit: '10kb' }));

// 3. Custom Rate Limiter Interceptor
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
export const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'anonymous';
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + windowMs;
    }

    entry.count++;
    rateLimitMap.set(ip, entry);

    if (entry.count > limit) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }
    next();
  };
};

// 4. Centralized Error-Handling Middleware (Must have 4 parameters: err, req, res, next)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err.message);
  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});`,
        explanation: 'In Express, middleware is a function (req, res, next). You must call next() to advance to the next layer. Error-handling middleware must explicitly accept exactly 4 arguments (err, req, res, next).',
        architectureHighlights: [
          'Linear pipeline ordering (top-to-bottom)',
          'next() calls the next function; omitting it hangs the request indefinitely',
          'Special 4-argument signature (err, req, res, next) identifies error handlers',
          'res.on("finish") allows capturing response headers and execution time'
        ]
      },
      springboot: {
        framework: 'springboot',
        frameworkName: 'Spring Boot (Servlet Filters & @ControllerAdvice)',
        language: 'java',
        fileLabel: 'com.cohort.filter.LoggingFilter.java',
        badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30',
        code: `package com.cohort.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.io.IOException;

// 1. Request Logging Filter (Servlet Level)
@Component
@Order(1) // Controls execution order in filter chain
public class LoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        long start = System.currentTimeMillis();
        chain.doFilter(request, response); // Passes request forward
        long duration = System.currentTimeMillis() - start;

        System.out.printf("[%s] %s -> %d (%dms)%n",
                req.getMethod(), req.getRequestURI(), res.getStatus(), duration);
    }
}

// 2. Global Exception Handling Middleware
@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(400, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralError(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(500, "Unexpected system error"));
    }
}`,
        explanation: 'Spring Boot uses Servlet Filters (implementing Filter with chain.doFilter) for HTTP pipeline interception and @ControllerAdvice with @ExceptionHandler for centralized, typed error translation.',
        architectureHighlights: [
          '@Order annotation specifies exact position in filter execution chain',
          'chain.doFilter(request, response) passes execution to the next filter',
          '@ControllerAdvice catches and maps Java exceptions into standardized JSON responses',
          'Clean separation of transport-level filters vs application-level interceptors'
        ]
      },
      fastapi: {
        framework: 'fastapi',
        frameworkName: 'FastAPI (Starlette Middleware / Async)',
        language: 'python',
        fileLabel: 'middlewares/pipeline.py',
        badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        code: `from fastapi import FastAPI, Request, Response, status
from fastapi.responses import JSONResponse
import time

app = FastAPI()

# 1. Timing & Logging Middleware using @app.middleware("http")
@app.middleware("http")
async def add_process_time_and_log(request: Request, call_next):
    start_time = time.perf_counter()
    
    # Passes request to downstream routes/middleware
    response: Response = await call_next(request)
    
    process_time = (time.perf_counter() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    
    print(f"[{request.method}] {request.url.path} -> {response.status_code} ({process_time:.1f}ms)")
    return response

# 2. Global Exception Handler Middleware
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"success": False, "error": "Bad Request", "detail": str(exc)}
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "Internal Server Error"}
    )`,
        explanation: 'FastAPI uses async functions decorated with @app.middleware("http"). call_next(request) yields execution to inner layers and returns a Response object that can be augmented with custom headers.',
        architectureHighlights: [
          'Non-blocking async/await middleware execution',
          'call_next(request) yields response for post-processing',
          'Headers such as X-Process-Time-Ms attached directly to response',
          '@app.exception_handler binds directly to Python exception types'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Execution Model',
        express: 'Callback-based: next() or next(err)',
        springboot: 'Servlet Filter: chain.doFilter(req, res)',
        fastapi: 'Async generator: response = await call_next(request)'
      },
      {
        feature: 'Ordering',
        express: 'Strictly ordered by app.use() declaration sequence',
        springboot: '@Order(1), @Order(2) annotations on Filter classes',
        fastapi: 'Decorators executed in reverse definition order (LIFO onion)'
      },
      {
        feature: 'Global Exception Catching',
        express: 'app.use((err, req, res, next) => {}) with 4 parameters',
        springboot: '@ControllerAdvice with @ExceptionHandler methods',
        fastapi: '@app.exception_handler(ExceptionType)'
      },
      {
        feature: 'Modifying Response Headers',
        express: 'res.setHeader() or res.on("finish")',
        springboot: 'res.setHeader() before/after chain.doFilter()',
        fastapi: 'response.headers["Header-Name"] = "Value"'
      }
    ],
    quiz: {
      question: 'In Express, what happens if your custom logging middleware fails to call next()?',
      options: [
        'Express automatically calls next() after 5 seconds',
        'The HTTP request hangs forever until client timeout, because the chain cannot advance',
        'The response is immediately sent with 200 OK',
        'Express throws an UnhandledNextException'
      ],
      correctIndex: 1,
      explanation: 'In Express, next() is entirely manual. If your middleware neither sends a response (res.send) nor calls next(), the connection remains open indefinitely until a gateway timeout occurs.'
    },
    bestPractices: [
      'Always place global logging and error handlers in the correct position (loggers first, error handlers last).',
      'Never forget to call next() (Express) or chain.doFilter() (Spring) or await call_next (FastAPI).',
      'Ensure error-handling middleware sanitizes database error traces before sending to production clients.',
      'Use rate-limiting middleware on public endpoints to prevent credential stuffing and DDoS attacks.'
    ],
    commonMistakes: [
      {
        mistake: 'Placing error-handling middleware BEFORE your routes in Express',
        consequence: 'The error handler will never be reached, because Express executes middleware in strict declaration order.',
        solution: 'Always register error-handling middleware at the very bottom of your application entry point.'
      },
      {
        mistake: 'Leaking raw database stack traces in error middleware',
        consequence: 'Attackers can view internal table names, SQL queries, and software versions.',
        solution: 'Filter out err.stack in production environments and only log it server-side.'
      }
    ]
  }
};
