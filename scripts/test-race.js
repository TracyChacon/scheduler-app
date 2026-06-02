// /scheduler-app/scripts/test-race.js
const { createBooking } = require('../src/actions/bookings');
const { pool } = require('../src/lib/db');

// Helper function to calculate a target slot at least 5 days ahead on a weekday
function getFutureWeekdayIsoString(daysAhead=6) {
    const date = new Date();

    date.setDate(date.getDate() + daysAhead);

    const day = date.getDay();

    if (day === 0) {
        date.setDate(date.getDate() +1);
    } else if (day === 6) {
        date.setDate(date.getDate() + 2);
    }

    date.setUTCHours(15, 0, 0, 0);

    return date.toISOString();
};


async function simulateDoubleBookingAttack() {
    const userLookup = await pool.query(
        `SELECT id
        FROM users
        WHERE username = 'tracy'
        LIMIT 1;
        `
    );

    if(userLookup.rows.length === 0) {
        console.error("❌ ERROR: Could not find user 'tracy' in the database. Run your migration script first!\n");

        process.exit(1);
    };

    const liveUserId = userLookup.rows[0].id;
    const targetSlot = getFutureWeekdayIsoString();
    // Reusable mock data utilizing verified seed database user ID
    const mockBookingPayload = {
        userId: liveUserId, 
        guestName: 'Attacking Competitor',
        guestEmail: 'attacker@example.com',
        startTimeIso: targetSlot,
        durationMinutes: 30
    }
    const attackBatch = [
        createBooking({ ...mockBookingPayload, guestName: 'Guest Alpha '}),
        createBooking({ ...mockBookingPayload, guestName: 'Guest Beta'})
    ];
    const [response1, response2] = await Promise.all(attackBatch);

    let createdBookingId = null;

    console.log('⚠️ INITIALIZING SIMULATED CONCURRENT ATTACK...\n');
    console.log(`📡 Target Host Verified: tracy [ID: ${liveUserId}] \n`);
    console.log(`📅 Targeting Slot (Dynamic): ${targetSlot}\n`);
    console.log('🧨 Firing parallel requests simultaneously into the server action layer...\n');

    if (response1.success !== response2.success) {
        createdBookingId = response1.success ? response1.bookingId : response2.bookingId;

        console.log('✅ SYSTEM IMMUNITY VERIFIED: The gatekeeper cleanly intercepted the race condition.\n');
        console.log('Only 1 request was written to disk; the concurrent collision was discarded.\n');
    } else if (response1.success && response2.success) {
        createdBookingId = [response1.bookingId, response2.bookingId];
        console.log('☢️ VULNERABILITY DETECTED: Both requests succeeded. Double-booking allowed!\n');
    } else {
        console.log('⁉️ Both requests failed. Inspect the database error messages above.\n');
        console.log('💡 TIP: If the slot was already claimed from a previous test run, manually delete it or rerun migrate.js.');
    }
    // =========================================================================
    // AUTOMATED TEARDOWN LAYER
    // =========================================================================
    if (createdBookingId) {
        console.log('🧹 Cleaning up database state for next execution loop...\n');

        try {
            if (Array.isArray(createdBookingId)) {
                await pool.query(
                    `DELETE FROM bookings
                    WHERE id = ANY($1),
                    [createdBookingId]`
                );
            } else {
                await pool.query(`
                    DELETE FROM bookings
                    WHERE id = $1;`,
                    [createdBookingId]
                );
            }

            console.log('🗑️ Test booking slot cleared from database. State is pristine! ✨\n');
        } catch (cleanupError) {
            console.error(`Cleanup failed to remove test row: ${cleanupError.message}\n`);
        }
    }
    // Force script exit since the db connection pool keeps the process alive
    process.exit(0);
}

simulateDoubleBookingAttack();