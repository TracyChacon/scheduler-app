// / src/app/dashboard/layout.tsx
import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}:{
    children: React.ReactNode;
}) {
    return (
        <div className='"min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans'>

            {/* Sidbar Navigation Rail */}
            <aside className='w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between'>
                <div className="space-y-8">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase ">
                            Scheduler Engine
                        </span>
                        <h2 className='text-xl font-extrabold text-slate-200 mt-1'>
                            Pro Console
                        </h2>
                    </div>

                    <nav className='flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0'>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-950 text-emerald-400 border border-emerald-500/20 shadow-sm whitespace-nowrap"
                        >
                            Overview
                        </Link>

                        <Link
                            href="/dashboard/meetings"
                            className='px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all whitespace-nowrap'
                        >
                            Client Meetings
                        </Link>

                        <Link 
                            href="/dashboard/avilability"
                            className='px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all whitespace-nowrap'
                        >
                            Availability Rules
                        </Link>
                    </nav>
                </div>

                {/* User Identity Footer Context */}
                <div className='hidden md:block pt-6 border-t border-slate-800'>
                    <p className='text-xs text-slate-500 font-semibold uppercase tracking-wider'>Aunthenticated User</p>
                    <p className="text-sm font-mono text-slate-300 truncate mt-0.5">chacon_pro</p>
                </div>
            </aside>

            {/* Primary Dashboard Content Viewport */}
            <main className='flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6'>
                {children}
            </main>
        </div>
    );
}