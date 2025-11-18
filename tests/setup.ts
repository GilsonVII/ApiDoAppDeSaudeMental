import pool from '../src/database/connection';

afterAll(async () => {
  await pool.end();
});