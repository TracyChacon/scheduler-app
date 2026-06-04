// src/app/test-db/page.tsx
import { pool } from '@/lib/db';

export default async function TestDbPage() {
    let status = 'Pending';
    let dbTime = '';
    let errorMessage = '';

    try {
        // Execute a quick low-overhead timestamp query to verify connectivity
        const res = await pool.query("SELECT NOW();");
        status = 'Success';
        dbTime = res.rows[0].now.toString();
    } catch (error: any) {
        status = 'Failed';
        errorMessage = error.message
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <h1 className="text-2xl font-bold tracking-tight mb-4 text-center">
                    📺 Docker Network Connection Monitor
                </h1>

                <hr className="border-slate-800 my-4" />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">
                            Network Link Status
                        </span>
                        {/* ✨ FIX 2: Extracted static 'border' out of the dynamic template template string block */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border ${
                            status === 'Success'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                        >
                            {status}
                        </span>
                    </div>

                    {status === 'Success' ? (
                        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                Database System Time (UTC)
                            </p>
                            <p className="text-sm font-mono text-emerald-300 break-all">
                                {dbTime}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-rose-950/20 rounded-lg p-3 border border-rose-950/50">
                            <p className="text-xs text-rose-400 uppercase tracking-wider mb-1 font-semibold">
                                Error Log Output
                            </p>
                            <p className="text-sm font-mono text-rose-300 wrap-break-word">
                                {errorMessage}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}