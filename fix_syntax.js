const fs = require('fs');

function fixAuthCrudMiddleware(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/},\s*,\s*django:\s*\{/, '},\n      django: {');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

function fixRest(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/},\s*,\s*django:\s*\{/, '},\n      django: {');
  
  // Fix the unterminated template literal in express
  // Currently: express: 'res.setHeader("Location", `/api/orders/${id,\n      django: 'Custom Response header manipulation'}`)',
  // Should be: express: 'res.setHeader("Location", `/api/orders/${id}`)',\n        django: 'Custom Response header manipulation'
  
  content = content.replace(/express:\s*'res\.setHeader\("Location",\s*`\/api\/orders\/\$\{id,\s*django:\s*'Custom Response header manipulation'\}`\)',/, 
    `express: 'res.setHeader("Location", \`/api/orders/\${id}\`)',\n        django: 'Custom Response header manipulation'`);
    
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

// But wait, the file `auth.ts` was ALREADY mangled by replace_file_content!
// I need to RESTORE `auth.ts`, `crud.ts`, `middleware.ts`, `rest.ts`!
