import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './database/connection';
import masterRouter from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB(); 

app.use(cors());
app.use(express.json());
app.use('/', masterRouter);

app.listen(PORT, () => {
    console.log(`🚀 API rodando no http://localhost:${PORT}`);
});