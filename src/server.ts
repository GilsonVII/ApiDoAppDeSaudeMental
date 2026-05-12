import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { checkConnection } from './database/connection'; 
import masterRouter from './routes';
import { Logger } from './utils/logger';
import { startScheduler } from './scheduler'; 

const app = express();
const PORT = process.env.PORT || 3000;

checkConnection();

app.use(cors());
app.use(express.json());


app.use('/', masterRouter);

startScheduler();

app.listen(PORT, () => {
    Logger.info(`\n========================================`);
    Logger.info(`🏠 API SafeHome rodando no http://localhost:${PORT}`);
    Logger.info(`========================================\n`);
});
