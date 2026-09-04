import { WorkflowTopicData } from '../../types';

export const middlewareWorkflow: WorkflowTopicData = {
    id: 'middleware',
    title: 'Middleware & Interceptors',
    subtitle: 'Intercepting Requests & Responses',
    tagline: 'The glue that holds the web framework pipeline together.',
    accentColor: '#A855F7',
    tags: ['Pipeline', 'Interceptors', 'Logging', 'CORS'],
    sections: [
      { id: 'mid-01', num: 1, label: 'The Middleware Pipeline', group: 'Phase 1: Beginner' }
    ],
    flowSteps: [
      {
        name: 'Incoming Request',
        detail: 'Request hits the server and passes through a sequence of middleware functions.',
        lit: ['router', 'middleware']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js',
        language: 'typescript',
        fileLabel: 'logger.ts',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        code: `export const loggerMiddleware = (req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
};`,
        explanation: 'A basic Express middleware that logs requests and passes control to the next handler.',
        architectureHighlights: [
          'Chain of responsibility pattern',
          'Perfect for cross-cutting concerns (auth, logging, CORS)'
        ]
      }
    },
    quiz: undefined,
    comparisonPoints: [],
    bestPractices: [],
    commonMistakes: []
};
