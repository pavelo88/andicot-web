"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, Cpu } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(164,200,81,0.4)] group-hover:scale-105 transition-transform">
            <Cpu className="text-secondary" size={24} />
          </div>
          <h1 className="text-2xl font-headline font-bold tracking-widest text-white leading-none">
            ANDI<span className="text-primary">COT</span>
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-headline text-sm font-medium">
          <Link href="#top" className="text-gray-300 hover:text-primary transition-colors">Inicio</Link>
          <Link href="#soluciones" className="text-gray-300 hover:text-primary transition-colors">Ecosistemas</Link>
          <Link href="#contacto" className="text-gray-300 hover:text-primary transition-colors">Contacto</Link>
          <div className="h-6 w-px bg-gray-700 mx-2"></div>
          <Link href="/admin" className="flex items-center gap-2 border border-primary/50 bg-primary/10 text-primary px-4 py-2 rounded hover:bg-primary hover:text-secondary transition-all">
            <Lock size={16} /> Administración
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-primary/20 py-4 px-6 flex flex-col gap-4 shadow-2xl">
          <Link href="#top" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-800">Inicio</Link>
          <Link href="#soluciones" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-800">Ecosistemas</Link>
          <Link href="#contacto" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-800">Contacto</Link>
          <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-primary text-secondary font-bold px-4 py-3 rounded mt-2">
            <Lock size={18} /> Administración
          </Link>
        </div>
      )}
    </nav>
  );
};
