import { Pool } from 'pg';
import config from './config.js';

const pool = new Pool({
    user: config.DB.USER,
    host: config.DB.HOST,
    database: config.DB.DATABASE,
    password: config.DB.PASSWORD,
    port: config.DB.PORT,
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;