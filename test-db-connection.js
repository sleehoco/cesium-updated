// Quick test script
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
  console.log('❌ Usage: node test-db-connection.js "postgresql://..."');
  process.exit(1);
}

console.log('Testing database connection...\n');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

client`SELECT 1 as test, current_database() as db, version() as pg_version`
  .then((result) => {
    console.log('✅ Connection successful!\n');
    console.log('Database:', result[0].db);
    console.log('PostgreSQL Version:', result[0].pg_version.split(' ')[0], result[0].pg_version.split(' ')[1]);
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Connection failed!\n');
    console.log('Error:', err.message);
    process.exit(1);
  });
