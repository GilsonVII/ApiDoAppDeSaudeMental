import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './database/connection';
import masterRouter from './routes';
import authRoutes from './routes/authRoutes'

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

connectDB(); 

app.use(cors());
app.use(express.json());
app.use('/', masterRouter);
app.use(express.json());
app.use('/v1/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`🚀 API rodando no http://localhost:${PORT}`);
});