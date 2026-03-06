
"use client";

import React, { useState } from 'react';
import { IconMapper } from '../icons/IconMapper';
import { Service } from '@/lib/types';
import { cn } from '@/lib/utils';

const ServiceCard = ({ service, isLarge }: { service: Service, isLarge: boolean }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={cn(
      "group relative rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-500 hover:shadow-[0_15px_50px_rgba(164,200,81,0.15)] hover:border-primary/40",
      // En móvil, todas las tarjetas ocupan 1 columna. En desktop respetamos el diseño original.
      isLarge ? "md:col-span-2 md:row-span-2 min-h-[400px]" : "col-span-1 min-h-[300px]"
    )}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060d] via-[#05060d]/70 to-transparent z-10"></div>
        {!imgError ? (
          <img 
            src={service.imgUrl} 
            alt={service.title} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" 
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
            <div className="text-primary/5 scale-[6]">
              <IconMapper name={service.icon} />
            </div>
          </div>
        )}
      </div>
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        <div className="w-14 h-14 rounded-2xl bg-secondary/80 border border-white/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-secondary transition-all duration-500 shadow-xl group-hover:rotate-6">
          <IconMapper name={service.icon} size={28} />
        </div>
        <h3 className={cn(
          "font-headline font-bold mb-3 text-white transition-colors group-hover:text-primary leading-tight",
          isLarge ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
        )}>
          {service.title}
        </h3>
        <p className="text-gray-400 text-sm md:text-base font-body italic line-clamp-3 group-hover:text-gray-200 transition-all duration-500 opacity-80 group-hover:opacity-100">
          {service.desc}
        </p>
      </div>
    </div>
  );
};

export const ServiceGrid = ({ services }: { services: Service[] }) => {
  return (
    <section id="soluciones" className="px-6 py-24 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
           <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">Portfolio B2B</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-white tracking-tight">
          Nuestros <span className="text-primary">Ecosistemas</span>
        </h2>
        <p className="text-gray-400 font-body text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Ingeniería de vanguardia diseñada para blindar, conectar y potenciar la infraestructura tecnológica de su organización.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            isLarge={index === 0 || index === 3} 
          />
        ))}
      </div>
    </section>
  );
};
