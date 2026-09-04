const fs = require('fs');
let content = fs.readFileSync('src/components/BackendWorkflowViewer.tsx', 'utf8');

const targetStr = `  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setIsSidebarOpen(false);
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, WorkflowTopicData['sections']>);`;

const correctStr = `  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    setIsSidebarOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentStep = (currentTopicData?.flowSteps || [])[stepIndex] || (currentTopicData?.flowSteps || [])[0] || { lit: [] };
  const isLit = (elementId: string) => currentStep.lit.includes(elementId);

  // Group navigation items
  const groupedNav = (currentTopicData?.sections || []).reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, WorkflowTopicData['sections']>);`;

content = content.replace(targetStr, correctStr);
fs.writeFileSync('src/components/BackendWorkflowViewer.tsx', content);
console.log('Fixed BackendWorkflowViewer.tsx');
