import { WorkflowTopicData } from '../../types';

export const osMemoryWorkflow: WorkflowTopicData = {
    id: 'os-memory',
    title: 'OS & Memory Management',
    subtitle: 'Processes, Threads, and Garbage Collection',
    tagline: 'Understanding the foundation of systems programming.',
    accentColor: '#64748B',
    tags: ['Threads', 'Heap', 'Stack', 'Garbage Collection'],
    sections: [
      { id: 'os-01', num: 1, label: 'Memory Layout', group: 'Phase 1: Beginner' }
    ],
    flowSteps: [
      {
        name: 'Process Allocation',
        detail: 'The OS allocates a chunk of RAM for the process, dividing it into Stack, Heap, Data, and Text segments.',
        lit: ['server']
      }
    ],
    codebases: {
      c: {
        framework: 'c',
        frameworkName: 'C Language',
        language: 'c',
        fileLabel: 'memory.c',
        badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        code: `int main() {
  // Stack allocation
  int local_var = 5;
  
  // Heap allocation
  int *heap_var = (int*)malloc(sizeof(int));
  *heap_var = 10;
  
  // Must manually free heap memory!
  free(heap_var);
  return 0;
}`,
        explanation: 'Manual memory management in C demonstrates the difference between Stack (automatic) and Heap (manual) allocation.',
        architectureHighlights: [
          'Stack is fast and automatically cleaned up',
          'Heap requires manual malloc/free, risking memory leaks'
        ]
      }
    },
    quiz: undefined,
    comparisonPoints: [],
    bestPractices: [],
    commonMistakes: []
};
