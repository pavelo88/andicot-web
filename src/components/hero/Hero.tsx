"use client";

import React from 'react';
import { Activity } from 'lucide-react';
import { IconMapper } from '../icons/IconMapper';
import { SiteContent } from '@/lib/types';

export const Hero = ({ content }: { content: SiteContent }) => {
  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/30 text-primary text-sm font-medium mb-8">
            <Activity size={16} /> Ingeniería B2B & B2C
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold mb-6 tracking-tight leading-[1.1] text-white">
            {content.heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 0 ? "text-primary" : ""}>{word} </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl font-body italic text-gray-300 max-w-xl mb-10 leading-relaxed">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="#contacto" className="bg-primary text-secondary font-bold py-4 px-8 rounded text-lg hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(164,200,81,0.3)] text-center">
              {content.ctaText}
            </a>
            <a href="#soluciones" className="glass-card text-white font-medium py-4 px-8 rounded text-lg hover:bg-white/10 transition-all duration-300 text-center">
              Explorar Ecosistemas
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {content.stats.map((stat) => (
            <div key={stat.id} className="glass-card p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-secondary border border-primary/30 flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-secondary transition-all">
                <IconMapper name={stat.icon} size={24} />
              </div>
              <h3 className="text-3xl md:text-5xl font-bold font-headline text-white mb-2">{stat.value}</h3>
              <p className="text-[10px] md:text-xs font-bold tracking-widest text-primary uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
