"use client";

import React, { useState } from 'react';
import { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

const BrandItem = ({ brand }: { brand: SiteContent['brands'][0] }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-[160px] md:w-[250px] flex-shrink-0 flex items-center justify-center p-6 transition-all duration-300">
      {!hasError ? (
        <img 
          src={brand.url} 
          alt={brand.name} 
          onError={() => setHasError(true)}
          className={cn(
            "max-h-10 md:max-h-14 max-w-full transition-all duration-500",
            "opacity-30 grayscale scale-90",
            "hover:opacity-100 hover:grayscale-0 hover:scale-110"
          )}
        />
      ) : (
        <span className={cn(
          "font-bold text-[10px] md:text-sm tracking-widest uppercase transition-all duration-500 text-center",
          "text-white/20 hover:text-primary hover:scale-110"
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
