import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path from environment or default
const DB_PATH = process.env.DATABASE_PATH || join(__dirname, '../../database/school_scheduler.db');

// Create database connection
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Configure for better performance
db.pragma('journal_mode = WAL');

console.log(`Database connected: ${DB_PATH}`);

export default db;
