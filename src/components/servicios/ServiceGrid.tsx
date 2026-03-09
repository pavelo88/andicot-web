"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { IconMapper } from '../icons/IconMapper';
import { Service } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, Info } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const ServiceCard = ({ service }: { service: Service }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="group relative rounded-3xl overflow-hidden glass-card cursor-pointer flex flex-col justify-end h-[320px] md:h-[380px] border border-border shadow-lg">
      <div className="absolute inset-0 z-0">
        {!hasError && service.imgUrl ? (
          <img 
            src={service.imgUrl} 
            alt={service.title} 
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-6 text-center">
            <IconMapper name={service.icon} size={64} className="text-primary/20 mb-4" />
            <span className="font-bold text-sm uppercase tracking-widest text-primary/60">{service.title}</span>
          </div>
        )}
        {/* Sombra sutil solo en la base para lectura, sin tapar la foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
      </div>
      
      <div className="relative z-20 p-6 md:p-8">
        <div className="w-10 h-10 rounded-2xl bg-primary text-secondary flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform">
          <IconMapper name={service.icon} size={20} />
        </div>
        <div className="space-y-2">
          <h3 className="font-headline font-bold text-white text-lg md:text-xl group-hover:text-primary leading-tight transition-colors uppercase tracking-tight">
            {service.title}
          </h3>
          <p className="text-white/90 text-[10px] md:text-xs font-body italic line-clamp-2 leading-relaxed font-medium">
            {service.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ServiceGrid = ({ services }: { services: Service[] }) => {
  const [search, setSearch] = useState('');
  const [api, setApi] = useState<CarouselApi>();

  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.title.toLowerCase().includes(search.toLowerCase()) || 
      s.desc.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, services]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="soluciones" className="px-6 py-16 md:py-24 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
           <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">Ecosistemas Tecnológicos</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-foreground tracking-tighter">
          Nuestra <span className="text-primary">Ingeniería</span>
        </h2>
        
        <div className="max-w-md mx-auto relative mt-8">
          <div className="relative flex items-center bg-card/50 backdrop-blur-md border border-border rounded-2xl p-1 shadow-2xl">
            <Search className="ml-4 text-primary" size={20} />
            <input 
              type="text" 
              placeholder="¿Qué servicio buscas?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground px-4 py-4 text-sm font-bold"
            />
          </div>
        </div>
      </div>

      {/* Vista Móvil: Carrusel Táctil */}
      <div className="md:hidden">
        {filteredServices.length > 0 ? (
          <Carousel 
            setApi={setApi}
            opts={{ loop: true, align: "start" }} 
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {filteredServices.map((service) => (
                <CarouselItem key={service.id} className="pl-4 basis-[85%]">
                  <ServiceCard service={service} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="text-center py-20 border-dashed border-2 border-border rounded-3xl">
            <p className="text-muted-foreground font-bold uppercase text-xs">Sin resultados</p>
          </div>
        )}
      </div>

      {/* Vista Escritorio: Grid Estable sin solapamientos */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className="col-span-1">
              <ServiceCard service={service} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border border-border border-dashed rounded-3xl">
             <p className="text-muted-foreground font-bold">No se encontraron ecosistemas para: "{search}"</p>
          </div>
        )}
      </div>
    </section>
  );
};