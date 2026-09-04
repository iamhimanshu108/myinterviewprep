import { WorkflowTopicData } from '../../types';

export const devopsWorkflow: WorkflowTopicData = {
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
  };
