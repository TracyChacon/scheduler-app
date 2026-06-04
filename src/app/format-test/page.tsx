// src/app/format-test/page.tsx
"use client"
import React from 'react';

export default function FormatTestPage() {
  return (
    <main className="min-h-screen bg-amber-700 text-red-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Tailwind CSS v4 Format Test Studio
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Use this environment to verify layout compilation, typography scales, components, and interactive utility variant states.
          </p>
        </header>

        {/* Section 1: Typography Scale */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">01 / Typography Scale</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h1 className="text-5xl font-black">Display 5XL Black</h1>
            <h2 className="text-3xl font-bold">Heading 3XL Bold</h2>
            <h3 className="text-xl font-semibold">Subtitle XL Semibold</h3>
            <p className="text-base text-slate-300 leading-relaxed">
              Body text (base regular) rendered with fine inter-line spacing tracking. <code className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded text-sm font-mono text-emerald-400">@import "tailwindcss"</code> handles this configuration pipeline naturally.
            </p>
          </div>
        </section>

        {/* Section 2: Color Matrices & Opacity Channels */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">02 / Color Matrices & Opacity Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-emerald-500 text-slate-950 p-4 rounded-xl font-bold flex flex-col justify-between h-24 shadow-lg shadow-emerald-500/10">
              <span>Solid Accent</span>
              <span className="text-xs font-mono uppercase tracking-wide">emerald-500</span>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-xl flex flex-col justify-between h-24">
              <span className="text-emerald-400 font-semibold">Translucent Pill</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-medium w-fit uppercase tracking-wider">
                Active 20%
              </span>
            </div>

            <div className="bg-blue-600 text-white p-4 rounded-xl font-bold flex flex-col justify-between h-24 shadow-lg shadow-blue-600/10">
              <span>Info Base</span>
              <span className="text-xs font-mono uppercase tracking-wide">blue-600</span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex flex-col justify-between h-24">
              <span className="font-semibold">Warning Box</span>
              <span className="text-xs font-mono uppercase tracking-wide">amber-500/10</span>
            </div>

          </div>
        </section>

        {/* Section 3: Flexbox & Dynamic Grid System */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">03 / Dynamic Grid Layouts (Cards)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors duration-200">
                  ⚡
                </div>
                <h3 className="text-lg font-bold mt-4 mb-2 group-hover:text-emerald-400 transition-colors duration-200">
                  Interactive Node {item}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Hovering over this component container causes structural transforms, shifting borders, and state changes.
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* Section 4: Data Forms & Custom Interactive Controls */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">04 / Form Inputs & System Controls</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <form className="space-y-6 max-w-xl" onSubmit={(e) => e.preventDefault()}>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 block">
                  Configuration Key Target
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., postgres://chacon:password@localhost:5432" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" 
                  className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors duration-150 cursor-pointer shadow-lg shadow-emerald-500/10 text-center"
                >
                  Commit Alteration
                </button>
                <button 
                  type="button" 
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors duration-150 cursor-pointer text-center"
                >
                  Discard Changes
                </button>
              </div>

            </form>
          </div>
        </section>

      </div>
    </main>
  );
}