"use client";

import React, { useState } from 'react';
import { MessageCircle, Settings, MapPin, XCircle, CheckCircle2 } from 'lucide-react';
import { SiteContent } from '@/lib/types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const ContactForm = ({ content }: { content: SiteContent }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Transmitiendo...' });
    try {
      await addDoc(collection(db, 'leads'), { 
        ...formData, 
        status: 'Nuevo', 
        createdAt: Date.now() 
      });
      setStatus({ type: 'success', message: '¡Gracias! Solicitud enviada correctamente.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión. Intente nuevamente.' });
    }
  };

  return (
    <section id="contacto" className="px-4 sm:px-6 py-24 relative z-10 bg-gradient-to-b from-transparent to-[#05060d]">
      <div className="max-w-7xl mx-auto glass-card rounded-3xl p-6 md:p-12 border border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start relative z-10">
          <div className="flex flex-col h-full">
            <h2 className="text-3xl md:text-5xl font-headline font-bold mb-4 text-white leading-tight">{content.formTitle}</h2>
            <p className="text-gray-400 font-body text-base md:text-lg mb-8 leading-relaxed">{content.formSubtitle}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded bg-background flex-shrink-0 flex items-center justify-center text-primary"><MessageCircle size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Ventas & Asesoría</p>
                  <p className="font-bold text-white">ventas@andicot.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded bg-background flex-shrink-0 flex items-center justify-center text-primary"><Settings size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Línea Directa</p>
                  <p className="font-bold text-white">+{content.whatsappNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded bg-background flex-shrink-0 flex items-center justify-center text-primary"><MapPin size={24} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Oficina Matriz</p>
                  <p className="font-bold text-white text-sm">{content.address}</p>
                </div>
              </div>
            </div>

            <div className="w-full h-64 md:flex-1 rounded-2xl overflow-hidden border border-primary/20 opacity-80 hover:opacity-100 transition-opacity">
              <iframe 
                src={content.mapUrl} 
                width="100%" height="100%" style={{border:0}} loading="lazy" 
                className="grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-background/80 p-6 md:p-8 rounded-2xl border border-gray-800 backdrop-blur-xl h-full flex flex-col justify-between">
            <div className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre / Empresa</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-secondary/20 border border-gray-700 rounded-lg p-3 text-white focus:border-primary outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Correo</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-secondary/20 border border-gray-700 rounded-lg p-3 text-white focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Teléfono</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-secondary/20 border border-gray-700 rounded-lg p-3 text-white focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Requerimiento</label>
                <textarea required rows={6} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-secondary/20 border border-gray-700 rounded-lg p-3 text-white focus:border-primary outline-none resize-none" />
              </div>
            </div>
            
            <div className="pt-6">
              {status.message && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 font-medium text-sm ${status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-primary/10 border-primary/50 text-primary'}`}>
                  {status.type === 'error' ? <XCircle size={18}/> : <CheckCircle2 size={18}/>}
                  {status.message}
                </div>
              )}
              <button type="submit" disabled={status.type === 'loading'} className="w-full bg-primary text-secondary font-bold py-4 rounded-lg hover:bg-white transition-all disabled:opacity-50">
                {status.type === 'loading' ? 'Enviando...' : 'Enviar Solicitud B2B'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
