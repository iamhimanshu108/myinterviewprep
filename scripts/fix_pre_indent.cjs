const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  let inPre = false;
  let newLines = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if we enter a pre block
    if (line.includes('<pre className="ref-code-pre">')) {
      inPre = true;
      if (line.includes('</pre>')) {
        inPre = false; // single line pre block
      }
      newLines.push(line);
      continue;
    }
    
    if (inPre) {
      if (line.includes('</pre>')) {
        inPre = false;
        newLines.push(line);
      } else {
        // We are inside the pre block.
        // 1. Ensure {"\n"} is at the end. (We already did this, but let's be safe).
        if (!line.endsWith('{"\\n"}') && line.trim().length > 0) {
          line = line + '{"\\n"}';
        }
        if (line.trim().length === 0) {
            line = '{"\\n"}';
        }
        
        // 2. Fix leading spaces.
        // Wait, if we use a regex to capture leading spaces:
        const match = line.match(/^(\s+)(.*)/);
        if (match) {
          const spaces = match[1];
          const rest = match[2];
          // Replace leading spaces with {"    "}
          // Note: we can just do: '{"' + spaces + '"}' + rest
          line = '{"' + spaces + '"}' + rest;
        }
        
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'));
}

fixFile('src/components/AuthCohortNotesViewer.tsx');
fixFile('src/components/RestCohortNotesViewer.tsx');
fixFile('src/components/CrudCohortNotesViewer.tsx');
fixFile('src/components/MiddlewareCohortNotesViewer.tsx');

console.log('Fixed JSX indentation in pre tags for all 4 files!');
