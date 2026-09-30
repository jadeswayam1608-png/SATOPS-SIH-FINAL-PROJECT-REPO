import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import { TASK_DEFINITIONS } from './SimulationEngine';

export default function MissionTimeline() {
  const { 
    missionTimeSeconds, 
    tasks, 
    setTasks, 
    passWindows, 
    groundStations, 
    addLog 
  } = useMission();

  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskType, setNewTaskType] = useState('HEALTH_TELEMETRY');
  const [newTaskStart, setNewTaskStart] = useState(10);
  const [newTaskGS, setNewTaskGS] = useState(groundStations[0]?.id || 'gs-blr');

  const currentMinute = missionTimeSeconds / 60.0;
  const TOTAL_TIMELINE_MINUTES = 90;

  const handleAddTask = () => {
    const def = TASK_DEFINITIONS[newTaskType];
    const createdTask = {
      id: `task-${Date.now()}`,
      type: newTaskType,
      name: def.name,
      startMinute: Number(newTaskStart),
      durationMinutes: def.durationMinutes,
      groundStationId: newTaskGS
    };
    setTasks(prev => [...prev, createdTask].sort((a, b) => a.startMinute - b.startMinute));
    setShowAddModal(false);
    addLog('SUCCESS', `Scheduled task: "${def.name}" at T+ ${newTaskStart}m`);
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTask(null);
    addLog('WARN', 'Removed task from mission timeline.');
  };

  return (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <h2 className="text-lg font-display font-black text-white uppercase tracking-wider">
            Mission Operations Gantt Timeline
          </h2>
          <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
            00:00 to 90:00 (1 Orbit)
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
        >
          <span>+ Add Task</span>
        </button>
      </div>

      <div className="relative mt-4 flex-1 overflow-x-auto min-h-[300px]">
        <div className="relative h-6 border-b border-slate-800 flex items-center text-[10px] font-mono text-slate-500 select-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute transform -translate-x-1/2"
              style={{ left: `${(i * 10 / TOTAL_TIMELINE_MINUTES) * 100}%` }}
            >
              T+{i * 10}m
            </div>
          ))}
        </div>

        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-30 pointer-events-none transition-all duration-300 shadow-[0_0_8px_#f43f5e]"
          style={{ left: `${Math.min(100, (currentMinute / TOTAL_TIMELINE_MINUTES) * 100)}%` }}
        >
          <div className="absolute -top-2 -translate-x-1/2 bg-rose-600 text-[9px] font-mono font-bold text-white px-1.5 py-0.5 rounded shadow">
            T+{currentMinute.toFixed(1)}m
          </div>
        </div>

        <div className="mt-3 relative h-8 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center">
          <div className="absolute inset-y-0 left-0 w-[62%] bg-amber-500/20 border-r border-amber-500/40 flex items-center px-3 text-[10px] font-mono text-amber-300">
            ?? SUNLIGHT (+4.8W Solar Generation)
          </div>
          <div className="absolute inset-y-0 right-0 w-[38%] bg-indigo-950/60 flex items-center justify-end px-3 text-[10px] font-mono text-indigo-300">
            ?? ECLIPSE (0.0W Solar Gen / Battery Discharge)
          </div>
        </div>

        <div className="mt-3 relative h-10 rounded-lg border border-slate-800 bg-slate-950/60">
          <div className="absolute top-1 left-2 text-[9px] font-mono uppercase text-slate-500">
            Ground Station AOS/LOS Windows
          </div>
          {passWindows.map(pass => {
            const leftPct = (pass.startMinute / TOTAL_TIMELINE_MINUTES) * 100;
            const widthPct = (pass.durationMinutes / TOTAL_TIMELINE_MINUTES) * 100;
            return (
              <div
                key={pass.id}
                className="absolute top-4 bottom-1 rounded border text-[10px] font-mono flex items-center px-2 shadow overflow-hidden whitespace-nowrap"
                style={{
                  left: `${leftPct}%`,
                  width: `${Math.max(2, widthPct)}%`,
                  backgroundColor: `${pass.groundStationColor}25`,
                  borderColor: pass.groundStationColor,
                  color: pass.groundStationColor
                }}
                title={`${pass.groundStationName} (${pass.startMinute.toFixed(1)}m - ${pass.endMinute.toFixed(1)}m, Max El: ${pass.maxElevationDeg}°)`}
              >
                ?? {pass.groundStationCode} ({pass.maxElevationDeg}°)
              </div>
            );
          })}
        </div>

        <div className="mt-4 relative h-28 rounded-lg border border-slate-800 bg-slate-950/80 p-2">
          <div className="text-[9px] font-mono uppercase text-slate-500 mb-2">
            Scheduled Tasks (Click to inspect or reschedule)
          </div>
          {tasks.map(task => {
            const def = TASK_DEFINITIONS[task.type] || {};
            const leftPct = (task.startMinute / TOTAL_TIMELINE_MINUTES) * 100;
            const widthPct = (task.durationMinutes / TOTAL_TIMELINE_MINUTES) * 100;
            const isCurrentlyRunning = currentMinute >= task.startMinute && currentMinute < (task.startMinute + task.durationMinutes);

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`absolute top-7 h-14 rounded-lg border-2 p-2 cursor-pointer transition-all flex flex-col justify-between shadow-lg ${
                  isCurrentlyRunning 
                    ? 'border-emerald-400 bg-emerald-950/80 shadow-[0_0_12px_#10b981]' 
                    : 'border-cyan-500/60 bg-slate-900/90 hover:border-cyan-400'
                }`}
                style={{
                  left: `${leftPct}%`,
                  width: `${Math.max(6, widthPct)}%`
                }}
              >
                <div className="flex items-center justify-between text-[10px] font-display font-bold text-white truncate">
                  <span>{task.name}</span>
                  {isCurrentlyRunning && <span className="text-emerald-400 text-[9px] animate-pulse">ACTIVE</span>}
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>T+{task.startMinute}m ({task.durationMinutes}m)</span>
                  <span className="text-amber-400">{def.powerWatts}W</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTask && (
        <div className="mt-4 p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-display font-bold text-white">{selectedTask.name}</h4>
            <p className="text-xs font-mono text-slate-400">
              Start: T+{selectedTask.startMinute}m | Duration: {selectedTask.durationMinutes}m | Station: {selectedTask.groundStationId}
            </p>
          </div>
          <button
            onClick={() => handleDeleteTask(selectedTask.id)}
            className="px-3 py-1 bg-rose-600/80 hover:bg-rose-500 text-white font-mono text-xs rounded-lg transition"
          >
            Delete Task
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-display font-bold text-white mb-4">Schedule Mission Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Task Type</label>
                <select 
                  value={newTaskType} 
                  onChange={e => setNewTaskType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-white"
                >
                  {Object.keys(TASK_DEFINITIONS).map(k => (
                    <option key={k} value={k}>{TASK_DEFINITIONS[k].name} ({TASK_DEFINITIONS[k].powerWatts}W, {TASK_DEFINITIONS[k].durationMinutes}m)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Start Time (T+ Minute)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="85" 
                  value={newTaskStart} 
                  onChange={e => setNewTaskStart(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Target Ground Station</label>
                <select 
                  value={newTaskGS} 
                  onChange={e => setNewTaskGS(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-white"
                >
                  {groundStations.map(gs => (
                    <option key={gs.id} value={gs.id}>{gs.name} ({gs.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-lg shadow-cyan-500/20"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
