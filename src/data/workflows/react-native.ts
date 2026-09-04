import { WorkflowTopicData } from '../../types';

export const reactNativeWorkflow: WorkflowTopicData = {
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
  };
