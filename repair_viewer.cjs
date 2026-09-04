const fs = require('fs');
let lines = fs.readFileSync('src/components/BackendWorkflowViewer.tsx', 'utf8').split(/\r?\n/);

// Find line index for handleQuizAnswer
const idx = lines.findIndex(l => l.includes('const handleQuizAnswer'));

if (idx !== -1) {
  const insertLines = [
    '  const handleQuizAnswer = (quizId: string, optionIndex: number, isCorrect: boolean) => {',
    '    setQuizResults((prev) => ({',
    '      ...prev,',
    '      [quizId]: { selectedIndex: optionIndex, isCorrect }',
    '    }));',
    '  };',
    '',
    '  const scrollToSection = (id: string) => {',
    '    setActiveSectionId(id);',
    '    setIsSidebarOpen(false);',
    '    const target = document.getElementById(id);',
    '    if (target) {',
    '      target.scrollIntoView({ behavior: "smooth", block: "start" });',
    '    }',
    '  };',
    '',
    '  const currentStep = (currentTopicData?.flowSteps || [])[stepIndex] || (currentTopicData?.flowSteps || [])[0] || { lit: [] };',
    '  const isLit = (elementId: string) => (currentStep.lit || []).includes(elementId);',
    '',
    '  // Group navigation items',
    '  const groupedNav = (currentTopicData?.sections || []).reduce((acc, curr) => {',
    '    if (!acc[curr.group]) acc[curr.group] = [];',
    '    acc[curr.group].push(curr);',
    '    return acc;',
    '  }, {} as Record<string, typeof currentTopicData.sections>);',
    '',
    '  // Dynamic framework details helper based on active topic',
    '  const frameworksList = React.useMemo(() => {',
    '    return Object.entries((currentTopicData?.codebases || {})).map(([key, cb]: [string, any]) => {',
    '      let icon = "⚡";',
    '      if (key === "express") icon = "🟢";'
  ];

  // We want to replace from `handleQuizAnswer` to `if (key === 'express') icon = '🟢';`
  const endIdx = lines.findIndex((l, i) => i > idx && l.includes("if (key === 'express')"));
  
  if (endIdx !== -1) {
    lines.splice(idx, endIdx - idx + 1, ...insertLines);
    fs.writeFileSync('src/components/BackendWorkflowViewer.tsx', lines.join('\n'));
    console.log('Successfully spliced BackendWorkflowViewer');
  } else {
    console.log('Could not find end index');
  }
} else {
  console.log('Could not find start index');
}
