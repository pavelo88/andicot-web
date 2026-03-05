"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { publicAIChatbot } from '@/ai/flows/public-ai-chatbot-flow';
import { SiteContent } from '@/lib/types';

export const AIChatbot = ({ content }: { content: SiteContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '¡Hola! Soy el ✨ Asistente IA de ANDICOT. ¿En qué ecosistema tecnológico o servicio puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const { response } = await publicAIChatbot({
        chatHistory: history,
        currentMessage: currentMsg,
        servicesContext
      });
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Lo siento, tengo problemas de conexión. Por favor intenta más tarde." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl mb-4 w-80 md:w-96 overflow-hidden border border-gray-200 flex flex-col h-[400px] animate-in slide-in-from-bottom-5">
          <div className="bg-secondary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              <h3 className="font-bold text-sm">✨ Asistente IA ANDICOT</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white"><X size={18} /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-[85%] text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-secondary font-medium rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-white border border-gray-200 text-gray-400 flex items-center gap-2 text-sm rounded-tl-none shadow-sm">
                  <Loader2 size={14} className="animate-spin text-primary" /> Pensando...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Pregunta algo..." 
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
        className="bg-secondary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 group"
      >
        <Sparkles size={24} className="text-primary" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm hidden md:inline-block">IA Chat</span>
      </button>
    </div>
  );
};
