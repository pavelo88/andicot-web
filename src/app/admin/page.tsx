"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Cpu, Loader2, Sparkles, UploadCloud, Plus, Trash2, Globe, LayoutDashboard, Settings, BarChart3, TrendingUp, Users as UsersIcon } from 'lucide-react';
import { doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SiteContent } from '@/lib/types';
import { defaultSiteContent } from '@/lib/defaults';
import { Dashboard } from '@/components/admin/Dashboard';
import { CRMLeads } from '@/components/admin/CRMLeads';
import { generateSeoMetadata } from '@/ai/flows/generate-seo-metadata-flow';
import { generateServiceDescription } from '@/ai/flows/generate-service-description-flow';

const ImagePreview = ({ src, alt, fallbackIcon: Icon }: { src: string, alt: string, fallbackIcon: any }) => {
  const [error, setError] = useState(false);
  if (!src || error) return <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50"><Icon size={32}/></div>;
  return <img src={src} alt={alt} onError={() => setError(true)} className="w-full h-full object-cover" />;
};

const BrandPreview = ({ src, name }: { src: string, name: string }) => {
  const [error, setError] = useState(false);
  if (!src || error) return <div className="h-full flex items-center justify-center p-4 bg-gray-50 w-full rounded border text-xs font-bold text-gray-400 uppercase">{name}</div>;
  return <img src={src} alt={name} onError={() => setError(true)} className="max-h-full object-contain" />;
};

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('metrics');
  const [generalView, setGeneralView] = useState<'content' | 'seo'>('content');
  
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [leadsCount, setLeadsCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  useEffect(() => {
    const unsubContent = onSnapshot(doc(db, 'config', 'siteContent'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteContent;
        setContent({ ...defaultSiteContent, ...data });
      }
    });

    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      setLeadsCount(snapshot.size);
    });

    return () => {
      unsubContent();
      unsubLeads();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_ACCESS_PASSWORD || "Andicot2026";
    if (password === adminPass) setIsLogged(true);
    else alert('Clave incorrecta');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'config', 'siteContent'), content);
      alert('Publicado correctamente');
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (file: File, path: string, callback: (url: string) => void) => {
    if (!storage) return alert('Storage no configurado');
    const fileRef = ref(storage, `site/${path}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    callback(url);
  };

  const handleGenSEO = async () => {
    setLoadingAI('seo');
    try {
      const res = await generateSeoMetadata({ heroTitle: content.heroTitle, heroSubtitle: content.heroSubtitle });
      setContent({
        ...content,
        seo: {
          ...content.seo,
          description: res.metaDescription,
          keywords: res.keywords.join(', ')
        }
      });
    } finally {
      setLoadingAI(null);
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-secondary/80 backdrop-blur-xl p-10 rounded-3xl border border-primary/20 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center border border-primary/50">
              <Lock size={32} className="text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Acceso Admin</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-background border border-gray-700 rounded-lg p-4 text-center text-xl focus:border-primary outline-none text-white" 
              placeholder="••••••••" 
            />
            <button type="submit" className="w-full bg-primary text-secondary font-bold py-4 rounded-lg hover:bg-white transition-colors">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 w-full overflow-x-hidden">
      <Dashboard 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSave={handleSave} 
        onLogout={() => setIsLogged(false)}
        isSaving={isSaving}
      >
        <main className="w-full">
          
          {activeTab === 'metrics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <UsersIcon size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Usuarios Hoy</p>
                  <p className="text-5xl font-black text-slate-900 mt-2">0</p>
                  <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={12} /> +0% vs ayer
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                    <LayoutDashboard size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Leads Totales</p>
                  <p className="text-5xl font-black text-slate-900 mt-2">{leadsCount}</p>
                  <p className="text-xs text-orange-600 font-bold mt-2">Nuevos prospectos</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                    <TrendingUp size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Conversión</p>
                  <p className="text-5xl font-black text-slate-900 mt-2">0%</p>
                  <p className="text-xs text-gray-400 font-bold mt-2">Tasa de cierre</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <BarChart3 size={24} />
                  </div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Visitas (Mes)</p>
                  <p className="text-5xl font-black text-slate-900 mt-2">0</p>
                  <p className="text-xs text-gray-400 font-bold mt-2">Tráfico orgánico</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary" /> Rendimiento de la Página
                </h3>
                <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed flex items-center justify-center text-gray-400">
                  <p className="text-center p-6">Aquí se visualizarán las gráficas de Google Analytics <br/><span className="text-xs">(Próxima integración con API de Google)</span></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex bg-white p-1.5 rounded-2xl border shadow-sm w-full sm:w-fit overflow-x-auto no-scrollbar gap-1">
                <button 
                  onClick={() => setGeneralView('content')} 
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all text-sm ${generalView === 'content' ? 'bg-primary text-secondary shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Settings size={18} /> Contenido Web
                </button>
                <button 
                  onClick={() => setGeneralView('seo')} 
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all text-sm ${generalView === 'seo' ? 'bg-primary text-secondary shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Globe size={18} /> SEO & Metadatos
                </button>
              </div>

              {generalView === 'content' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b pb-4">Textos Principales (Hero)</h3>
                    <div className="space-y-5">
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título Hero</label><input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtítulo Hero</label><textarea value={content.heroSubtitle} onChange={e => setContent({...content, heroSubtitle: e.target.value})} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" rows={4} /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Botón Principal</label><input value={content.ctaText} onChange={e => setContent({...content, ctaText: e.target.value})} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b pb-4">Contacto & Ubicación</h3>
                    <div className="space-y-5">
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Número WhatsApp</label><input value={content.whatsappNumber} onChange={e => setContent({...content, whatsappNumber: e.target.value})} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dirección Física</label><input value={content.address} onChange={e => setContent({...content, address: e.target.value})} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL Google Maps (Embed)</label><textarea value={content.mapUrl} onChange={e => setContent({...content, mapUrl: e.target.value})} className="w-full border p-3 rounded-xl mt-1 focus:ring-1 focus:ring-primary outline-none text-xs" rows={4} /></div>
                    </div>
                  </div>
                </div>
              )}

              {generalView === 'seo' && (
                <div className="bg-white p-8 rounded-3xl border shadow-sm w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                     <h3 className="font-bold text-lg border-b pb-2 w-full sm:w-auto">Optimización SEO Global</h3>
                     <button onClick={handleGenSEO} disabled={loadingAI === 'seo'} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-xl text-sm font-bold border border-green-200 hover:bg-green-100 transition-colors">
                        {loadingAI === 'seo' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Sugerir con IA
                     </button>
                  </div>
                  <div className="space-y-6">
                    <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Meta Título (Título de pestaña)</label><input value={content.seo.title} onChange={e => setContent({...content, seo: {...content.seo, title: e.target.value}})} className="w-full border p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none" /></div>
                    <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Meta Descripción</label><textarea value={content.seo.description} onChange={e => setContent({...content, seo: {...content.seo, description: e.target.value}})} className="w-full border p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none" rows={4} /><p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Límite recomendado: 160 caracteres.</p></div>
                    <div><label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Palabras Clave (Keywords)</label><textarea value={content.seo.keywords} onChange={e => setContent({...content, seo: {...content.seo, keywords: e.target.value}})} className="w-full border p-4 rounded-xl focus:ring-1 focus:ring-primary outline-none" rows={3} /></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ecosystems' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-secondary">Gestión de Servicios</h3>
                <button onClick={() => setContent({...content, services: [{ id: Date.now(), title: 'Nuevo Ecosistema', desc: '', imgUrl: '', icon: 'Cpu' }, ...content.services]})} className="bg-secondary text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-opacity-90 shadow-lg"><Plus size={18} /> Agregar Nuevo</button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {content.services.map((s, i) => (
                  <div key={s.id} className="bg-white p-6 rounded-3xl border flex flex-col sm:flex-row gap-6 relative shadow-sm group hover:border-primary/50 transition-all">
                    <button onClick={() => setContent({...content, services: content.services.filter(srv => srv.id !== s.id)})} className="absolute top-4 right-4 text-red-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                    <div className="shrink-0">
                      <div className="w-44 h-44 bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100">
                        <ImagePreview src={s.imgUrl} alt={s.title} fallbackIcon={UploadCloud} />
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        <label className="cursor-pointer bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"><UploadCloud size={14} /> Subir Foto<input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'services', url => { const items = [...content.services]; items[i].imgUrl = url; setContent({...content, services: items}); })} /></label>
                        <button onClick={async () => { setLoadingAI(`desc-${s.id}`); const { description } = await generateServiceDescription({ title: s.title }); const items = [...content.services]; items[i].desc = description; setContent({...content, services: items}); setLoadingAI(null); }} disabled={loadingAI === `desc-${s.id}`} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">{loadingAI === `desc-${s.id}` ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Generar Desc</button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre del Ecosistema</label>
                        <input value={s.title} onChange={e => { const items = [...content.services]; items[i].title = e.target.value; setContent({...content, services: items}); }} className="w-full font-bold text-xl border-b-2 border-slate-100 py-2 outline-none focus:border-primary bg-transparent" placeholder="Ej: CCTV Avanzado" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descripción Comercial</label>
                        <textarea value={s.desc} onChange={e => { const items = [...content.services]; items[i].desc = e.target.value; setContent({...content, services: items}); }} className="w-full text-sm border p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none" rows={4} placeholder="Describe el impacto de este servicio..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-secondary">Aliados Estratégicos</h3>
                <button onClick={() => setContent({...content, brands: [...content.brands, { id: Date.now(), name: 'Nueva Marca', url: '' }]})} className="bg-secondary text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-opacity-90 shadow-lg"><Plus size={18} /> Nueva Marca</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {content.brands.map((b, i) => (
                  <div key={b.id} className="bg-white p-6 rounded-2xl border relative flex flex-col items-center gap-4 shadow-sm group hover:border-primary/50 transition-all">
                    <button onClick={() => setContent({...content, brands: content.brands.filter(br => br.id !== b.id)})} className="absolute top-2 right-2 text-red-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                    <div className="h-28 flex items-center justify-center p-4 bg-slate-50 w-full rounded-xl border border-slate-100 overflow-hidden">
                      <BrandPreview src={b.url} name={b.name} />
                    </div>
                    <input value={b.name} onChange={e => { const items = [...content.brands]; items[i].name = e.target.value; setContent({...content, brands: items}); }} className="w-full text-center font-bold text-xs p-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none" />
                    <label className="cursor-pointer bg-secondary text-white px-6 py-2 rounded-full text-[10px] font-bold hover:bg-opacity-90 transition-all w-full text-center">Subir Logo<input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'brands', url => { const items = [...content.brands]; items[i].url = url; setContent({...content, brands: items}); })} /></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'crm' && <CRMLeads />}
          
        </main>
      </Dashboard>
    </div>
  );
}
