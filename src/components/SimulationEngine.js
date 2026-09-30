/**
 * SATOPS Simulation Engine - Physics, SGP4 Orbit Mechanics & Power Budgeting
 */
export const EARTH_RADIUS_KM = 6371.0;
export const MU_EARTH = 398600.4418;
export const EARTH_ROTATION_RATE = 7.292115e-5;

export const DEFAULT_TLE = {
  name: 'PRATHAM-II (CubeSat)',
  line1: '1 99999U 24001A   26256.50000000  .00001200  00000-0  50000-4 0  9991',
  line2: '2 99999  97.5000 120.0000 0012000  65.0000 295.0000 15.15000000 12005'
};

export const DEFAULT_GROUND_STATIONS = [
  { id: 'gs-blr', name: 'ISRO Bangalore (ISTRAC)', code: 'BLR-01', lat: 12.9716, lon: 77.5946, minElevation: 10, status: 'ONLINE', color: '#10b981' },
  { id: 'gs-iitm', name: 'IIT Madras Space Lab', code: 'IITM-02', lat: 12.9915, lon: 80.2337, minElevation: 12, status: 'ONLINE', color: '#38bdf8' },
  { id: 'gs-nrsc', name: 'NRSC Shadnagar Dish', code: 'NRSC-03', lat: 17.0600, lon: 78.2000, minElevation: 8, status: 'ONLINE', color: '#f59e0b' }
];

export const TASK_DEFINITIONS = {
  HEALTH_TELEMETRY: {
    type: 'HEALTH_TELEMETRY',
    name: 'Housekeeping Telemetry Downlink',
    priority: 'HIGH',
    durationMinutes: 2,
    powerWatts: 1.5,
    dataRateKbps: 9.6,
    storageDeltaMB: 0,
    requiresLOS: true,
    desc: 'Downlink thermistor temperatures, bus voltages, and battery state-of-charge.'
  },
  BEACON: {
    type: 'BEACON',
    name: 'AX.25 CW Health Beacon',
    priority: 'HIGH',
    durationMinutes: 2,
    powerWatts: 0.8,
    dataRateKbps: 1.2,
    storageDeltaMB: 0,
    requiresLOS: false,
    desc: 'Morse / AX.25 periodic beacon broadcast across ground tracking network.'
  },
  ATTITUDE_UPLINK: {
    type: 'ATTITUDE_UPLINK',
    name: 'Attitude Ephemeris Uplink',
    priority: 'HIGH',
    durationMinutes: 3,
    powerWatts: 2.2,
    dataRateKbps: 19.2,
    storageDeltaMB: 0,
    requiresLOS: true,
    desc: 'Upload Two-Line Element (TLE) and quaternion attitude targets.'
  },
  PAYLOAD_IMAGE: {
    type: 'PAYLOAD_IMAGE',
    name: 'Multispectral Camera Downlink',
    priority: 'MEDIUM',
    durationMinutes: 5,
    powerWatts: 6.0,
    dataRateKbps: 256.0,
    storageDeltaMB: -28,
    requiresLOS: true,
    desc: 'High-speed downlink of compressed 12-band multispectral farm imagery.'
  },
  SCIENCE_DATA: {
    type: 'SCIENCE_DATA',
    name: 'Magnetometer Science Dump',
    priority: 'LOW',
    durationMinutes: 4,
    powerWatts: 3.5,
    dataRateKbps: 64.0,
    storageDeltaMB: -12,
    requiresLOS: true,
    desc: 'Downlink magnetic field fluctuations recorded in LEO orbit.'
  },
  SAFE_HOLD: {
    type: 'SAFE_HOLD',
    name: 'Safe-Hold Load Shedding',
    priority: 'CRITICAL',
    durationMinutes: 5,
    powerWatts: 0.4,
    dataRateKbps: 0,
    storageDeltaMB: 0,
    requiresLOS: false,
    desc: 'Emergency minimal power state with payload disconnected to allow recharge.'
  }
};

export function propagateOrbit(tSeconds, options = {}) {
  const altitudeKm = options.altitudeKm || 550.0;
  const inclinationDeg = options.inclinationDeg || 97.5;
  const rOrbit = EARTH_RADIUS_KM + altitudeKm;
  const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(rOrbit, 3) / MU_EARTH);
  const meanMotionRadSec = (2 * Math.PI) / periodSeconds;
  const orbitalVelocityKmS = Math.sqrt(MU_EARTH / rOrbit);

  const meanAnomaly = (meanMotionRadSec * tSeconds) % (2 * Math.PI);
  const incRad = (inclinationDeg * Math.PI) / 180.0;
  const raanRad = (options.raanDeg || 120.0) * Math.PI / 180.0;
  const greenwichHourAngle = (EARTH_ROTATION_RATE * tSeconds) % (2 * Math.PI);

  const xOrb = rOrbit * Math.cos(meanAnomaly);
  const yOrb = rOrbit * Math.sin(meanAnomaly);

  const xECI = xOrb * Math.cos(raanRad) - yOrb * Math.sin(raanRad) * Math.cos(incRad);
  const yECI = xOrb * Math.sin(raanRad) + yOrb * Math.sin(raanRad) * Math.cos(incRad);
  const zECI = yOrb * Math.sin(incRad);

  const xECEF = xECI * Math.cos(greenwichHourAngle) + yECI * Math.sin(greenwichHourAngle);
  const yECEF = -xECI * Math.sin(greenwichHourAngle) + yECI * Math.cos(greenwichHourAngle);
  const zECEF = zECI;

  const latitudeRad = Math.asin(zECEF / rOrbit);
  const longitudeRad = Math.atan2(yECEF, xECEF);

  const latitudeDeg = (latitudeRad * 180.0) / Math.PI;
  let longitudeDeg = (longitudeRad * 180.0) / Math.PI;
  if (longitudeDeg > 180) longitudeDeg -= 360;
  if (longitudeDeg < -180) longitudeDeg += 360;

  const inSunlight = Math.cos(meanAnomaly) > -0.32;

  return {
    tSeconds,
    latitude: latitudeDeg,
    longitude: longitudeDeg,
    altitude: altitudeKm,
    velocity: orbitalVelocityKmS,
    periodMinutes: periodSeconds / 60.0,
    inSunlight,
    inEclipse: !inSunlight,
    xECI, yECI, zECI,
    xECEF, yECEF, zECEF
  };
}

export function calculateLookAngles(satLatDeg, satLonDeg, satAltKm, gsLatDeg, gsLonDeg, gsAltKm = 0) {
  const DEG2RAD = Math.PI / 180.0;
  const RAD2DEG = 180.0 / Math.PI;

  const lat1 = gsLatDeg * DEG2RAD;
  const lon1 = gsLonDeg * DEG2RAD;
  const lat2 = satLatDeg * DEG2RAD;
  const lon2 = satLonDeg * DEG2RAD;

  const r1 = EARTH_RADIUS_KM + (gsAltKm / 1000.0);
  const r2 = EARTH_RADIUS_KM + satAltKm;

  const dLon = lon2 - lon1;
  const cosGamma = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const gamma = Math.acos(Math.max(-1, Math.min(1, cosGamma)));

  const rangeKm = Math.sqrt(r1 * r1 + r2 * r2 - 2 * r1 * r2 * Math.cos(gamma));
  const elevationRad = Math.atan((r2 * Math.cos(gamma) - r1) / (r2 * Math.sin(gamma)));
  const elevationDeg = elevationRad * RAD2DEG;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let azimuthDeg = Math.atan2(y, x) * RAD2DEG;
  if (azimuthDeg < 0) azimuthDeg += 360;

  return {
    azimuthDeg,
    elevationDeg,
    rangeKm,
    isAboveHorizon: elevationDeg >= 0
  };
}

export function calculatePassWindows(durationMinutes = 90, groundStations = DEFAULT_GROUND_STATIONS, stepSeconds = 15) {
  const passes = [];
  const totalSeconds = durationMinutes * 60;

  groundStations.forEach(gs => {
    let inPass = false;
    let currentPass = null;

    for (let t = 0; t <= totalSeconds; t += stepSeconds) {
      const satPos = propagateOrbit(t);
      const look = calculateLookAngles(satPos.latitude, satPos.longitude, satPos.altitude, gs.lat, gs.lon);

      if (look.elevationDeg >= gs.minElevation) {
        if (!inPass) {
          inPass = true;
          currentPass = {
            id: pass--,
            groundStationId: gs.id,
            groundStationName: gs.name,
            groundStationCode: gs.code,
            groundStationColor: gs.color,
            startSecond: t,
            startMinute: t / 60,
            endSecond: t,
            endMinute: t / 60,
            maxElevationDeg: look.elevationDeg,
            solar: satPos.inSunlight ? 'SUNLIGHT' : 'ECLIPSE'
          };
        } else {
          currentPass.endSecond = t;
          currentPass.endMinute = t / 60;
          if (look.elevationDeg > currentPass.maxElevationDeg) {
            currentPass.maxElevationDeg = look.elevationDeg;
          }
        }
      } else {
        if (inPass && currentPass) {
          currentPass.durationSeconds = currentPass.endSecond - currentPass.startSecond;
          currentPass.durationMinutes = (currentPass.durationSeconds / 60).toFixed(1);
          currentPass.maxElevationDeg = Math.round(currentPass.maxElevationDeg);
          passes.push(currentPass);
          currentPass = null;
          inPass = false;
        }
      }
    }

    if (inPass && currentPass) {
      currentPass.durationSeconds = currentPass.endSecond - currentPass.startSecond;
      currentPass.durationMinutes = (currentPass.durationSeconds / 60).toFixed(1);
      currentPass.maxElevationDeg = Math.round(currentPass.maxElevationDeg);
      passes.push(currentPass);
    }
  });

  return passes.sort((a, b) => a.startSecond - b.startSecond);
}

export function computePowerStep({
  dtSeconds,
  currentBatteryPercent,
  batteryCapacityWh = 24.0,
  inSunlight = true,
  solarEfficiency = 1.0,
  activeTasks = [],
  parasiticDrainWatts = 0.0
}) {
  const BASE_PASSIVE_LOAD_WATTS = 0.8;
  const NOMINAL_SOLAR_GEN_WATTS = 4.8;

  const solarGenWatts = inSunlight ? NOMINAL_SOLAR_GEN_WATTS * Math.max(0, solarEfficiency) : 0.0;

  let taskLoadWatts = 0.0;
  let currentStorageDeltaMB = 0;

  activeTasks.forEach(task => {
    const def = TASK_DEFINITIONS[task.type] || {};
    taskLoadWatts += (def.powerWatts || 1.0);
    currentStorageDeltaMB += (def.storageDeltaMB || 0);
  });

  const totalLoadWatts = BASE_PASSIVE_LOAD_WATTS + taskLoadWatts + parasiticDrainWatts;
  const netPowerWatts = solarGenWatts - totalLoadWatts;

  const energyDeltaWh = (netPowerWatts * dtSeconds) / 3600.0;
  const batteryDeltaPercent = (energyDeltaWh / batteryCapacityWh) * 100.0;

  let newBatteryPercent = currentBatteryPercent + batteryDeltaPercent;
  newBatteryPercent = Math.max(0.0, Math.min(100.0, newBatteryPercent));

  const voltage = 6.0 + (newBatteryPercent / 100.0) * 2.4;

  return {
    batteryPercent: Number(newBatteryPercent.toFixed(2)),
    solarGenWatts: Number(solarGenWatts.toFixed(2)),
    totalLoadWatts: Number(totalLoadWatts.toFixed(2)),
    netPowerWatts: Number(netPowerWatts.toFixed(2)),
    voltage: Number(voltage.toFixed(2)),
    storageDeltaMB: currentStorageDeltaMB
  };
}
