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
  group: 'Phase 1: Beginner' | 'Phase 2: Intermediate' | 'Phase 3: Advanced' | 'Phase 4: Expert' | 'Phase 5: Mastery';
}

export interface ComparisonColumn {
  key: string;
  label: string;
  icon: string;
  colorClass: string;
}

export interface WorkflowTopicData {
  id: BackendWorkflowTopic;
  title: string;
  subtitle: string;
  tagline: string;
  accentColor: string;
  category?: 'backend' | 'frontend' | 'mobile' | 'devops';
  tags: string[];
  sections: WorkflowSection[];
  flowSteps: FlowStep[];
  codebases: Record<string, WorkflowCodebase>;
  comparisonColumns?: ComparisonColumn[];
  comparisonPoints: {
    feature: string;
    [key: string]: string;
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
      { id: 'crud-01', num: 1, label: 'Core Concept & Architecture', group: 'Phase 1: Beginner' },
      { id: 'crud-04', num: 2, label: 'Interactive Request Lifecycle', group: 'Phase 2: Intermediate' },
      { id: 'crud-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'crud-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'crud-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
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
      { id: 'rest-01', num: 1, label: 'REST Core Principles', group: 'Phase 1: Beginner' },
      { id: 'rest-04', num: 2, label: 'Interactive REST Dispatcher', group: 'Phase 2: Intermediate' },
      { id: 'rest-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'rest-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'rest-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
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
      { id: 'middleware-01', num: 1, label: 'Middleware Interception', group: 'Phase 1: Beginner' },
      { id: 'middleware-04', num: 2, label: 'Interactive Middleware Pipeline', group: 'Phase 2: Intermediate' },
      { id: 'middleware-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'middleware-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'middleware-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
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
  },

  // ─────────────────────────────────────────────────────────────
  // 5. REACT WEB ARCHITECTURE WORKFLOW
  // ─────────────────────────────────────────────────────────────
  react: {
    id: 'react',
    title: 'React Web Architecture & Data Flow',
    subtitle: 'Virtual DOM Reconciliation, TanStack Query CRUD with Optimistic UI, & Web Auth',
    tagline: 'How modern React apps orchestrate hooks, manage server state, handle JWT sessions, and render 60 FPS UIs',
    accentColor: '#06B6D4', // Cyan
    category: 'frontend',
    tags: ['Virtual DOM / Fiber', 'Hooks Lifecycle', 'TanStack Query CRUD', 'Optimistic UI', 'Axios Interceptors', 'Cookie Auth'],
    sections: [
      { id: 'react-01', num: 1, label: 'React Rendering Concepts', group: 'Phase 1: Beginner' },
      { id: 'react-04', num: 2, label: 'Interactive Component Lifecycle', group: 'Phase 2: Intermediate' },
      { id: 'react-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'react-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'react-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],
    flowSteps: [
      {
        name: 'User Event & State Trigger',
        detail: 'User clicks submit or filter. React handler dispatches a mutation or state update via useState / useMutation.',
        lit: ['client', 'router', 'arr-client-router']
      },
      {
        name: 'Fiber Reconciliation & Diffing',
        detail: 'React creates work-in-progress Fiber nodes, computes virtual DOM diffs asynchronously, and prioritizes urgent updates (concurrent mode).',
        lit: ['router', 'validation', 'arr-router-val']
      },
      {
        name: 'API Request & Auth Interceptor',
        detail: 'Axios interceptor verifies token validity. Injects Authorization Bearer header or relies on HttpOnly cookie credentials.',
        lit: ['validation', 'service', 'arr-val-service']
      },
      {
        name: 'Optimistic UI Update',
        detail: 'TanStack Query cancels outgoing queries, snapshots previous cache, and immediately renders new item in UI without waiting for server response.',
        lit: ['service', 'db', 'arr-service-db']
      },
      {
        name: 'Server Sync & Cache Commit',
        detail: 'Backend returns 201 Created or 200 OK. Query cache commits server ID; rolls back snapshot if backend returns 4xx/5xx error.',
        lit: ['db', 'service', 'client', 'arr-db-client']
      },
      {
        name: 'Commit Phase & Real DOM Flush',
        detail: 'React commits final mutations to the real browser DOM in a single synchronous layout pass, avoiding layout thrashing.',
        lit: ['client', 'router']
      }
    ],
    comparisonColumns: [
      { key: 'query', label: '⚛️ TanStack Query', icon: '⚛️', colorClass: 'text-cyan-400' },
      { key: 'auth', label: '🔒 Auth & Interceptors', icon: '🔒', colorClass: 'text-amber-400' },
      { key: 'next', label: '▲ Next.js Server Actions', icon: '▲', colorClass: 'text-sky-400' }
    ],
    codebases: {
      query: {
        framework: 'query',
        frameworkName: 'React + TanStack Query v5 (CRUD & Optimistic UI)',
        language: 'typescript',
        fileLabel: 'src/features/products/useProducts.ts',
        badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// 1. READ (List) - GET with automatic cache & stale-while-revalidate
export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ['products', { category }],
    queryFn: async (): Promise<Product[]> => {
      const res = await apiClient.get('/products', { params: { category } });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
};

// 2. CREATE - POST with Optimistic UI Update & Rollback
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id'>) => {
      const res = await apiClient.post('/products', newProduct);
      return res.data.data;
    },
    // When mutate is called:
    onMutate: async (newProduct) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot the previous state
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);

      // Optimistically update cache with temporary id
      queryClient.setQueryData<Product[]>(['products'], (old = []) => [
        { ...newProduct, id: 'temp-' + Date.now() },
        ...old,
      ]);

      return { previousProducts };
    },
    // If mutation fails, roll back to snapshot:
    onError: (_err, _newProduct, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
    },
    // Always refetch to sync with server ground truth:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};`,
        explanation: 'TanStack Query separates Server State from Client State. By implementing onMutate, onError, and onSettled, user actions feel instantaneous with automatic rollback on network failure.',
        architectureHighlights: [
          'Automatic request deduplication, background refetching, and stale time caching',
          'Optimistic UI updates ensure zero-latency feedback for mutations',
          'Automatic rollback protects UI consistency on 4xx/5xx network errors',
          'Query keys act as fine-grained cache dependencies'
        ]
      },
      auth: {
        framework: 'auth',
        frameworkName: 'React Auth Context + Axios Silent Refresh Interceptor',
        language: 'typescript',
        fileLabel: 'src/context/AuthContext.tsx',
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        code: `import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: object) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true, // Crucial: sends and receives httpOnly cookies
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Setup Axios Interceptors for 401 Auto-Refresh
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Call refresh endpoint (server reads httpOnly refresh cookie)
            await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
            return apiClient(originalRequest); // Retry original request
          } catch (refreshErr) {
            setUser(null); // Session completely dead -> force login
            return Promise.reject(refreshErr);
          }
        }
        return Promise.reject(error);
      }
    );

    // Initial session bootstrap
    apiClient.get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));

    return () => apiClient.interceptors.response.eject(interceptor);
  }, []);

  const login = async (credentials: object) => {
    const res = await apiClient.post('/auth/login', credentials);
    setUser(res.data.user);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};`,
        explanation: 'Provides secure web authentication using httpOnly cookies (resistant to XSS). Axios response interceptor intercepts 401 errors and performs silent refresh behind the scenes.',
        architectureHighlights: [
          'withCredentials: true enables automatic browser cookie transmission',
          'Silent refresh interceptor retries failed 401 requests transparently',
          'Centralized AuthContext guarantees consistent authorization state across tree',
          'Initial /auth/me bootstrap restores authenticated state on browser refresh'
        ]
      },
      next: {
        framework: 'next',
        frameworkName: 'Next.js 15 (App Router & Server Actions CRUD)',
        language: 'typescript',
        fileLabel: 'app/actions/products.ts',
        badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        code: `'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().positive(),
  category: z.string().default('General'),
});

// CREATE - Server Action called directly from form or client component
export async function createProductAction(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    price: formData.get('price'),
    category: formData.get('category'),
  };

  // 1. Server-side validation
  const validation = ProductSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  // 2. Direct database mutation (No extra API network hop needed!)
  try {
    const newProduct = await db.product.create({
      data: validation.data,
    });

    // 3. Purge Next.js data cache and refresh server components
    revalidatePath('/products');

    return { success: true, data: newProduct };
  } catch (error) {
    return { success: false, message: 'Database error occurred' };
  }
}

// DELETE - Server Action
export async function deleteProductAction(productId: string) {
  try {
    await db.product.delete({ where: { id: productId } });
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Could not delete product' };
  }
}`,
        explanation: 'Next.js 15 Server Actions run strictly on the Node.js server. They accept FormData directly from React components, validate input, mutate the database, and trigger revalidatePath.',
        architectureHighlights: [
          "'use server' directive boundary prevents server secrets from leaking to client",
          'Zero API boilerplate: eliminates the need for separate controllers and routes',
          'revalidatePath automatically invalidates edge and server cache',
          'Progressive enhancement: works even before JavaScript finishes hydrating'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Data Fetching & Cache',
        query: 'TanStack Query: In-memory stale-while-revalidate, optimistic updates',
        auth: 'Axios / Fetch with manual useEffect or custom hooks',
        next: 'Next.js fetch cache + React Server Components (RSC)'
      },
      {
        feature: 'Auth Storage Method',
        query: 'Accepts JWT from memory; relies on HttpOnly cookies for persistence',
        auth: 'HttpOnly Secure Cookie with automatic Axios 401 refresh loop',
        next: 'Encrypted cookie sessions (Iron-session / Auth.js / NextAuth)'
      },
      {
        feature: 'CRUD Mutation Handling',
        query: 'useMutation with onMutate optimistic cache update and rollback',
        auth: 'Imperative API calls wrapped in Context methods',
        next: 'Server Actions with automatic revalidatePath & useActionState'
      },
      {
        feature: 'Rendering Mechanism',
        query: 'Client-Side Rendering (CSR) hydrated into browser DOM',
        auth: 'Client-Side Auth Guard with redirect to /login on 401',
        next: 'Hybrid: Static (SSG), Dynamic (SSR), and Streaming React components'
      }
    ],
    quiz: {
      question: 'Why is storing JWT access tokens in browser localStorage considered an anti-pattern for web applications?',
      options: [
        'LocalStorage has a strict 50KB size limit',
        'Any Cross-Site Scripting (XSS) vulnerability can read localStorage and exfiltrate the token',
        'LocalStorage does not persist across browser tabs',
        'Browsers delete localStorage automatically every 24 hours'
      ],
      correctIndex: 1,
      explanation: 'Any JavaScript running on the page (including third-party analytics or compromised npm packages) has full read access to localStorage. Using httpOnly cookies ensures JavaScript cannot access the token.'
    },
    bestPractices: [
      'Separate server state (TanStack Query) from client UI state (Zustand / useState).',
      'Always store authentication tokens in httpOnly, Secure, SameSite cookies to mitigate XSS.',
      'Implement optimistic UI updates for high-frequency CRUD operations to maximize perceived speed.',
      'Use abort controllers to cancel pending network requests when components unmount.'
    ],
    commonMistakes: [
      {
        mistake: 'Storing server data in global Redux/Zustand stores without caching semantics',
        consequence: 'Manual tracking of isLoading, error, refetching, and race conditions leads to duplicated code and stale UI.',
        solution: 'Use TanStack Query or RTK Query designed specifically for asynchronous server state.'
      },
      {
        mistake: 'Putting access tokens in localStorage',
        consequence: 'Trivial token exfiltration via XSS attacks.',
        solution: 'Use httpOnly cookies or in-memory tokens refreshed via an httpOnly refresh cookie.'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 6. REACT NATIVE MOBILE ARCHITECTURE WORKFLOW
  // ─────────────────────────────────────────────────────────────
  'react-native': {
    id: 'react-native',
    title: 'React Native Mobile Architecture & Sync',
    subtitle: 'Bridge vs New Architecture (Fabric / JSI), Hardware SecureStore, & Offline CRUD',
    tagline: 'Bridging JavaScript and Native iOS/Android: Threading, Hardware Keychain, and Resilient Data Sync',
    accentColor: '#6366F1', // Indigo
    category: 'mobile',
    tags: ['New Architecture (Fabric / JSI)', 'TurboModules', 'Keychain / Keystore', 'Offline CRUD', 'React Navigation', 'AppState'],
    sections: [
      { id: 'react-native-01', num: 1, label: 'Mobile Architecture Shift', group: 'Phase 1: Beginner' },
      { id: 'react-native-04', num: 2, label: 'Interactive Native Bridge', group: 'Phase 2: Intermediate' },
      { id: 'react-native-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'react-native-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'react-native-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],
    flowSteps: [
      {
        name: 'Native Touch on UI Thread',
        detail: 'User touches the screen. Native OS (iOS UIKit / Android View) registers gesture and propagates event at 120Hz.',
        lit: ['client', 'router', 'arr-client-router']
      },
      {
        name: 'JSI Direct Invocation (No JSON Queue)',
        detail: 'New Architecture bypasses old asynchronous JSON bridge. JavaScript invokes native C++ methods synchronously via JSI.',
        lit: ['router', 'validation', 'arr-router-val']
      },
      {
        name: 'Hardware Keychain / Keystore Auth',
        detail: 'App retrieves encrypted JWT from hardware-backed storage (iOS Keychain / Android KeyStore) via expo-secure-store.',
        lit: ['validation', 'service', 'arr-val-service']
      },
      {
        name: 'NetInfo Guard & Offline Queue',
        detail: 'App evaluates connectivity. If offline, the CRUD action is persisted into local SQLite database with pending_sync flag.',
        lit: ['service', 'db', 'arr-service-db']
      },
      {
        name: 'Native TLS Socket & REST Call',
        detail: 'When online, native networking engine executes TLS 1.3 socket to backend REST endpoint (/api/v1/resource).',
        lit: ['db', 'service', 'client', 'arr-db-client']
      },
      {
        name: 'SQLite Sync & 60 FPS Re-render',
        detail: 'Server response updates local SQLite cache; Fabric updates native iOS/Android views directly on the UI thread.',
        lit: ['client', 'router']
      }
    ],
    comparisonColumns: [
      { key: 'secure', label: '🔐 Secure Hardware Auth', icon: '🔐', colorClass: 'text-indigo-400' },
      { key: 'offline', label: '📦 Offline CRUD & SQLite', icon: '📦', colorClass: 'text-emerald-400' },
      { key: 'nav', label: '🧭 Native Navigation & AppState', icon: '🧭', colorClass: 'text-rose-400' }
    ],
    codebases: {
      secure: {
        framework: 'secure',
        frameworkName: 'React Native Secure Hardware Auth (Keychain / Keystore)',
        language: 'typescript',
        fileLabel: 'src/services/secureAuth.ts',
        badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        code: `import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const ACCESS_TOKEN_KEY = 'secure_access_token';
const REFRESH_TOKEN_KEY = 'secure_refresh_token';

// 1. Hardware-Backed Storage (iOS Keychain / Android KeyStore)
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
};

export const getAccessToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

// 2. Mobile Axios Instance with Token Injection & Auto-Refresh
export const mobileApiClient = axios.create({
  baseURL: 'https://api.myapp.com/v1',
  timeout: 10000,
});

mobileApiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

mobileApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await axios.post('https://api.myapp.com/v1/auth/refresh', {
          refreshToken,
        });
        const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
        await saveTokens(newAccess, newRefresh);
        originalRequest.headers.Authorization = \`Bearer \${newAccess}\`;
        return mobileApiClient(originalRequest);
      } catch (refreshErr) {
        await clearTokens(); // Force re-authentication
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);`,
        explanation: 'In mobile, cookies do not persist naturally across app lifecycles. Instead, tokens are stored inside hardware-backed storage (iOS Keychain and Android KeyStore) using SecureStore.',
        architectureHighlights: [
          'Hardware-backed encryption protects tokens against physical memory extraction',
          'Avoids unencrypted AsyncStorage which is vulnerable on rooted devices',
          'Automatic token rotation handling via Axios interceptors',
          'Thread-safe asynchronous token access across app backgrounding'
        ]
      },
      offline: {
        framework: 'offline',
        frameworkName: 'React Native Offline-First CRUD & SQLite Sync Engine',
        language: 'typescript',
        fileLabel: 'src/services/offlineSync.ts',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        code: `import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { mobileApiClient } from './secureAuth';

const db = SQLite.openDatabaseSync('app_data.db');

// 1. Initialize local SQLite table with sync flags
export const initOfflineDb = () => {
  db.execSync(\`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer TEXT NOT NULL,
      amount REAL NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'synced', -- 'synced' | 'pending_create' | 'pending_delete'
      updated_at INTEGER NOT NULL
    );
  \`);
};

// 2. Offline-First CREATE: Writes locally first, then syncs if online
export const createOrderOfflineFirst = async (order: { id: string; customer: string; amount: number }) => {
  const isOnline = (await NetInfo.fetch()).isConnected;
  const initialStatus = isOnline ? 'synced' : 'pending_create';

  // Always write to local database immediately (instant UI feedback)
  db.runSync(
    \`INSERT OR REPLACE INTO orders (id, customer, amount, sync_status, updated_at) VALUES (?, ?, ?, ?, ?)\`,
    [order.id, order.customer, order.amount, initialStatus, Date.now()]
  );

  if (isOnline) {
    try {
      await mobileApiClient.post('/orders', order);
    } catch (err) {
      // Mark as pending if network request failed midway
      db.runSync(\`UPDATE orders SET sync_status = 'pending_create' WHERE id = ?\`, [order.id]);
    }
  }
};

// 3. Background Sync: Triggered on NetInfo reconnect or app foreground
export const syncPendingOrders = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  const pendingRecords = db.getAllSync<{ id: string; customer: string; amount: number }>(
    \`SELECT id, customer, amount FROM orders WHERE sync_status = 'pending_create'\`
  );

  for (const record of pendingRecords) {
    try {
      await mobileApiClient.post('/orders', record);
      db.runSync(\`UPDATE orders SET sync_status = 'synced' WHERE id = ?\`, [record.id]);
    } catch (err) {
      console.warn('Sync failed for item', record.id, err);
    }
  }
};`,
        explanation: 'Mobile apps must function without an internet connection. This pattern writes immediately to local SQLite with a sync_status flag, syncing to the backend REST API when connectivity returns.',
        architectureHighlights: [
          'Zero-latency local CRUD operations: writes to local SQLite first',
          'Resilient sync_status flag manages offline queues (pending_create, synced)',
          'NetInfo triggers automatic synchronization upon network reconnection',
          'Protects user input from network packet drops or subway dead-zones'
        ]
      },
      nav: {
        framework: 'nav',
        frameworkName: 'React Native Navigation Guard & AppState Lifecycle',
        language: 'typescript',
        fileLabel: 'src/navigation/RootNavigator.tsx',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        code: `import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAccessToken } from '../services/secureAuth';
import { syncPendingOrders } from '../services/offlineSync';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 1. Initial auth check
  useEffect(() => {
    getAccessToken().then((token) => setIsAuthenticated(!!token));
  }, []);

  // 2. AppState Lifecycle Listener: Trigger sync when app resumes
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        // App returned to foreground: sync offline queues & check token freshness
        syncPendingOrders();
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, []);

  if (isAuthenticated === null) return null; // Or splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Protected App Stack
          <Stack.Group>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
          </Stack.Group>
        ) : (
          // Public Auth Stack
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};`,
        explanation: 'Combines native screen transitions with conditional routing based on auth state. Listens to mobile AppState (active, background, inactive) to trigger data sync upon foregrounding.',
        architectureHighlights: [
          'Conditional stack rendering prevents unauthenticated screen access',
          'Native stack navigator renders true iOS UINavigationController and Android Fragments',
          'AppState listener synchronizes offline queues whenever user opens the app',
          'Splash screen prevents UI flashes during asynchronous token resolution'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Architecture & Engine',
        secure: 'JSI (JavaScript Interface) invokes C++ directly without serialization',
        offline: 'C++ SQLite bindings bypass JS bridge for microsecond queries',
        nav: 'Native Stack delegates navigation to OS native view controllers'
      },
      {
        feature: 'Authentication Persistence',
        secure: 'Hardware-backed iOS Keychain & Android KeyStore via SecureStore',
        offline: 'Stores user credentials alongside encrypted local database records',
        nav: 'Reactive auth state dynamically switches RootNavigator route tree'
      },
      {
        feature: 'Offline Resilience',
        secure: 'Cached tokens allow biometric / offline app unlock',
        offline: 'Local SQLite engine with pending_sync queue and NetInfo trigger',
        nav: 'AppState listener triggers sync when user returns from background'
      },
      {
        feature: 'Thread Performance',
        secure: 'Async crypto hashing executes off the main 60/120 FPS UI thread',
        offline: 'Background worker thread prevents UI thread stutter during sync',
        nav: 'Native driver animates screen transitions at native 120 FPS'
      }
    ],
    quiz: {
      question: 'What is the main architectural benefit of React Native’s New Architecture (Fabric & TurboModules) over the legacy Bridge?',
      options: [
        'It compiles JavaScript into native Swift and Kotlin code ahead of time',
        'It replaces the asynchronous JSON serialization bridge with direct synchronous C++ JSI calls',
        'It allows React Native apps to run in the browser without Node.js',
        'It eliminates the need for state management libraries'
      ],
      correctIndex: 1,
      explanation: 'The old bridge passed JSON messages asynchronously across threads, causing lag on fast gestures or lists. JSI gives JavaScript direct pointers to C++ native host objects for synchronous, zero-copy communication.'
    },
    bestPractices: [
      'Never store sensitive authentication tokens in AsyncStorage; always use Keychain / KeyStore.',
      'Design mobile apps to be offline-first using SQLite, WatermelonDB, or TanStack offline persistence.',
      'Listen to AppState to pause timers or refetch data when app returns to foreground.',
      'Always run animations using the native driver (useNativeDriver: true or react-native-reanimated).'
    ],
    commonMistakes: [
      {
        mistake: 'Using AsyncStorage for JWT tokens and sensitive user data',
        consequence: 'AsyncStorage is unencrypted plain-text XML/JSON on the filesystem; easily extracted from rooted devices.',
        solution: 'Use expo-secure-store or react-native-keychain with hardware-backed encryption.'
      },
      {
        mistake: 'Failing to handle offline state when making REST calls',
        consequence: 'App throws unhandled network errors or displays empty white screens when user enters a tunnel or loses Wi-Fi.',
        solution: 'Use NetInfo and an offline queue pattern to persist mutations locally before syncing.'
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 7. DEVOPS, CI/CD, & CLOUD DEPLOYMENT WORKFLOW
  // ─────────────────────────────────────────────────────────────
  devops: {
    id: 'devops',
    title: 'DevOps, CI/CD Pipeline & Cloud Deployment',
    subtitle: 'Multi-Stage Dockerization, GitHub Actions CI/CD, Nginx Gateway, & Cloud Infrastructure',
    tagline: 'From Git commit to zero-downtime production deployment with automated testing, containerization, and APM',
    accentColor: '#EC4899', // Pink
    category: 'devops',
    tags: ['Docker Multi-stage', 'GitHub Actions', 'Nginx Reverse Proxy', 'AWS ECS / K8s', 'Zero Downtime', 'Prometheus / Sentry'],
    sections: [
      { id: 'devops-01', num: 1, label: 'CI/CD Automation', group: 'Phase 1: Beginner' },
      { id: 'devops-04', num: 2, label: 'Interactive Deployment Pipeline', group: 'Phase 2: Intermediate' },
      { id: 'devops-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'devops-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'devops-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],
    flowSteps: [
      {
        name: 'Git Push & PR Webhook Trigger',
        detail: 'Developer pushes code to main or opens PR. GitHub Actions runner provisions containerized Ubuntu runner.',
        lit: ['client', 'router', 'arr-client-router']
      },
      {
        name: 'Automated Test & Lint Matrix',
        detail: 'Runner installs dependencies, executes TypeScript compilation (tsc), ESLint, unit tests, and integration tests.',
        lit: ['router', 'validation', 'arr-router-val']
      },
      {
        name: 'Security Audit & Vulnerability Scan',
        detail: 'Snyk and Trivy scan npm dependencies and Docker base images for critical CVE vulnerabilities. Halts if high severity found.',
        lit: ['validation', 'service', 'arr-val-service']
      },
      {
        name: 'Multi-Stage Container Build',
        detail: 'Docker executes multi-stage build: compiles code in builder stage, copies only runtime artifacts to a slim alpine image.',
        lit: ['service', 'db', 'arr-service-db']
      },
      {
        name: 'Registry Push & Cloud Deployment',
        detail: 'Image tagged with Git commit SHA is pushed to AWS ECR / Docker Hub. Deploys to AWS ECS / Kubernetes with rolling update.',
        lit: ['db', 'service', 'client', 'arr-db-client']
      },
      {
        name: 'Health Check & Zero-Downtime Traffic Shift',
        detail: 'Nginx / ALB tests /healthz endpoint. Traffic shifts to new pods only when healthy; old containers terminated cleanly.',
        lit: ['client', 'router']
      }
    ],
    comparisonColumns: [
      { key: 'docker', label: '🐳 Multi-Stage Dockerfile', icon: '🐳', colorClass: 'text-sky-400' },
      { key: 'actions', label: '⚙️ GitHub Actions CI/CD', icon: '⚙️', colorClass: 'text-amber-400' },
      { key: 'nginx', label: '🛡️ Nginx Reverse Proxy', icon: '🛡️', colorClass: 'text-emerald-400' }
    ],
    codebases: {
      docker: {
        framework: 'docker',
        frameworkName: 'Production Multi-Stage Dockerfile & Docker Compose',
        language: 'dockerfile',
        fileLabel: 'Dockerfile',
        badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        code: `# ── STAGE 1: Builder ──
FROM node:20-alpine AS builder
WORKDIR /app

# Cache package manifests first (Docker layer caching)
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# Prune development dependencies
RUN npm prune --production

# ── STAGE 2: Production Runner ──
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Create non-root user and group
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 appuser

# Copy only production artifacts from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Switch away from root user
USER appuser

EXPOSE 3000
ENV PORT=3000

# Health check instruction for orchestrator
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1

CMD ["node", "dist/main.js"]`,
        explanation: 'Multi-stage builds decouple the build tools (TypeScript compiler, testing frameworks) from the final runtime image, reducing image size from 1.2GB to <120MB and eliminating build-time security vulnerabilities.',
        architectureHighlights: [
          'Layer caching: package*.json copied before source code speeds up rebuilds',
          'Non-root user (appuser:1001) mitigates container breakout vulnerabilities',
          'HEALTHCHECK instruction enables Kubernetes/Docker swarm automatic healing',
          'Distroless/Alpine base dramatically minimizes attack surface'
        ]
      },
      actions: {
        framework: 'actions',
        frameworkName: 'GitHub Actions Automated CI/CD Pipeline (.github/workflows)',
        language: 'yaml',
        fileLabel: '.github/workflows/deploy.yml',
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        code: `name: CI/CD Production Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  # 1. Continuous Integration (Lint, Typecheck, Test)
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Typecheck
        run: npm run lint

      - name: Run Unit & Integration Tests
        run: npm test -- --coverage

  # 2. Security Vulnerability Scan
  security-audit:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}

  # 3. Continuous Delivery (Build & Deploy to Cloud)
  deploy:
    needs: [validate, security-audit]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to Cloud (Rolling Update)
        run: |
          echo "Triggering cloud deploy on AWS ECS / Kubernetes..."
          # e.g., aws ecs update-service --cluster prod --service api --force-new-deployment`,
        explanation: 'GitHub Actions automates code validation, security scanning, multi-arch Docker image compilation, and automated deployment with zero human error.',
        architectureHighlights: [
          'Branch guards: deployments execute strictly on verified commits to main',
          'GitHub Actions Docker cache (type=gha) saves minutes on image builds',
          'Automated security audit halts delivery if high CVE vulnerabilities exist',
          'Tagged with commit SHA for instant, deterministic one-click rollbacks'
        ]
      },
      nginx: {
        framework: 'nginx',
        frameworkName: 'Nginx Reverse Proxy, SSL, & Rate Limiting Configuration',
        language: 'nginx',
        fileLabel: 'nginx/conf.d/default.conf',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        code: `# 1. Rate Limiting Zone: 20 requests per second per IP
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;

# 2. Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.myapp.com;
    return 301 https://$host$request_uri;
}

# 3. HTTPS Server & Reverse Proxy
server {
    listen 443 ssl http2;
    server_name api.myapp.com;

    # SSL Certificates (Let's Encrypt / Cloudflare)
    ssl_certificate /etc/letsencrypt/live/api.myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.myapp.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_types application/json text/plain text/css application/javascript;

    # API Proxy Location
    location / {
        # Enforce rate limit with burst allowance of 10 requests
        limit_req zone=api_limit burst=10 nodelay;

        proxy_pass http://backend_upstream:3000;
        proxy_http_version 1.1;

        # Forward real client headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
}`,
        explanation: 'Nginx sits at the edge in front of backend containers. It handles SSL termination, enforces IP rate limiting against DDoS attacks, enables gzip compression, and securely forwards traffic.',
        architectureHighlights: [
          'SSL/TLS 1.3 termination relieves application servers from CPU-heavy crypto operations',
          'limit_req protects backend databases against brute-force and DDoS flooding',
          'Security headers (HSTS, nosniff, DENY) protect against clickjacking and MIME sniffing',
          'X-Forwarded-* headers ensure application controllers read real client IP addresses'
        ]
      }
    },
    comparisonPoints: [
      {
        feature: 'Deployment Strategy',
        docker: 'Docker Compose: Single-server or local microservices orchestration',
        actions: 'GitHub Actions: Automated CI/CD pipeline triggering cloud updates',
        nginx: 'Nginx: Upstream weighted routing for Blue-Green or Canary releases'
      },
      {
        feature: 'Security Hardening',
        docker: 'Non-root user (appuser), Alpine base image, stripped devDependencies',
        actions: 'Snyk CVE scanning, branch protection, encrypted repo secrets',
        nginx: 'SSL/TLS 1.3 termination, HSTS headers, IP-based rate limiting'
      },
      {
        feature: 'Health Checks & Resilience',
        docker: 'HEALTHCHECK instruction probes /healthz every 30 seconds',
        actions: 'Rolls back deployment automatically if post-deploy smoke tests fail',
        nginx: 'Fails over to healthy upstream instances with zero dropped connections'
      },
      {
        feature: 'Scalability Model',
        docker: 'docker compose up --scale backend=5 behind local load balancer',
        actions: 'Parallel matrix testing across Node, Python, and Java environments',
        nginx: 'Event-driven asynchronous epoll architecture handles 50,000+ concurrent connections'
      }
    ],
    quiz: {
      question: 'In a Dockerfile, why is it critical to COPY package.json and run npm install BEFORE copying the rest of the application source code?',
      options: [
        'npm will fail if source code is already present in the directory',
        'To take advantage of Docker layer caching: dependencies only reinstall when package.json changes, drastically speeding up builds',
        'Docker requires all JSON files to be loaded first in memory',
        'It prevents git commit hashes from being embedded in the container'
      ],
      correctIndex: 1,
      explanation: 'Docker caches each instruction layer. If you copy source code first, any change in your code invalidates the cache for all subsequent steps, forcing a slow npm install on every single build.'
    },
    bestPractices: [
      'Always use multi-stage Docker builds to keep production images tiny and secure.',
      'Never run containers as the root user in production.',
      'Enforce zero-downtime rolling updates with /healthz readiness and liveness probes.',
      'Use infrastructure-as-code (Terraform / Helm) and automated CI/CD instead of manual SSH deploys.'
    ],
    commonMistakes: [
      {
        mistake: 'Deploying containers with the :latest tag in production',
        consequence: 'Impossible to determine what exact version is running; rollbacks become unpredictable and break traceability.',
        solution: 'Tag Docker images with the exact Git commit SHA ($GITHUB_SHA) or semantic release version.'
      },
      {
        mistake: 'Running containers as the root user',
        consequence: 'If a vulnerability is exploited in your app, the attacker gains root access to the host kernel.',
        solution: 'Create and switch to a non-privileged user (e.g., USER appuser) in the Dockerfile.'
      }
    ]
  }
};
