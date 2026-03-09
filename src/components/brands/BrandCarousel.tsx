
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

const BrandItem = ({ brand }: { brand: SiteContent['brands'][0] }) => {
  return (
    <div className="w-[160px] md:w-[220px] flex-shrink-0 flex items-center justify-center px-6">
      {brand.url ? (
        <img 
          src={brand.url} 
          alt={brand.name} 
          className="max-h-10 md:max-h-16 max-w-full object-contain pointer-events-none"
        />
      ) : (
        <span className="font-bold text-3xl md:text-5xl tracking-widest uppercase text-primary/80 text-center leading-none pointer-events-none">
          {brand.name}
        </span>
      )}
    </div>
  );
};

export const BrandCarousel = ({ brands }: { brands: SiteContent['brands'] }) => {
  if (!brands || brands.length === 0) return null;

  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-12 md:py-20 bg-[#05060d] border-y border-white/5 relative z-10 overflow-hidden pointer-events-none">
      <div className="text-center px-6 mb-8 md:mb-12">
         <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-primary/70 uppercase">Aliados Estratégicos & Ecosistemas</p>
      </div>
      
      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-16 md:before:w-48 before:bg-gradient-to-r before:from-[#05060d] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-16 md:after:w-48 after:bg-gradient-to-l after:from-[#05060d] after:to-transparent">
        <div className="carousel-track items-center py-6">
          {displayBrands.map((brand, idx) => (
            <div key={`${brand.id}-${idx}`} className="flex-shrink-0">
              <BrandItem brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
