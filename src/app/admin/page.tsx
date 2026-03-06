"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Cpu, Loader2, Sparkles, UploadCloud, Plus, Trash2, Globe, LayoutDashboard, Settings, BarChart3, TrendingUp, Users as UsersIcon, XCircle } from 'lucide-react';
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
  if (!src || error) return <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50"><Icon size={32}/></div>;
  return <img src={src} alt={alt} onError={() => setError(true)} className="w-full h-full object-cover" />;
};

const BrandPreview = ({ src, name }: { src: string, name: string }) => {
  const [error, setError] = useState(false);
  if (!src || error) return <div className="h-full flex items-center justify-center p-4 bg-muted/50 w-full rounded border text-xs font-bold text-muted-foreground uppercase">{name}</div>;
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
    if (!storage) return alert('Firebase Storage no está configurado correctamente en el archivo .env');
    
    try {
      const fileRef = ref(storage, `site/${path}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(uploadResult.ref);
      callback(url);
    } catch (err: any) {
      console.error('Error en upload:', err);
      if (err.code === 'storage/unauthorized') {
        alert('Error: No tienes permisos para subir archivos. Revisa las reglas de seguridad de Firebase Storage.');
      } else if (err.message.includes('CORS')) {
        alert('Error de CORS: Debes configurar las políticas CORS en tu bucket de Firebase Storage para permitir subidas desde este dominio.');
      } else {
        alert('Error al subir la imagen: ' + (err.message || 'Error desconocido'));
      }
    }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
        <div className="w-full max-w-md bg-card p-10 rounded-3xl border border-primary/20 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center border border-primary/50">
              <Lock size={32} className="text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground font-headline uppercase tracking-tighter">Acceso de Seguridad</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-muted border border-border rounded-xl p-4 text-center text-xl focus:border-primary outline-none text-foreground" 
              placeholder="••••••••" 
            />
            <button type="submit" className="w-full bg-primary text-secondary font-bold py-4 rounded-xl hover:opacity-90 transition-opacity">Ingresar al Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full overflow-hidden">
      <Dashboard 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSave={handleSave} 
        onLogout={() => setIsLogged(false)}
        isSaving={isSaving}
      >
        <div className="w-full animate-in fade-in duration-500">
          
          {activeTab === 'metrics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Usuarios Hoy', val: '0', icon: UsersIcon, color: 'text-blue-500', trend: '+0%' },
                  { label: 'Leads Totales', val: leadsCount, icon: LayoutDashboard, color: 'text-orange-500', trend: 'Nuevos' },
                  { label: 'Conversión', val: '0%', icon: TrendingUp, color: 'text-green-500', trend: 'Tasa cierre' },
                  { label: 'Visitas (Mes)', val: '0', icon: BarChart3, color: 'text-purple-500', trend: 'Orgánico' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-card p-6 rounded-3xl border shadow-sm hover:border-primary/30 transition-all">
                    <div className={`w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-4xl font-bold text-foreground mt-1">{item.val}</p>
                    <p className="text-[10px] text-primary font-bold mt-2 uppercase">{item.trend}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card p-8 rounded-3xl border shadow-sm">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 font-headline">
                  <BarChart3 size={20} className="text-primary" /> ACTIVIDAD RECIENTE
                </h3>
                <div className="h-80 bg-muted/30 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground italic">
                  <p className="text-center p-6 text-sm">Integración con Google Analytics 4 activa.<br/>Sincronizando flujos de datos tecnológicos...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="flex bg-card p-1 rounded-2xl border shadow-sm w-fit overflow-hidden">
                <button 
                  onClick={() => setGeneralView('content')} 
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap ${generalView === 'content' ? 'bg-primary text-secondary' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <Settings size={18} /> Contenido Web
                </button>
                <button 
                  onClick={() => setGeneralView('seo')} 
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap ${generalView === 'seo' ? 'bg-primary text-secondary' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  <Globe size={18} /> SEO Global
                </button>
              </div>

              {generalView === 'content' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b border-border pb-4 uppercase tracking-tighter">Textos del Hero</h3>
                    <div className="space-y-5">
                      <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Título Principal</label><input value={content.heroTitle} onChange={e => setContent({...content, heroTitle: e.target.value})} className="w-full bg-muted border border-border p-4 rounded-xl mt-1 focus:border-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Subtítulo Descriptivo</label><textarea value={content.heroSubtitle} onChange={e => setContent({...content, heroSubtitle: e.target.value})} className="w-full bg-muted border border-border p-4 rounded-xl mt-1 focus:border-primary outline-none" rows={4} /></div>
                      <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Texto del Botón (CTA)</label><input value={content.ctaText} onChange={e => setContent({...content, ctaText: e.target.value})} className="w-full bg-muted border border-border p-4 rounded-xl mt-1 focus:border-primary outline-none" /></div>
                    </div>
                  </div>
                  
                  <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b border-border pb-4 uppercase tracking-tighter">Contacto & Maps</h3>
                    <div className="space-y-5">
                      <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">WhatsApp Corporativo</label><input value={content.whatsappNumber} onChange={e => setContent({...content, whatsappNumber: e.target.value})} className="w-full bg-muted border border-border p-4 rounded-xl mt-1 focus:border-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dirección Operativa</label><input value={content.address} onChange={e => setContent({...content, address: e.target.value})} className="w-full bg-muted border border-border p-4 rounded-xl mt-1 focus:border-primary outline-none" /></div>
                      <div><label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">URL Iframe Google Maps</label><textarea value={content.mapUrl} onChange={e => setContent({...content, mapUrl: e.target.value})} className="w-full bg-muted border border-border p-4 rounded-xl mt-1 focus:border-primary outline-none text-xs" rows={4} /></div>
                    </div>
                  </div>
                </div>
              )}

              {generalView === 'seo' && (
                <div className="bg-card p-8 rounded-3xl border shadow-sm w-full">
                  <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                     <h3 className="font-bold text-lg uppercase tracking-tighter">Optimización de Motores de Búsqueda</h3>
                     <button onClick={handleGenSEO} disabled={loadingAI === 'seo'} className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-2.5 rounded-xl text-xs font-bold border border-primary/20 hover:bg-primary/20 transition-all">
                        {loadingAI === 'seo' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generar con IA
                     </button>
                  </div>
                  <div className="space-y-6">
                    <div><label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Meta Título</label><input value={content.seo.title} onChange={e => setContent({...content, seo: {...content.seo, title: e.target.value}})} className="w-full bg-muted border border-border p-4 rounded-xl focus:border-primary outline-none" /></div>
                    <div><label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Meta Descripción (160 caracteres)</label><textarea value={content.seo.description} onChange={e => setContent({...content, seo: {...content.seo, description: e.target.value}})} className="w-full bg-muted border border-border p-4 rounded-xl focus:border-primary outline-none" rows={4} /></div>
                    <div><label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Palabras Clave (Separadas por comas)</label><textarea value={content.seo.keywords} onChange={e => setContent({...content, seo: {...content.seo, keywords: e.target.value}})} className="w-full bg-muted border border-border p-4 rounded-xl focus:border-primary outline-none" rows={3} /></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ecosystems' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold uppercase tracking-tighter">Gestión de Ecosistemas Tecnológicos</h3>
                <button onClick={() => setContent({...content, services: [{ id: Date.now(), title: 'Nuevo Ecosistema', desc: '', imgUrl: '', icon: 'Cpu' }, ...content.services]})} className="bg-primary text-secondary px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:opacity-90 shadow-lg"><Plus size={18} /> Agregar Servicio</button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {content.services.map((s, i) => (
                  <div key={s.id} className="bg-card p-8 rounded-3xl border flex flex-col md:flex-row gap-8 relative shadow-sm hover:border-primary/50 transition-all">
                    <button onClick={() => setContent({...content, services: content.services.filter(srv => srv.id !== s.id)})} className="absolute top-4 right-4 text-destructive/50 hover:text-destructive transition-colors"><Trash2 size={20} /></button>
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-48 h-48 bg-muted rounded-3xl overflow-hidden border border-border shadow-inner relative group">
                        <ImagePreview src={s.imgUrl} alt={s.title} fallbackIcon={UploadCloud} />
                        {s.imgUrl && (
                          <button 
                            onClick={() => { const items = [...content.services]; items[i].imgUrl = ''; setContent({...content, services: items}); }}
                            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Eliminar Imagen"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                      <div className="mt-4 flex flex-col gap-2 w-full">
                        <label className="cursor-pointer bg-muted text-foreground px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors border border-border"><UploadCloud size={14} /> Subir Imagen<input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'services', url => { const items = [...content.services]; items[i].imgUrl = url; setContent({...content, services: items}); })} /></label>
                        <button onClick={async () => { setLoadingAI(`desc-${s.id}`); try { const { description } = await generateServiceDescription({ title: s.title }); const items = [...content.services]; items[i].desc = description; setContent({...content, services: items}); } finally { setLoadingAI(null); } }} disabled={loadingAI === `desc-${s.id}`} className="bg-primary/5 text-primary px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors border border-primary/20">{loadingAI === `desc-${s.id}` ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Redactar con IA</button>
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nombre del Ecosistema</label>
                        <input value={s.title} onChange={e => { const items = [...content.services]; items[i].title = e.target.value; setContent({...content, services: items}); }} className="w-full font-bold text-2xl border-b border-border py-2 outline-none focus:border-primary bg-transparent text-foreground" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Descripción Comercial</label>
                        <textarea value={s.desc} onChange={e => { const items = [...content.services]; items[i].desc = e.target.value; setContent({...content, services: items}); }} className="w-full bg-muted border border-border p-4 rounded-2xl focus:border-primary outline-none text-sm leading-relaxed" rows={5} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold uppercase tracking-tighter">Partners & Alianzas</h3>
                <button onClick={() => setContent({...content, brands: [{ id: Date.now(), name: 'Nueva Marca', url: '' }, ...content.brands]})} className="bg-primary text-secondary px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold hover:opacity-90 shadow-lg"><Plus size={18} /> Nueva Alianza</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {content.brands.map((b, i) => (
                  <div key={b.id} className="bg-card p-6 rounded-3xl border relative flex flex-col items-center gap-4 shadow-sm hover:border-primary/50 transition-all">
                    <button onClick={() => setContent({...content, brands: content.brands.filter(br => br.id !== b.id)})} className="absolute top-2 right-2 text-destructive/40 hover:text-destructive"><Trash2 size={16}/></button>
                    <div className="h-28 flex items-center justify-center p-4 bg-muted/30 w-full rounded-2xl border border-border overflow-hidden relative group">
                      <BrandPreview src={b.url} name={b.name} />
                      {b.url && (
                        <button 
                          onClick={() => { const items = [...content.brands]; items[i].url = ''; setContent({...content, brands: items}); }}
                          className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar Logo"
                        >
                          <XCircle size={12} />
                        </button>
                      )}
                    </div>
                    <input value={b.name} onChange={e => { const items = [...content.brands]; items[i].name = e.target.value; setContent({...content, brands: items}); }} className="w-full text-center font-bold text-[10px] uppercase bg-muted p-2 rounded-lg border border-border focus:border-primary outline-none" />
                    <label className="cursor-pointer bg-secondary text-white px-4 py-2 rounded-lg text-[9px] font-bold hover:bg-primary hover:text-secondary transition-all w-full text-center uppercase tracking-widest">Cargar Logo<input type="file" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files[0], 'brands', url => { const items = [...content.brands]; items[i].url = url; setContent({...content, brands: items}); })} /></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'crm' && <CRMLeads />}
          
        </div>
      </Dashboard>
    </div>
  );
}