import { db } from '../src/database/connection'; 

afterAll(async () => {
  await db.destroy(); 
});