// /scheduler-app/scripts/migrate.js

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// QUICK SANITY CHECK: log to console to prove it's reading the file
if (!process.env.DATABASE_URL) {
    console.error('❌ ALERT: process.env.DATABASE_URL is undefined! Check your .env.local file placement.');
    process.exit(1);
} else {
    console.log('🔌 Connection string loaded successfully.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('🔄 Starting database migration...');
        // Run inside a transaction for safety
        await client.query('BEGIN');

        // Clean teardown for local testing (Standardized Table Names)
        await client.query(`
            DROP TABLE IF EXISTS bookings CASCADE;
            DROP TABLE IF EXISTS availability CASCADE;
            DROP TABLE IF EXISTS users CASCADE;    
        `);

        // Users Table
        await client.query(`
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                timezone VARCHAR(50) DEFAULT 'UTC' NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP   
            );
        `);

        // Availability Table (Stores rule sets for host working hours)
        await client.query(`
            CREATE TABLE availability (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
                start_time TIME NOT NULL,  -- e.g., '09:00:00'
                end_time TIME NOT NULL,    -- e.g., '17:00:00'
                UNIQUE(user_id, day_of_week)
            );    
        `);

        // Bookings Table
        await client.query(`
            CREATE TABLE bookings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                guest_name VARCHAR(255) NOT NULL,
                guest_email VARCHAR(255) NOT NULL,
                start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                end_time TIMESTAMP WITH TIME ZONE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Seed Initial Test User: Tracy Chacon
        const seedUser = await client.query(`
            INSERT INTO users (name, email, username, timezone)
            VALUES ('Tracy Chacon', 'tracy@example.com', 'tracy', 'America/Chicago')
            RETURNING id;
        `);

        const userId = seedUser.rows[0].id;
        console.log(`👤 Seeded User: Tracy Chacon [ID: ${userId}]`);

        // Seed Availability Rules: Mon - Fri, 9 AM to 5 PM
        for (let day = 1; day <= 5; day++) {
            await client.query(`
                INSERT INTO availability (user_id, day_of_week, start_time, end_time)
                VALUES ($1, $2, '09:00:00', '17:00:00');
                `, [userId, day]
            );
        }
        console.log('📅 Seeded availability schedule: Mon-Fri (09:00 - 17:00)');
        
        await client.query('COMMIT');
        console.log('✅ Migration database setup complete!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed. Transaction rolled back:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();