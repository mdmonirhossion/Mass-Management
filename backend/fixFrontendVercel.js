const fs = require('fs');
const path = require('path');

const frontendVercelPath = path.join(__dirname, '../frontend/vercel.json');
const vercelConfig = {
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://backend-nu-pied-68.vercel.app/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
};

fs.writeFileSync(frontendVercelPath, JSON.stringify(vercelConfig, null, 2), 'utf8');
console.log('frontend/vercel.json updated with framework: vite and outputDirectory: dist!');
