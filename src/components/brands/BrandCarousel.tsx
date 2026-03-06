
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

const BrandItem = ({ brand, isActive }: { brand: SiteContent['brands'][0], isActive: boolean }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={cn(
        "w-[120px] md:w-[200px] flex-shrink-0 flex items-center justify-center px-2 transition-all duration-500",
        isActive ? "scale-105" : "scale-95"
      )}
    >
      {!hasError ? (
        <img 
          src={brand.url} 
          alt={brand.name} 
          onError={() => setHasError(true)}
          className={cn(
            "max-h-7 md:max-h-10 max-w-full transition-all duration-700 ease-in-out pointer-events-none",
            isActive ? "opacity-100 grayscale-0 brightness-110" : "opacity-40 grayscale brightness-90"
          )}
        />
      ) : (
        <span className={cn(
          "font-bold text-[9px] md:text-xs tracking-widest uppercase transition-all duration-700 text-center leading-none pointer-events-none",
          isActive ? "text-primary" : "text-white/40"
        )}>
          {brand.name}
        </span>
      )}
    </div>
  );
};

export const BrandCarousel = ({ brands }: { brands: SiteContent['brands'] }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px -49% 0px -49%', // Margen extremadamente estrecho para detectar solo el centro exacto
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActiveIndex(index);
        }
      });
    }, observerOptions);

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [brands]);

  if (!brands || brands.length === 0) return null;

  // Triplicamos para asegurar un loop infinito visual fluido
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-10 md:py-16 bg-[#05060d] border-y border-white/5 relative z-10 overflow-hidden pointer-events-none">
      <div className="text-center px-6 mb-6 md:mb-8">
         <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-primary/70 uppercase">Aliados Estratégicos & Ecosistemas</p>
      </div>
      
      <div 
        className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-16 md:before:w-32 before:bg-gradient-to-r before:from-[#05060d] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-16 md:after:w-32 after:bg-gradient-to-l after:from-[#05060d] after:to-transparent"
      >
        <div className="carousel-track items-center py-4">
          {displayBrands.map((brand, idx) => (
            <div 
              key={`${brand.id}-${idx}`} 
              data-index={idx}
              ref={el => { itemsRef.current[idx] = el; }}
              className="flex-shrink-0"
            >
              <BrandItem brand={brand} isActive={activeIndex === idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
