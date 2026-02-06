// Detailed production diagnostic test
const https = require('https');

const BASE_URL = 'expense-tracker-nxc0.onrender.com';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function diagnose() {
  console.log('🔍 PRODUCTION SERVER DIAGNOSTIC\n');
  
  try {
    // Test signup and get detailed error
    console.log('Testing Signup Endpoint...\n');
    const signupData = {
      name: 'DiagnosticTest',
      email: `diag${Date.now()}@test.com`,
      password: 'Test123456'
    };
    
    const res = await makeRequest('POST', '/api/auth/signup', signupData);
    
    console.log(`Status Code: ${res.status}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}\n`);
    console.log(`Response Body:\n${res.data}\n`);
    
    if (res.status === 500) {
      console.log('❌ SERVER ERROR (500)');
      console.log('\nThis indicates:');
      console.log('1. Server is running but encountered an error');
      console.log('2. Database connection likely failed');
      console.log('3. Production code may not be updated with PostgreSQL changes\n');
      console.log('SOLUTION: Redeploy on Render from the latest commit');
    }
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  }
}

diagnose();
