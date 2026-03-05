"use client";

import React, { useState } from 'react';
import { Settings, Server, ImageIcon, Users, LogOut, Cpu, Save } from 'lucide-react';

interface DashboardProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSave: () => void;
  onLogout: () => void;
  isSaving: boolean;
}

export const Dashboard = ({ children, activeTab, setActiveTab, onSave, onLogout, isSaving }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-headline text-gray-900">
      <div className="w-full md:w-64 bg-secondary text-white flex flex-col flex-shrink-0 z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/10 bg-[#1e2246]">
          <div className="flex items-center gap-2">
            <Cpu className="text-primary" size={24} />
            <span className="font-bold text-xl">Admin<span className="text-primary">Portal</span></span>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-6">
          <div>
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Editor Web (CMS)</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'general' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
                <Settings size={18} /> General
              </button>
              <button onClick={() => setActiveTab('ecosystems')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'ecosystems' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
                <Server size={18} /> Ecosistemas
              </button>
              <button onClick={() => setActiveTab('brands')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'brands' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
                <ImageIcon size={18} /> Marcas
              </button>
            </div>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Ventas (CRM)</p>
            <button onClick={() => setActiveTab('crm')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'crm' ? 'bg-primary text-secondary font-bold' : 'text-gray-300 hover:bg-white/10'}`}>
              <Users size={18} /> Prospectos
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 text-sm">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h2 className="text-2xl font-bold text-secondary capitalize">
            {activeTab === 'general' && 'Configuración General'}
            {activeTab === 'ecosystems' && 'Ecosistemas (Servicios)'}
            {activeTab === 'brands' && 'Aliados Estratégicos'}
            {activeTab === 'crm' && 'CRM de Prospectos'}
          </h2>
          {activeTab !== 'crm' && (
            <button 
              onClick={onSave} 
              disabled={isSaving} 
              className="flex items-center gap-2 bg-primary text-secondary px-6 py-2.5 rounded-lg hover:bg-[#8eb340] transition-colors disabled:opacity-70 font-bold shadow-md"
            >
              <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar y Publicar'}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};
