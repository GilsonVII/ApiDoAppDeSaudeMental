import mysql from 'mysql2/promise'; 

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'alertamente_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`Banco de Dados MySQL conectado com sucesso ao host: ${dbConfig.host}`);
        connection.release(); 
    } catch (error) {
        console.error('ERRO ao conectar ao banco de dados MySQL:', error);
        process.exit(1);
    }
};

export default pool;