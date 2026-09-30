import React, { useMemo } from 'react';
import { useMission } from '../context/MissionContext';

export default function PowerChart() {
  const { 
    batteryPercent, 
    telemetryHistory, 
    currentOrbit, 
    solarEfficiency, 
    currentActiveTasks, 
    parasiticDrainWatts 
  } = useMission();

  // SVG Chart Geometry
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Max X is 90 minutes
  const maxX = 90;

  // Points for Battery Path
  const points = useMemo(() => {
    if (!telemetryHistory || telemetryHistory.length === 0) return '';

    return telemetryHistory.map((pt, idx) => {
      const x = padding.left + (Math.min(maxX, pt.tMinutes) / maxX) * innerWidth;
      const y = padding.top + (1 - (pt.battery / 100)) * innerHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [telemetryHistory, innerWidth, innerHeight, padding]);

  // Current Power Metrics
  const currentGen = currentOrbit.inSunlight ? (4.8 * solarEfficiency).toFixed(1) : '0.0';
  let taskLoad = 0;
  currentActiveTasks.forEach(t => {
    taskLoad += (t.type === 'PAYLOAD_IMAGE' ? 6.0 : t.type === 'SCIENCE_DATA' ? 3.5 : 1.5);
  });
  const totalLoad = (0.8 + taskLoad + parasiticDrainWatts).toFixed(1);
  const netPower = (Number(currentGen) - Number(totalLoad)).toFixed(1);
  const voltage = (6.0 + (batteryPercent / 100) * 2.4).toFixed(2);

  // Critical Safe Floor Line (20% DoD)
  const y20 = padding.top + (1 - 0.20) * innerHeight;

  return (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
          <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
            Power Budget & Battery State of Charge (SoC)
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className={`px-2 py-0.5 rounded font-bold ${
            batteryPercent < 20 
              ? 'bg-rose-950 text-rose-400 border border-rose-600 animate-pulse' 
              : batteryPercent < 50 
              ? 'bg-amber-950 text-amber-400 border border-amber-600' 
              : 'bg-emerald-950 text-emerald-400 border border-emerald-600'
          }`}>
            SoC: {batteryPercent.toFixed(1)}% ({voltage}V)
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-2 my-3">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Solar Gen</div>
          <div className="text-xs font-mono font-bold text-amber-400">+{currentGen} W</div>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Total Load</div>
          <div className="text-xs font-mono font-bold text-rose-400">-{totalLoad} W</div>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Net Power</div>
          <div className={`text-xs font-mono font-bold ${Number(netPower) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {Number(netPower) >= 0 ? `+${netPower}` : netPower} W
          </div>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Capacity</div>
          <div className="text-xs font-mono font-bold text-cyan-400">24.0 Wh</div>
        </div>
      </div>

      {/* Live SVG Graph */}
      <div className="flex-1 w-full relative min-h-[160px] flex items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-2">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
          {/* Y Axis Grid Lines */}
          {[0, 20, 50, 80, 100].map(val => {
            const y = padding.top + (1 - val / 100) * innerHeight;
            return (
              <g key={val}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={chartWidth - padding.right} 
                  y2={y} 
                  stroke="#334155" 
                  strokeDasharray={val === 20 ? "4 2" : "2 2"} 
                  strokeWidth={val === 20 ? "1.5" : "0.75"} 
                  strokeOpacity={val === 20 ? "0.9" : "0.5"}
                />
                <text x={padding.left - 6} y={y + 3} textAnchor="end" fill={val === 20 ? "#f43f5e" : "#64748b"} fontSize="9" fontFamily="monospace">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* 20% Critical Safe Floor Warning Zone */}
          <rect 
            x={padding.left} 
            y={y20} 
            width={innerWidth} 
            height={chartHeight - padding.bottom - y20} 
            fill="#f43f5e" 
            fillOpacity="0.08" 
          />
          <text x={chartWidth - padding.right - 4} y={y20 - 4} textAnchor="end" fill="#f43f5e" fontSize="8" fontFamily="monospace" fontWeight="bold">
            20% CRITICAL SAFE FLOOR
          </text>

          {/* X Axis Ticks */}
          {[0, 15, 30, 45, 60, 75, 90].map(min => {
            const x = padding.left + (min / maxX) * innerWidth;
            return (
              <g key={min}>
                <line x1={x} y1={chartHeight - padding.bottom} x2={x} y2={chartHeight - padding.bottom + 4} stroke="#475569" />
                <text x={x} y={chartHeight - padding.bottom + 14} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
                  {min}m
                </text>
              </g>
            );
          })}

          {/* Battery Telemetry Line */}
          {points && (
            <polyline 
              fill="none" 
              stroke="#38bdf8" 
              strokeWidth="2.5" 
              points={points} 
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_6px_#38bdf8]"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
