
"use client";

import React, { useState } from 'react';
import { IconMapper } from '../icons/IconMapper';
import { Service } from '@/lib/types';

const ServiceCard = ({ service, isLarge }: { service: Service, isLarge: boolean }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`group relative rounded-2xl overflow-hidden glass-card cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(164,200,81,0.2)] hover:border-primary/50 ${isLarge ? 'md:col-span-2 md:row-span-2' : 'col-span-1'}`}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060d] via-[#05060d]/80 to-transparent z-10"></div>
        {!imgError ? (
          <img 
            src={service.imgUrl} 
            alt={service.title} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity" 
          />
        ) : (
          <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
            <div className="text-primary/10 scale-[5]">
              <IconMapper name={service.icon} />
            </div>
          </div>
        )}
      </div>
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <div className="w-12 h-12 rounded-lg bg-secondary/90 border border-primary/50 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-secondary transition-colors shadow-lg">
          <IconMapper name={service.icon} size={24} />
        </div>
        <h3 className={`font-headline font-bold mb-2 text-white group-hover:text-primary transition-colors ${isLarge ? 'text-3xl' : 'text-xl'}`}>{service.title}</h3>
        <p className="text-gray-400 text-sm font-body italic line-clamp-3 group-hover:text-gray-200 transition-colors">{service.desc}</p>
      </div>
    </div>
  );
};

export const ServiceGrid = ({ services }: { services: Service[] }) => {
  return (
    <section id="soluciones" className="px-6 py-24 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6 text-white">Catálogo de <span className="text-primary">Ecosistemas</span></h2>
        <p className="text-gray-400 font-body text-lg max-w-2xl mx-auto">Ingeniería diseñada para blindar, conectar y potenciar su infraestructura corporativa y residencial.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px]">
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
