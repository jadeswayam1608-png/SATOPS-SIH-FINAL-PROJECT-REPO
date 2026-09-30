# 🛰️ SATOPS // Student Satellite Operations & Training Platform

> **Smart India Hackathon (SIH) | Problem Statement #209**  
> *Operations, Scheduling, Deterministic Rule Validation, In-Orbit Emergency Simulation & Autonomous AI Intelligence for Student Satellite Teams*

---

## 🌌 Overview

**SATOPS (Student Satellite Operations System)** is an aerospace-grade, web-based simulation and training environment designed to equip university CubeSat teams, student ground station operators, and space engineering cadets with professional mission operations capabilities.

Operating a satellite in Low Earth Orbit (LEO) presents critical operational constraints:
- **Tight Link Windows**: Ground station passes typically last only 8 to 12 minutes from Acquisition of Signal (AOS) to Loss of Signal (LOS).
- **Power Constraints**: Deep eclipse periods demand strict enforcement of the 20% Depth-of-Discharge (DoD) battery floor to prevent irreversible cell damage and computer brownout.
- **Attitude & Thermal Dynamics**: Balancing payload duty cycles against thermal vacuum limits, solar incidence angles, and reaction wheel desaturation.
- **Autonomous Gating**: Preventing catastrophic commanding through auditable, deterministic flight rules.

---

## 🚀 Key Modules & System Architecture

### 1. `01 // Home` — Academic Aerospace Landing Deck
- Professional aerospace HUD interface inspired by NASA and ISRO flight centers.
- Keplerian orbital trajectory paths, apogee/perigee markers, and sub-satellite coordinates.
- Realistic 3D Earth and Satellite rendering with atmospheric Rayleigh scattering, photorealistic clouds, night city lights, and multi-layer metallic satellite bus.
- Direct entry into the Mission Planner and Emergency Drill Academy via **Get Started**.

### 2. `02 // Mission Planner` — Real-Time LEO Flight Operations
- **3D Keplerian Orbit Tracker**: 550 km altitude, 53° inclination LEO propagation with live sub-satellite latitude/longitude, altitude, and orbital velocity (~7.59 km/s).
- **Ground Station Pass Timeline**: Real-time tracking across Indian and international ground stations:
  - ISRO Bangalore Dish (`GS_BLR`, 10° elevation mask)
  - IIT Madras Space Station (`GS_IITM`, 15° elevation mask)
  - NRSC Shadnagar Deep Dish (`GS_NRSC`, 8° elevation mask)
  - Svalbard Polar Station (`GS_SVL`, 10° elevation mask)
- **Sunlight vs. Eclipse (Umbra) Power Ribbon**: Live tracking of +18.0W solar generation vs. 0W discharge.
- **Differential Battery Power Integrator**: Continuous step integration with visual 20% DoD critical safe floor warnings.
- **Interactive Payload Scheduler**: Plan imaging passes, telemetry pings, wheel desaturations, and sensor calibration tasks.

### 3. `03 // Rule Engine` — Deterministic Aerospace Safety Gating
Auditable, deterministic flight constraints with interactive expandable/collapsible cards and remediation actions:
- **Rule 1**: Ground Station Pass Gating & Horizon Elevation Mask (&ge; 5°–10°).
- **Rule 2**: Solar Flare & South Atlantic Anomaly (SAA) Radiation Safe-Hold.
- **Rule 3**: Battery Depth-of-Discharge (DoD) Protection Threshold (&ge; 20% SoC).
- **Rule 4**: Antenna Deployment Verification & Detumble Interlock.
- **Rule 5**: Pre-Pass Checklist & Link-Budget Gating.

### 4. `04 // Emergency Drills` — 50 In-Orbit Anomaly Drills & 20 Quizzes
- **50 Interactive In-Orbit Anomaly Drills** across 11 critical spacecraft subsystems:
  - *COMMS*: Ground antenna rotor azimuth jam, RF polarization mismatch (RHCP/LHCP), LNA terrestrial RFI saturation, transmitter VSWR mismatch trips, WAN backhaul link cuts, and oscillator thermal frequency drift.
  - *POWER*: Solar array shadow, 80% power drop, shunt dissipator overheating, battery cell voltage charge imbalance (>150 mV delta), MPPT firmware lockup, and deployment separation switch floating logic states.
  - *ADCS*: B-dot detumbling divergence, reaction wheel saturation, zero-speed stiction, gyroscope bias random walk, parasitic magnetic dipole harness interference, and Earth albedo cloud-top glare on horizon sensors.
  - *THERMAL*: S-band PA thermal runaway, battery cryogenic freeze in eclipse, GPU payload thermal throttling, sunward MLI blanket detachment, and stuck-closed battery heater relays.
  - *CDH*: Single-Event Upset (SEU) in SAA, watchdog reboot loops, real-time clock (RTC) pass desync, telecommand authentication replay counter desync, NAND flash bad block degradation, HK telemetry FIFO queue overflow, and stuck I2C data bus recovery.
  - *PAYLOAD*: CMOS imager Sun blinding, high-voltage bias supply Paschen arc discharge hazards, and spectrometer dark-current drift.
  - *SAFETY & SPACE ENVIRONMENT*: Post-deployer 30-minute radio silence violations, debris conjunction warnings (miss distance <180m, Pc > 1e-4), upper atmospheric density spikes during geomagnetic storms, and dielectric surface charging / electrostatic discharge (ESD).
  - *STRUCTURES & PROPULSION*: Deployable UHF dipole burn-wire open circuits, deployable wing secondary microswitch false negatives, slip-ring electrical noise, cold-gas thruster solenoid leaks, tank pressure thermal contraction, and propulsion module thermal shadow recovery.
- **20 Rapid-Fire Knowledge Quizzes**: Conceptual questions testing orbital mechanics, MPPT electronics, Friis link budgets, MLI thermal blankets, Watchdog architectures, and IADC space debris mitigation standards.

### 5. `05 // Scorecard` — FRR 100-Point Certification Review
- **Dynamic Scoring Engine**: Starts at **0 / 100** and increments dynamically:
  - **Emergency Drills**: 50 scenarios &times; 1.4 PTS = **70.0 PTS**
  - **Rapid Quizzes**: 20 quizzes &times; 1.5 PTS = **30.0 PTS**
  - **Total**: **100.0 Max Points**
- **Operator Rank Tiers**:
  - `FLIGHT DIRECTOR (GO FOR LAUNCH)`: &ge; 85%
  - `CERTIFIED SATELLITE OPERATOR`: &ge; 60%
  - `JUNIOR FLIGHT CONTROLLER`: &ge; 30%
  - `TRAINEE OPERATOR`: &lt; 30%
- **Auditability**: Complete exportable JSON Flight Certification Scorecard reports.

### 6. `06 // Knowledge Library` — 20 Authoritative Operations Modules
Curated, source-grounded space operations knowledge base with definitions, explanations, examples, and citations from **ISRO**, **IN-SPACe**, **ISTRAC**, **URSC**, **IIRS**, and **CCSDS**:
1. *CubeSat Basics (1U–12U Standards)*
2. *AOS, LOS & Communication Passes*
3. *Ground Station Operations & Tracking*
4. *Housekeeping Telemetry vs. Payload Data*
5. *Battery, Sunlight & Eclipse Dynamics*
6. *Downlink, Modulation & Data Rates*
7. *Flight Rules & Operational Envelopes*
8. *Satellite Safe Mode & Contingencies*
9. *Ground Station Failure & Tactical Handover*
10. *Shift Handover & Mission Auditability*
11. *Two-Line Elements (TLE) & Orbital Propagation (SGP4)*
12. *Doppler Shift & Ground RF Tracking*
13. *Attitude Determination & Control Systems (ADCS)*
14. *Thermal Control Subsystems (TCS & MLI)*
15. *Command & Data Handling (C&DH) & Hardware Watchdogs*
16. *Electrical Power Architecture & MPPT Regulation*
17. *RF Link Budget & Free-Space Path Loss (Friis)*
18. *Space Radiation Environment & Single-Event Effects (SEU/SEL)*
19. *Payload Operations & Queue Prioritization*
20. *Space Debris Mitigation & Post-Mission Disposal (IADC/ISO)*

---

## 💻 Tech Stack & Deployment

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Canvas 2D / WebGL Orbit Rendering
- **Architecture**: Self-contained, zero-dependency deployment ready for GitHub Pages or local execution
- **Zero-Build Option**: Double-click `index.html` to run directly in any modern browser

### Running Locally

```bash
# Option 1: Python HTTP server
python -m http.server 8000

# Option 2: Node.js (npx)
npx serve .

# Option 3: Direct browser opening
Open index.html in Chrome / Edge / Firefox
```

---

## 🏆 Smart India Hackathon (SIH) Compliance

This repository directly fulfills all requirements for **SIH Problem Statement #209**:
- ✅ Deterministic safety rules and pass verification
- ✅ Dynamic battery depth-of-discharge monitoring
- ✅ In-orbit emergency anomaly handling (50 scenarios)
- ✅ Autonomous operations certification scorecard
- ✅ Authoritative ISRO / CCSDS grounded operations library
- ✅ Accessible to university student teams without proprietary software dependencies

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
