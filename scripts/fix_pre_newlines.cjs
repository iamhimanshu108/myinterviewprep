const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  let inPre = false;
  let newLines = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (line.includes('<pre className="ref-code-pre">')) {
      inPre = true;
      if (line.includes('</pre>')) {
        inPre = false;
      } else {
        if (!line.endsWith('{"\\n"}')) {
          line = line + '{"\\n"}';
        }
      }
      newLines.push(line);
      continue;
    }
    
    if (inPre) {
      if (line.includes('</pre>')) {
        inPre = false;
        newLines.push(line);
      } else {
        // add {\n} to the end of the line if it doesn't have it
        if (!line.endsWith('{"\\n"}') && line.trim().length > 0) {
          line = line + '{"\\n"}';
        }
        // if the line is completely empty, replace it with just {"\n"}
        if (line.trim().length === 0) {
            line = '{"\\n"}';
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
console.log('Fixed JSX newlines in pre tags');
