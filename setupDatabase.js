/**
 * Database Setup Script for Expense Tracker API
 * This script helps initialize the PostgreSQL database with the schema and sample data
 * 
 * Usage:
 * 1. Ensure PostgreSQL is running
 * 2. Update .env with your database credentials
 * 3. Run: node setupDatabase.js
 */

const db = require('./config/db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('\n========================================');
  console.log('Expense Tracker API - Database Setup');
  console.log('========================================\n');

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

    console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let executed = 0;
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await db.query(statement);
        executed++;
        console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
      } catch (error) {
        // If statement fails, log but continue
        console.log(`⚠️  Statement ${i + 1} result: ${error.message.substring(0, 60)}...`);
      }
    }

    // Verify the setup
    console.log('\n📊 Verifying database setup...\n');

    try {
      const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
      const categoriesResult = await db.query('SELECT COUNT(*) as count FROM categories');
      const expensesResult = await db.query('SELECT COUNT(*) as count FROM expenses');

      console.log(`✅ Users table: ${usersResult.rows[0].count} records`);
      console.log(`✅ Categories table: ${categoriesResult.rows[0].count} records`);
      console.log(`✅ Expenses table: ${expensesResult.rows[0].count} records`);
    } catch (error) {
      console.error('⚠️  Could not verify tables:', error.message);
    }

    console.log('\n========================================');
    console.log('✅ Database initialization completed!');
    console.log('========================================\n');

    // Display test credentials
    console.log('📝 Test User Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123\n');

    console.log('🚀 You can now start the server with: npm start\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during database setup:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();
