"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Cpu, Loader2, Sparkles, UploadCloud, Plus, Trash2, Search } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SiteContent } from '@/lib/types';
import { defaultSiteContent } from '@/lib/defaults';
import { Dashboard } from '@/components/admin/Dashboard';
import { CRMLeads } from '@/components/admin/CRMLeads';
import { generateSeoMetadata } from '@/ai/flows/generate-seo-metadata-flow';
import { generateServiceDescription } from '@/ai/flows/generate-service-description-flow';
import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post-flow';

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isSaving, setIsSaving] = useState(false);
  const [seoResult, setSeoResult] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'siteContent'), (snapshot) => {
      if (snapshot.exists()) setContent(snapshot.data() as SiteContent);
    });
    return () => unsub();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Andicot2026') setIsLogged(true);
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
      setSeoResult(res);
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
          <h2 className="text-2xl font-bold text-center mb-8">Acceso Admin</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-background border border-gray-700 rounded-lg p-4 text-center text-xl focus:border-primary outline-none" 
              placeholder="••••••••" 
            />
            <button type="submit" className="w-full bg-primary text-secondary font-bold py-4 rounded-lg hover:bg-white transition-colors">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Dashboard 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onSave={handleSave} 
      onLogout={() => setIsLogged(false)}
      isSaving={isSaving}
    >
      {activeTab === 'general' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Sección Hero</h3>
            <div className="space-y-4">
              <input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full border p-2 rounded" placeholder="Título Hero" />
              <textarea value={content.heroSubtitle} onChange={e => setContent({...content, heroSubtitle: e.target.value})} className="w-full border p-2 rounded" rows={3} placeholder="Subtítulo Hero" />
              <div className="flex gap-2">
                <input value={content.heroMediaUrl} readOnly className="flex-1 bg-gray-50 border p-2 rounded text-xs" />
                <label className="cursor-pointer bg-secondary text-white p-2 rounded flex items-center gap-2">
                  <UploadCloud size={16} /> Subir
                  <input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'hero', url => setContent({...content, heroMediaUrl: url}))} />
                </label>
              </div>
            </div>
            <button onClick={handleGenSEO} disabled={loadingAI === 'seo'} className="mt-6 flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded text-sm font-bold border border-green-200">
              {loadingAI === 'seo' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Sugerir SEO con IA
            </button>
            {seoResult && (
              <div className="mt-4 p-4 bg-gray-50 border rounded text-xs">
                <p><strong>Desc:</strong> {seoResult.metaDescription}</p>
                <p><strong>Keywords:</strong> {seoResult.keywords.join(', ')}</p>
              </div>
            )}
          </div>
          
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              {content.stats.map((s, i) => (
                <div key={i} className="p-4 border rounded bg-gray-50">
                  <input value={s.value} onChange={e => {
                    const newStats = [...content.stats]; newStats[i].value = e.target.value; setContent({...content, stats: newStats});
                  }} className="w-full font-bold mb-2 p-1 border rounded" />
                  <input value={s.label} onChange={e => {
                    const newStats = [...content.stats]; newStats[i].label = e.target.value; setContent({...content, stats: newStats});
                  }} className="w-full text-xs p-1 border rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ecosystems' && (
        <div className="max-w-5xl mx-auto space-y-4">
          <button onClick={() => setContent({...content, services: [{ id: Date.now(), title: 'Nuevo', desc: '', imgUrl: '', icon: 'Cpu' }, ...content.services]})} className="bg-secondary text-white px-4 py-2 rounded flex items-center gap-2 text-sm ml-auto">
            <Plus size={16} /> Nuevo
          </button>
          {content.services.map((s, i) => (
            <div key={s.id} className="bg-white p-6 rounded-2xl border flex gap-6 relative">
              <button onClick={() => setContent({...content, services: content.services.filter(srv => srv.id !== s.id)})} className="absolute top-4 right-4 text-red-400"><Trash2 size={18} /></button>
              <div className="w-40 h-40 bg-gray-100 rounded-xl overflow-hidden border">
                <img src={s.imgUrl} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-3">
                <input value={s.title} onChange={e => {
                  const items = [...content.services]; items[i].title = e.target.value; setContent({...content, services: items});
                }} className="w-full font-bold text-lg border-b p-1 outline-none focus:border-primary" />
                <textarea value={s.desc} onChange={e => {
                  const items = [...content.services]; items[i].desc = e.target.value; setContent({...content, services: items});
                }} className="w-full text-sm border p-2 rounded" rows={2} />
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs flex items-center gap-1">
                    <UploadCloud size={14} /> Foto
                    <input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'services', url => {
                      const items = [...content.services]; items[i].imgUrl = url; setContent({...content, services: items});
                    })} />
                  </label>
                  <button 
                    onClick={async () => {
                      setLoadingAI(`desc-${s.id}`);
                      const { description } = await generateServiceDescription({ title: s.title });
                      const items = [...content.services]; items[i].desc = description; setContent({...content, services: items});
                      setLoadingAI(null);
                    }}
                    disabled={loadingAI === `desc-${s.id}`}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-bold"
                  >
                    {loadingAI === `desc-${s.id}` ? '...' : '✨ Desc IA'}
                  </button>
                  <button 
                    onClick={async () => {
                      setLoadingAI(`post-${s.id}`);
                      const post = await generateSocialMediaPost({ title: s.title, description: s.desc });
                      navigator.clipboard.writeText(post); alert('Post copiado al portapapeles');
                      setLoadingAI(null);
                    }}
                    disabled={loadingAI === `post-${s.id}`}
                    className="bg-purple-50 text-purple-700 px-3 py-1 rounded text-xs font-bold"
                  >
                    {loadingAI === `post-${s.id}` ? '...' : '📱 Post Social'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'brands' && (
        <div className="max-w-5xl mx-auto">
          <button onClick={() => setContent({...content, brands: [...content.brands, { id: Date.now(), name: 'Nueva', url: '' }]})} className="bg-secondary text-white px-4 py-2 rounded flex items-center gap-2 text-sm ml-auto mb-6">
            <Plus size={16} /> Nueva Marca
          </button>
          <div className="grid grid-cols-3 gap-6">
            {content.brands.map((b, i) => (
              <div key={b.id} className="bg-white p-4 rounded-xl border relative flex flex-col items-center gap-4">
                <button onClick={() => setContent({...content, brands: content.brands.filter(br => br.id !== b.id)})} className="absolute top-2 right-2 text-red-300"><Trash2 size={16}/></button>
                <div className="h-20 flex items-center justify-center p-4 bg-gray-50 w-full rounded border">
                  <img src={b.url} className="max-h-full object-contain" />
                </div>
                <input value={b.name} onChange={e => {
                   const items = [...content.brands]; items[i].name = e.target.value; setContent({...content, brands: items});
                }} className="w-full text-center font-bold text-xs p-1 border rounded" />
                <label className="cursor-pointer bg-secondary text-white px-4 py-1.5 rounded-full text-[10px] font-bold">
                  Sustituir Logo
                  <input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'brands', url => {
                     const items = [...content.brands]; items[i].url = url; setContent({...content, brands: items});
                  })} />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'crm' && <CRMLeads />}
    </Dashboard>
  );
}
