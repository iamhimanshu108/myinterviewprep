import { Question } from '../types';
import { REACT_QUESTIONS } from './stacks/react';
import { JAVA_QUESTIONS } from './stacks/java';
import { JAVASCRIPT_QUESTIONS } from './stacks/javascript';
import { NODE_QUESTIONS } from './stacks/node';
import { EXPRESS_QUESTIONS } from './stacks/express';
import { HTML_QUESTIONS } from './stacks/html';
import { PYTHON_QUESTIONS } from './stacks/python';
import { TYPESCRIPT_QUESTIONS } from './stacks/typescript';

export {
  REACT_QUESTIONS,
  JAVA_QUESTIONS,
  JAVASCRIPT_QUESTIONS,
  NODE_QUESTIONS,
  EXPRESS_QUESTIONS,
  HTML_QUESTIONS,
  PYTHON_QUESTIONS,
  TYPESCRIPT_QUESTIONS
};

export const QUESTIONS_DATA: Question[] = [
  ...HTML_QUESTIONS,
  ...JAVASCRIPT_QUESTIONS,
  ...PYTHON_QUESTIONS,
  ...REACT_QUESTIONS,
  ...JAVA_QUESTIONS,
  ...NODE_QUESTIONS,
  ...EXPRESS_QUESTIONS,
  ...TYPESCRIPT_QUESTIONS
];
