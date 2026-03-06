"use client";

import React, { useState } from 'react';
import { Phone, Mail, MapPin, XCircle, CheckCircle2, Send, FileText, ShieldAlert } from 'lucide-react';
import { SiteContent } from '@/lib/types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        
        <div className="text-center mb-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 text-white leading-tight">
            {content.formTitle}
          </h2>
          <p className="text-gray-400 font-body text-base md:text-lg leading-relaxed italic">
            {content.formSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-6 flex flex-col">
            <div className="glass-card rounded-3xl p-8 border-white/5 space-y-6">
              <div className="flex flex-wrap items-center gap-8">
                <a href={`tel:${content.whatsappNumber}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all shadow-lg shadow-primary/5">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Línea Directa</p>
                    <p className="font-bold text-white text-lg group-hover:text-primary transition-colors">+{content.whatsappNumber}</p>
                  </div>
                </a>
                
                <a href="mailto:ventas@andicot.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all shadow-lg shadow-primary/5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Email Corporativo</p>
                    <p className="font-bold text-white text-lg group-hover:text-primary transition-colors">ventas@andicot.com</p>
                  </div>
                </a>
              </div>

              <div className="h-[270px] lg:h-[340px] rounded-2xl overflow-hidden border border-white/5 relative shadow-2xl">
                <iframe 
                  src={content.mapUrl} 
                  width="100%" height="100%" style={{border:0}} loading="lazy" 
                  className="grayscale invert opacity-80 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-1000"
                />
              </div>

              <div className="flex items-start gap-4 pt-2 text-gray-400">
                <MapPin size={24} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Base de Operaciones</p>
                  <p className="text-sm font-medium leading-relaxed max-w-md">{content.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-full">
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 md:p-10 border-white/5 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group min-h-[500px]">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Send size={120} className="text-primary" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Nombre o Razón Social</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600" 
                    placeholder="Empresa S.A." 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Email Corporativo</label>
                    <input 
                      required 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600" 
                      placeholder="ejemplo@andicot.com" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">WhatsApp / Celular</label>
                    <input 
                      required 
                      type="tel" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600" 
                      placeholder="+593 ..." 
                    />
                  </div>
                </div>

                <div className="space-y-1 flex-1 flex flex-col">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Descripción del Requerimiento</label>
                  <textarea 
                    required 
                    value={formData.message} 
                    onChange={e => setFormData({...formData, message: e.target.value})} 
                    className="flex-1 min-h-[120px] w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white focus:border-primary/50 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-600 resize-none" 
                    placeholder="Detalle su proyecto tecnológico..." 
                  />
                </div>
              </div>
              
              <div className="mt-8 relative z-10 space-y-4">
                {status.message && (
                  <div className={`mb-4 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border animate-in zoom-in-95 ${status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-primary/10 border-primary/50 text-primary'}`}>
                    {status.type === 'error' ? <XCircle size={18}/> : <CheckCircle2 size={18}/>}
                    {status.message}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    type="submit" 
                    disabled={status.type === 'loading'} 
                    className="flex-1 bg-primary text-secondary font-black py-5 rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-2xl shadow-primary/10 disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
                  >
                    {status.type === 'loading' ? 'Procesando...' : (
                      <>
                        Solicitar Presupuesto <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        type="button"
                        className="bg-white/5 border border-white/10 text-white font-bold py-5 px-6 rounded-2xl hover:bg-white/10 transition-all duration-500 text-xs uppercase tracking-widest flex items-center justify-center gap-2 group"
                      >
                        <FileText size={18} className="text-primary group-hover:scale-110 transition-transform" /> Ver Garantía
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-secondary text-white border-primary/20 p-0 overflow-hidden">
                      <DialogHeader className="p-8 bg-background/50 border-b border-white/5">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                          <ShieldAlert className="text-primary" /> Políticas de Garantía
                        </DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[450px] p-8">
                        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
                          <p className="font-bold text-primary italic">Resumen de los términos y condiciones más importantes.</p>
                          <p>Los dispositivos y equipos comercializados cuentan con <strong>un año de garantía</strong> contra defectos de fábrica, de acuerdo con los siguientes términos y condiciones.</p>
                          
                          <div className="space-y-3">
                            <h4 className="text-white font-bold border-l-2 border-primary pl-3 uppercase tracking-widest text-xs">Procedimiento de Garantía</h4>
                            <ul className="space-y-2 list-disc pl-5">
                              <li><strong>Coordinación Previa:</strong> Antes de acudir, comunique el desperfecto por email (ventas@andicot.com) o WhatsApp (0984467411), incluyendo detalles y videos del problema.</li>
                              <li><strong>Recepción:</strong> El trámite se realiza en nuestra oficina (Jose Tamayo N24-33, Torres del Castillo, T2, Of. 903) de lunes a viernes, de 09h00 a 17h00.</li>
                              <li><strong>Requisitos:</strong> Es indispensable presentar la factura y todos los accesorios originales. El trámite es personal con el cliente directo.</li>
                              <li><strong>Diagnóstico:</strong> El tiempo de respuesta es de 48 a 72 horas laborables.</li>
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-white font-bold border-l-2 border-primary pl-3 uppercase tracking-widest text-xs">Condiciones y Exclusiones</h4>
                            <ul className="space-y-2 list-disc pl-5">
                              <li><strong>Reposición:</strong> Si un producto no tiene stock o está discontinuado, se emitirá una nota de crédito proporcional. El producto de recambio continúa con el tiempo de garantía original.</li>
                              <li><strong>Logística:</strong> Gastos de envío por courier a provincia son cubiertos por el cliente.</li>
                              <li><strong>Sin Garantía:</strong> Cables, accesorios y productos sin número de serie se entregan probados y no están cubiertos.</li>
                              <li><strong>Costo por Revisión:</strong> Si el equipo funciona correctamente, el diagnóstico tiene un costo de $10 + IVA. Se recomienda realizar pruebas previas por WhatsApp para evitar este cargo.</li>
                              <li><strong>Abandono:</strong> No nos responsabilizamos por equipos no reclamados después de 30 días.</li>
                            </ul>
                          </div>

                          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl space-y-2">
                            <h4 className="text-red-400 font-bold uppercase tracking-widest text-xs">Causas de Invalidación Automática</h4>
                            <p className="text-xs">La garantía se anulará de forma inmediata si el equipo ha sido abierto, manipulado por personal no autorizado, o si presenta golpes, quemaduras, humedad, sobrecargas de voltaje o alteración en los sellos de seguridad y seriales.</p>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};