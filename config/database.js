const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((connection) => {
    console.log('CONECTADO ao banco de dados MySQL (loja)');
    connection.release(); 
  })
  .catch((err) => {
    console.log('ERRO ao conectar com o MySQL:', err.message);
  });

module.exports = pool;