const https = require('https');
const key = 'AIzaSyAjbeRmwze0CEQN__7Of_Y2wCfkSlA1XRg';

async function check(v) {
  return new Promise((resolve) => {
    https.get(`https://generativelanguage.googleapis.com/${v}/models?key=${key}`, (res) => {
      let data = '';
      res.on('data', (d) => data += d);
      res.on('end', () => {
        console.log(`--- Version ${v} (Status: ${res.statusCode}) ---`);
        try {
          const parsed = JSON.parse(data);
          if (parsed.models) {
            console.log('Available Models:', parsed.models.map(m => m.name.split('/').pop()));
          } else {
            console.log('No models found/Error:', parsed.error?.message || data);
          }
        } catch {
          console.log('Response:', data);
        }
        resolve();
      });
    });
  });
}

async function run() {
  await check('v1');
  await check('v1beta');
}

run();
