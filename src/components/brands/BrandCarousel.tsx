"use client";

import React from 'react';
import { SiteContent } from '@/lib/types';

export const BrandCarousel = ({ brands }: { brands: SiteContent['brands'] }) => {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-12 bg-[#05060d] border-y border-primary/10 relative z-10 flex flex-col gap-10">
      <div className="text-center px-6">
         <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">Tecnologías Soportadas y Aliados Estratégicos</p>
      </div>
      
      <div className="relative w-full overflow-hidden max-w-7xl mx-auto">
        <div className="carousel-track items-center">
          {[...brands, ...brands].map((brand, idx) => (
            <div key={`mono-${idx}`} className="w-[200px] flex-shrink-0 flex items-center justify-center p-4">
              <img 
                src={brand.url} 
                alt={brand.name} 
                className="max-h-12 max-w-[150px] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
