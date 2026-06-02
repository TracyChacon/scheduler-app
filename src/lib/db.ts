// /scheduler-app/src/lib/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
    user: 'tracy',
    host: 'localhost',
    database: 'scheduler_db', // Ensure this line is exactly here
    port: 5432
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};