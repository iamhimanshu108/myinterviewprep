const fs = require('fs');
const file = 'src/data/backendWorkflowsData.ts';
let data = fs.readFileSync(file, 'utf8');

// Update type definition
data = data.replace(
  /group: 'Foundations' \| 'Lifecycle' \| 'Architecture' \| 'Implementation' \| 'Wrap up';/,
  "group: 'Phase 1: Beginner' | 'Phase 2: Intermediate' | 'Phase 3: Advanced' | 'Phase 4: Expert' | 'Phase 5: Mastery';"
);

// Update all occurrences in the file
data = data.replace(/group: 'Foundations'/g, "group: 'Phase 1: Beginner'");
data = data.replace(/group: 'Lifecycle'/g, "group: 'Phase 2: Intermediate'");
data = data.replace(/group: 'Architecture'/g, "group: 'Phase 3: Advanced'");
data = data.replace(/group: 'Implementation'/g, "group: 'Phase 4: Expert'");
data = data.replace(/group: 'Wrap up'/g, "group: 'Phase 5: Mastery'");

fs.writeFileSync(file, data);
console.log('Successfully updated phases');
