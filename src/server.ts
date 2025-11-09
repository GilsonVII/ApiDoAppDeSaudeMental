import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './database/connection';
import masterRouter from './routes';
import { startScheduler } from './scheduler';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
startScheduler();

app.use(cors()); 
app.use(express.json()); 
app.use('/', masterRouter); 

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 API AlertaMente rodando no http://localhost:${PORT}`);
    console.log(`========================================\n`);
});