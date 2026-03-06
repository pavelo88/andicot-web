"use client";

import React, { useState } from 'react';
import { Phone, Mail, MapPin, XCircle, CheckCircle2 } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto">
        
        {/* TÍTULO CENTRADO PARA AMBAS SECCIONES */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 text-white leading-tight">
            {content.formTitle}
          </h2>
          <p className="text-gray-400 font-body text-base md:text-lg leading-relaxed italic">
            {content.formSubtitle}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-10 border border-primary/20 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* SECCIÓN IZQUIERDA: Información, Mapa y Dirección */}
            <div className="flex flex-col h-full space-y-8">
              
              {/* FILA DE CONTACTO: Teléfono y Correo */}
              <div className="flex flex-wrap items-center gap-8">
                <a href={`tel:${content.whatsappNumber}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Llamada Directa</p>
                    <p className="font-bold text-white text-sm">+{content.whatsappNumber}</p>
                  </div>
                </a>
                
                <a href="mailto:ventas@andicot.com" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Correo Corporativo</p>
                    <p className="font-bold text-white text-sm">ventas@andicot.com</p>
                  </div>
                </a>
              </div>

              {/* MAPA PROTAGONISTA (MUCHO MÁS ALTO) */}
              <div className="flex-1 min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-primary/20 relative shadow-inner">
                <iframe 
                  src={content.mapUrl} 
                  width="100%" height="100%" style={{border:0}} loading="lazy" 
                  className="grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* DIRECCIÓN ABAJO DEL MAPA */}
              <div className="flex items-start gap-3 text-gray-400 pt-2 border-t border-white/5">
                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Ubicación Física</p>
                  <p className="text-sm font-medium leading-relaxed">{content.address}</p>
                </div>
              </div>
            </div>

            {/* SECCIÓN DERECHA: Formulario (Alineado en altura con la izquierda) */}
            <form onSubmit={handleSubmit} className="bg-background/40 p-6 md:p-10 rounded-2xl border border-white/5 backdrop-blur-xl flex flex-col justify-between shadow-2xl h-full">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nombre o Empresa</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Ej: Tech Solutions S.A." />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Correo Corporativo</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="usuario@empresa.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Teléfono / WhatsApp</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="+593 ..." />
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-[250px]">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Requerimiento Técnico</label>
                  <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="flex-1 w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all" placeholder="Describa su proyecto o necesidad tecnológica..." />
                </div>
              </div>
              
              <div className="mt-10">
                {status.message && (
                  <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 font-bold text-sm border ${status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-primary/10 border-primary/50 text-primary'}`}>
                    {status.type === 'error' ? <XCircle size={18}/> : <CheckCircle2 size={18}/>}
                    {status.message}
                  </div>
                )}
                <button type="submit" disabled={status.type === 'loading'} className="w-full bg-primary text-secondary font-black py-5 rounded-xl hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 uppercase tracking-[0.2em]">
                  {status.type === 'loading' ? 'Transmitiendo...' : 'Enviar Solicitud B2B'}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};