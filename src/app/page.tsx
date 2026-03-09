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
import { defaultSiteContent, defaultServices, defaultBrands } from '@/lib/defaults';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'siteContent'), (snapshot) => {
      if (snapshot.exists()) {
        const firestoreData = snapshot.data() as any;
        
        // Merge Blindado: Rescate de imágenes si Firestore envía campos vacíos
        const mergedServices = (firestoreData.services || []).length > 0 
          ? firestoreData.services.map((s: any, i: number) => ({
              ...s,
              imgUrl: s.imgUrl && s.imgUrl.trim() !== "" ? s.imgUrl : (defaultServices[i]?.imgUrl || "")
            }))
          : defaultServices;

        const mergedBrands = (firestoreData.brands || []).length > 0
          ? firestoreData.brands.map((b: any, i: number) => ({
              ...b,
              url: b.url && b.url.trim() !== "" ? b.url : (defaultBrands[i]?.url || "")
            }))
          : defaultBrands;

        setContent({
          ...defaultSiteContent,
          ...firestoreData,
          services: mergedServices,
          brands: mergedBrands,
          seo: {
            ...defaultSiteContent.seo,
            ...(firestoreData.seo || {})
          }
        });
      } else {
        setContent(defaultSiteContent);
      }
    });
    return () => unsub();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000')] opacity-0 dark:opacity-20 bg-cover bg-center transition-opacity duration-700" 
          style={{ mixBlendMode: 'overlay' }}
        />
        <div className="absolute inset-0 tech-grid-bg" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/5 blur-[150px] rounded-full" />
      </div>

      <Navbar />
      
      <Hero content={content} />
      <BrandCarousel brands={content.brands} />
      <ServiceGrid services={content.services} />
      <ContactForm content={content} />

      <footer className="bg-muted dark:bg-[#05060d] pt-16 pb-8 border-t border-border relative z-10 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-headline font-bold text-foreground mb-2">ANDI<span className="text-primary">COT</span></h2>
            <p className="text-muted-foreground text-sm italic font-body">Análisis, Diseño y Construcción Tecnológica de Alto Nivel.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              <a href={content.socialUrls.facebook} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-sm"><Facebook size={18} /></a>
              <a href={content.socialUrls.instagram} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-sm"><Instagram size={18} /></a>
              <a href={content.socialUrls.linkedin} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all shadow-sm"><Linkedin size={18} /></a>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end text-sm text-muted-foreground space-y-1">
            <p>{content.address}</p>
            <p>ventas@andicot.com</p>
            <p>+{content.whatsappNumber}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center border-t border-border mt-12 pt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ANDICOT. Todos los derechos reservados.
        </div>
      </footer>

      {/* Floating Buttons */}
      <a 
        href={`https://wa.me/${content.whatsappNumber}`} 
        target="_blank" 
        className="fixed bottom-6 right-6 z-50 bg-[#A4C851] text-secondary p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-white/20"
      >
        <MessageCircle size={32} />
      </a>

      <AIChatbot content={content} />
    </main>
  );
}
