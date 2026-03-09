
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

const ServiceCard = ({ service, isLarge = false }: { service: Service, isLarge?: boolean }) => {
  return (
    <div className={cn(
      "group relative rounded-3xl overflow-hidden glass-card cursor-pointer flex flex-col justify-end",
      "h-[320px]",
      isLarge ? "md:col-span-2 md:row-span-2 md:h-[480px]" : "col-span-1"
    )}>
      <div className="absolute inset-0 z-0">
        {service.imgUrl ? (
          <img 
            src={service.imgUrl} 
            alt={service.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <IconMapper name={service.icon} size={48} className="text-primary/20" />
          </div>
        )}
      </div>
      
      {/* Contenido sin gradientes oscuros que tapen la imagen */}
      <div className="relative z-20 p-6 md:p-8">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary text-secondary flex items-center justify-center mb-4 shadow-lg">
          <IconMapper name={service.icon} size={20} />
        </div>
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
          <h3 className={cn(
            "font-headline font-bold mb-1 text-white group-hover:text-primary leading-tight",
            isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          )}>
            {service.title}
          </h3>
          <p className="text-white/90 text-[10px] md:text-xs font-body italic line-clamp-2 leading-relaxed">
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
    <section id="soluciones" className="px-6 py-16 md:py-24 max-w-7xl mx-auto relative z-10 overflow-hidden">
      <div className="text-center mb-10 md:mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
           <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">Portfolio Tecnológico</span>
        </div>
        <h2 className="text-3xl md:text-6xl font-headline font-bold mb-6 text-foreground tracking-tight">
          Nuestros <span className="text-primary">Ecosistemas</span>
        </h2>
        
        <div className="max-w-md mx-auto relative mt-8">
          <div className="relative flex items-center bg-background/50 backdrop-blur-md border border-border rounded-2xl p-1 shadow-xl">
            <Search className="ml-4 text-primary/50" size={20} />
            <input 
              type="text" 
              placeholder="Buscar servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground px-4 py-3 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        {filteredServices.length > 0 ? (
          <Carousel 
            setApi={setApi}
            opts={{ loop: true, align: "start" }} 
            className="w-full max-w-sm mx-auto"
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
            <Info className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-[0.2em]">Sin resultados</p>
          </div>
        )}
      </div>

      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              isLarge={!search && (index === 0 || index === 3)} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 border border-border rounded-3xl">
             <p className="text-muted-foreground font-bold">No hay resultados para "{search}"</p>
          </div>
        )}
      </div>
    </section>
  );
};
