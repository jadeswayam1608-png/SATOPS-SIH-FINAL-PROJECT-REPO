import React, { useState, useMemo } from 'react';
import { useMission } from '../context/MissionContext';

export default function FlightReviewReport() {
  const { 
    tasks, 
    batteryPercent, 
    storageUsedMB, 
    storageTotalMB, 
    activeEmergencies, 
    missionLogs,
    missionTimeSeconds 
  } = useMission();

  const [operatorNotes, setOperatorNotes] = useState('Nominal orbit operations conducted. SATOPS deterministic constraints verified.');
  const [operatorName, setOperatorName] = useState('Flight Controller Cadet');

  // Dynamic Score Calculation (100-Point FRR Breakdown)
  const scoreBreakdown = useMemo(() => {
    // 1. Safe Schedule (30 pts)
    const scheduleScore = tasks.length >= 3 ? 30 : Math.max(10, tasks.length * 10);

    // 2. Telemetry & Checklist (25 pts)
    const hasTelem = tasks.some(t => t.type === 'HEALTH_TELEMETRY');
    const telemScore = hasTelem ? 25 : 5;

    // 3. Emergency Management (25 pts)
    const emergScore = activeEmergencies.length === 0 ? 25 : Math.max(0, 25 - (activeEmergencies.length * 10));

    // 4. Handover & Power Preservation (20 pts)
    const powerScore = batteryPercent >= 50 ? 20 : batteryPercent >= 20 ? 12 : 0;

    const total = scheduleScore + telemScore + emergScore + powerScore;

    return {
      scheduleScore,
      telemScore,
      emergScore,
      powerScore,
      total
    };
  }, [tasks, activeEmergencies, batteryPercent]);

  // Export JSON Report
  const handleExportJSON = () => {
    const reportData = {
      mission: 'SATOPS-209 Student Satellite Operations Simulator',
      operator: operatorName,
      timestamp: new Date().toISOString(),
      simulationDurationSeconds: missionTimeSeconds,
      evaluationScore: scoreBreakdown,
      metrics: {
        finalBatterySoC: batteryPercent,
        storageUsedMB,
        storageCapacityMB: storageTotalMB,
        scheduledTasksCount: tasks.length,
        unresolvedAnomalies: activeEmergencies
      },
      tasks,
      operatorNotes
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SATOPS_FRR_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
            Flight Readiness Review (FRR) Scorecard
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Official Aerospace Operations Evaluation & Mission Handover Debrief
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
        >
          <span>?? Export JSON FRR Report</span>
        </button>
      </div>

      {/* Score Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            Total Operational Score
          </div>
          <div className="my-4 flex items-baseline space-x-2">
            <span className="text-6xl font-display font-black text-white">{scoreBreakdown.total}</span>
            <span className="text-2xl font-mono text-slate-500">/ 100</span>
          </div>
          <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border text-center font-bold ${
            scoreBreakdown.total >= 85 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
              : scoreBreakdown.total >= 60 
              ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
              : 'bg-rose-950/80 border-rose-500 text-rose-300'
          }`}>
            {scoreBreakdown.total >= 85 ? 'CERTIFIED FOR FLIGHT OPERATIONS' : scoreBreakdown.total >= 60 ? 'PROVISIONAL PASS - REMEDIATION REQUIRED' : 'REJECTED - SAFETY CONSTRAINTS BREACHED'}
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Safe Scheduling</div>
            <div className="text-2xl font-display font-bold text-white mt-1">{scoreBreakdown.scheduleScore} <span className="text-xs text-slate-500">/ 30</span></div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">Ground Station exclusivity & LOS window bounds</div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Telemetry Precedence</div>
            <div className="text-2xl font-display font-bold text-white mt-1">{scoreBreakdown.telemScore} <span className="text-xs text-slate-500">/ 25</span></div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">Housekeeping health downlink verified prior to payload</div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Emergency Handling</div>
            <div className="text-2xl font-display font-bold text-white mt-1">{scoreBreakdown.emergScore} <span className="text-xs text-slate-500">/ 25</span></div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">Rapid tactical handover & contingency execution</div>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Power Preservation</div>
            <div className="text-2xl font-display font-bold text-white mt-1">{scoreBreakdown.powerScore} <span className="text-xs text-slate-500">/ 20</span></div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">Kept battery above 20% DoD safe-hold floor</div>
          </div>
        </div>
      </div>

      {/* Operator Shift Handover Section */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
          Shift Handover & Operations Signoff
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Shift Flight Operator Name</label>
            <input 
              type="text" 
              value={operatorName} 
              onChange={e => setOperatorName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Payload Storage Balance</label>
            <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-cyan-400">
              {storageUsedMB} MB / {storageTotalMB} MB ({((storageUsedMB / storageTotalMB) * 100).toFixed(0)}% Used)
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Handover Notes for Incoming Shift</label>
          <textarea
            rows="3"
            value={operatorNotes}
            onChange={e => setOperatorNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            placeholder="Enter mission observations, anomaly resolutions, and pass instructions..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}
