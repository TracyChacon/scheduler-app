// /scheduler-app/src/lib/db.ts
import { Pool } from 'pg';



// Create a reusable pool client using our environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// A clean helper function to execure queries safely
export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};

