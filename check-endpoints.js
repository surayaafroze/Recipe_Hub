const fs = require('fs'); 
const content = fs.readFileSync('node_modules/better-auth/dist/plugins/jwt/index.mjs', 'utf8'); 
const m = content.match(/createAuthEndpoint\(['"`].*?['"`]/g); 
console.log(m);
