
"use client";

import React from 'react';
import { Activity, Sparkles } from 'lucide-react';
import { IconMapper } from '../icons/IconMapper';
import { SiteContent } from '@/lib/types';

export const Hero = ({ content }: { content: SiteContent }) => {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border-primary/20 text-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8">
            <Activity size={16} /> Ingeniería de Alto Nivel
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold mb-8 tracking-tighter leading-[1.1] text-foreground">
            {content.heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 0 ? "text-primary" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-base md:text-lg font-body italic text-muted-foreground max-w-xl mb-12 leading-relaxed opacity-90">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto">
            <a href="#contacto" className="bg-primary text-secondary font-bold py-4 px-8 rounded-xl text-base hover:bg-secondary hover:text-white dark:hover:bg-white transition-all duration-300 shadow-xl text-center">
              {content.ctaText}
            </a>
            <button 
              onClick={openChat}
              className="bg-secondary/10 dark:bg-secondary/50 backdrop-blur-md border border-primary/30 text-foreground dark:text-white font-bold py-4 px-8 rounded-xl text-base hover:bg-primary hover:text-secondary transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
            >
              <Sparkles size={20} className="text-primary" /> Asistente IA
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full lg:w-[70%] grid grid-cols-2 gap-3">
            {content.stats.map((stat) => (
              <div key={stat.id} className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-300 group aspect-square">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 dark:bg-secondary/50 border border-primary/20 flex items-center justify-center mb-3 text-primary group-hover:bg-primary group-hover:text-secondary transition-all shadow-md">
                  <IconMapper name={stat.icon} size={20} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-1 tracking-tighter">{stat.value}</h3>
                <p className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-primary/70 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
