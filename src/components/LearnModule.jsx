import React, { useState } from 'react';
import { SATOPS_LESSONS } from '../data/satopsKnowledge';

export default function LearnModule() {
  const [selectedLessonId, setSelectedLessonId] = useState('lesson-1');

  const selectedLesson = SATOPS_LESSONS.find(l => l.id === selectedLessonId) || SATOPS_LESSONS[0];

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_#0b0f19] space-y-6 text-[#0b0f19]">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-black gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black animate-pulse"></div>
          <div>
            <h2 className="text-xl font-display font-black text-black uppercase tracking-wider">
              06 // SATOPS Knowledge Library
            </h2>
            <p className="text-xs font-mono text-gray-700">
              SATOPS uses an ISRO-first, source-grounded knowledge base, supplemented by authoritative space standards.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono bg-cyan-100 text-black border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_#0b0f19] font-bold">
            20 Operations Modules
          </span>
          <span className="text-xs font-mono bg-white text-black border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_#0b0f19] font-bold">
            ISRO-First Grounded
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
        {/* LEFT PANEL: Lesson Topic Index */}
        <div className="lg:col-span-4 bg-[#f8fafc] border-2 border-black rounded-xl p-3 flex flex-col space-y-2.5 overflow-y-auto max-h-[640px] shadow-[3px_3px_0px_#0b0f19]">
          <div className="text-[11px] font-mono text-black font-extrabold uppercase px-2 py-1 tracking-wider border-b-2 border-black mb-1">
            Lesson Topics
          </div>
          {SATOPS_LESSONS.map((lesson) => {
            const isSelected = lesson.id === selectedLesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`w-full text-left p-3 rounded-lg border-2 border-black transition-all text-xs font-mono flex items-center justify-between group shadow-[2px_2px_0px_#0b0f19] ${
                  isSelected
                    ? 'bg-black text-white font-extrabold translate-x-0.5'
                    : 'bg-white text-black hover:bg-slate-100 font-semibold'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-cyan-300' : 'text-gray-500'}`}>
                    {lesson.number} //
                  </span>
                  <span className="truncate">{lesson.title}</span>
                </div>
                <span className={`text-xs ml-2 transition-transform ${isSelected ? 'text-cyan-300 translate-x-0.5' : 'text-black group-hover:translate-x-1'}`}>
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT PANEL: Single Selected Lesson Content */}
        <div className="lg:col-span-8 bg-[#f8fafc] border-2 border-black rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-[3px_3px_0px_#0b0f19]">
          <div className="space-y-5">
            {/* Header */}
            <div className="border-b-2 border-black pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-black font-bold uppercase tracking-widest mb-1">
                <span className="px-2 py-0.5 bg-cyan-200 border border-black rounded">Module {selectedLesson.number}</span>
                <span>•</span>
                <span>Space Operations Standard</span>
              </div>
              <h3 className="text-2xl font-display font-black text-black tracking-wide">
                {selectedLesson.title}
              </h3>
            </div>

            {/* Section 1: Definition */}
            <div className="bg-white border-2 border-black rounded-xl p-4 space-y-1.5 shadow-[2px_2px_0px_#0b0f19]">
              <div className="text-[11px] font-mono text-cyan-700 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                <span>📖 1. DEFINITION</span>
              </div>
              <p className="text-sm font-sans text-gray-900 leading-relaxed font-medium">
                {selectedLesson.definition}
              </p>
            </div>

            {/* Section 2: Brief Explanation */}
            <div className="bg-white border-2 border-black rounded-xl p-4 space-y-1.5 shadow-[2px_2px_0px_#0b0f19]">
              <div className="text-[11px] font-mono text-amber-700 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                <span>⚙️ 2. BRIEF EXPLANATION</span>
              </div>
              <p className="text-sm font-sans text-gray-900 leading-relaxed font-medium">
                {selectedLesson.explanation}
              </p>
            </div>

            {/* Section 3: Example */}
            <div className="bg-white border-2 border-black rounded-xl p-4 space-y-1.5 shadow-[2px_2px_0px_#0b0f19]">
              <div className="text-[11px] font-mono text-emerald-700 uppercase tracking-wider font-extrabold flex items-center space-x-1.5">
                <span>🛰️ 3. EXAMPLE</span>
              </div>
              <p className="text-sm font-sans text-gray-900 leading-relaxed font-medium">
                {selectedLesson.example}
              </p>
            </div>
          </div>

          {/* Section 4: Sources */}
          <div className="border-t-2 border-black pt-4 mt-auto">
            <div className="text-[11px] font-mono text-black uppercase tracking-wider mb-2 font-extrabold flex items-center space-x-1.5">
              <span>🔗 Sources</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedLesson.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border-2 border-black hover:bg-cyan-50 text-black hover:text-black text-xs font-mono transition-all group shadow-[2px_2px_0px_#0b0f19]"
                >
                  <span className="px-1.5 py-0.5 rounded bg-black text-white text-[10px] font-bold">
                    {src.organization}
                  </span>
                  <span className="group-hover:underline font-bold">{src.title}</span>
                  <span className="text-[10px] text-black group-hover:translate-x-0.5 transition-transform">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
