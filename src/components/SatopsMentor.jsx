import React, { useState, useRef, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import { querySatopsKnowledge } from '../data/satopsKnowledge';

export default function SatopsMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'msg-init',
      sender: 'mentor',
      text: "Welcome Cadet! I'm your SATOPS Flight Operations Mentor. I provide verified educational guidance on CubeSats, pass planning (AOS/LOS), battery depth-of-discharge, deterministic flight rules, and emergency procedures. How can I assist your mission?",
      source: null,
      time: '00:00:00'
    }
  ]);
  const messagesEndRef = useRef(null);

  const {
    batteryPercent,
    currentOrbit,
    currentActiveTasks,
    activeEmergencies,
    tasks,
    missionTimeSeconds
  } = useMission();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  const handleSend = (textToSend) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const min = Math.floor((missionTimeSeconds || 0) / 60);
    const sec = Math.floor((missionTimeSeconds || 0) % 60);
    const timeStr = `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      time: timeStr
    };

    const missionContext = {
      batteryPercent: batteryPercent !== undefined ? batteryPercent : 94.5,
      currentOrbit: currentOrbit || { inSunlight: true },
      currentActiveTasks: currentActiveTasks || [],
      activeEmergencies: activeEmergencies || [],
      tasks: tasks || [],
      missionTimeSeconds: missionTimeSeconds || 0
    };

    const result = querySatopsKnowledge(q, missionContext);

    const mentorMsg = {
      id: `mentor-${Date.now()}`,
      sender: 'mentor',
      text: result.text,
      source: result.source,
      time: timeStr
    };

    setChatHistory(prev => [...prev, userMsg, mentorMsg]);
    setInputQuery('');
  };

  const quickPrompts = [
    'What is AOS?',
    'Why does eclipse affect battery?',
    'What is housekeeping telemetry?',
    'Why must telemetry be sent before payload data?',
    'What happens if the ground station fails?',
    'What is safe mode?',
    'Why did the battery rule fail?'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-neo bg-black hover:bg-slate-900 text-white px-4 py-3 rounded-xl border-2 border-black font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0px_#0b0f19] flex items-center space-x-2.5 transition-all"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white animate-ping"></span>
          <span>⚡ SATOPS AI MENTOR</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[82vh] bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_#0b0f19] flex flex-col overflow-hidden font-sans text-black">
          {/* Header */}
          <div className="p-3.5 bg-black text-white border-b-2 border-black flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-white animate-pulse"></div>
              <div>
                <div className="font-display font-black text-sm text-white uppercase tracking-wider flex items-center space-x-2">
                  <span>SATOPS AI Mentor</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-900 text-cyan-200 border border-cyan-400 font-bold">
                    READ-ONLY
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-300">
                  LEO Operations & Curated Space Guide
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-black border-2 border-black font-mono text-xs font-extrabold flex items-center justify-center transition shadow-[2px_2px_0px_#000]"
            >
              ✕
            </button>
          </div>

          {/* Live Telemetry Summary Pill (Read-Only) */}
          <div className="px-3 py-2 bg-[#f1f5f9] border-b-2 border-black flex items-center justify-between text-[11px] font-mono text-black font-bold">
            <div className="flex items-center space-x-1">
              <span>🔋 SoC:</span>
              <span className={`px-1.5 py-0.2 rounded border border-black ${(batteryPercent || 100) < 20 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
                {(batteryPercent || 94.5).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Orbit:</span>
              <span className="px-1.5 py-0.2 rounded border border-black bg-cyan-50 text-cyan-900">
                {currentOrbit?.inSunlight ? '☀️ Sunlight' : '🌑 Eclipse'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Station:</span>
              <span className="px-1.5 py-0.2 rounded border border-black bg-amber-50 text-amber-900">BLR-01</span>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-white border-b-2 border-black flex items-center space-x-1.5 overflow-x-auto text-[10px] font-mono">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-[#f8fafc] border-2 border-black hover:bg-cyan-100 text-black font-bold shadow-[2px_2px_0px_#0b0f19] transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-mono text-xs bg-[#f8fafc]">
            {chatHistory.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[9px] text-gray-600 mb-1 px-1 font-bold">
                  {msg.sender === 'user' ? 'Operator' : 'SATOPS Mentor'} • {msg.time}
                </div>
                <div
                  className={`p-3 rounded-xl max-w-[90%] leading-relaxed border-2 border-black shadow-[2px_2px_0px_#0b0f19] ${
                    msg.sender === 'user'
                      ? 'bg-black text-white rounded-tr-none font-medium'
                      : 'bg-white text-black rounded-tl-none space-y-2 font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans text-xs">{msg.text}</p>
                  
                  {msg.source && (
                    <div className="pt-2 mt-2 border-t border-black/30 text-[10px] font-mono text-cyan-900 font-bold flex items-center space-x-1">
                      <span>Source:</span>
                      <a
                        href={msg.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-black font-extrabold"
                      >
                        [{msg.source.organization}] {msg.source.title}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t-2 border-black">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask about passes, battery, flight rules, telemetry..."
                className="flex-1 bg-[#f8fafc] border-2 border-black rounded-lg px-3 py-2 text-xs font-mono text-black placeholder-gray-500 focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#0b0f19]"
              />
              <button
                type="submit"
                className="btn-neo px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black text-xs uppercase tracking-wider rounded-lg transition shadow-[2px_2px_0px_#0b0f19]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
