import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import masterRouter from './routes'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', masterRouter); 

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 API rodando no http://localhost:${PORT}`);
    console.log(`========================================\n`);
});