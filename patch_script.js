const fs = require('fs');
let content = fs.readFileSync('sections/cart.liquid', 'utf-8');
// first remove backslashes from the injected CSS
content = content.replace(/\\\n/g, '\n');
fs.writeFileSync('sections/cart.liquid', content);
