import mysql from 'mysql2/promise';

import { config } from '../config/index';

export const db = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    port: Number(config.DB_PORT)
});

