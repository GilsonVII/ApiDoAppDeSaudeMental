import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './database/connection';
<<<<<<< HEAD
import masterRouter from './routes'; 
=======
import masterRouter from './routes';
import authRoutes from './routes/authRoutes'
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123

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
    console.log(`\n========================================`);
    console.log(`🚀 API AlertaMente rodando no http://localhost:${PORT}`);
    console.log(`========================================\n`);
});