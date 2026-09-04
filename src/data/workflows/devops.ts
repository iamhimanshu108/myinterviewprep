import { WorkflowTopicData } from '../../types';

export const devopsWorkflow: WorkflowTopicData = {
    id: 'devops',
    title: 'DevOps & Deployment',
    subtitle: 'Containers, Pipelines, and Infrastructure',
    tagline: 'Bridging the gap between writing code and running it in production.',
    accentColor: '#EC4899',
    tags: ['Docker', 'CI/CD', 'AWS', 'Kubernetes'],
    sections: [
      { id: 'devops-01', num: 1, label: 'Containerization', group: 'Phase 1: Beginner' }
    ],
    flowSteps: [
      {
        name: 'Build Image',
        detail: 'Code and dependencies are packaged into an immutable Docker image.',
        lit: ['server']
      }
    ],
    codebases: {
      docker: {
        framework: 'docker',
        frameworkName: 'Docker',
        language: 'dockerfile',
        fileLabel: 'Dockerfile',
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        code: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
        explanation: 'A standard Dockerfile for a Node.js application, ensuring consistent environments.',
        architectureHighlights: [
          'Immutable infrastructure',
          'Environment parity across dev, staging, and production'
        ]
      }
    },
    quiz: undefined,
    comparisonPoints: [],
    bestPractices: [],
    commonMistakes: []
};
