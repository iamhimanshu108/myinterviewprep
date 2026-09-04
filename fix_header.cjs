const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

const missingImports = `import React from 'react';
import { TechStack, ViewMode, BackendWorkflowTopic } from '../types';
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  Layers, 
  Bookmark, 
  X,
  Workflow,
  Globe,
`;

content = missingImports + content;
fs.writeFileSync('src/components/Header.tsx', content);
console.log('Fixed Header.tsx');
