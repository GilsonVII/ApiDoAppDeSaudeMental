import knex from 'knex';
import { Logger } from '../utils/logger';

export const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'alertamente_db',
  },
  pool: { min: 2, max: 10 } 
});

export const checkConnection = async () => {
    try {
        await db.raw('SELECT 1');
        Logger.info(`✅ Knex conectado ao MySQL em ${process.env.DB_HOST || 'localhost'}!`);
    } catch (error) {
        Logger.error('❌ Erro ao conectar Knex:', error);
        process.exit(1);
    }
};