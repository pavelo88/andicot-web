
"use client";

import React from 'react';
import { Activity, ArrowDown, Sparkles } from 'lucide-react';
import { IconMapper } from '../icons/IconMapper';
import { SiteContent } from '@/lib/types';

export const Hero = ({ content }: { content: SiteContent }) => {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border-primary/20 text-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Activity size={16} className="animate-pulse" /> Ingeniería de Alto Nivel
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-headline font-bold mb-8 tracking-tighter leading-[1] text-foreground animate-in fade-in slide-in-from-left-8 duration-700">
            {content.heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 0 ? "text-primary block md:inline" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-base md:text-xl font-body italic text-muted-foreground max-w-xl mb-12 leading-relaxed opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <a href="#contacto" className="bg-primary text-secondary font-bold py-4 px-8 rounded-xl text-base md:text-lg hover:bg-secondary hover:text-white dark:hover:bg-white transition-all duration-500 shadow-[0_10px_30px_rgba(164,200,81,0.25)] text-center hover:-translate-y-1">
              {content.ctaText}
            </a>
            <button 
              onClick={openChat}
              className="bg-secondary/10 dark:bg-secondary/50 backdrop-blur-md border border-primary/30 text-foreground dark:text-white font-bold py-4 px-8 rounded-xl text-base md:text-lg hover:bg-primary hover:text-secondary transition-all duration-500 flex items-center justify-center gap-2 group shadow-xl"
            >
              <Sparkles size={20} className="text-primary group-hover:text-secondary transition-colors" /> Asistente IA
            </button>
            <a href="#soluciones" className="glass-card text-foreground font-medium py-4 px-8 rounded-xl text-base md:text-lg hover:bg-primary/10 transition-all duration-500 text-center flex items-center justify-center gap-2 border-border">
              Soluciones <ArrowDown size={18} className="animate-bounce" />
            </a>
          </div>
        </div>
        
        {/* Tarjetas de Experiencia - Animación inmediata para evitar parpadeo de hidratación */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 animate-in fade-in zoom-in duration-700">
          {content.stats.map((stat) => (
            <div key={stat.id} className="glass-card p-4 md:p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:-translate-y-2 hover:border-primary/50 transition-all duration-500 group relative">
              <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/20 animate-ping group-hover:bg-primary" />
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-secondary/10 dark:bg-secondary/50 border border-primary/20 flex items-center justify-center mb-3 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-secondary transition-all duration-500 shadow-lg">
                <IconMapper name={stat.icon} size={20} />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold font-headline text-foreground mb-1 tracking-tighter">{stat.value}</h3>
              <p className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-primary/70 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
