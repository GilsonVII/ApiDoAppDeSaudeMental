import dotenv from 'dotenv';
import path from 'path';

export default async () => {
  
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  console.log('GlobalSetup: Variáveis .env carregadas para os testes.');
};