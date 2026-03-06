"use client";

import React, { useState } from 'react';
import { Settings, Server, ImageIcon, Users, LogOut, Cpu, Save, Menu, X, BarChart3 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSave: () => void;
  onLogout: () => void;
  isSaving: boolean;
}

export const Dashboard = ({ children, activeTab, setActiveTab, onSave, onLogout, isSaving }: DashboardProps) => {
  const [open, setOpen] = useState(false);

  const navItems = (
    <div className="flex-1 py-6 px-4 space-y-6">
      <div>
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Rendimiento</p>
        <button onClick={() => { setActiveTab('metrics'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'metrics' ? 'bg-primary text-secondary font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
          <BarChart3 size={18} /> Estadísticas
        </button>
      </div>

      <div>
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Editor Web (CMS)</p>
        <div className="space-y-1">
          <button onClick={() => { setActiveTab('general'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'general' ? 'bg-primary text-secondary font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
            <Settings size={18} /> General
          </button>
          <button onClick={() => { setActiveTab('ecosystems'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'ecosystems' ? 'bg-primary text-secondary font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
            <Server size={18} /> Ecosistemas
          </button>
          <button onClick={() => { setActiveTab('brands'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'brands' ? 'bg-primary text-secondary font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
            <ImageIcon size={18} /> Marcas
          </button>
        </div>
      </div>

      <div>
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Ventas (CRM)</p>
        <button onClick={() => { setActiveTab('crm'); setOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${activeTab === 'crm' ? 'bg-primary text-secondary font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
          <Users size={18} /> Prospectos
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden font-headline bg-background text-foreground w-full">
      {/* Sidebar Desktop - Fixed & Non-scrolling */}
      <aside className="hidden md:flex w-64 bg-secondary text-white flex-col shrink-0 shadow-2xl z-50 border-r border-white/5">
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#1a1d3c]">
          <div className="flex items-center gap-2">
            <Cpu className="text-primary" size={24} />
            <span className="font-bold text-xl tracking-tight">Admin<span className="text-primary">Portal</span></span>
          </div>
        </div>
        {navItems}
        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white py-2 text-sm transition-colors">
            <LogOut size={16} /> Salir del Portal
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background relative">
        
        {/* Header - Fixed Top */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-40 shadow-sm transition-colors">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-secondary text-white border-none">
                  <SheetHeader className="h-20 flex flex-row items-center px-6 border-b border-white/5 bg-[#1a1d3c] space-y-0 text-left">
                    <SheetTitle className="text-xl font-bold text-primary">Navegación</SheetTitle>
                  </SheetHeader>
                  {navItems}
                  <div className="p-4 border-t border-white/5 mt-auto">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 text-sm">
                      <LogOut size={16} /> Salir
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <h2 className="text-lg md:text-2xl font-bold text-foreground capitalize truncate tracking-tight">
              {activeTab === 'metrics' && 'Dashboard de Estadísticas'}
              {activeTab === 'general' && 'Configuración General'}
              {activeTab === 'ecosystems' && 'Gestión de Ecosistemas'}
              {activeTab === 'brands' && 'Aliados Estratégicos'}
              {activeTab === 'crm' && 'CRM de Prospectos'}
            </h2>
          </div>

          {activeTab !== 'crm' && activeTab !== 'metrics' && (
            <button 
              onClick={onSave} 
              disabled={isSaving} 
              className="flex items-center gap-2 bg-primary text-secondary px-4 md:px-6 py-2 md:py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-70 font-bold shadow-lg text-sm"
            >
              <Save size={18} className={isSaving ? "animate-spin" : ""} /> 
              <span className="hidden sm:inline">{isSaving ? 'Guardando...' : 'Publicar Cambios'}</span>
              <span className="sm:hidden">{isSaving ? '...' : 'Publicar'}</span>
            </button>
          )}
        </header>

        {/* Content Area - ONLY SCROLLABLE PART */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
