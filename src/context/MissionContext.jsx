import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  propagateOrbit, 
  calculateLookAngles, 
  calculatePassWindows, 
  computePowerStep, 
  DEFAULT_GROUND_STATIONS, 
  DEFAULT_TLE,
  TASK_DEFINITIONS
} from '../components/SimulationEngine';

export const MissionContext = createContext(null);

export function MissionProvider({ children }) {
  const [simRunning, setSimRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(5);
  const [missionTimeSeconds, setMissionTimeSeconds] = useState(0);

  const [tle, setTle] = useState(DEFAULT_TLE);
  const [groundStations, setGroundStations] = useState(DEFAULT_GROUND_STATIONS);
  const [activeGroundStationId, setActiveGroundStationId] = useState('gs-blr');

  const [batteryPercent, setBatteryPercent] = useState(94.5);
  const [storageUsedMB, setStorageUsedMB] = useState(148);
  const [storageTotalMB] = useState(512);
  const [solarEfficiency, setSolarEfficiency] = useState(1.0);
  const [parasiticDrainWatts, setParasiticDrainWatts] = useState(0.0);
  const [dopplerOffsetKhz, setDopplerOffsetKhz] = useState(0.0);

  const [tasks, setTasks] = useState([
    { id: 'task-1', type: 'HEALTH_TELEMETRY', startMinute: 9, durationMinutes: 2, groundStationId: 'gs-blr', name: 'Housekeeping Telemetry Downlink' },
    { id: 'task-2', type: 'ATTITUDE_UPLINK', startMinute: 11, durationMinutes: 3, groundStationId: 'gs-blr', name: 'Attitude Ephemeris Uplink' },
    { id: 'task-3', type: 'PAYLOAD_IMAGE', startMinute: 23, durationMinutes: 5, groundStationId: 'gs-iitm', name: 'Multispectral Camera Downlink' },
    { id: 'task-4', type: 'SCIENCE_DATA', startMinute: 45, durationMinutes: 4, groundStationId: 'gs-nrsc', name: 'Magnetometer Science Dump' }
  ]);

  const [telemetryHistory, setTelemetryHistory] = useState([
    { tMinutes: 0, battery: 94.5, solarGen: 4.8, load: 0.8, inSunlight: true }
  ]);

  const [missionLogs, setMissionLogs] = useState([
    { id: 'log-0', time: '00:00:00', type: 'INFO', text: 'SATOPS Mission Control Initialized. Orbit propagated at 550km LEO.' }
  ]);
  const [activeEmergencies, setActiveEmergencies] = useState([]);

  const passWindows = useMemo(() => {
    return calculatePassWindows(90, groundStations);
  }, [groundStations]);

  const currentOrbit = useMemo(() => {
    return propagateOrbit(missionTimeSeconds);
  }, [missionTimeSeconds]);

  const activeGS = useMemo(() => {
    return groundStations.find(g => g.id === activeGroundStationId) || groundStations[0];
  }, [groundStations, activeGroundStationId]);

  const currentLookAngles = useMemo(() => {
    if (!activeGS) return { azimuthDeg: 0, elevationDeg: -90, rangeKm: 0, isAboveHorizon: false };
    return calculateLookAngles(currentOrbit.latitude, currentOrbit.longitude, currentOrbit.altitude, activeGS.lat, activeGS.lon);
  }, [currentOrbit, activeGS]);

  const currentActiveTasks = useMemo(() => {
    const currentMin = missionTimeSeconds / 60.0;
    return tasks.filter(t => currentMin >= t.startMinute && currentMin < (t.startMinute + t.durationMinutes));
  }, [tasks, missionTimeSeconds]);

  const addLog = useCallback((type, text) => {
    const min = Math.floor(missionTimeSeconds / 60);
    const sec = Math.floor(missionTimeSeconds % 60);
    const timeStr = ${String(Math.floor(min / 60)).padStart(2, '0')}::;
    setMissionLogs(prev => [{ id: log--, time: timeStr, type, text }, ...prev.slice(0, 49)]);
  }, [missionTimeSeconds]);

  useEffect(() => {
    if (!simRunning) return;

    const interval = setInterval(() => {
      const dtSeconds = simSpeed;
      setMissionTimeSeconds(prevT => {
        const nextT = prevT + dtSeconds;
        const orbitState = propagateOrbit(nextT);
        
        setBatteryPercent(prevBatt => {
          const power = computePowerStep({
            dtSeconds,
            currentBatteryPercent: prevBatt,
            batteryCapacityWh: 24.0,
            inSunlight: orbitState.inSunlight,
            solarEfficiency,
            activeTasks: currentActiveTasks,
            parasiticDrainWatts
          });

          if (Math.floor(nextT / 30) !== Math.floor(prevT / 30)) {
            setTelemetryHistory(hist => [
              ...hist.slice(-120),
              {
                tMinutes: Number((nextT / 60).toFixed(1)),
                battery: power.batteryPercent,
                solarGen: power.solarGenWatts,
                load: power.totalLoadWatts,
                inSunlight: orbitState.inSunlight
              }
            ]);
          }

          return power.batteryPercent;
        });

        setStorageUsedMB(prevStore => {
          let delta = 0;
          currentActiveTasks.forEach(t => {
            const def = TASK_DEFINITIONS[t.type] || {};
            delta += (def.storageDeltaMB || 0) * (dtSeconds / 60.0);
          });
          return Math.max(10, Math.min(storageTotalMB, Number((prevStore + delta).toFixed(1))));
        });

        return nextT;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simRunning, simSpeed, solarEfficiency, parasiticDrainWatts, currentActiveTasks, storageTotalMB]);

  return (
    <MissionContext.Provider value={{
      simRunning, setSimRunning,
      simSpeed, setSimSpeed,
      missionTimeSeconds, setMissionTimeSeconds,
      tle, setTle,
      groundStations, setGroundStations,
      activeGroundStationId, setActiveGroundStationId,
      activeGS,
      batteryPercent, setBatteryPercent,
      storageUsedMB, setStorageUsedMB,
      storageTotalMB,
      solarEfficiency, setSolarEfficiency,
      parasiticDrainWatts, setParasiticDrainWatts,
      dopplerOffsetKhz, setDopplerOffsetKhz,
      tasks, setTasks,
      passWindows,
      currentOrbit,
      currentLookAngles,
      currentActiveTasks,
      telemetryHistory,
      missionLogs, addLog,
      activeEmergencies, setActiveEmergencies
    }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) throw new Error('useMission must be used within a MissionProvider');
  return context;
}
