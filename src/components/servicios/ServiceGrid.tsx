
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { IconMapper } from '../icons/IconMapper';
import { Service } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const ServiceCard = ({ service, className }: { service: Service, className?: string }) => {
  return (
    <div className={cn("group relative rounded-[2.5rem] overflow-hidden bg-[#0a0b14] border border-white/5 shadow-2xl transition-all duration-500 hover:border-primary/40 h-full min-h-[280px]", className)}>
      {/* Imagen de Fondo */}
      {service.imgUrl && (
        <img
          src={service.imgUrl}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
        />
      )}
      
      {/* Capa de profundidad sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
      
      {/* Contenido */}
      <div className="relative z-20 h-full w-full p-6 flex flex-col justify-end">
        {/* Bloque de Icono */}
        <div className="w-11 h-11 mb-4 rounded-xl bg-primary flex items-center justify-center text-secondary shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:scale-110">
          <IconMapper name={service.icon} size={20} />
        </div>

        {/* Tarjeta de Texto Flotante (Solo para letras, al fondo) */}
        <div className="bg-black/30 backdrop-blur-md border border-white/5 p-4 rounded-2xl w-fit max-w-[90%] transition-colors duration-500 group-hover:bg-black/50">
          <h3 className="font-headline text-lg md:text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-white/70 text-[10px] md:text-xs font-body italic leading-tight line-clamp-2">
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
    if (!search) return services;
    return services.filter(s => 
      s.title.toLowerCase().includes(search.toLowerCase()) || 
      s.desc.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, services]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (document.hasFocus()) {
        api.scrollNext();
      }
    }, 2500); // 2.5 segundos exactos
    return () => clearInterval(interval);
  }, [api]);
  
  const bentoLayout = useMemo(() => {
    const s = filteredServices;
    if (!s || s.length === 0) {
        return (
          <div className="col-span-full text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
             <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Sin coincidencias técnicas</p>
          </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
            {/* CCTV - Destacado 2x2 */}
            {s[0] && <div className="md:col-span-2 md:row-span-2"><ServiceCard service={s[0]} /></div>}
            
            {/* Secundarios a la derecha de CCTV */}
            {s[1] && <div className="md:col-span-1 md:row-span-1"><ServiceCard service={s[1]} /></div>}
            {s[2] && <div className="md:col-span-1 md:row-span-1"><ServiceCard service={s[2]} /></div>}
            
            {/* Domótica - Destacado 2x2 (derecha abajo) */}
            {s[3] && <div className="md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-2"><ServiceCard service={s[3]} /></div>}
            
            {/* Fila debajo de CCTV */}
            {s[4] && <div className="md:col-span-1 md:row-span-1"><ServiceCard service={s[4]} /></div>}
            {s[5] && <div className="md:col-span-1 md:row-span-1"><ServiceCard service={s[5]} /></div>}

            {/* Fila Inferior Estándar */}
            {s.slice(6).map(service => (
                <div key={service.id} className="md:col-span-1">
                    <ServiceCard service={service} />
                </div>
            ))}
        </div>
    );
  }, [filteredServices, search]);

  return (
    <section id="soluciones" className="px-6 py-20 md:py-32 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-20">
        <div className="inline-block px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
           <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">Portfolio Tecnológico</span>
        </div>
        <h2 className="text-4xl md:text-7xl font-headline font-bold mb-10 text-foreground tracking-tighter">
          Nuestros <span className="text-primary">Ecosistemas</span>
        </h2>
        
        <div className="max-w-xl mx-auto relative">
          <div className="relative flex items-center bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-1 shadow-2xl focus-within:border-primary/30 transition-all">
            <Search className="ml-5 text-primary/50" size={20} />
            <input 
              type="text" 
              placeholder="Buscar solución de ingeniería..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground px-5 py-5 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Vista Móvil: Una sola tarjeta a la vez */}
      <div className="md:hidden">
        {filteredServices.length > 0 ? (
          <Carousel 
            setApi={setApi}
            opts={{ loop: true, align: "start" }} 
            className="w-full"
          >
            <CarouselContent className="-ml-0">
              {filteredServices.map((service) => (
                <CarouselItem key={service.id} className="pl-0 basis-full">
                  <div className="px-2 h-[450px]">
                    <ServiceCard service={service} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="text-center py-20 border-dashed border-2 border-white/5 rounded-[3rem]">
            <p className="text-muted-foreground font-black uppercase text-[10px]">Sin resultados</p>
          </div>
        )}
      </div>

      {/* Vista Escritorio: Bento Grid */}
      <div className="hidden md:block">
        {bentoLayout}
      </div>
    </section>
  );
};
