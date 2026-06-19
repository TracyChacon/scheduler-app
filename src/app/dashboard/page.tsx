// src/app/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import StagePipeline, { Stage, Client, SecurityClearanceRole } from "@/components/StagePipeline";

// Sandbox presets using explicit literal keys that map 1:1 with your security types
const PROFESSION_PRESETS = {
  "Mortgage Loan Officer": {
    label: "Residential Mortgage Loan Officer",
    role: "Mortgage Loan Officer" as SecurityClearanceRole,
    stages: [
      { id: "lead", name: "Lead / Prospecting" },
      { id: "app", name: "Application & Disclosure" },
      { id: "home_search", name: "Home Search" },
      { id: "on_contract", name: "On Contract" },
      { id: "processing", name: "Processing" },
      { id: "underwriting", name: "Underwriting" },
      { id: "ctc", name: "Clear to Close (CTC)" },
      { id: "funding", name: "Funding & Recording" },
      { id: "post", name: "Post-Closing" },
      { id: "fallout", name: "Fallout / Withdrawn" }
    ],
    clients: [
      { name: "James Wilson", stage: "lead" },
      { name: "Elena Rostova", stage: "lead" },
      { name: "Sarah & David Miller", stage: "app" },
      { name: "Robert Chen", stage: "processing" },
      { name: "Marcus Vance", stage: "underwriting" },
      { name: "Amanda Huggins", stage: "ctc" },
      { name: "Carlos Mendez", stage: "funding" },
      { name: "The Jacobs Family", stage: "post" },
    ]
  },
  "Loan Officer Assistant": {
    label: "Loan Officer Assistant View",
    role: "Loan Officer Assistant" as SecurityClearanceRole,
    stages: [
      { id: "lead", name: "Lead / Prospecting" },
      { id: "app", name: "Application & Disclosure" },
      { id: "home_search", name: "Home Search" },
      { id: "on_contract", name: "On Contract" },
      { id: "processing", name: "Processing" },
      { id: "underwriting", name: "Underwriting" },
      { id: "ctc", name: "Clear to Close (CTC)" },
      { id: "funding", name: "Funding & Recording" },
      { id: "post", name: "Post-Closing" }
    ],
    clients: [
      { name: "James Wilson", stage: "lead" },
      { name: "Sarah & David Miller", stage: "app" },
      { name: "Robert Chen", stage: "processing" },
    ]
  },
  "Underwriter": {
    label: "Risk & Underwriting Board",
    role: "Underwriter" as SecurityClearanceRole,
    stages: [
      { id: "processing", name: "Processing" },
      { id: "underwriting", name: "Underwriting" },
      { id: "ctc", name: "Clear to Close (CTC)" },
    ],
    clients: [
      { name: "Robert Chen", stage: "processing" },
      { name: "Marcus Vance", stage: "underwriting" },
      { name: "Amanda Huggins", stage: "ctc" },
    ]
  },
  "Realtor": {
    label: "Real Estate Agent / Broker",
    role: "Realtor" as SecurityClearanceRole,
    stages: [
      { id: "consult", name: "Initial Consultation" },
      { id: "preapp", name: "Pre-Approval Check" },
      { id: "showing", name: "Home Showings" },
      { id: "offer", name: "Offer Submitted" },
      { id: "escrow", name: "Under Contract / Escrow" },
      { id: "inspect", name: "Inspections & Appraisal" },
      { id: "closing", name: "Final Walkthrough / Closing" },
      { id: "lost", name: "Lost Client" }
    ],
    clients: [
      { name: "Lisa Kudrow", stage: "consult" },
      { name: "Tom Haverford", stage: "showing" },
      { name: "Donna Meagle", stage: "showing" },
      { name: "Sarah & David Miller", stage: "offer" },
      { name: "Jim Halpert", stage: "escrow" },
      { name: "Marcus Vance", stage: "inspect" },
    ]
  },
  "Processor": {
    label: "Insurance Risk Agent Pipeline",
    role: "Processor" as SecurityClearanceRole,
    stages: [
      { id: "quote_req", name: "Quote Requested" },
      { id: "risk_eval", name: "Risk Assessment" },
      { id: "carrier", name: "Carrier Underwriting" },
      { id: "bound", name: "Policy Bound" },
      { id: "issued", name: "Policy Issued" },
      { id: "renew", name: "Up For Renewal" },
      { id: "lapsed", name: "Lapsed / Cancelled" }
    ],
    clients: [
      { name: "Sarah & David Miller", stage: "quote_req" },
      { name: "Bruce Wayne", stage: "risk_eval" },
      { name: "Clark Kent", stage: "carrier" },
      { name: "Marcus Vance", stage: "bound" },
      { name: "Diana Prince", stage: "issued" },
    ]
  }
};

export default function DashboardOverview() {
  // --- CORE CONTEXT STATE MANAGEMENT ENGINE ---
  const [activeProfile, setActiveProfile] = useState<keyof typeof PROFESSION_PRESETS>("Mortgage Loan Officer");
  const [stages, setStages] = useState<Stage[]>(PROFESSION_PRESETS["Mortgage Loan Officer"].stages);
  const [clients, setClients] = useState<Client[]>(PROFESSION_PRESETS["Mortgage Loan Officer"].clients);

  // RBAC Authentication State Simulation - Defaults cleanly to standard baseline
  const [isTeamMode, setIsTeamMode] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<SecurityClearanceRole>('Mortgage Loan Officer');
  const [canDragAndDrop, setCanDragAndDrop] = useState<boolean>(true);

  // Filter States
  const [onlyUpcomingMeetings, setOnlyUpcomingMeetings] = useState(false);

  // Profile presets switching logic
  const handleProfilePresetSwap = (profileKey: keyof typeof PROFESSION_PRESETS) => {
    setActiveProfile(profileKey);
    setStages(PROFESSION_PRESETS[profileKey].stages);
    setClients(PROFESSION_PRESETS[profileKey].clients);
    setUserRole(PROFESSION_PRESETS[profileKey].role); // Automatically load role preset parameters
  };

  const handleUpdatePipelineStructure = (newStages: Stage[], updatedClients?: Client[]) => {
    setStages(newStages);
    if (updatedClients) {
      setClients(updatedClients);
    }
  };

  const handleInlineClientMovement = (clientName: string, targetStageId: string) => {
    setClients(prev => prev.map(client => 
      client.name === clientName ? { ...client, stage: targetStageId } : client
    ));
  };

  // Fixed metrics keys mapping
  const pipelineMetrics = [
    { label: 'Total Scheduled', value: '24', detail: 'This calendar month', color: 'text-emerald-400' },
    { label: 'Pending Pre-Approvals', value: '7', detail: 'Requires document substantiation', color: 'text-blue-400' },
    { label: 'Active Booking Forms', value: '3', detail: 'Live client channels', color: 'text-purple-400' },
  ];

  const meetingsData = [
    { id: 1, client: 'Sarah & David Miller', type: 'Mortgage Pre-Approval Consultation', time: 'Tomorrow at 10:00 AM CST', isUpcoming: true, pipelineField: "Application & Disclosure" },
    { id: 2, client: 'Marcus Vance', type: 'Refinance Rate Assessment', time: 'June 8, 2026 at 2:30 PM CST', isUpcoming: true, pipelineField: "Underwriting" },
    { id: 3, client: 'James Wilson', type: 'Initial Discovery Call', time: 'Completed Yesterday', isUpcoming: false, pipelineField: "Lead / Prospecting" },
  ];

  const filteredMeetings = onlyUpcomingMeetings ? meetingsData.filter(m => m.isUpcoming) : meetingsData;

  return (
    <div className="space-y-8 p-6 max-w-[1600px] mx-auto text-slate-100 bg-slate-950 min-h-screen">

      {/* Panel 1: Recruiter & Client live sandbox system controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6 shadow-md">
        <div>
          <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
            Guest Log-on Option Panel
          </span>
          <h2 className="text-md font-semibold text-slate-200 mt-0.5">
            Simulate Tenant Archetypes & Security Tiers
          </h2>
        </div>

        <hr className="border-slate-800" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          
          {/* Preset Sector Designation Selector Switch */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Target Profession Preset
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(PROFESSION_PRESETS) as Array<keyof typeof PROFESSION_PRESETS>).map((prof) => (
                <button
                  key={prof}
                  onClick={() => handleProfilePresetSwap(prof)}
                  className={`w-[47%] h-14 px-2 rounded-lg text-[10px] font-bold tracking-wide border cursor-pointer transition-all uppercase text-center ${
                    activeProfile === prof
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {prof}
                </button>
              ))}
            </div>
          </div>
          
          {/* Core Configuration Modes Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Workspace Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTeamMode(false)}
                className={`w-[47%] h-12 px-2 rounded-lg text-xs font-bold tracking-wide border cursor-pointer transition-all uppercase ${
                  !isTeamMode 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-slate-200'
                }`}
              >
                Solo Broker
              </button>

              <button
                onClick={() => setIsTeamMode(true)}
                className={`w-[47%] h-12 px-2 rounded-lg text-xs font-bold tracking-wide border cursor-pointer transition-all uppercase ${
                  isTeamMode 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-slate-200'
                }`}
              >
                Team Matrix
              </button>
            </div>
          </div>

          {/* Explicitly Hand-coded Sandboxed Dropdown aligned with explicit SecurityClearanceRole strings */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Clearance Role 
            </label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as SecurityClearanceRole)}
              className="w-[96%] h-12 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold p-2 text-slate-300 outline-none uppercase tracking-wide cursor-pointer focus:border-emerald-500"
            >
              <option value="admin">Admin (Global Control)</option>
              <option value="Mortgage Loan Officer">Mortgage Loan Officer</option>
              <option value="Loan Officer Assistant">Loan Officer Assistant</option>
              <option value="Underwriter">Underwriter</option>
              <option value="Realtor">Realtor</option>
              <option value="Processor">Processor</option>
            </select>
          </div>

          {/* Operations Capabilities Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Board Drag Mechanics
            </label>
            <button 
              onClick={() => setCanDragAndDrop(!canDragAndDrop)}
              className={`w-[96%] h-12 px-2.5 rounded-lg text-xs font-bold tracking-wide border cursor-pointer transition-all uppercase ${
                canDragAndDrop
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:text-rose-300'
              }`}
            >
              {canDragAndDrop ? "Allowed / Unlocked" : "Revoked / Frozen"}
            </button>
          </div>
        </div>
      </div>
          
      {/* PRIMARY CONSOLE CONTENT BRANDING */}
      <div className="pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-400 font-medium mt-1">
          Currently rendering live presets for: <span className="text-emerald-400 ml-1 font-semibold">{PROFESSION_PRESETS[activeProfile].label}</span>
        </p>
      </div>

      {/* METRIC INDEX COUNTER CARDS GRID ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {pipelineMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {metric.label}
            </p>
            <p className={`text-3xl font-black mt-2 mb-1 ${metric.color || 'text-slate-200'}`}>
              {metric.value}
            </p>
            <p className="text-xs text-slate-500">
              {metric.detail}
            </p>
          </div>
        ))}
      </div>

      {/* REUSABLE PIPELINE PORTABLE DRAG CANVAS INSTANCE */}
      <StagePipeline
        stages={stages}
        clients={clients}
        userRole={userRole}
        canDragAndDrop={canDragAndDrop}
        onUpdatePipelineStructure={handleUpdatePipelineStructure}
        onMoveClient={handleInlineClientMovement}
      />
          
      {/* REVENUE PIPELINE MONITOR: UPCOMING MEETINGS MONITORING COMPONENT */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Upcoming Meetings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Next calendar actions queued by external client scheduling forms.</p>
          </div>

          <button
            onClick={() => setOnlyUpcomingMeetings(!onlyUpcomingMeetings)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
              onlyUpcomingMeetings
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:text-amber-200'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-slate-100 hover:border-slate-500'
            }`}
          >
            {onlyUpcomingMeetings ? "Showing: Only Upcoming Meetings" : "Showing: All Scheduled Log Sessions"}
          </button>
        </div>

        {/* MEETING LOG GRID ROWS */}
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    Meeting
                  </p>
                </div>
                <div className="pl-4">
                  <h4 className="text-lg font-bold text-slate-200">
                    {meeting.client}
                  </h4>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">
                    {meeting.type}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {meeting.time}
                  </p>
                </div>
              </div>

              {/* Multi-Tenant Adjacency Cross Match Data Box */}
              <div className="flex-1 bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
                <div className="text-right mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                    Pipeline Details
                  </span>
                </div>

                <div className="bg-slate-950 rounded-lg border border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Pipeline Stage</p>
                    <p className="text-sm font-bold text-slate-200 mt-0.5">{meeting.pipelineField}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                      {isTeamMode ? "Assignee" : "Account Status"}
                    </p>
                    <p className="text-sm font-bold text-slate-200 mt-0.5">
                      {isTeamMode ? "Tracy (MLO)" : "Primary Producer"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}