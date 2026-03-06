"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, Cpu, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Al cargar, sincronizamos el estado visual con la clase del document
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      isScrolled ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "py-6 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(164,200,81,0.4)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
            <Cpu className="text-secondary" size={26} />
          </div>
          <h1 className="text-2xl font-headline font-bold tracking-[0.2em] text-foreground leading-none">
            ANDI<span className="text-primary">COT</span>
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-headline text-[13px] font-bold tracking-widest uppercase">
          <Link href="#top" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link>
          <Link href="#soluciones" className="text-muted-foreground hover:text-primary transition-colors">Ecosistemas</Link>
          <Link href="#contacto" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link>
          
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-secondary" />
              ) : (
                <Sun size={20} className="text-primary" />
              )}
            </button>
            
            <div className="h-6 w-px bg-border"></div>
            
            <Link href="/admin" className="flex items-center gap-2 border border-primary/30 bg-primary/5 text-secondary dark:text-primary px-6 py-2.5 rounded-full hover:bg-primary hover:text-secondary transition-all duration-500 shadow-lg shadow-primary/5">
              <Lock size={16} /> Administración
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-muted transition-colors text-foreground"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="text-foreground p-2 rounded-lg bg-muted" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menú Mobile Animado */}
      <div className={cn(
        "md:hidden absolute top-0 left-0 w-full h-screen bg-background transition-all duration-500 ease-in-out",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}>
        <div className="flex flex-col items-center justify-center h-full gap-10 px-10 text-center">
          <button className="absolute top-6 right-6 text-foreground p-2" onClick={() => setIsMenuOpen(false)}>
            <X size={32} />
          </button>
          
          <Link href="#top" onClick={() => setIsMenuOpen(false)} className="text-4xl font-headline font-bold text-foreground">Inicio</Link>
          <Link href="#soluciones" onClick={() => setIsMenuOpen(false)} className="text-4xl font-headline font-bold text-foreground">Ecosistemas</Link>
          <Link href="#contacto" onClick={() => setIsMenuOpen(false)} className="text-4xl font-headline font-bold text-foreground">Contacto</Link>
          
          <div className="w-full h-px bg-border my-4"></div>
          
          <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 bg-primary text-secondary font-bold px-8 py-5 rounded-2xl w-full text-xl shadow-2xl">
            <Lock size={22} /> Panel Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};
