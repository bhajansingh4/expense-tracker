const db = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.query('DELETE FROM exp_expenses');
    await db.query('DELETE FROM exp_categories');
    await db.query('DELETE FROM exp_users');

    // Create test users
    console.log('👥 Creating test users...');
    const salt = await bcrypt.genSalt(10);
    
    const user1Password = await bcrypt.hash('password123', salt);
    const user1Result = await db.query(
      'INSERT INTO exp_users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
      ['John Doe', 'john@example.com', user1Password]
    );
    const user1Id = user1Result.rows[0].id;
    console.log(`✅ Created user: ${user1Result.rows[0].email}`);

    const user2Password = await bcrypt.hash('password123', salt);
    const user2Result = await db.query(
      'INSERT INTO exp_users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
      ['Jane Smith', 'jane@example.com', user2Password]
    );
    const user2Id = user2Result.rows[0].id;
    console.log(`✅ Created user: ${user2Result.rows[0].email}`);

    // Create categories for user 1
    console.log('\n🏷️  Creating categories for user 1...');
    const categories1 = [
      { name: 'Food & Dining' },
      { name: 'Transportation' },
      { name: 'Entertainment' },
      { name: 'Utilities' },
      { name: 'Shopping' },
      { name: 'Health & Medical' },
      { name: 'Education' },
      { name: 'Travel' }
    ];

    const categoryIds1 = [];
    for (const category of categories1) {
      const result = await db.query(
        'INSERT INTO exp_categories (name, user_id) VALUES ($1, $2) RETURNING id',
        [category.name, user1Id]
      );
      categoryIds1.push(result.rows[0].id);
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create categories for user 2
    console.log('\n🏷️  Creating categories for user 2...');
    const categoryIds2 = [];
    for (const category of categories1) {
      const result = await db.query(
        'INSERT INTO exp_categories (name, user_id) VALUES ($1, $2) RETURNING id',
        [category.name, user2Id]
      );
      categoryIds2.push(result.rows[0].id);
    }

    // Seed expenses for user 1
    console.log('\n💰 Creating expenses for user 1...');
    const expensesData1 = [
      { categoryIndex: 0, amount: 25.50, description: 'Lunch at Italian Restaurant', daysAgo: 5 },
      { categoryIndex: 1, amount: 15.00, description: 'Uber ride to office', daysAgo: 4 },
      { categoryIndex: 2, amount: 40.00, description: 'Movie tickets', daysAgo: 3 },
      { categoryIndex: 3, amount: 120.00, description: 'Monthly electricity bill', daysAgo: 2 },
      { categoryIndex: 4, amount: 89.99, description: 'Winter jacket purchase', daysAgo: 1 },
      { categoryIndex: 5, amount: 35.00, description: 'Doctor visit copay', daysAgo: 0 },
      { categoryIndex: 0, amount: 12.50, description: 'Coffee and breakfast', daysAgo: 0 },
      { categoryIndex: 6, amount: 150.00, description: 'Online course subscription', daysAgo: 6 },
      { categoryIndex: 7, amount: 250.00, description: 'Weekend hotel stay', daysAgo: 7 },
      { categoryIndex: 1, amount: 45.00, description: 'Gas for car', daysAgo: 2 }
    ];

    for (const expense of expensesData1) {
      const date = new Date();
      date.setDate(date.getDate() - expense.daysAgo);
      
      await db.query(
        'INSERT INTO exp_expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5)',
        [user1Id, categoryIds1[expense.categoryIndex], expense.amount, expense.description, date.toISOString().split('T')[0]]
      );
      console.log(`✅ Created expense: $${expense.amount} - ${expense.description}`);
    }

    // Seed expenses for user 2
    console.log('\n💰 Creating expenses for user 2...');
    const expensesData2 = [
      { categoryIndex: 0, amount: 30.00, description: 'Dinner out', daysAgo: 2 },
      { categoryIndex: 2, amount: 50.00, description: 'Concert tickets', daysAgo: 1 },
      { categoryIndex: 3, amount: 100.00, description: 'Internet bill', daysAgo: 0 }
    ];

    for (const expense of expensesData2) {
      const date = new Date();
      date.setDate(date.getDate() - expense.daysAgo);
      
      await db.query(
        'INSERT INTO exp_expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5)',
        [user2Id, categoryIds2[expense.categoryIndex], expense.amount, expense.description, date.toISOString().split('T')[0]]
      );
      console.log(`✅ Created expense: $${expense.amount} - ${expense.description}`);
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('User 1: john@example.com / password123');
    console.log('User 2: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
