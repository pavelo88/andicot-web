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
  const [imgError, setImgError] = useState(false);

  return (
    <div className={cn(
      "group relative rounded-3xl overflow-hidden glass-card cursor-pointer transition-all duration-500 hover:shadow-[0_15px_50px_rgba(164,200,81,0.15)] hover:border-primary/40 flex flex-col justify-end",
      "h-[260px]",
      isLarge ? "md:col-span-2 md:row-span-2 md:h-[420px]" : "col-span-1"
    )}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent dark:from-[#05060d] dark:via-[#05060d]/70 dark:to-transparent z-10"></div>
        {!imgError ? (
          <img 
            src={service.imgUrl} 
            alt={service.title} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover opacity-95 dark:opacity-40 group-hover:opacity-100 dark:group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-primary/10 dark:text-primary/5 scale-[6]">
              <IconMapper name={service.icon} />
            </div>
          </div>
        )}
      </div>
      
      <div className="relative z-10 p-6 md:p-8">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-secondary/80 border border-border flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-secondary transition-all duration-500 shadow-md">
          <IconMapper name={service.icon} size={20} />
        </div>
        <h3 className={cn(
          "font-headline font-bold mb-2 text-foreground transition-colors group-hover:text-primary leading-tight",
          isLarge ? "text-2xl md:text-4xl" : "text-lg md:text-xl"
        )}>
          {service.title}
        </h3>
        <p className="text-muted-foreground text-[10px] md:text-sm font-body italic line-clamp-2 opacity-90 dark:opacity-80">
          {service.desc}
        </p>
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
    }, 4000);
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
        
        <div className="max-w-md mx-auto relative group mt-8">
          <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500 rounded-full" />
          <div className="relative flex items-center bg-background/50 backdrop-blur-md border border-border rounded-2xl p-1 shadow-xl">
            <Search className="ml-4 text-primary/50 group-hover:text-primary transition-colors" size={20} />
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
          <div className="text-center py-20 glass-card rounded-3xl border-dashed border-2 border-border">
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
          <div className="col-span-full text-center py-20 glass-card rounded-3xl">
             <p className="text-muted-foreground font-bold">No hay resultados para "{search}"</p>
          </div>
        )}
      </div>
    </section>
  );
};
