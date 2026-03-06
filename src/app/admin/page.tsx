
"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Cpu, Loader2, Sparkles, UploadCloud, Plus, Trash2, Search, Menu, LayoutDashboard, Settings, Globe } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('general');
  const [generalView, setGeneralView] = useState<'metrics' | 'content' | 'seo'>('metrics');
  
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
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900">
      <Dashboard 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSave={handleSave} 
        onLogout={() => setIsLogged(false)}
        isSaving={isSaving}
      >
        <main className="flex-1 w-full p-4 md:p-0 overflow-y-auto">
          
          {activeTab === 'general' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex bg-white p-2 rounded-xl border shadow-sm mb-6 w-full overflow-x-auto no-scrollbar">
                <button onClick={() => setGeneralView('metrics')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${generalView === 'metrics' ? 'bg-primary text-secondary shadow' : 'text-gray-500 hover:bg-gray-100'}`}><LayoutDashboard size={18} /> Métricas</button>
                <button onClick={() => setGeneralView('content')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${generalView === 'content' ? 'bg-primary text-secondary shadow' : 'text-gray-500 hover:bg-gray-100'}`}><Settings size={18} /> Contenido</button>
                <button onClick={() => setGeneralView('seo')} className={`flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${generalView === 'seo' ? 'bg-primary text-secondary shadow' : 'text-gray-500 hover:bg-gray-100'}`}><Globe size={18} /> SEO & Metadatos</button>
              </div>

              {generalView === 'metrics' && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-bold mb-6">Métricas de Rendimiento</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                      <p className="text-sm text-gray-500 font-medium">Usuarios Activos</p>
                      <p className="text-4xl font-bold text-primary mt-2">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                      <p className="text-sm text-gray-500 font-medium">Leads Registrados</p>
                      <p className="text-4xl font-bold text-orange-500 mt-2">{leadsCount}</p>
                    </div>
                  </div>
                </section>
              )}

              {generalView === 'content' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-8 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">Sección Principal (Hero)</h3>
                    <div className="space-y-4">
                      <div><label className="text-xs font-bold text-gray-400 uppercase">Título</label><input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full border p-2 rounded mt-1" /></div>
                      <div><label className="text-xs font-bold text-gray-400 uppercase">Subtítulo</label><textarea value={content.heroSubtitle} onChange={e => setContent({...content, heroSubtitle: e.target.value})} className="w-full border p-2 rounded mt-1" rows={3} /></div>
                      <div><label className="text-xs font-bold text-gray-400 uppercase">Botón CTA</label><input value={content.ctaText} onChange={e => setContent({...content, ctaText: e.target.value})} className="w-full border p-2 rounded mt-1" /></div>
                    </div>
                  </div>
                </div>
              )}

              {generalView === 'seo' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-8 rounded-2xl border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-lg border-b pb-2">Optimización SEO Global</h3>
                       <button onClick={handleGenSEO} disabled={loadingAI === 'seo'} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded text-sm font-bold border border-green-200 hover:bg-green-100 transition-colors">
                          {loadingAI === 'seo' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generar con IA
                       </button>
                    </div>
                    <div className="space-y-6">
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Meta Título</label><input value={content.seo.title} onChange={e => setContent({...content, seo: {...content.seo, title: e.target.value}})} className="w-full border p-3 rounded-lg focus:ring-1 focus:ring-primary outline-none" /></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Meta Descripción</label><textarea value={content.seo.description} onChange={e => setContent({...content, seo: {...content.seo, description: e.target.value}})} className="w-full border p-3 rounded-lg focus:ring-1 focus:ring-primary outline-none" rows={4} /><p className="text-[10px] text-gray-400 mt-1">Recomendado: 150-160 caracteres.</p></div>
                      <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Palabras Clave</label><textarea value={content.seo.keywords} onChange={e => setContent({...content, seo: {...content.seo, keywords: e.target.value}})} className="w-full border p-3 rounded-lg focus:ring-1 focus:ring-primary outline-none" rows={3} /></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ecosystems' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <button onClick={() => setContent({...content, services: [{ id: Date.now(), title: 'Nuevo', desc: '', imgUrl: '', icon: 'Cpu' }, ...content.services]})} className="bg-secondary text-white px-4 py-2 rounded flex items-center gap-2 text-sm ml-auto hover:bg-opacity-90 transition-colors"><Plus size={16} /> Nuevo</button>
              {content.services.map((s, i) => (
                <div key={s.id} className="bg-white p-6 rounded-2xl border flex flex-col md:flex-row gap-6 relative shadow-sm">
                  <button onClick={() => setContent({...content, services: content.services.filter(srv => srv.id !== s.id)})} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  <div className="shrink-0">
                    <div className="w-40 h-40 bg-gray-100 rounded-xl overflow-hidden border">
                      <ImagePreview src={s.imgUrl} alt={s.title} fallbackIcon={UploadCloud} />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input value={s.title} onChange={e => { const items = [...content.services]; items[i].title = e.target.value; setContent({...content, services: items}); }} className="w-full font-bold text-lg border-b p-1 outline-none focus:border-primary bg-transparent" placeholder="Título" />
                    <textarea value={s.desc} onChange={e => { const items = [...content.services]; items[i].desc = e.target.value; setContent({...content, services: items}); }} className="w-full text-sm border p-2 rounded" rows={3} placeholder="Descripción..." />
                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs flex items-center gap-1 hover:bg-gray-200 transition-colors"><UploadCloud size={14} /> Foto<input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'services', url => { const items = [...content.services]; items[i].imgUrl = url; setContent({...content, services: items}); })} /></label>
                      <button onClick={async () => { setLoadingAI(`desc-${s.id}`); const { description } = await generateServiceDescription({ title: s.title }); const items = [...content.services]; items[i].desc = description; setContent({...content, services: items}); setLoadingAI(null); }} disabled={loadingAI === `desc-${s.id}`} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-100 transition-colors">{loadingAI === `desc-${s.id}` ? <Loader2 size={14} className="animate-spin inline" /> : '✨ Desc IA'}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="max-w-5xl mx-auto">
              <button onClick={() => setContent({...content, brands: [...content.brands, { id: Date.now(), name: 'Nueva', url: '' }]})} className="bg-secondary text-white px-4 py-2 rounded flex items-center gap-2 text-sm ml-auto mb-6 hover:bg-opacity-90 transition-colors"><Plus size={16} /> Nueva Marca</button>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {content.brands.map((b, i) => (
                  <div key={b.id} className="bg-white p-4 rounded-xl border relative flex flex-col items-center gap-4 shadow-sm">
                    <button onClick={() => setContent({...content, brands: content.brands.filter(br => br.id !== b.id)})} className="absolute top-2 right-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                    <div className="h-24 flex items-center justify-center p-4 bg-gray-50 w-full rounded border overflow-hidden">
                      <BrandPreview src={b.url} name={b.name} />
                    </div>
                    <input value={b.name} onChange={e => { const items = [...content.brands]; items[i].name = e.target.value; setContent({...content, brands: items}); }} className="w-full text-center font-bold text-xs p-1 border rounded" />
                    <label className="cursor-pointer bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-bold hover:bg-opacity-90 transition-colors">Logo<input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'brands', url => { const items = [...content.brands]; items[i].url = url; setContent({...content, brands: items}); })} /></label>
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
