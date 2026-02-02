
import React, { useState, useCallback } from 'react';
import { UISpec, SectionType, UISection, PrimaryColor } from './types';
import { generateFullPage, regenerateSection } from './geminiService';
import SectionRenderer from './components/SectionRenderer';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [uiSpec, setUiSpec] = useState<UISpec | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const spec = await generateFullPage(prompt);
      setUiSpec(spec);
    } catch (err) {
      setError(err instanceof Error ? err.message : "System architecture failure.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateSection = useCallback((updated: UISection) => {
    setUiSpec(prev => prev ? ({
      ...prev,
      sections: prev.sections.map(s => s.id === updated.id ? updated : s)
    }) : null);
  }, []);

  const handleRegenerate = async (id: string) => {
    if (!uiSpec) return;
    const existing = uiSpec.sections.find(s => s.id === id);
    if (!existing) return;
    
    setRegeneratingIds(prev => new Set([...prev, id]));
    try {
      const fresh = await regenerateSection(prompt, existing.type, uiSpec);
      // SHALLOW MERGE: Retain structural metadata, update AI content
      handleUpdateSection({
        ...existing,
        content: { ...existing.content, ...fresh.content }
      });
    } catch (err) {
      console.error("Regeneration Error:", err);
      alert("Failed to refresh section. Please check your connection.");
    } finally {
      setRegeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleCopyJSX = async () => {
    if (!uiSpec) return;
    
    const generateTemplate = (s: UISection) => {
      // Basic escaping for exported code
      const escape = (str?: string) => (str || '').replace(/"/g, '&quot;').replace(/\n/g, ' ');
      
      switch(s.type) {
        case SectionType.NAVBAR:
          return `<nav className="flex justify-between items-center py-8">
            <h1 className="text-2xl font-black">${escape(s.content.title)}</h1>
            <button className="bg-black text-white px-8 py-2 rounded-full font-bold">${escape(s.content.buttonText)}</button>
          </nav>`;
        case SectionType.HERO:
          return `<section className="py-24 text-center">
            <h2 className="text-7xl font-black tracking-tighter">${escape(s.content.title)}</h2>
            <p className="mt-8 text-2xl text-gray-500 max-w-3xl mx-auto font-medium">${escape(s.content.description)}</p>
            <button className="mt-12 bg-black text-white px-12 py-5 rounded-[2rem] text-xl font-black">${escape(s.content.buttonText)}</button>
          </section>`;
        case SectionType.FEATURES:
          return `<section className="py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            ${(s.content.items || []).map(item => `<div className="p-12 border border-gray-100 rounded-[3rem] shadow-sm">
              <h3 className="text-2xl font-black">${escape(item.title)}</h3>
              <p className="mt-6 text-gray-500 leading-relaxed">${escape(item.description)}</p>
            </div>`).join('\n            ')}
          </section>`;
        case SectionType.CTA:
          return `<section className="bg-black text-white p-24 rounded-[4rem] text-center">
            <h2 className="text-5xl font-black mb-12">${escape(s.content.title)}</h2>
            <button className="bg-white text-black px-12 py-5 rounded-3xl font-black text-xl">${escape(s.content.buttonText)}</button>
          </section>`;
        default: return '';
      }
    };

    const code = `
import React from 'react';

/**
 * Landing Page Scaffold - Generated via GenLanding UI
 * Aesthetic: Tambo Standard
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 px-6 max-w-7xl mx-auto font-sans">
      ${uiSpec.sections.map(generateTemplate).join('\n\n      ')}
    </div>
  );
}`;
    try {
      await navigator.clipboard.writeText(code);
      alert("JSX Structure Copied!");
    } catch {
      alert("Clipboard access denied.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl"><i className="fa-solid fa-cube text-sm"></i></div>
          <span className="text-xl font-black tracking-tighter">GenLanding</span>
        </div>
        {uiSpec && (
          <div className="flex gap-2">
            <button onClick={handleCopyJSX} className="hidden sm:block text-[10px] font-black text-slate-500 px-5 py-2 hover:bg-slate-50 rounded-xl transition-all tracking-widest uppercase">Export</button>
            <button onClick={() => { if(confirm("Discard current layout?")) setUiSpec(null); }} className="bg-slate-900 text-white text-[10px] font-black px-6 py-2.5 rounded-xl shadow-xl shadow-slate-200 tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all">Reset</button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center">
        {!uiSpec && !isGenerating && (
          <div className="max-w-4xl w-full text-center py-32 md:py-48 px-6">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-12 border border-indigo-100/50">
              <i className="fa-solid fa-bolt-lightning"></i> Tambo Engine 1.1
            </div>
            <h1 className="text-6xl md:text-[9rem] font-black text-slate-900 mb-12 tracking-tighter leading-[0.85] select-none">
              Design <span className="text-indigo-600">Pure.</span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-400 mb-20 font-medium max-w-2xl mx-auto leading-tight">
              A high-end design architect that writes your code, copy, and layout in seconds.
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-5 w-full max-w-3xl mx-auto">
              <div className="relative flex-1 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition duration-1000"></div>
                <input 
                  type="text"
                  placeholder="e.g. A high-fashion jewelry brand for Gen Z"
                  className="relative w-full px-10 py-8 rounded-[2.2rem] border-2 border-slate-100 focus:border-indigo-500 outline-none text-2xl shadow-2xl bg-white transition-all font-medium"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                />
              </div>
              <button type="submit" disabled={!prompt.trim()} className="bg-indigo-600 text-white px-14 py-8 rounded-[2.2rem] font-black text-2xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-30 active:scale-95">Generate</button>
            </form>
            {error && <p className="mt-10 text-rose-500 font-bold text-sm bg-rose-50 px-8 py-4 rounded-2xl border border-rose-100 inline-block">{error}</p>}
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-64 text-center px-6">
            <div className="relative w-28 h-28 mb-12">
              <div className="absolute inset-0 border-[12px] border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-[12px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-wand-sparkles text-indigo-600 text-3xl animate-pulse"></i>
              </div>
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Forging Layout</h2>
            <p className="text-slate-400 font-medium text-xl tracking-wide">Mapping design tokens and strategic copy...</p>
          </div>
        )}

        {uiSpec && !isGenerating && (
          <div className="w-full max-w-[1500px] mx-auto py-16 md:py-24 px-4 sm:px-12">
            <div className="bg-white rounded-[5.5rem] shadow-[0_60px_150px_-40px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100/50">
              {uiSpec.sections.map(s => (
                <SectionRenderer 
                  key={s.id} 
                  section={s} 
                  theme={uiSpec.theme} 
                  onUpdate={handleUpdateSection} 
                  onRegenerate={handleRegenerate}
                  isRegenerating={regeneratingIds.has(s.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-20 text-center opacity-30 select-none">
        <div className="flex items-center justify-center gap-8 text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">
           <span>GenLanding</span>
           <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
           <span>Tambo Aesthetic</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
