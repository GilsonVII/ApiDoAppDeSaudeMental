import dotenv from 'dotenv';
import path from 'path';
import { Logger } from '../src/utils/logger';

export default async () => {
  
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  Logger.info('GlobalSetup: Variáveis .env carregadas para os testes.');
};