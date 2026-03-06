"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles, Phone } from 'lucide-react';
import { publicAIChatbot } from '@/ai/flows/public-ai-chatbot-flow';
import { SiteContent } from '@/lib/types';

export const AIChatbot = ({ content }: { content: SiteContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string, showWA?: boolean, summary?: string}[]>([
    { role: 'bot', text: '¡Hola! Soy el asistente de ANDICOT. ¿Qué proyecto tecnológico tienes en mente?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

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
      const { response, shouldShowWhatsApp, leadSummary } = await publicAIChatbot({
        chatHistory: history,
        currentMessage: currentMsg,
        servicesContext
      });
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        showWA: shouldShowWhatsApp,
        summary: leadSummary
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Hubo un error. Por favor intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWALink = (summary?: string) => {
    const baseUrl = `https://wa.me/${content.whatsappNumber}`;
    const text = encodeURIComponent(`Hola, me interesa un proyecto. Resumen: ${summary || 'Interés general en servicios técnicos.'}`);
    return `${baseUrl}?text=${text}`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl mb-4 w-80 md:w-96 overflow-hidden border border-gray-200 flex flex-col h-[450px] animate-in slide-in-from-bottom-5">
          <div className="bg-secondary text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-widest">Ventas ANDICOT</h3>
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
                  <a 
                    href={generateWALink(msg.summary)}
                    target="_blank"
                    className="mt-3 flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-lg animate-pulse"
                  >
                    <Phone size={14} /> Finalizar por WhatsApp
                  </a>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 flex items-center gap-2 text-xs rounded-tl-none shadow-sm">
                  <Loader2 size={12} className="animate-spin text-primary" /> Analizando requerimiento...
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
              placeholder="Escribe tu requerimiento..." 
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
