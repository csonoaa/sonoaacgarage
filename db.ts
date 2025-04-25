import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './shared/schema';

// Create a SQLite database for local development
const sqlite = new Database('local.db');

// Create a Drizzle ORM instance
export const db = drizzle(sqlite, { schema });

// Initialize the database with tables if they don't exist
export function initializeDatabase() {
  // This will create tables based on the schema
  // In a real app, you'd use migrations, but for simplicity:
  console.log('Initializing database...');
  
  // Create tables if they don't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS car_valuations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year TEXT NOT NULL,
      trim TEXT,
      body_type TEXT NOT NULL,
      mileage TEXT NOT NULL,
      transmission TEXT NOT NULL,
      drivetrain TEXT NOT NULL,
      exterior_color TEXT NOT NULL,
      vin TEXT,
      drivable TEXT NOT NULL,
      condition TEXT NOT NULL,
      additional_info TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      offer_amount INTEGER NOT NULL,
      offer_expiry TEXT NOT NULL,
      accepted INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('Database initialized successfully');
} 