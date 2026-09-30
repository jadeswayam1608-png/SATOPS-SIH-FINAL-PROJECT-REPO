import React, { useState, useMemo } from 'react';
import { MissionProvider, useMission } from './context/MissionContext';
import OrbitVisualizer from './components/OrbitVisualizer';
import PowerChart from './components/PowerChart';
import MissionTimeline from './components/MissionTimeline';
import RuleChecker from './components/RuleChecker';
import EmergencySimulator from './components/EmergencySimulator';
import FlightReviewReport from './components/FlightReviewReport';
import LearnModule from './components/LearnModule';
import SatopsMentor from './components/SatopsMentor';

function OverviewSection({ setView }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className="min-h-[82vh] flex flex-col items-center justify-center text-center px-2 sm:px-4 py-4 select-none relative overflow-hidden"
    >
      {/* ================= 1. LEFT SIDE: ORGANIC BLACK VOID + BOTTOM MOUND + STANDING ALIEN ================= */}
      {/* Middle-Left Organic Black Void with Stars */}
      <div 
        className="absolute left-[-15px] sm:left-[-5px] md:left-2 lg:left-4 top-[5%] sm:top-[8%] select-none pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`
        }}
      >
        <svg className="w-28 sm:w-38 md:w-48 lg:w-56 h-auto" viewBox="0 0 200 240" fill="none">
          {/* Smooth organic pebble / bean shape */}
          <path d="M 65 20 C 130 10, 190 40, 195 110 C 200 180, 145 235, 80 235 C 20 235, 8 180, 12 110 C 16 45, 25 25, 65 20 Z" fill="#0b0f19" />
          {/* Star specks inside void */}
          <circle cx="85" cy="65" r="1.5" fill="#ffffff" opacity="0.9" />
          <circle cx="150" cy="90" r="1.2" fill="#ffffff" opacity="0.8" />
          <circle cx="70" cy="155" r="1.8" fill="#ffffff" opacity="0.9" />
          <circle cx="130" cy="180" r="1.2" fill="#ffffff" opacity="0.75" />
          <circle cx="165" cy="140" r="1" fill="#ffffff" opacity="0.8" />
          <circle cx="45" cy="100" r="1.5" fill="#ffffff" opacity="0.85" />
        </svg>
      </div>

      {/* Bottom-Left Organic Black Ground / Mound */}
      <div 
        className="absolute left-0 bottom-0 select-none pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * -4}px, ${mousePos.y * 4}px)`
        }}
      >
        <svg className="w-44 sm:w-56 md:w-72 lg:w-84 h-auto" viewBox="0 0 280 200" fill="none">
          <path d="M 0 50 C 45 20, 110 15, 160 60 C 205 100, 240 155, 260 200 L 0 200 Z" fill="#0b0f19" />
        </svg>
      </div>

      {/* Standing Alien (Posed on top of the bottom-left mound) */}
      <div 
        className="absolute left-0 sm:left-1 md:left-3 lg:left-6 bottom-[14%] sm:bottom-[16%] md:bottom-[18%] select-none pointer-events-none z-20 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * -7}px, ${mousePos.y * -7}px)`
        }}
      >
        <svg className="w-15 sm:w-20 md:w-26 lg:w-30 h-auto drop-shadow-md" viewBox="0 0 120 220" fill="none">
          {/* Alien Head */}
          <ellipse cx="60" cy="42" rx="26" ry="32" fill="#f8fafc" stroke="#0b0f19" strokeWidth="3" />
          {/* Big Almond Eyes */}
          <ellipse cx="46" cy="40" rx="9" ry="14" fill="#0b0f19" transform="rotate(-15 46 40)" />
          <ellipse cx="44" cy="35" rx="3" ry="5" fill="#ffffff" transform="rotate(-15 44 35)" />
          <ellipse cx="74" cy="40" rx="9" ry="14" fill="#0b0f19" transform="rotate(15 74 40)" />
          <ellipse cx="72" cy="35" rx="3" ry="5" fill="#ffffff" transform="rotate(15 72 35)" />
          {/* Nostril dots & Mouth */}
          <circle cx="58" cy="54" r="1.2" fill="#0b0f19" />
          <circle cx="62" cy="54" r="1.2" fill="#0b0f19" />
          <path d="M 53 62 Q 60 65 67 62" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />
          
          {/* Slender Torso with ribbed segments */}
          <path d="M 54 74 L 52 90 Q 42 106 45 138 Q 47 150 54 154 L 66 154 Q 73 150 75 138 Q 78 106 68 90 L 66 74 Z" fill="#f8fafc" stroke="#0b0f19" strokeWidth="3" />
          <path d="M 49 108 Q 60 112 71 108" stroke="#0b0f19" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 50 118 Q 60 122 70 118" stroke="#0b0f19" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 51 128 Q 60 132 69 128" stroke="#0b0f19" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 52 138 Q 60 142 68 138" stroke="#0b0f19" strokeWidth="1.5" strokeLinecap="round" />

          {/* Left Arm Raised Waving / Pointing towards center */}
          <path d="M 68 90 Q 86 82 92 62 Q 96 48 98 38" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 98 38 Q 99 26 96 20 M 98 38 Q 104 28 105 22 M 98 38 Q 109 34 111 30" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Right Arm hanging naturally */}
          <path d="M 46 94 Q 38 116 40 138 Q 40 146 37 150" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 37 150 Q 34 155 32 160 M 37 150 Q 38 158 38 163" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />

          {/* Skinny Legs & Three-Toed Feet */}
          <path d="M 52 154 Q 50 178 47 202 L 38 206 M 47 202 L 36 210 M 47 202 L 40 214" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
          <path d="M 66 154 Q 68 178 71 202 L 80 206 M 71 202 L 82 210 M 71 202 L 78 214" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* ================= 2. BOTTOM-LEFT: DETAILED CRATERED MOON + 4-POINT SPARKLE STAR ================= */}
      <div 
        className="absolute left-1 sm:left-3 md:left-6 bottom-0 sm:bottom-1 select-none pointer-events-none z-20 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * -5}px, ${mousePos.y * 5}px)`
        }}
      >
        <div className="relative">
          {/* 4-Point Sparkle Star */}
          <svg className="absolute top-[-16px] sm:top-[-22px] right-2 sm:right-4 w-7 sm:w-9 h-7 sm:h-9 text-white z-30 drop-shadow-md" viewBox="0 0 40 40" fill="currentColor">
            <path d="M 20 0 Q 20 20 40 20 Q 20 20 20 40 Q 20 20 0 20 Q 20 20 20 0 Z" />
            <circle cx="20" cy="20" r="2.5" fill="#38bdf8" />
          </svg>

          {/* Detailed Cratered Moon */}
          <svg className="w-22 sm:w-28 md:w-36 lg:w-42 h-auto drop-shadow-lg" viewBox="0 0 140 140" fill="none">
            <circle cx="70" cy="70" r="58" fill="#f8fafc" stroke="#0b0f19" strokeWidth="3.5" />
            {/* Main Craters with shadows & stippling */}
            <circle cx="48" cy="46" r="13" fill="#e2e8f0" stroke="#0b0f19" strokeWidth="2" />
            <circle cx="50" cy="48" r="8.5" fill="#cbd5e1" />
            <circle cx="49" cy="47" r="3" fill="#0b0f19" />
            
            <circle cx="86" cy="58" r="16" fill="#e2e8f0" stroke="#0b0f19" strokeWidth="2.2" />
            <circle cx="88" cy="60" r="11" fill="#cbd5e1" />
            <circle cx="87" cy="59" r="4" fill="#0b0f19" />

            <circle cx="56" cy="94" r="15" fill="#e2e8f0" stroke="#0b0f19" strokeWidth="2" />
            <circle cx="58" cy="96" r="10" fill="#cbd5e1" />

            <circle cx="96" cy="96" r="11" fill="#e2e8f0" stroke="#0b0f19" strokeWidth="1.8" />
            <circle cx="97" cy="97" r="7" fill="#cbd5e1" />

            <circle cx="32" cy="74" r="8" fill="#cbd5e1" stroke="#0b0f19" strokeWidth="1.5" />
            <circle cx="74" cy="30" r="7" fill="#cbd5e1" stroke="#0b0f19" strokeWidth="1.5" />
            
            {/* Texture stipple dots */}
            <circle cx="44" cy="30" r="1.5" fill="#0b0f19" />
            <circle cx="68" cy="66" r="1.5" fill="#0b0f19" />
            <circle cx="106" cy="46" r="1.5" fill="#0b0f19" />
            <circle cx="36" cy="96" r="1.5" fill="#0b0f19" />
            <circle cx="78" cy="116" r="1.5" fill="#0b0f19" />
            <circle cx="114" cy="80" r="1.2" fill="#0b0f19" />
            <circle cx="60" cy="40" r="1.2" fill="#0b0f19" />
          </svg>
        </div>
      </div>

      {/* ================= 3. TOP-RIGHT: TILTED ORGANIC BLACK VOID + SPARKLE STAR + SATURN ================= */}
      <div 
        className="absolute right-[-10px] sm:right-0 md:right-4 lg:right-8 top-1 sm:top-4 select-none pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * 9}px, ${mousePos.y * 9}px)`
        }}
      >
        <div className="relative w-48 sm:w-60 md:w-76 lg:w-88 h-48 sm:h-60 md:h-76 lg:h-88 flex items-center justify-center">
          {/* Tilted Organic Black Void */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 260" fill="none">
            <path d="M 75 30 C 145 5, 235 35, 250 105 C 265 175, 210 245, 140 250 C 70 255, 20 200, 15 130 C 10 70, 30 45, 75 30 Z" fill="#0b0f19" />
            {/* 4-point sparkle star in top-right corner of void */}
            <g transform="translate(190, 40) scale(0.7)">
              <path d="M 20 0 Q 20 20 40 20 Q 20 20 20 40 Q 20 20 0 20 Q 20 20 20 0 Z" fill="#ffffff" />
              <circle cx="20" cy="20" r="2.5" fill="#38bdf8" />
            </g>
            {/* Starfield dots */}
            <circle cx="75" cy="65" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="145" cy="65" r="2" fill="#ffffff" opacity="0.9" />
            <circle cx="215" cy="130" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="85" cy="190" r="1.8" fill="#ffffff" opacity="0.75" />
            <circle cx="170" cy="215" r="1.2" fill="#ffffff" opacity="0.7" />
          </svg>

          {/* Detailed Etched Saturn with Multi-Ring System */}
          <svg className="relative z-10 w-38 sm:w-50 md:w-64 lg:w-72 h-auto" viewBox="0 0 260 160" fill="none">
            {/* Background Ring Shadow arc */}
            <ellipse cx="130" cy="80" rx="118" ry="35" stroke="#ffffff" strokeWidth="8" transform="rotate(-18 130 80)" opacity="0.3" />
            
            {/* Planet Sphere */}
            <circle cx="130" cy="80" r="46" fill="#ffffff" stroke="#0b0f19" strokeWidth="3.5" />
            {/* Shading Bands / Crosshatching lines on planet */}
            <path d="M 88 68 Q 130 84 172 68" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 86 76 Q 130 93 174 76" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
            <path d="M 87 84 Q 130 101 173 84" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 90 92 Q 130 109 170 92" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
            <path d="M 95 101 Q 130 118 165 101" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 102 110 Q 130 124 158 110" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />

            {/* Foreground Complex Rings */}
            <ellipse cx="130" cy="80" rx="118" ry="35" stroke="#ffffff" strokeWidth="9" transform="rotate(-18 130 80)" />
            <ellipse cx="130" cy="80" rx="118" ry="35" stroke="#0b0f19" strokeWidth="3.2" transform="rotate(-18 130 80)" />
            <ellipse cx="130" cy="80" rx="104" ry="29" stroke="#0b0f19" strokeWidth="2.5" strokeDasharray="6 3" transform="rotate(-18 130 80)" />
            <ellipse cx="130" cy="80" rx="90" ry="23" stroke="#0b0f19" strokeWidth="1.8" transform="rotate(-18 130 80)" />
            <ellipse cx="130" cy="80" rx="126" ry="40" stroke="#ffffff" strokeWidth="2.5" transform="rotate(-18 130 80)" />
          </svg>
        </div>
      </div>

      {/* ================= 4. BOTTOM CENTER-LEFT: RETRO UFO FLYING SAUCER ================= */}
      <div 
        className="absolute left-[14%] sm:left-[18%] md:left-[21%] lg:left-[23%] bottom-1 sm:bottom-3 select-none pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * -4}px, ${mousePos.y * 5}px)`
        }}
      >
        <svg className="w-22 sm:w-28 md:w-36 lg:w-40 h-auto" viewBox="0 0 160 140" fill="none">
          {/* Light Ray Cone */}
          <polygon points="62,64 98,64 140,135 20,135" fill="url(#ufoRayGradient)" opacity="0.45" />
          <line x1="68" y1="66" x2="35" y2="135" stroke="#0b0f19" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <line x1="80" y1="66" x2="80" y2="135" stroke="#0b0f19" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
          <line x1="92" y1="66" x2="125" y2="135" stroke="#0b0f19" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />

          {/* Glass Cockpit Dome */}
          <ellipse cx="80" cy="38" rx="24" ry="18" fill="#ffffff" stroke="#0b0f19" strokeWidth="2.5" />
          <path d="M 68 34 Q 80 26 92 34" stroke="#0b0f19" strokeWidth="1.5" />
          <ellipse cx="74" cy="32" rx="4" ry="2" fill="#38bdf8" opacity="0.7" />

          {/* Saucer Disc & Portholes */}
          <ellipse cx="80" cy="52" rx="55" ry="16" fill="#ffffff" stroke="#0b0f19" strokeWidth="3" />
          <ellipse cx="80" cy="56" rx="52" ry="12" stroke="#0b0f19" strokeWidth="2" strokeDasharray="8 4" />
          <circle cx="50" cy="55" r="2.5" fill="#0b0f19" />
          <circle cx="65" cy="58" r="2.5" fill="#0b0f19" />
          <circle cx="80" cy="59" r="2.5" fill="#0b0f19" />
          <circle cx="95" cy="58" r="2.5" fill="#0b0f19" />
          <circle cx="110" cy="55" r="2.5" fill="#0b0f19" />

          {/* Thruster Rim */}
          <ellipse cx="80" cy="65" rx="22" ry="6" fill="#0b0f19" stroke="#0b0f19" strokeWidth="2" />
          <ellipse cx="80" cy="65" rx="16" ry="4" fill="#ffffff" />

          <defs>
            <linearGradient id="ufoRayGradient" x1="80" y1="65" x2="80" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ================= 5. BOTTOM CENTER-RIGHT: RETRO TELESCOPE ON TRIPOD ================= */}
      <div 
        className="absolute right-[22%] sm:right-[26%] md:right-[29%] lg:right-[32%] bottom-0 sm:bottom-2 select-none pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)`
        }}
      >
        <svg className="w-18 sm:w-24 md:w-30 lg:w-36 h-auto" viewBox="0 0 140 140" fill="none">
          {/* Telescope Tube angled at 30 deg */}
          <g transform="rotate(-30 70 60)">
            <rect x="30" y="52" width="80" height="15" rx="3" fill="#ffffff" stroke="#0b0f19" strokeWidth="2.5" />
            <rect x="105" y="50" width="14" height="19" rx="2" fill="#ffffff" stroke="#0b0f19" strokeWidth="2.5" />
            <line x1="110" y1="52" x2="110" y2="67" stroke="#0b0f19" strokeWidth="1.5" />
            <rect x="20" y="55" width="12" height="9" rx="1" fill="#0b0f19" stroke="#0b0f19" strokeWidth="1.5" />
            <rect x="14" y="52" width="7" height="15" rx="1" fill="#ffffff" stroke="#0b0f19" strokeWidth="2" />
            <rect x="55" y="42" width="35" height="7" rx="1.5" fill="#ffffff" stroke="#0b0f19" strokeWidth="2" />
            <line x1="62" y1="49" x2="62" y2="52" stroke="#0b0f19" strokeWidth="2" />
            <line x1="80" y1="49" x2="80" y2="52" stroke="#0b0f19" strokeWidth="2" />
          </g>

          {/* Tripod Swivel Mount */}
          <circle cx="70" cy="62" r="5" fill="#0b0f19" stroke="#0b0f19" strokeWidth="2" />
          <rect x="67" y="65" width="6" height="10" fill="#ffffff" stroke="#0b0f19" strokeWidth="2" />
          <circle cx="70" cy="76" r="3.5" fill="#0b0f19" />

          {/* Folding Tripod Legs */}
          <path d="M 68 76 L 38 135" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
          <path d="M 70 76 L 70 136" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
          <path d="M 72 76 L 102 135" stroke="#0b0f19" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="102" x2="88" y2="102" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* ================= 6. RIGHT / BOTTOM-RIGHT: DETAILED FLOATING ASTRONAUT & BOTTOM MOUND ================= */}
      {/* Bottom-Right Organic Black Mound */}
      <div 
        className="absolute right-0 bottom-0 select-none pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`
        }}
      >
        <svg className="w-44 sm:w-56 md:w-72 lg:w-84 h-auto" viewBox="0 0 280 220" fill="none">
          <path d="M 50 220 C 60 120, 120 70, 200 65 C 240 62, 265 75, 280 90 L 280 220 Z" fill="#0b0f19" />
        </svg>
      </div>

      {/* Large Floating Spacewalk Astronaut (Tilted in dynamic zero-g pose) + Floating Asteroids */}
      <div 
        className="absolute right-[-20px] sm:right-[-10px] md:right-0 lg:right-2 bottom-[3%] sm:bottom-[6%] md:bottom-[8%] select-none pointer-events-none z-20 transition-transform duration-200"
        style={{
          transform: `translate(${mousePos.x * 8}px, ${mousePos.y * -8}px) rotate(-12deg)`
        }}
      >
        <div className="relative w-56 sm:w-72 md:w-88 lg:w-[26rem] h-56 sm:h-72 md:h-88 lg:h-[26rem] flex items-center justify-center">
          {/* Floating Mini Cratered Asteroids */}
          <svg className="absolute left-3 sm:left-6 bottom-16 sm:bottom-24 w-8 sm:w-11 h-8 sm:h-11 z-30 drop-shadow-md" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="15" fill="#f8fafc" stroke="#0b0f19" strokeWidth="2" />
            <circle cx="16" cy="16" r="3.5" fill="#cbd5e1" stroke="#0b0f19" strokeWidth="1" />
            <circle cx="24" cy="22" r="4.5" fill="#cbd5e1" stroke="#0b0f19" strokeWidth="1" />
            <circle cx="18" cy="26" r="2.5" fill="#cbd5e1" />
          </svg>
          <svg className="absolute left-[-2px] sm:left-2 bottom-32 sm:bottom-42 w-5 sm:w-7 h-5 sm:h-7 z-30 drop-shadow-sm" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="11" fill="#f8fafc" stroke="#0b0f19" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="2.5" fill="#cbd5e1" />
          </svg>

          {/* High-Fidelity Retro Apollo EVA Spacewalk Astronaut */}
          <svg className="relative z-20 w-52 sm:w-68 md:w-84 lg:w-96 h-auto drop-shadow-2xl" viewBox="0 0 240 260" fill="none">
            {/* PLSS Backpack (Portable Life Support System) */}
            <g transform="rotate(-15 80 100)">
              <rect x="52" y="48" width="52" height="90" rx="12" fill="#f8fafc" stroke="#0b0f19" strokeWidth="3.5" />
              <rect x="58" y="58" width="14" height="32" rx="3" fill="#cbd5e1" stroke="#0b0f19" strokeWidth="2" />
              <rect x="76" y="58" width="22" height="12" rx="2" fill="#0b0f19" stroke="#0b0f19" strokeWidth="1.5" />
              <line x1="60" y1="102" x2="94" y2="102" stroke="#0b0f19" strokeWidth="2.5" />
              <line x1="60" y1="112" x2="94" y2="112" stroke="#0b0f19" strokeWidth="2" />
              <line x1="60" y1="122" x2="94" y2="122" stroke="#0b0f19" strokeWidth="2" />
            </g>

            {/* Left Leg (Trailing in zero-g) */}
            <g>
              {/* Upper Thigh */}
              <path d="M 105 142 L 138 185 L 156 198 L 172 192 L 158 175 L 126 136 Z" fill="#ffffff" stroke="#0b0f19" strokeWidth="3.5" strokeLinejoin="round" />
              {/* Knee joint accordion pleats */}
              <path d="M 128 165 Q 140 176 148 168" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />
              <path d="M 134 174 Q 146 185 154 177" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />
              {/* Lower Shin & Ankle cuff */}
              <path d="M 148 188 L 168 212 L 184 206 L 166 182 Z" fill="#ffffff" stroke="#0b0f19" strokeWidth="3.5" strokeLinejoin="round" />
              {/* Lunar Boot with ribbed sole */}
              <path d="M 166 205 L 188 220 L 196 216 L 194 208 L 180 196 Z" fill="#f8fafc" stroke="#0b0f19" strokeWidth="3.5" strokeLinejoin="round" />
              <ellipse cx="186" cy="216" rx="14" ry="7" fill="#0b0f19" stroke="#0b0f19" strokeWidth="2" transform="rotate(30 186 216)" />
              <line x1="176" y1="210" x2="194" y2="222" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" />
            </g>

            {/* Right Leg (Forward bent in zero-g) */}
            <g>
              {/* Thigh with fabric wrinkles */}
              <path d="M 78 138 L 94 178 L 115 212 L 134 218 L 126 196 L 105 168 L 94 132 Z" fill="#ffffff" stroke="#0b0f19" strokeWidth="3.5" strokeLinejoin="round" />
              {/* Knee bellows rings */}
              <path d="M 88 155 Q 100 166 108 158" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 94 172 Q 106 183 114 175" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 100 188 Q 112 198 120 190" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
              {/* Heavy Lunar Boot */}
              <path d="M 112 210 L 134 222 L 140 234 L 118 230 L 106 218 Z" fill="#0b0f19" stroke="#0b0f19" strokeWidth="3" />
              <ellipse cx="128" cy="226" rx="16" ry="8" fill="#ffffff" stroke="#0b0f19" strokeWidth="3" transform="rotate(22 128 226)" />
              <line x1="118" y1="222" x2="136" y2="230" stroke="#0b0f19" strokeWidth="2.5" />
              <line x1="120" y1="227" x2="138" y2="235" stroke="#0b0f19" strokeWidth="2.5" />
            </g>

            {/* Main Torso & Suit Pressure Body */}
            <g>
              <path d="M 70 82 Q 100 68 128 88 L 118 148 Q 90 156 70 140 Z" fill="#ffffff" stroke="#0b0f19" strokeWidth="3.5" strokeLinejoin="round" />
              {/* Crosshatch shadow lines on left flank */}
              <path d="M 74 95 Q 82 110 80 135" stroke="#0b0f19" strokeWidth="2" strokeDasharray="4 3" fill="none" />
              <path d="M 78 100 Q 86 115 84 140" stroke="#0b0f19" strokeWidth="2" strokeDasharray="4 3" fill="none" />
              
              {/* Chest Remote Control Unit (RCU) */}
              <rect x="80" y="90" width="36" height="38" rx="5" fill="#f1f5f9" stroke="#0b0f19" strokeWidth="2.8" />
              <circle cx="89" cy="100" r="3" fill="#38bdf8" stroke="#0b0f19" strokeWidth="1.5" />
              <circle cx="101" cy="100" r="3" fill="#f59e0b" stroke="#0b0f19" strokeWidth="1.5" />
              <circle cx="109" cy="100" r="2" fill="#ef4444" stroke="#0b0f19" strokeWidth="1.2" />
              <rect x="86" y="108" width="24" height="14" rx="2.5" fill="#0b0f19" />
              <line x1="90" y1="115" x2="106" y2="115" stroke="#38bdf8" strokeWidth="1.5" />

              {/* Oxygen Umbilical Hoses & Connectors */}
              <path d="M 68 88 C 60 102, 66 122, 78 116" stroke="#0b0f19" strokeWidth="3.5" strokeDasharray="5 2.5" fill="none" />
              <path d="M 64 96 C 56 112, 62 130, 76 124" stroke="#0b0f19" strokeWidth="3.5" strokeDasharray="5 2.5" fill="none" />
            </g>

            {/* Left Arm (Reaching forward / floating with glove) */}
            <g>
              {/* Upper Arm & Ribbed Bicep */}
              <path d="M 126 90 Q 148 100 164 118 L 178 110 Q 156 90 132 80 Z" fill="#ffffff" stroke="#0b0f19" strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M 138 92 Q 148 102 156 96" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />
              <path d="M 146 100 Q 156 110 164 104" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />

              {/* Forearm & Glove Wrist Ring */}
              <ellipse cx="174" cy="114" rx="12" ry="9" fill="#f1f5f9" stroke="#0b0f19" strokeWidth="3" transform="rotate(35 174 114)" />
              
              {/* Articulated EVA Glove with fingers spread */}
              <path d="M 180 110 Q 192 114 190 124 M 179 116 Q 190 124 186 130 M 174 120 Q 184 128 178 134 M 168 122 Q 175 130 170 136 M 184 106 Q 194 108 195 116" stroke="#0b0f19" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <ellipse cx="182" cy="118" rx="8" ry="6" fill="#ffffff" stroke="#0b0f19" strokeWidth="2.5" />
            </g>

            {/* Right Arm (Floating naturally downwards) */}
            <g>
              <path d="M 70 82 Q 50 96 56 118 L 68 114 Q 62 98 76 86 Z" fill="#ffffff" stroke="#0b0f19" strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M 56 94 Q 66 104 70 96" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />
              <path d="M 54 104 Q 64 114 68 106" stroke="#0b0f19" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="58" cy="120" rx="10" ry="7" fill="#ffffff" stroke="#0b0f19" strokeWidth="2.8" />
              <path d="M 54 122 Q 50 130 52 136 M 58 124 Q 56 134 60 138" stroke="#0b0f19" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Spacesuit Helmet with Deep Glossy Tinted Visor & Reflection */}
            <g>
              {/* Helmet Outer Dome with neck seal collar */}
              <ellipse cx="94" cy="56" rx="30" ry="28" fill="#ffffff" stroke="#0b0f19" strokeWidth="4" />
              <path d="M 76 74 Q 96 84 118 72" stroke="#0b0f19" strokeWidth="3.5" strokeLinecap="round" />

              {/* Deep Tinted Gold/Black Visor Shield */}
              <ellipse cx="98" cy="58" rx="21" ry="19" fill="#0b0f19" stroke="#0b0f19" strokeWidth="2.5" />

              {/* Brilliant Curved Specular Reflection Sheen on Visor */}
              <path d="M 86 48 Q 98 42 110 50 Q 102 46 90 52 Z" fill="#ffffff" opacity="0.95" />
              <ellipse cx="93" cy="52" rx="10" ry="5" fill="#ffffff" transform="rotate(-25 93 52)" opacity="0.9" />
              {/* Secondary Horizon reflection glint */}
              <circle cx="108" cy="65" r="3" fill="#38bdf8" opacity="0.85" />
              <path d="M 88 66 Q 100 70 112 65" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </g>
          </svg>
        </div>
      </div>

      {/* ================= CENTER 3D HEADLINE & COPY ================= */}
      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-3.5 text-center my-auto">
        {/* Top Mission Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border-2 border-black shadow-[3px_3px_0px_#0b0f19] text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#0b0f19]">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] border border-black animate-ping"></span>
          <span>ISRO SATOPS // STUDENT SATELLITE OPERATIONS</span>
        </div>

        {/* 3D Extruded Title ("EXPLORE" / "THE SPACE" in 2 compact lines with mouse tilt) */}
        <div className="w-full flex flex-col items-center justify-center text-center px-2">
          <h1 
            className="hero-3d-title text-4xl sm:text-5xl md:text-6xl lg:text-[6.2rem] tracking-tight text-center"
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 3.0}deg) rotateY(${mousePos.x * 3.0}deg)`
            }}
          >
            EXPLORE<br/>
            <span className="whitespace-nowrap inline-block mt-1">THE SPACE</span>
          </h1>
        </div>

        {/* Description Paragraph */}
        <p className="text-xs sm:text-sm text-[#0b0f19] font-sans font-semibold max-w-md mx-auto text-center leading-relaxed">
          Student satellite teams know how to build a CubeSat, but operating it is difficult. Plan orbital pass windows, guard battery depth-of-discharge, and solve in-orbit emergency drills.
        </p>

        {/* Signature Line */}
        <div className="text-[10.5px] font-mono font-bold tracking-widest uppercase text-gray-700">
          — SATOPS FLIGHT DIRECTORATE —
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
          <button 
            onClick={() => setView('planner')}
            className="btn-neo bg-black text-white px-6 py-2.5 text-xs sm:text-sm font-display font-black uppercase tracking-wider flex items-center space-x-2 shadow-[3px_3px_0px_#0b0f19]"
          >
            <span>Launch Mission Planner</span>
            <span>→</span>
          </button>

          <button 
            onClick={() => setView('drills')}
            className="btn-neo bg-white text-black px-6 py-2.5 text-xs sm:text-sm font-display font-black uppercase tracking-wider flex items-center space-x-2 shadow-[3px_3px_0px_#0b0f19]"
          >
            <span>🚨 Emergency Drill</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MissionControlDashboard() {
  const { batteryPercent } = useMission();
  const [view, setView] = useState('overview');

  const currentScore = useMemo(() => {
    let score = 100;
    if (batteryPercent < 20) score -= 25;
    else if (batteryPercent < 35) score -= 10;
    return Math.max(40, score);
  }, [batteryPercent]);

  const navTabs = [
    { id: 'overview', label: '01 // Overview' },
    { id: 'planner', label: '02 // Mission Planner' },
    { id: 'rules', label: '03 // Rule Engine' },
    { id: 'drills', label: '04 // Emergency Drills' },
    { id: 'scorecard', label: `05 // Scorecard (${currentScore}/100)` },
    { id: 'learn', label: '06 // Knowledge Library' }
  ];

  return (
    <div className="min-h-screen bg-[#e5e8ed] text-[#0b0f19] font-sans selection:bg-[#38bdf8] selection:text-black p-4 md:p-6 space-y-6">
      {/* Header Bar matching Reference Image */}
      <header className="pb-3 border-b-2 border-[#0b0f19]/80 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo + Name */}
          <div 
            onClick={() => setView('overview')}
            className="flex items-center space-x-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#38bdf8] group-hover:shadow-[3px_3px_0px_#38bdf8] transition-all">
              <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-700 shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="10">
                <circle cx="50" cy="50" r="42" strokeDasharray="180 50" />
                <circle cx="50" cy="50" r="28" strokeDasharray="120 40" />
                <circle cx="50" cy="50" r="14" />
              </svg>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-display font-black text-2xl tracking-tighter text-[#0b0f19] uppercase block leading-none text-center">
                SATOPS
              </span>
              <span className="font-mono text-[8.5px] font-extrabold text-gray-600 tracking-widest uppercase block mt-0.5 text-center">
                STUDENT SATELLITE OPS
              </span>
            </div>
          </div>

          {/* Navigation Tabs - Centered, Bold & Single-Line */}
          <nav className="flex items-center justify-center space-x-3 sm:space-x-5 md:space-x-6 text-xs font-mono font-bold uppercase tracking-wider text-[#0b0f19] mx-auto overflow-x-auto">
            {navTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`py-1 whitespace-nowrap transition-all ${
                  view === tab.id 
                    ? 'border-b-2 border-black font-black text-black' 
                    : 'font-extrabold text-[#0b0f19] hover:text-black hover:border-b-2 hover:border-black/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sub-row: OPEN FLIGHT DECK button placed on left under SATOPS */}
        <div className="flex items-center justify-start">
          <button
            onClick={() => setView(view === 'planner' ? 'overview' : 'planner')}
            className="btn-neo bg-black text-white px-4 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase tracking-wider shadow-sm"
          >
            {view === 'planner' ? '← 3D Poster View' : 'OPEN FLIGHT DECK →'}
          </button>
        </div>
      </header>

      <main className="pt-2">
        {view === 'overview' && <OverviewSection setView={setView} />}
        {view === 'planner' && (
          <div className="space-y-6">
            <MissionTimeline />
            <PowerChart />
          </div>
        )}
        {view === 'rules' && <RuleChecker />}
        {view === 'drills' && <EmergencySimulator />}
        {view === 'scorecard' && <FlightReviewReport />}
        {view === 'learn' && <LearnModule />}
      </main>

      {/* SATOPS AI Flight Operations Mentor Overlay */}
      <SatopsMentor />
    </div>
  );
}

export default function App() {
  return (
    <MissionProvider>
      <MissionControlDashboard />
    </MissionProvider>
  );
}
