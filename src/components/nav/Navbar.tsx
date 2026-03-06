
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-3 bg-background/90 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(164,200,81,0.4)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
            <Cpu className="text-secondary" size={26} />
          </div>
          <h1 className="text-2xl font-headline font-bold tracking-[0.2em] text-white leading-none">
            ANDI<span className="text-primary">COT</span>
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 font-headline text-[13px] font-bold tracking-widest uppercase">
          <Link href="#top" className="text-gray-400 hover:text-primary transition-colors">Inicio</Link>
          <Link href="#soluciones" className="text-gray-400 hover:text-primary transition-colors">Ecosistemas</Link>
          <Link href="#contacto" className="text-gray-400 hover:text-primary transition-colors">Contacto</Link>
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <Link href="/admin" className="flex items-center gap-2 border border-primary/30 bg-primary/5 text-primary px-6 py-2.5 rounded-full hover:bg-primary hover:text-secondary transition-all duration-500 shadow-lg shadow-primary/5">
            <Lock size={16} /> Administración
          </Link>
        </div>

        <button className="md:hidden text-white p-2 rounded-lg bg-white/5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Mobile Animado */}
      <div className={`md:hidden absolute top-0 left-0 w-full h-screen bg-background transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-10 px-10 text-center">
          <button className="absolute top-6 right-6 text-white p-2" onClick={() => setIsMenuOpen(false)}>
            <X size={32} />
          </button>
          
          <Link href="#top" onClick={() => setIsMenuOpen(false)} className="text-4xl font-headline font-bold text-white">Inicio</Link>
          <Link href="#soluciones" onClick={() => setIsMenuOpen(false)} className="text-4xl font-headline font-bold text-white">Ecosistemas</Link>
          <Link href="#contacto" onClick={() => setIsMenuOpen(false)} className="text-4xl font-headline font-bold text-white">Contacto</Link>
          
          <div className="w-full h-px bg-white/10 my-4"></div>
          
          <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 bg-primary text-secondary font-bold px-8 py-5 rounded-2xl w-full text-xl shadow-2xl">
            <Lock size={22} /> Panel Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};
