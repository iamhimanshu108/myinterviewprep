import { WorkflowTopicData } from '../../types';

export const reactWorkflow: WorkflowTopicData = {
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
  };
