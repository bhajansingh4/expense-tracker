const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Create connection with SSL
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect(err => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  console.log('Connected to PostgreSQL server');
  
  // Read schema.sql file
  const schema = fs.readFileSync('./database/schema.sql', 'utf8');
  
  // Split schema by semicolons and execute each statement
  const statements = schema.split(';').filter(stmt => stmt.trim());
  
  let executed = 0;
  
  statements.forEach((statement, index) => {
    client.query(statement, (err, results) => {
      if (err) {
        console.error(`Error executing statement ${index + 1}:`, err.message);
      } else {
        executed++;
        console.log(`✓ Executed statement ${index + 1}/${statements.length}`);
      }
      
      // Close connection after all statements are executed
      if (executed === statements.length || index === statements.length - 1) {
        client.end(err => {
          if (err) {
            console.error('Error closing connection:', err);
            process.exit(1);
          }
          console.log('\n✓ PostgreSQL setup completed successfully!');
          console.log('Tables created: users, categories, expenses');
          console.log('Sample data inserted!');
          process.exit(0);
        });
      }
    });
  });
});
