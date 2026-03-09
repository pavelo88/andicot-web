
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

const BrandItem = ({ brand, isActive }: { brand: SiteContent['brands'][0], isActive: boolean }) => {
  const [hasError, setHasError] = useState(false);

  // Verificación estricta: si no hay URL o hay error, mostramos texto.
  // Importante: No renderizamos el tag <img> si la URL está vacía.
  const isValidUrl = brand.url && brand.url.trim() !== "";
  const shouldShowText = !isValidUrl || hasError;

  return (
    <div 
      className={cn(
        "w-[140px] md:w-[200px] flex-shrink-0 flex items-center justify-center px-4 transition-all duration-700 ease-in-out",
        isActive ? "scale-110" : "scale-90"
      )}
    >
      {!shouldShowText ? (
        <img 
          src={brand.url} 
          alt={brand.name} 
          onError={() => setHasError(true)}
          className={cn(
            "max-h-8 md:max-h-12 max-w-full transition-all duration-1000 ease-in-out pointer-events-none",
            isActive ? "opacity-100 grayscale-0 brightness-110" : "opacity-40 grayscale brightness-90"
          )}
        />
      ) : (
        <span className={cn(
          "font-bold text-[10px] md:text-xs tracking-widest uppercase transition-all duration-1000 text-center leading-none pointer-events-none",
          isActive ? "text-primary opacity-100" : "text-white opacity-40"
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
      rootMargin: '0px -48% 0px -48%',
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

  const validBrands = brands.filter(b => b.name || b.url);
  if (validBrands.length === 0) return null;

  const displayBrands = [...validBrands, ...validBrands, ...validBrands];

  return (
    <section className="py-12 md:py-20 bg-[#05060d] border-y border-white/5 relative z-10 overflow-hidden pointer-events-none">
      <div className="text-center px-6 mb-8 md:mb-12">
         <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-primary/70 uppercase">Aliados Estratégicos & Ecosistemas</p>
      </div>
      
      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-16 md:before:w-48 before:bg-gradient-to-r before:from-[#05060d] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-16 md:after:w-48 after:bg-gradient-to-l after:from-[#05060d] after:to-transparent">
        <div className="carousel-track items-center py-6">
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
