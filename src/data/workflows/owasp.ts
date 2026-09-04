import { WorkflowTopicData } from '../../types';

export const owaspWorkflow: WorkflowTopicData = {
    id: 'owasp',
    title: 'OWASP Top 10',
    subtitle: 'SQL injection, XSS, CSRF protection, input validation',
    tagline: 'Deep dive into OWASP Top 10 concepts and code architectures.',
    accentColor: '#6366f1', // Indigo
    category: 'Security',
    tags: ["SQLi","XSS","CSRF","Input Validation"],
    sections: [
      { id: 'owasp-01', num: 1, label: 'Core Principles', group: 'Phase 1: Beginner' }
    ],
    flowSteps: [
      {
        name: 'Concept Overview',
        detail: 'Detailed flow implementation coming soon.',
        lit: ['client', 'server']
      }
    ],
    codebases: {
      placeholder: {
        framework: 'placeholder',
        frameworkName: 'Coming Soon',
        language: 'plaintext',
        fileLabel: 'example.txt',
        badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        code: 'Detailed framework implementations for this topic are currently under construction.',
        explanation: 'Stay tuned for deep-dives into how this is handled across Express, Spring Boot, Django, and FastAPI!',
        architectureHighlights: ['Check back soon!']
      }
    },
    comparisonPoints: [],
    quiz: {
      question: 'Placeholder Quiz for OWASP Top 10',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'Placeholder explanation.'
    },
    bestPractices: ['Coming soon.'],
    commonMistakes: [
      { mistake: 'Coming soon.', consequence: 'Unknown', solution: 'N/A' }
    ]
  };
