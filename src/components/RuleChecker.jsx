import React, { useMemo } from 'react';
import { useMission } from '../context/MissionContext';
import { TASK_DEFINITIONS } from './SimulationEngine';

export default function RuleChecker() {
  const { tasks, setTasks, passWindows, batteryPercent, addLog } = useMission();

  const ruleResults = useMemo(() => {
    const violations = [];

    // Rule 1: Ground Station Exclusivity
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const t1 = tasks[i];
        const t2 = tasks[j];
        if (t1.groundStationId && t1.groundStationId === t2.groundStationId) {
          const t1End = t1.startMinute + t1.durationMinutes;
          const t2End = t2.startMinute + t2.durationMinutes;
          if (t1.startMinute < t2End && t2.startMinute < t1End) {
            violations.push({
              id: `rule-exclusivity-${t1.id}-${t2.id}`,
              rule: 'Ground Station Exclusivity',
              severity: 'CRITICAL',
              taskIds: [t1.id, t2.id],
              desc: `Antenna conflict on station ${t1.groundStationId}: "${t1.name}" and "${t2.name}" overlap in time.`,
              fix: () => {
                setTasks(prev => prev.map(t => t.id === t2.id ? { ...t, startMinute: t1End + 1 } : t));
                addLog('SUCCESS', `Auto-Fix Applied: Shifted "${t2.name}" to start after "${t1.name}"`);
              }
            });
          }
        }
      }
    }

    // Rule 2: Pass Window Horizon Violation
    tasks.forEach(task => {
      const def = TASK_DEFINITIONS[task.type] || {};
      if (def.requiresLOS) {
        const taskEnd = task.startMinute + task.durationMinutes;
        const matchingPass = passWindows.find(p => 
          p.groundStationId === task.groundStationId &&
          task.startMinute >= p.startMinute &&
          taskEnd <= p.endMinute
        );

        if (!matchingPass) {
          const nearestPass = passWindows.find(p => p.groundStationId === task.groundStationId);
          violations.push({
            id: `rule-pass-${task.id}`,
            rule: 'Pass Window Horizon Violation',
            severity: 'CRITICAL',
            taskIds: [task.id],
            desc: `"${task.name}" is scheduled outside the AOS-to-LOS contact window for ground station ${task.groundStationId}.`,
            fix: () => {
              if (nearestPass) {
                setTasks(prev => prev.map(t => t.id === task.id ? { ...t, startMinute: nearestPass.startMinute + 1 } : t));
                addLog('SUCCESS', `Auto-Fix Applied: Snapped "${task.name}" inside pass window (${nearestPass.startMinute.toFixed(0)}m)`);
              }
            }
          });
        }
      }
    });

    // Rule 3: Battery Depth of Discharge (DoD < 20%)
    if (batteryPercent < 20.0) {
      violations.push({
        id: 'rule-dod-critical',
        rule: 'Battery Depth of Discharge (DoD)',
        severity: 'CRITICAL',
        taskIds: [],
        desc: `CRITICAL POWER DROP: Battery is at ${batteryPercent.toFixed(1)}% (below the 20% safe floor). Risk of OBC brownout!`,
        fix: () => {
          setTasks(prev => [
            { id: `safe-${Date.now()}`, type: 'SAFE_HOLD', name: 'Safe-Hold Load Shedding', startMinute: 0, durationMinutes: 15, groundStationId: null },
            ...prev.filter(t => (TASK_DEFINITIONS[t.type]?.powerWatts || 0) <= 1.5)
          ]);
          addLog('SUCCESS', 'Auto-Fix Applied: Initiated Safe-Hold mode and shed high-drain payload loads.');
        }
      });
    }

    // Rule 4: Housekeeping Telemetry Precedence
    const sortedTasks = [...tasks].sort((a, b) => a.startMinute - b.startMinute);
    const firstPayloadIdx = sortedTasks.findIndex(t => t.type === 'PAYLOAD_IMAGE');
    const firstTelemetryIdx = sortedTasks.findIndex(t => t.type === 'HEALTH_TELEMETRY');

    if (firstPayloadIdx !== -1 && (firstTelemetryIdx === -1 || firstTelemetryIdx > firstPayloadIdx)) {
      violations.push({
        id: 'rule-precedence',
        rule: 'Telemetry Precedence Protocol',
        severity: 'WARNING',
        taskIds: [sortedTasks[firstPayloadIdx].id],
        desc: 'Payload imaging is scheduled before housekeeping telemetry verification in pass.',
        fix: () => {
          const payloadTask = sortedTasks[firstPayloadIdx];
          const newTelemTask = {
            id: `telem-fix-${Date.now()}`,
            type: 'HEALTH_TELEMETRY',
            name: 'Housekeeping Telemetry Downlink',
            startMinute: Math.max(0, payloadTask.startMinute - 2),
            durationMinutes: 2,
            groundStationId: payloadTask.groundStationId
          };
          setTasks(prev => [newTelemTask, ...prev].sort((a, b) => a.startMinute - b.startMinute));
          addLog('SUCCESS', 'Auto-Fix Applied: Inserted Housekeeping Telemetry task prior to payload downlink.');
        }
      });
    }

    return violations;
  }, [tasks, passWindows, batteryPercent, setTasks, addLog]);

  return (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${ruleResults.length === 0 ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'}`}></div>
          <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
            Deterministic Rule Engine ("The Brain")
          </h3>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
          ruleResults.length === 0 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
            : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
        }`}>
          {ruleResults.length} Violation{ruleResults.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
        {ruleResults.length === 0 ? (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs font-mono flex items-center space-x-3">
            <span className="text-lg">?</span>
            <div>
              <div className="font-bold">ALL FLIGHT CONSTRAINTS MET</div>
              <div className="text-[11px] text-emerald-400/80">Schedule is safe for uplink. Zero pass overlap or battery violations.</div>
            </div>
          </div>
        ) : (
          ruleResults.map(viol => (
            <div 
              key={viol.id}
              className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/30 space-y-2 shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-rose-400 uppercase tracking-wide flex items-center space-x-1.5">
                  <span>??</span>
                  <span>{viol.rule}</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-600">
                  {viol.severity}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                {viol.desc}
              </p>
              <div className="pt-1 flex items-center justify-end">
                <button
                  onClick={viol.fix}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shadow-cyan-500/20 flex items-center space-x-1"
                >
                  <span>? Suggest Fix (Apply)</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
