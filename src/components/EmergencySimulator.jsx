import React from 'react';
import { useMission } from '../context/MissionContext';

export default function EmergencySimulator() {
  const { 
    setSolarEfficiency, 
    setParasiticDrainWatts, 
    groundStations, 
    setGroundStations,
    setActiveGroundStationId,
    addLog,
    activeEmergencies,
    setActiveEmergencies 
  } = useMission();

  const handleInjectGSFailure = () => {
    setGroundStations(prev => prev.map(g => g.id === 'gs-blr' ? { ...g, status: 'JAMMED' } : g));
    setActiveEmergencies(prev => [...prev, 'GROUND_STATION_JAMMED']);
    addLog('ERROR', 'EMERGENCY INJECTED: Bangalore antenna azimuth rotor jammed! Signal SNR dropped to 0 dB.');
  };

  const handleInjectPowerAnomaly = () => {
    setSolarEfficiency(0.2);
    setActiveEmergencies(prev => [...prev, 'SOLAR_ARRAY_COLLAPSE']);
    addLog('ERROR', 'EMERGENCY INJECTED: Solar array micro-meteoroid impact! Generation dropped by 80%.');
  };

  const handleResolveEmergency = (id) => {
    if (id === 'GROUND_STATION_JAMMED') {
      setActiveGroundStationId('gs-iitm');
      setGroundStations(prev => prev.map(g => g.id === 'gs-blr' ? { ...g, status: 'ONLINE' } : g));
      addLog('SUCCESS', 'Handover executed to IIT Madras Space Lab. Link reacquired!');
    } else if (id === 'SOLAR_ARRAY_COLLAPSE') {
      setSolarEfficiency(1.0);
      addLog('SUCCESS', 'Power bus shunted to secondary string. Solar generation restored.');
    }
    setActiveEmergencies(prev => prev.filter(e => e !== id));
  };

  return (
    <div className="bg-slate-900/90 border-2 border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
          <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">
            In-Orbit Emergency Injector
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
          Anomaly Drills
        </span>
      </div>

      <div className="mt-4 space-y-3 flex-1 overflow-y-auto pr-1">
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold text-white">?? Ground Station Rotor Jam</span>
            <button
              onClick={handleInjectGSFailure}
              className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-500 text-white font-mono text-[10px] font-bold rounded transition"
            >
              Inject Drill
            </button>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Jams Bangalore dish mid-pass. Forces tactical handover to IIT Madras.
          </p>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-bold text-white">? Solar Array 80% Power Drop</span>
            <button
              onClick={handleInjectPowerAnomaly}
              className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-500 text-white font-mono text-[10px] font-bold rounded transition"
            >
              Inject Drill
            </button>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Instantly drops solar generation to 0.96W. Demands rapid load shedding.
          </p>
        </div>

        {activeEmergencies.length > 0 && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl space-y-2">
            <div className="text-xs font-display font-bold text-rose-300 uppercase">
              Active In-Orbit Anomalies ({activeEmergencies.length})
            </div>
            {activeEmergencies.map(em => (
              <div key={em} className="flex items-center justify-between bg-slate-900/90 p-2 rounded border border-rose-700/60 text-xs font-mono text-white">
                <span>{em}</span>
                <button
                  onClick={() => handleResolveEmergency(em)}
                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded transition"
                >
                  Execute Fix
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
