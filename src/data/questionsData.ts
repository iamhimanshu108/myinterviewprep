import { Question } from '../types';
import { REACT_QUESTIONS } from './stacks/react';
import { JAVA_QUESTIONS } from './stacks/java';
import { JAVASCRIPT_QUESTIONS } from './stacks/javascript';
import { NODE_QUESTIONS } from './stacks/node';
import { EXPRESS_QUESTIONS } from './stacks/express';

export {
  REACT_QUESTIONS,
  JAVA_QUESTIONS,
  JAVASCRIPT_QUESTIONS,
  NODE_QUESTIONS,
  EXPRESS_QUESTIONS
};

export const QUESTIONS_DATA: Question[] = [
  ...REACT_QUESTIONS,
  ...JAVA_QUESTIONS,
  ...JAVASCRIPT_QUESTIONS,
  ...NODE_QUESTIONS,
  ...EXPRESS_QUESTIONS
];
