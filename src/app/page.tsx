"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/nav/Navbar';
import { Hero } from '@/components/hero/Hero';
import { ServiceGrid } from '@/components/servicios/ServiceGrid';
import { BrandCarousel } from '@/components/brands/BrandCarousel';
import { ContactForm } from '@/components/contact/ContactForm';
import { AIChatbot } from '@/components/chat/AIChatbot';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { SiteContent } from '@/lib/types';
import { defaultSiteContent } from '@/lib/defaults';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'siteContent'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as SiteContent);
      }
    });
    return () => unsub();
  }, []);

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000')] opacity-20 mix-blend-luminosity bg-cover" />
        <div className="absolute inset-0 tech-grid-bg" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <Navbar />
      
      <Hero content={content} />
      <BrandCarousel brands={content.brands} />
      <ServiceGrid services={content.services} />
      <ContactForm content={content} />

      <footer className="bg-[#05060d] pt-16 pb-8 border-t border-gray-900 relative z-10 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-headline font-bold text-white mb-2">ANDI<span className="text-primary">COT</span></h2>
            <p className="text-gray-500 text-sm italic font-body">Análisis, Diseño y Construcción Tecnológica de Alto Nivel.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              <a href={content.socialUrls.facebook} className="w-10 h-10 rounded-full bg-secondary border border-gray-800 flex items-center justify-center text-gray-400 hover:text-primary transition-all"><Facebook size={18} /></a>
              <a href={content.socialUrls.instagram} className="w-10 h-10 rounded-full bg-secondary border border-gray-800 flex items-center justify-center text-gray-400 hover:text-primary transition-all"><Instagram size={18} /></a>
              <a href={content.socialUrls.linkedin} className="w-10 h-10 rounded-full bg-secondary border border-gray-800 flex items-center justify-center text-gray-400 hover:text-primary transition-all"><Linkedin size={18} /></a>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end text-sm text-gray-500 space-y-1">
            <p>{content.address}</p>
            <p>ventas@andicot.com</p>
            <p>+{content.whatsappNumber}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center border-t border-gray-900 mt-12 pt-8 text-xs text-gray-600">
          &copy; {new Date().getFullYear()} ANDICOT. Todos los derechos reservados.
        </div>
      </footer>

      <a 
        href={`https://wa.me/${content.whatsappNumber}`} 
        target="_blank" 
        className="fixed bottom-6 right-6 z-50 bg-[#A4C851] text-secondary p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
      >
        <MessageCircle size={32} />
      </a>

      <AIChatbot content={content} />
    </main>
  );
}
