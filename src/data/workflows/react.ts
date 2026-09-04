import { WorkflowTopicData } from '../../types';

export const reactWorkflow: WorkflowTopicData = {
    id: 'react',
    title: 'React & Frontend Web',
    subtitle: 'Client-Side Rendering and State Management',
    tagline: 'Building interactive UIs with components.',
    accentColor: '#06B6D4',
    tags: ['React', 'Hooks', 'State', 'Virtual DOM'],
    sections: [
      { id: 'react-01', num: 1, label: 'Virtual DOM', group: 'Phase 1: Beginner' }
    ],
    flowSteps: [
      {
        name: 'State Change',
        detail: 'User interacts with the UI, triggering a state update via useState or useReducer.',
        lit: ['client']
      }
    ],
    codebases: {
      react: {
        framework: 'react',
        frameworkName: 'React.js',
        language: 'typescript',
        fileLabel: 'App.tsx',
        badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count is {count}
    </button>
  );
}`,
        explanation: 'A simple React component with state.',
        architectureHighlights: [
          'Declarative UI updates',
          'Component encapsulation'
        ]
      }
    },
    quiz: undefined,
    comparisonPoints: [],
    bestPractices: [],
    commonMistakes: []
};
