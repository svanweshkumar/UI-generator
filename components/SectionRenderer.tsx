
import React from 'react';
import { UISection, SectionType, PrimaryColor } from '../types';

interface SectionRendererProps {
  section: UISection;
  theme: { primaryColor: PrimaryColor };
  onUpdate: (updatedSection: UISection) => void;
  onRegenerate: (id: string) => void;
  isRegenerating: boolean;
}

type ThemeTokens = { 
  bg: string; 
  text: string; 
  ring: string; 
  shadow: string; 
  bgSoft: string; 
  hoverBg: string;
};

const THEMES: Record<PrimaryColor, ThemeTokens> = {
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', ring: 'ring-indigo-100', shadow: 'shadow-indigo-200', bgSoft: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-700' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-600', ring: 'ring-sky-100', shadow: 'shadow-sky-200', bgSoft: 'bg-sky-50', hoverBg: 'hover:bg-sky-600' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-100', shadow: 'shadow-rose-200', bgSoft: 'bg-rose-50', hoverBg: 'hover:bg-rose-600' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', ring: 'ring-emerald-100', shadow: 'shadow-emerald-200', bgSoft: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-700' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-100', shadow: 'shadow-amber-200', bgSoft: 'bg-amber-50', hoverBg: 'hover:bg-amber-600' },
  slate: { bg: 'bg-slate-900', text: 'text-slate-900', ring: 'ring-slate-100', shadow: 'shadow-slate-200', bgSoft: 'bg-slate-50', hoverBg: 'hover:bg-black' },
};

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, theme, onUpdate, onRegenerate, isRegenerating }) => {
  const t = THEMES[theme.primaryColor] ?? THEMES.indigo;

  const handleEdit = (field: string, value: string) => {
    onUpdate({ ...section, content: { ...section.content, [field]: value } });
  };

  const renderContent = () => {
    const { type, content } = section;
    const { 
      title = "Brand Concept", 
      description = "Strategic description for your high-end brand concept.", 
      subtitle = "Premium Selection", 
      buttonText = "Start Now", 
      items = [] 
    } = content;

    switch (type) {
      case SectionType.NAVBAR:
        return (
          <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 p-4 md:px-12 flex justify-between items-center transition-all">
            <div className="text-xl md:text-2xl font-black flex items-center gap-2">
              <div className={`w-6 h-6 md:w-8 md:h-8 ${t.bg} rounded-lg shadow-sm`}></div>
              <span 
                contentEditable 
                role="textbox"
                aria-label="Edit Brand Name"
                onBlur={(e) => handleEdit('title', e.currentTarget.innerText)} 
                suppressContentEditableWarning 
                className="outline-none hover:bg-slate-50 rounded px-1 transition-colors cursor-text"
              >
                {title}
              </span>
            </div>
            <button className={`${t.bg} ${t.hoverBg} text-white px-5 py-2 md:py-2.5 rounded-full text-sm font-bold shadow-lg ${t.shadow} transition-all active:scale-95`}>
              {buttonText}
            </button>
          </nav>
        );

      case SectionType.HERO:
        return (
          <section className="relative pt-20 pb-28 md:pt-40 md:pb-48 px-6 text-center">
            <div className="max-w-5xl mx-auto relative z-10">
              <span className={`inline-block px-4 py-1.5 ${t.bgSoft} ${t.text} rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-10 border border-slate-100/50`}>
                {subtitle}
              </span>
              <h1 
                className="text-5xl md:text-8xl font-black text-slate-900 mb-10 leading-[1.05] tracking-tighter outline-none hover:bg-slate-50/50 rounded-2xl transition-colors cursor-text" 
                contentEditable 
                role="textbox"
                aria-label="Edit Headline"
                onBlur={(e) => handleEdit('title', e.currentTarget.innerText)} 
                suppressContentEditableWarning
              >
                {title}
              </h1>
              <p 
                className="text-lg md:text-2xl text-slate-500 mb-14 max-w-2xl mx-auto font-medium leading-relaxed outline-none hover:bg-slate-50/50 rounded-xl transition-colors cursor-text"
                contentEditable 
                role="textbox"
                aria-label="Edit Description"
                onBlur={(e) => handleEdit('description', e.currentTarget.innerText)} 
                suppressContentEditableWarning
              >
                {description}
              </p>
              <button className={`${t.bg} ${t.hoverBg} text-white px-12 py-5 md:px-16 md:py-6 rounded-[2.5rem] text-xl font-black shadow-2xl ${t.shadow} hover:-translate-y-1 transition-all active:translate-y-0`}>
                {buttonText}
              </button>
            </div>
          </section>
        );

      case SectionType.FEATURES:
        return (
          <section className="py-24 md:py-40 px-6 bg-slate-50/50">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
              {items.slice(0, 3).map((item, i) => (
                <div key={i} className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group/feature">
                  <div className={`w-16 h-16 ${t.bgSoft} ${t.text} flex items-center justify-center rounded-2xl mb-10 shadow-inner group-hover/feature:scale-110 transition-transform`}>
                    <i className={`fa-solid ${item.icon || 'fa-sparkles'} text-2xl`}></i>
                  </div>
                  <h3 className="text-2xl font-black mb-5 tracking-tight">{item.title || "Innovation"}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-base md:text-lg">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case SectionType.CTA:
        return (
          <section className="py-16 md:py-32 px-6">
            <div className={`${t.bg} max-w-6xl mx-auto rounded-[4rem] p-14 md:p-28 text-center text-white relative shadow-2xl ${t.shadow} overflow-hidden group/cta`}>
              <h2 
                className="text-4xl md:text-7xl font-black mb-12 tracking-tighter outline-none hover:bg-white/10 rounded-3xl p-2 transition-colors cursor-text"
                contentEditable 
                role="textbox"
                aria-label="Edit CTA Headline"
                onBlur={(e) => handleEdit('title', e.currentTarget.innerText)} 
                suppressContentEditableWarning
              >
                {title}
              </h2>
              <button className="bg-white text-slate-900 px-12 md:px-16 py-5 md:py-6 rounded-3xl text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                {buttonText}
              </button>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative group min-h-[100px] border-b border-transparent hover:border-slate-100 transition-colors">
      {!isRegenerating && (
        <button 
          onClick={() => onRegenerate(section.id)}
          className="absolute top-8 right-8 z-50 opacity-0 group-hover:opacity-100 bg-white/95 backdrop-blur shadow-[0_20px_40px_rgba(0,0,0,0.1)] text-slate-900 text-[10px] font-black px-5 py-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all flex gap-3 items-center tracking-widest uppercase active:scale-95"
          title={`Refresh ${section.type} Section`}
        >
          <i className={`fa-solid fa-arrows-rotate ${t.text} animate-hover-spin`}></i> Refresh
        </button>
      )}
      
      {isRegenerating && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-[45] flex flex-col items-center justify-center gap-4">
           <div className={`w-12 h-12 border-4 ${t.text} border-t-transparent rounded-full animate-spin`}></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Updating Section...</span>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default SectionRenderer;
