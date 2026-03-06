
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

const BrandItem = ({ brand, isActive }: { brand: SiteContent['brands'][0], isActive: boolean }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={cn(
        "w-[140px] md:w-[220px] flex-shrink-0 flex items-center justify-center px-4 transition-all duration-500",
        isActive ? "scale-110" : "scale-90"
      )}
    >
      {!hasError ? (
        <img 
          src={brand.url} 
          alt={brand.name} 
          onError={() => setHasError(true)}
          className={cn(
            "max-h-8 md:max-h-12 max-w-full transition-all duration-700 ease-in-out",
            isActive ? "opacity-100 grayscale-0 brightness-110" : "opacity-20 grayscale brightness-50"
          )}
        />
      ) : (
        <span className={cn(
          "font-bold text-[10px] md:text-xs tracking-widest uppercase transition-all duration-700 text-center leading-none",
          isActive ? "text-primary scale-110" : "text-white/10"
        )}>
          {brand.name}
        </span>
      )}
    </div>
  );
};

export const BrandCarousel = ({ brands }: { brands: SiteContent['brands'] }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px -48% 0px -48%', // Crea una franja vertical muy estrecha en el centro exacto
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
    <section className="py-12 md:py-20 bg-[#05060d] border-y border-white/5 relative z-10 overflow-hidden">
      <div className="text-center px-6 mb-8 md:mb-12">
         <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-primary/70 uppercase">Aliados Estratégicos & Ecosistemas</p>
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-20 md:before:w-40 before:bg-gradient-to-r before:from-[#05060d] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-20 md:after:w-40 after:bg-gradient-to-l after:from-[#05060d] after:to-transparent"
      >
        <div className="carousel-track items-center py-4 md:py-8">
          {displayBrands.map((brand, idx) => (
            <div 
              key={`${brand.id}-${idx}`} 
              data-index={idx}
              ref={el => { itemsRef.current[idx] = el; }}
            >
              <BrandItem brand={brand} isActive={activeIndex === idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
