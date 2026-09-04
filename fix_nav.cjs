const fs = require('fs');

let dbContent = fs.readFileSync('src/components/DashboardLayout.tsx', 'utf8');

// Replace handleSelectStack
dbContent = dbContent.replace(/const handleSelectStack = \(stack: TechStack\) => \{\s*setSelectedStack\(stack\);\s*setSelectedTopic\('all'\);\s*\};/,
`const handleSelectStack = (stack: TechStack) => {
    navigate(\`/questions/\${stack}\`);
  };`);

// Find <Header ... /> and update props
dbContent = dbContent.replace(/onChangeViewMode=\{setViewMode\}/,
`onChangeViewMode={(mode) => {
          if (mode === 'workflow') navigate(\`/flows/\${backendWorkflowTopic}\`);
          else navigate(\`/questions/\${selectedStack}\`);
        }}`);

dbContent = dbContent.replace(/onSelectBackendWorkflowTopic=\{\(topic\) => setBackendWorkflowTopic\(topic\)\}/,
`onSelectBackendWorkflowTopic={(topic) => navigate(\`/flows/\${topic}\`)}`);

fs.writeFileSync('src/components/DashboardLayout.tsx', dbContent);
console.log('Fixed navigation in DashboardLayout.tsx');
