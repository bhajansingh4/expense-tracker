const https = require('https');

const BASE_URL = 'expense-tracker-nxc0.onrender.com';

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('🧪 CATEGORY ENDPOINT DEBUG\n');
  
  try {
    // Step 1: Signup
    console.log('Step 1: Creating test user...');
    const signupRes = await makeRequest('POST', '/api/auth/signup', {
      name: `TestUser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'Password123'
    });
    console.log(`Status: ${signupRes.status}`);
    
    const token = signupRes.data.token;
    const userId = signupRes.data.user.id;
    console.log(`✅ User created. ID: ${userId}`);
    console.log(`✅ Token: ${token.substring(0, 20)}...\n`);

    // Step 2: Verify user profile
    console.log('Step 2: Verifying user profile...');
    const profileRes = await makeRequest('GET', '/api/users/me', null, token);
    console.log(`Status: ${profileRes.status}`);
    console.log(`✅ Profile: ${profileRes.data.user.name}\n`);

    // Step 3: Create category (the failing endpoint)
    console.log('Step 3: Creating category...');
    console.log(`Token: ${token.substring(0, 20)}...`);
    console.log(`Authorization header format: Bearer ${token.substring(0, 20)}...\n`);
    
    const categoryRes = await makeRequest('POST', '/api/categories', {
      name: `TestCat${Date.now()}`
    }, token);
    
    console.log(`Status: ${categoryRes.status}`);
    console.log(`Response:`, JSON.stringify(categoryRes.data, null, 2));
    
    if (categoryRes.status === 500) {
      console.log('\n❌ ERROR ANALYSIS:');
      console.log('Status 500 means server error');
      console.log('Check Render logs for detailed error');
      console.log('\nPossible causes:');
      console.log('1. Token not properly formatted in request');
      console.log('2. Auth middleware not recognizing token');
      console.log('3. Database query error in categories route');
    } else if (categoryRes.status === 201) {
      console.log('\n✅ SUCCESS! Category created');
      console.log(`Category ID: ${categoryRes.data.category.id}`);
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

test();
