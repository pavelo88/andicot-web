"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

const BrandItem = ({ brand }: { brand: SiteContent['brands'][0] }) => {
  const [hasError, setHasError] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Detectamos si el elemento está en la zona central activa del viewport
        setIsCentered(entry.isIntersecting && entry.intersectionRatio > 0.5);
      },
      {
        root: null,
        threshold: [0.1, 0.5, 0.9],
        rootMargin: "0px -35% 0px -35%" // Zona activa más amplia para asegurar que siempre haya uno iluminado
      }
    );

    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={itemRef}
      className="w-[160px] md:w-[250px] flex-shrink-0 flex items-center justify-center p-6 transition-all duration-700 ease-in-out"
    >
      {!hasError ? (
        <img 
          src={brand.url} 
          alt={brand.name} 
          onError={() => setHasError(true)}
          className={cn(
            "max-h-10 md:max-h-14 max-w-full transition-all duration-500",
            // Grayscale por defecto
            "opacity-30 grayscale scale-90",
            // Si está en el centro O si se le hace hover manual (en desktop)
            "md:hover:grayscale-0 md:hover:opacity-100 md:hover:scale-110",
            isCentered && "opacity-100 grayscale-0 scale-110"
          )}
        />
      ) : (
        <span className={cn(
          "font-bold text-[10px] md:text-sm tracking-widest uppercase transition-all duration-500 text-center",
          isCentered ? "text-primary scale-110" : "text-white/20"
        )}>
          {brand.name}
        </span>
      )}
    </div>
  );
};

export const BrandCarousel = ({ brands }: { brands: SiteContent['brands'] }) => {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-20 bg-[#05060d] border-y border-white/5 relative z-10 overflow-hidden">
      <div className="text-center px-6 mb-12">
         <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-primary/70 uppercase">Aliados Estratégicos & Ecosistemas</p>
      </div>
      
      {/* Degradados laterales para suavizar el flujo */}
      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-32 before:bg-gradient-to-r before:from-[#05060d] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-32 after:bg-gradient-to-l after:from-[#05060d] after:to-transparent">
        <div className="carousel-track items-center py-6">
          {[...brands, ...brands, ...brands].map((brand, idx) => (
            <BrandItem key={`${brand.id}-${idx}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
};