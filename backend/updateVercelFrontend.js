const fs = require('fs');
const path = require('path');

const frontendVercelPath = path.join(__dirname, '../frontend/vercel.json');
const vercelContent = JSON.stringify({
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}, null, 2);

fs.writeFileSync(frontendVercelPath, vercelContent, 'utf8');
console.log('frontend/vercel.json created successfully!');
