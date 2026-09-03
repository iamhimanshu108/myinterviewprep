export type TechStack = 'all' | 'react' | 'java' | 'javascript' | 'node' | 'express';

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

export type ViewMode = 'workflow' | 'questions' | 'flashcards' | 'files';

export type BackendWorkflowTopic = 'auth' | 'crud' | 'rest' | 'middleware';
export type BackendFramework = 'express' | 'springboot' | 'fastapi';
