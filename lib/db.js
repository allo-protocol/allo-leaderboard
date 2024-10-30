// lib/db.js
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Create a connection pool
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

// Utility function to load SQL file contents
export function loadQuery(fileName) {
  const filePath = path.join(process.cwd(), 'sql', fileName);
  return fs.readFileSync(filePath, 'utf8'); // Reads the SQL file as a string
}

// Function to run a query with optional parameters
export async function queryDatabase(sql, params = []) {
  try {
    const result = await pool.query(sql, params); // Pass params here
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}



