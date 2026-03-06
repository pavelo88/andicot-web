"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles, Phone, CheckCircle2 } from 'lucide-react';
import { publicAIChatbot } from '@/ai/flows/public-ai-chatbot-flow';
import { SiteContent } from '@/lib/types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const AIChatbot = ({ content }: { content: SiteContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, showWA?: boolean, summary?: string}[]>([
    { role: 'bot', text: '¡Hola! Soy el consultor de ingeniería de ANDICOT. Cuéntame, ¿qué desafío tecnológico quieres resolver hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSavedLead, setHasSavedLead] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  const saveLeadToFirestore = async (name?: string, phone?: string, email?: string, summary?: string) => {
    if (hasSavedLead || (!name && !phone && !email)) return;
    
    try {
      await addDoc(collection(db, 'leads'), {
        name: name || 'Prospecto Chat',
        phone: phone || '',
        email: email || '',
        message: `[CAPTURA IA]: ${summary || 'Interés detectado en el chat.'}`,
        status: 'Nuevo',
        createdAt: Date.now()
      });
      setHasSavedLead(true);
      console.log('Lead guardado automáticamente desde el chat');
    } catch (err) {
      console.error('Error al guardar lead desde chat:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentMsg = input;
    setInput('');
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    setMessages(prev => [...prev, { role: 'user', text: currentMsg }]);
    setIsLoading(true);

    try {
      const servicesContext = content.services.map(s => `${s.title}: ${s.desc}`).join(" | ");
      const res = await publicAIChatbot({
        chatHistory: history,
        currentMessage: currentMsg,
        servicesContext
      });
      
      const { response, shouldShowWhatsApp, leadSummary, capturedName, capturedPhone, capturedEmail } = res;

      // Si la IA capturó datos, guardamos en Firebase automáticamente
      if (capturedName || capturedPhone || capturedEmail) {
        saveLeadToFirestore(capturedName, capturedPhone, capturedEmail, leadSummary);
      }
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        showWA: shouldShowWhatsApp,
        summary: leadSummary
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Lo siento, tuve un problema técnico. ¿Podemos continuar por WhatsApp directamente?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWALink = (summary?: string) => {
    const baseUrl = `https://wa.me/${content.whatsappNumber}`;
    const text = encodeURIComponent(`Hola ANDICOT, me interesa una consultoría técnica. Requerimiento: ${summary || 'Interés en servicios tecnológicos.'}`);
    return `${baseUrl}?text=${text}`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl mb-4 w-80 md:w-96 overflow-hidden border border-gray-200 flex flex-col h-[500px] animate-in slide-in-from-bottom-5">
          <div className="bg-secondary text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-widest leading-none">Ingeniería ANDICOT</h3>
                <p className="text-[8px] text-primary/70 uppercase font-black mt-1">Soporte IA 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white"><X size={18} /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-xl max-w-[85%] text-sm shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary text-secondary font-bold rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
                  {msg.text}
                </div>
                {msg.showWA && (
                  <div className="mt-3 flex flex-col items-start gap-2 animate-in fade-in zoom-in-95">
                    {hasSavedLead && (
                      <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full border border-green-200">
                        <CheckCircle2 size={10} /> Requerimiento registrado en CRM
                      </div>
                    )}
                    <a 
                      href={generateWALink(msg.summary)}
                      target="_blank"
                      className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                      <Phone size={14} /> Hablar con un Ingeniero
                    </a>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 flex items-center gap-2 text-xs rounded-tl-none shadow-sm">
                  <Loader2 size={12} className="animate-spin text-primary" /> Analizando tu requerimiento...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ej: Necesito cámaras para mi galpón..." 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary text-gray-800" 
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-secondary text-white p-2 rounded-full hover:bg-opacity-90 disabled:opacity-50">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-secondary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 group border border-primary/20"
      >
        <Sparkles size={24} className="text-primary" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm hidden md:inline-block">Consultar IA</span>
      </button>
    </div>
  );
};
