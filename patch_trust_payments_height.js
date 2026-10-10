const fs = require('fs');
let content = fs.readFileSync('snippets/trust-payments.liquid', 'utf-8');
content = content.replace(/margin-top: 1\.5rem;/g, 'margin-top: 1rem;');
content = content.replace(/padding: 1\.25rem;/g, 'padding: 0.85rem;');
content = content.replace(/margin-bottom: 1\.25rem;/g, 'margin-bottom: 0.75rem;');
fs.writeFileSync('snippets/trust-payments.liquid', content);
