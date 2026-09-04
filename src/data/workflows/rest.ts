import { WorkflowTopicData } from '../../types';

export const restWorkflow: WorkflowTopicData = {
    id: 'rest',
    title: 'REST API Concepts',
    subtitle: 'Representational State Transfer',
    tagline: 'The architectural style that defines standard web services.',
    accentColor: '#3B82F6', // Blue
    tags: ['HTTP', 'Endpoints', 'JSON', 'Stateless'],
    sections: [
      { id: 'rest-01', num: 1, label: 'HTTP Methods', group: 'Phase 1: Beginner' },
      { id: 'rest-02', num: 2, label: 'Status Codes', group: 'Phase 2: Intermediate' }
    ],
    flowSteps: [
      {
        name: 'Client Sends HTTP Request',
        detail: 'The client requests a resource using a specific verb (GET) and URI (/api/users).',
        lit: ['client', 'router']
      },
      {
        name: 'Server Processes Resource',
        detail: 'The server retrieves the resource state from the database without relying on previous sessions (stateless).',
        lit: ['router', 'service', 'db']
      },
      {
        name: 'Server Returns JSON',
        detail: 'The server responds with a standard status code (e.g. 200 OK) and the data represented in JSON.',
        lit: ['service', 'client']
      }
    ],
    codebases: {
      express: {
        framework: 'express',
        frameworkName: 'Express.js (Node)',
        language: 'typescript',
        fileLabel: 'src/routes/api.ts',
        badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        code: `import express from 'express';
const router = express.Router();

// GET: Retrieve a resource
router.get('/users', (req, res) => {
  res.status(200).json({ message: 'List of users' });
});

// POST: Create a new resource
router.post('/users', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

export default router;`,
        explanation: 'A standard Express router demonstrating RESTful endpoint design mapping HTTP methods to specific routes.',
        architectureHighlights: [
          'Use plural nouns for resource endpoints (/users, not /getUser)',
          'Stateless design: Each request contains all information necessary to process it'
        ]
      }
    },
    quiz: undefined,
    comparisonPoints: [],
    bestPractices: [],
    commonMistakes: []
};
