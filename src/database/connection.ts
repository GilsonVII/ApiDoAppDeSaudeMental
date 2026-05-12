import knex from 'knex';
import { Logger } from '../utils/logger';

export const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1', 
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'safehome_db', 
  },
  pool: { 
    min: 2, 
    max: 10 
  } 
});

export const checkConnection = async () => {
    try {
        await db.raw('SELECT 1');
        Logger.info(`✅ Banco de Dados conectado com sucesso! (SafeHome V2)`);
    } catch (error) {
        Logger.error('❌ Falha crítica ao conectar no Banco de Dados:', error);
        process.exit(1);
    }
};
