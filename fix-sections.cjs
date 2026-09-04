const fs = require('fs');
const file = 'src/data/backendWorkflowsData.ts';
let data = fs.readFileSync(file, 'utf8');

// I need to replace the entire `sections: [...]` block for each topic with exactly 5 sections that match the phases and UI blocks.
const sectionsRegex = /sections:\s*\[[\s\S]*?\],/g;

// I will dynamically construct the 5 sections for each topic based on the topic ID.
// Wait, the regex matches the array, but I need to extract the topic ID.
// Instead, let's just parse the file as AST? No, regex is fine if I match the topic id before it.
// Actually, it's easier to modify the file directly since there are 7 topics. I'll just write the regex replacements.

data = data.replace(
  /crud: \{[\s\S]*?sections:\s*\[[\s\S]*?\],/,
  (match) => match.replace(/sections:\s*\[[\s\S]*?\],/, `sections: [
      { id: 'crud-01', num: 1, label: 'Core Concept & Architecture', group: 'Phase 1: Beginner' },
      { id: 'crud-04', num: 2, label: 'Interactive Request Lifecycle', group: 'Phase 2: Intermediate' },
      { id: 'crud-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'crud-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'crud-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],`)
);

data = data.replace(
  /auth: \{[\s\S]*?sections:\s*\[[\s\S]*?\],/,
  (match) => match.replace(/sections:\s*\[[\s\S]*?\],/, `sections: [
      { id: 'auth-01', num: 1, label: 'The Problem: Statelessness', group: 'Phase 1: Beginner' },
      { id: 'auth-04', num: 2, label: 'Token Lifecycle & Security Flow', group: 'Phase 2: Intermediate' },
      { id: 'auth-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'auth-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'auth-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],`)
);

data = data.replace(
  /rest: \{[\s\S]*?sections:\s*\[[\s\S]*?\],/,
  (match) => match.replace(/sections:\s*\[[\s\S]*?\],/, `sections: [
      { id: 'rest-01', num: 1, label: 'REST Core Principles', group: 'Phase 1: Beginner' },
      { id: 'rest-04', num: 2, label: 'Interactive REST Dispatcher', group: 'Phase 2: Intermediate' },
      { id: 'rest-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'rest-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'rest-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],`)
);

data = data.replace(
  /middleware: \{[\s\S]*?sections:\s*\[[\s\S]*?\],/,
  (match) => match.replace(/sections:\s*\[[\s\S]*?\],/, `sections: [
      { id: 'middleware-01', num: 1, label: 'Middleware Interception', group: 'Phase 1: Beginner' },
      { id: 'middleware-04', num: 2, label: 'Interactive Middleware Pipeline', group: 'Phase 2: Intermediate' },
      { id: 'middleware-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'middleware-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'middleware-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],`)
);

data = data.replace(
  /react: \{[\s\S]*?sections:\s*\[[\s\S]*?\],/,
  (match) => match.replace(/sections:\s*\[[\s\S]*?\],/, `sections: [
      { id: 'react-01', num: 1, label: 'React Rendering Concepts', group: 'Phase 1: Beginner' },
      { id: 'react-04', num: 2, label: 'Interactive Component Lifecycle', group: 'Phase 2: Intermediate' },
      { id: 'react-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'react-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'react-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],`)
);

data = data.replace(
  /'react-native': \{[\s\S]*?sections:\s*\[[\s\S]*?\],/,
  (match) => match.replace(/sections:\s*\[[\s\S]*?\],/, `sections: [
      { id: 'react-native-01', num: 1, label: 'Mobile Architecture Shift', group: 'Phase 1: Beginner' },
      { id: 'react-native-04', num: 2, label: 'Interactive Native Bridge', group: 'Phase 2: Intermediate' },
      { id: 'react-native-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'react-native-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'react-native-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],`)
);

data = data.replace(
  /devops: \{[\s\S]*?sections:\s*\[[\s\S]*?\],/,
  (match) => match.replace(/sections:\s*\[[\s\S]*?\],/, `sections: [
      { id: 'devops-01', num: 1, label: 'CI/CD Automation', group: 'Phase 1: Beginner' },
      { id: 'devops-04', num: 2, label: 'Interactive Deployment Pipeline', group: 'Phase 2: Intermediate' },
      { id: 'devops-06', num: 3, label: 'Real-World Implementations', group: 'Phase 3: Advanced' },
      { id: 'devops-09', num: 4, label: 'Architectural Comparison', group: 'Phase 4: Expert' },
      { id: 'devops-10', num: 5, label: 'Knowledge Check & Pitfalls', group: 'Phase 5: Mastery' },
    ],`)
);

fs.writeFileSync(file, data);
console.log('Successfully aligned sections to 5 phases');
