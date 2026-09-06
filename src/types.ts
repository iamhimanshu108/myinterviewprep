export type TechStack = 
  | 'all' 
  | 'html' 
  | 'javascript' 
  | 'python' 
  | 'react' 
  | 'java' 
  | 'node' 
  | 'express' 
  | 'typescript'
  | 'api'
  | 'auth'
  | 'database'
  | 'middleware'
  | 'reactnative'
  | 'devops';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';


export interface CodeStep {
  line: number;
  explanation: string;
  output?: string;
}

export interface CodeExample {
  language: string;
  code: string;
  filename?: string;
  output?: string;
  executionSteps?: CodeStep[];
}

export interface Question {
  id: string;
  stack: Exclude<TechStack, 'all'>;
  topic: string;
  title: string;
  difficulty: Difficulty;
  summary: string;
  explanation: string[];
  codeExample?: CodeExample;
  keyPoints: string[];
  interviewTip?: string;
  tags: string[];
}

export interface UserProgress {
  completedIds: string[];
  bookmarkedIds: string[];
  notes: Record<string, string>;
}
export type ViewMode = 'workflow' | 'questions' | 'practice';
export type BackendWorkflowTopic = 
  | 'mvc'
  | 'api'
  | 'auth' 
  | 'crud' 
  | 'middleware' 
  | 'react' 
  | 'react-native' 
  | 'devops'
  | 'networking'
  | 'os-memory'
  | 'cli-tools'
  | 'data-structures'
  | 'graphql'
  | 'grpc'
  | 'websockets'
  | 'sql-dbs'
  | 'nosql-dbs'
  | 'caching'
  | 'orms'
  | 'owasp'
  | 'encryption'
  | 'load-balancers'
  | 'message-queues'
  | 'microservices'
  | 'docker'
  | 'cicd'
  | 'monitoring';

export type BackendFramework = string;


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
  category?: string;
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