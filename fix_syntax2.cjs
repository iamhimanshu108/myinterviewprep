const fs = require('fs');

function fix(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/},\s*,\s*django:\s*\{/g, '},\n      django: {');
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
}

['src/data/workflows/crud.ts', 'src/data/workflows/middleware.ts'].forEach(fix);

let rest = fs.readFileSync('src/data/workflows/rest.ts', 'utf8');
rest = rest.replace(/},\s*,\s*django:\s*\{/g, '},\n      django: {');
rest = rest.replace(/express:\s*'res\.setHeader\("Location",\s*`\/api\/orders\/\$\{id,\s*django:\s*'Custom Response header manipulation'\}`\)',/, 
  "express: 'res.setHeader(\"Location\", `/api/orders/${id}`)',\n        django: 'Custom Response header manipulation'");
fs.writeFileSync('src/data/workflows/rest.ts', rest);
console.log('Fixed rest');
