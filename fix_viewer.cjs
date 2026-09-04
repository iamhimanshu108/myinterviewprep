const fs = require('fs');

// 1. Fix DashboardLayout to validate topicId
let dbContent = fs.readFileSync('src/components/DashboardLayout.tsx', 'utf8');
dbContent = dbContent.replace(/import \{ TechStack, ViewMode, Question, Difficulty, BackendWorkflowTopic \} from '\.\.\/types';/, "import { TechStack, ViewMode, Question, Difficulty, BackendWorkflowTopic } from '../types';\nimport { BACKEND_WORKFLOWS } from '../data/backendWorkflowsData';");

const effectReplacement = `
  useEffect(() => {
    if (topicId) {
      if (BACKEND_WORKFLOWS[topicId]) {
        setViewMode('workflow');
        setBackendWorkflowTopic(topicId as BackendWorkflowTopic);
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else if (stackId) {
      setViewMode('questions');
      setSelectedStack(stackId as TechStack);
    }
  }, [topicId, stackId, navigate]);
`;
dbContent = dbContent.replace(/useEffect\(\(\) => \{\n    if \(topicId\) \{\n      setViewMode\('workflow'\);\n      setBackendWorkflowTopic\(topicId as BackendWorkflowTopic\);\n    \} else if \(stackId\) \{\n      setViewMode\('questions'\);\n      setSelectedStack\(stackId as TechStack\);\n    \}\n  \}, \[topicId, stackId\]\);/g, effectReplacement);
fs.writeFileSync('src/components/DashboardLayout.tsx', dbContent);


// 2. Fix BackendWorkflowViewer to handle undefined currentTopicData gracefully
let viewerContent = fs.readFileSync('src/components/BackendWorkflowViewer.tsx', 'utf8');

viewerContent = viewerContent.replace(/const currentTopicData: WorkflowTopicData = BACKEND_WORKFLOWS\[selectedTopic\];/, 'const currentTopicData: WorkflowTopicData | undefined = BACKEND_WORKFLOWS[selectedTopic];');

viewerContent = viewerContent.replace(/currentTopicData\.flowSteps\.length/g, '(currentTopicData?.flowSteps?.length || 1)');
viewerContent = viewerContent.replace(/currentTopicData\.sections/g, '(currentTopicData?.sections || [])');
viewerContent = viewerContent.replace(/currentTopicData\.codebases/g, '(currentTopicData?.codebases || {})');
viewerContent = viewerContent.replace(/currentTopicData\.title/g, '(currentTopicData?.title || "")');
viewerContent = viewerContent.replace(/currentTopicData\.subtitle/g, '(currentTopicData?.subtitle || "")');
viewerContent = viewerContent.replace(/currentTopicData\.tagline/g, '(currentTopicData?.tagline || "")');
viewerContent = viewerContent.replace(/currentTopicData\.tags/g, '(currentTopicData?.tags || [])');
viewerContent = viewerContent.replace(/currentTopicData\.accentColor/g, '(currentTopicData?.accentColor || "")');
viewerContent = viewerContent.replace(/currentTopicData\.comparisonPoints/g, '(currentTopicData?.comparisonPoints || [])');
viewerContent = viewerContent.replace(/currentTopicData\.bestPractices/g, '(currentTopicData?.bestPractices || [])');
viewerContent = viewerContent.replace(/currentTopicData\.commonMistakes/g, '(currentTopicData?.commonMistakes || [])');
viewerContent = viewerContent.replace(/currentTopicData\.quiz/g, '(currentTopicData?.quiz)');
viewerContent = viewerContent.replace(/currentTopicData\.flowSteps/g, '(currentTopicData?.flowSteps || [])');

// Add early return for missing topic so the UI doesn't look completely empty, but we must do it after hooks!
// The hooks are at the top. Let's find the `return (` statement.
viewerContent = viewerContent.replace(/return \(\n    <div className="flex flex-col md:flex-row min-h-screen/, "if (!currentTopicData) { return <div className=\\\"flex flex-col min-h-screen bg-slate-950 items-center justify-center text-slate-400\\\">Topic not found</div>; }\n\n  return (\n    <div className=\\\"flex flex-col md:flex-row min-h-screen");

fs.writeFileSync('src/components/BackendWorkflowViewer.tsx', viewerContent);
console.log('Fixed undefined topic data bugs');
