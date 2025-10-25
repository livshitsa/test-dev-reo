import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || join(__dirname, '../school_scheduler.db');
const SCHEMA_PATH = join(__dirname, '../schema.sql');

try {
  console.log('Running database migrations...');
  console.log(`Database path: ${DB_PATH}`);

  // Create database connection
  const db = new Database(DB_PATH);

  // Read and execute schema
  const schema = readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);

  console.log('Database schema created successfully!');

  // Verify tables
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    ORDER BY name
  `).all();

  console.log('\nTables created:');
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });

  db.close();
  console.log('\nMigration complete!');

} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
