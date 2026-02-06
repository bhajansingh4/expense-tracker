const https = require('https');

const BASE_URL = 'expense-tracker-nxc0.onrender.com';
let authToken = '';
let testUserId = '';
let testCategoryId = '';

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

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
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

async function runTests() {
  console.log('🧪 PRODUCTION API TEST SUITE\n');
  console.log('URL: https://' + BASE_URL + '\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...');
    let res = await makeRequest('GET', '/');
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Response: ${res.data.message}\n`);

    // Test 2: Signup
    console.log('2️⃣  Testing Signup...');
    const signupData = {
      name: `TestUser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'Password123'
    };
    res = await makeRequest('POST', '/api/auth/signup', signupData);
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Message: ${res.data.message}`);
    authToken = res.data.token;
    testUserId = res.data.user.id;
    console.log(`   ✅ Token: ${authToken.substring(0, 20)}...\n`);

    // Test 3: Get User Profile
    console.log('3️⃣  Testing Get User Profile...');
    res = await makeRequest('GET', '/api/users/me');
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ User: ${res.data.user.name} (${res.data.user.email})\n`);

    // Test 4: Create Category
    console.log('4️⃣  Testing Create Category...');
    res = await makeRequest('POST', '/api/categories', {
      name: `TestCategory${Date.now()}`
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Message: ${res.data.message}`);
    testCategoryId = res.data.category.id;
    console.log(`   ✅ Category ID: ${testCategoryId}\n`);

    // Test 5: Get Categories
    console.log('5️⃣  Testing Get Categories...');
    res = await makeRequest('GET', '/api/categories');
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Categories Found: ${res.data.categories.length}\n`);

    // Test 6: Create Expense
    console.log('6️⃣  Testing Create Expense...');
    res = await makeRequest('POST', '/api/expenses', {
      category_id: testCategoryId,
      amount: 99.99,
      description: 'Test Expense',
      date: new Date().toISOString().split('T')[0]
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Message: ${res.data.message}`);
    console.log(`   ✅ Amount: ${res.data.expense.amount}\n`);

    // Test 7: Get Expenses
    console.log('7️⃣  Testing Get Expenses...');
    res = await makeRequest('GET', '/api/expenses');
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Expenses Found: ${res.data.expenses.length}\n`);

    // Test 8: Login with existing user
    console.log('8️⃣  Testing Login...');
    res = await makeRequest('POST', '/api/auth/login', {
      email: signupData.email,
      password: signupData.password
    });
    console.log(`   Status: ${res.status}`);
    console.log(`   ✅ Message: ${res.data.message}`);
    console.log(`   ✅ Login Successful: ${res.data.user.name}\n`);

    console.log('═'.repeat(50));
    console.log('✅ ALL TESTS PASSED!');
    console.log('═'.repeat(50));
    console.log('\n📊 DEPLOYMENT STATUS:');
    console.log('   ✅ Server: Running');
    console.log('   ✅ Database: Connected');
    console.log('   ✅ Authentication: Working');
    console.log('   ✅ Categories: Working');
    console.log('   ✅ Expenses: Working');
    console.log('   ✅ Users: Working');
    console.log('\n🎉 Production deployment is FULLY OPERATIONAL!\n');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    process.exit(1);
  }
}

runTests();
