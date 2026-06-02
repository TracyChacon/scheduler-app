// /scheduler-app/src/actions/bookings.ts
'use server';

import { pool } from '@/lib/db'

interface BookingInput {
    userId: string;
    guestName: string;
    guestEmail: string;
    // ISO string from frontend, e.g., '2026-06-02T10:00:00.000Z'
    startTimeIso: string;
    durationMinutes: number;
}

// ========================================================================================
// LAYER 1: APP-TIER DISTRIBUTED LOCK REGISTRY (In-Memory)
// ========================================================================================
// Because Node caches the memory layout of files outside of individual function execution scopes, we can
// maintain a fast, synchronized local lock registry directly in our server environment. If scaled to 
// millions of users later, we only have to swap out that localized JavaScript object for a Redis 
// connection string.
// Swap this object out for a redis client if moving to multiple servers later.
const localLockRegistry = new Set<string>();

export async function createBooking(data: BookingInput) {
    // 1. Data Sanitization & Basic Validation
    const guestName = data.guestName.trim();
    const guestEmail = data.guestEmail.trim().toLowerCase();
    const start = new Date(data.startTimeIso);
    // Calculate the end time based on the duration
    const end = new Date(start.getTime() + data.durationMinutes * 60000);

    if (!guestName || !guestEmail.includes('@')) {
        return { success: false, error: 'Invalid name or email format.'};
    }

    if (isNaN(start.getTime())) {
        return { success: false, error: 'Malformed timestamp provided.'};
    }

    if (start < new Date()) {
        return { success: false, error: 'Cannot book a meeting in the past.'}
    }


    // Generate the unique, atomic lock key for this specific slot
    const slotLockKey = `lock:${data.userId}:${start.toISOString()}`;

    // Evaluate the App-Layer Gatekeeper
    if (localLockRegistry.has(slotLockKey)) {
        // Thousands of chaotic overlapping clicks are rejected here in <1ms
        return { success: false, error: 'This time slot is currently being processed. Please try again.'}
    }

    // Acquire the lock key locally
    localLockRegistry.add(slotLockKey);

    // Establish the database client for Layer 2
    const client = await pool.connect();

    try {
        // =======================================================================================
        // LAYER 2: DB-TIER ROW LOCKING (Fast READ COMMITTED Isolation)
        // =======================================================================================
        console.log(`🔒 Gatekeeper key [${slotLockKey}] acquired. Opening high-speed DB transaction...\n`)


        await client.query('BEGIN');

        

        // Validate Against the Host's Availability Rules
        // Extract UTC day (0=Sunday, 6=Saturday) and format the HH:MM:SS time string
        const dayOfWeek = start.getUTCDay();
        const timeString = start.toISOString().substring(11, 19);

        const availabilityCheck = await client.query(
            `SELECT start_time, end_time
            FROM availability
            WHERE user_id = $1 AND day_of_week = $2
            FOR UPDATE`,
            [data.userId, dayOfWeek]
        );

        if(availabilityCheck.rows.length === 0) {
            throw new Error('The host is not available on this day of the week.');
        }

        const { start_time: hostStart, end_time: hostEnd } = availabilityCheck.rows[0];
        if (timeString < hostStart || timeString >= hostEnd) {
            throw new Error('The requested time falls outside the host hours.');
        }

        // Concurrency Protection: Prevent Overlapping Bookings
        // Formula to detect scheduling conflicts: (StartA < EndB) AND (EndA > StartB)
        const overlapCheck = await client.query(
            `SELECT id FROM bookings 
            WHERE user_id = $1
            AND ($2 < end_time AND $3 > start_time)`,
            [data.userId, start.toISOString(), end.toISOString()] 
        );

        if (overlapCheck.rows.length > 0) {
            throw new Error('This time slot has already been claimed.');
        }

        const insertResult = await client.query(
            `INSERT INTO bookings (user_id, guest_name, guest_email, start_time, end_time)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
            [data.userId, guestName, guestEmail, start.toISOString(), end.toISOString()]
        )

        await client.query('COMMIT');
        console.log(`✅ Slot locked, verified, and committed safely to disk.\n`);
        return { success: true, bookingId: insertResult.rows[0].id };

    } catch(error: any) {
        await client.query('ROLLBACK');
        console.error(`❌ Transaction rolled back due to safety breach: ${error.message}\n`);
        return { success: false, error: error.message || 'Internal database exception.' };
    }finally {
        client.release();
        localLockRegistry.delete(slotLockKey);
    }

}