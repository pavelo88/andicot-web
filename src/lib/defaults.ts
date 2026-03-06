import { SiteContent } from './types';

export const defaultServices = [
  { id: 1, title: "CCTV y Videovigilancia", desc: "Sistemas de cámaras PTZ, Térmicas y Analítica de Video avanzada con Inteligencia Artificial.", imgUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800", icon: "ShieldCheck" },
  { id: 2, title: "Control de Acceso", desc: "Seguridad biométrica, reconocimiento facial, torniquetes y cerraduras electrónicas gestionadas.", imgUrl: "https://images.unsplash.com/photo-1510511233900-4054415891e4?auto=format&fit=crop&q=80&w=800", icon: "Fingerprint" },
  { id: 3, title: "Respaldo Energético", desc: "UPS industriales de alta capacidad, bancos de baterías y generadores automatizados.", imgUrl: "https://images.unsplash.com/photo-1620288627228-db37f71bc7db?auto=format&fit=crop&q=80&w=800", icon: "Zap" },
  { id: 4, title: "Domótica Corporativa", desc: "Automatización integral de edificios, iluminación inteligente y control climático centralizado.", imgUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800", icon: "Cpu" },
  { id: 5, title: "Redes e Infraestructura", desc: "Switches empresariales, enrutadores de núcleo, Access Points y radioenlaces robustos.", imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800", icon: "Network" },
  { id: 6, title: "Cableado Estructurado", desc: "Diseño e instalación certificada de redes en Cobre y Fibra Óptica de alta velocidad.", imgUrl: "https://images.unsplash.com/photo-1515524738708-327f6b0037a7?auto=format&fit=crop&q=80&w=800", icon: "LinkIcon" },
  { id: 7, title: "Detección de Incendios", desc: "Sistemas de alarmas tempranas, sensores iónicos y paneles de control homologados.", imgUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800", icon: "BellRing" },
  { id: 8, title: "Cartelería Digital", desc: "Implementación de Videowalls, pantallas interactivas 4K y software de señalización comercial.", imgUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800", icon: "MonitorPlay" },
  { id: 9, title: "Equipamiento Informático", desc: "Provisión e instalación de Servidores Rackeables, Workstations y Laptops corporativas.", imgUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", icon: "Server" },
  { id: 10, title: "Licenciamiento Software", desc: "Implementación de Office 365, Antivirus empresariales (EDR) y sistemas operativos.", imgUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", icon: "Lock" }
];

export const defaultBrands = [
  { id: 1, name: 'PELCO', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Pelco_wordmark_tm_Clean_PMS300C.png' },
  { id: 2, name: 'AVIGILON', url: 'https://www.groupeclr.com/wp-content/uploads/2023/10/Avigilon-Logo-White-1024x292.png' },
  { id: 3, name: 'MOTOROLA', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Motorola_logo.svg/512px-Motorola_logo.svg.png' },
  { id: 4, name: 'BOSCH', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg' },
  { id: 5, name: 'TYCO', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Tyco-Logo.svg' },
  { id: 6, name: 'HIKVISION', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Hikvision_logo.svg' },
  { id: 7, name: 'CISCO', url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Cisco_logo.svg' },
  { id: 8, name: 'HONEYWELL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Honeywell_logo.svg' },
  { id: 9, name: 'APC', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/LogoAPC.svg' }
];

export const defaultStats = [
  { id: 1, value: "500+", label: "PROYECTOS", icon: "Zap" },
  { id: 2, value: "15+", label: "AÑOS EXP.", icon: "Globe" },
  { id: 3, value: "99.7%", label: "UPTIME", icon: "Cpu" },
  { id: 4, value: "24/7", label: "SOPORTE", icon: "ShieldCheck" }
];

export const defaultSiteContent: SiteContent = {
  heroTitle: "Ingeniería y Tecnología para el Futuro",
  heroSubtitle: "Análisis, Diseño y Construcción Tecnológica con estándares de nivel empresarial. Conectando su negocio al ecosistema digital.",
  heroMediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
  ctaText: "Solicitar Asesoría Técnica",
  formTitle: "Comencemos su Proyecto",
  formSubtitle: "Déjenos sus datos y un ingeniero especializado se pondrá en contacto para dimensionar su requerimiento.",
  whatsappNumber: "593984467411",
  address: "Carcelén, Quito, Pichincha 170120, Ecuador",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.814674112109!2d-78.4716!3d-0.0911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d58fbc8d6263e1%3A0xc3b44b9d3b45167a!2sCarcel%C3%A9n%2C%20Quito!5e0!3m2!1sen!2sec!4v1680000000000!5m2!1sen!2sec",
  socialUrls: { facebook: "https://facebook.com/andicot", instagram: "https://instagram.com/andicot.ec", linkedin: "https://linkedin.com/company/andicot" },
  seo: {
    title: "ANDICOT | Ingeniería, Seguridad Electrónica y Redes en Ecuador",
    description: "Expertos en CCTV, Redes de Fibra Óptica, Domótica y Respaldo Energético en Quito e instalación a nivel nacional. Soporte técnico 24/7 para empresas.",
    keywords: "CCTV Quito, Cámaras de seguridad Ecuador, Fibra Óptica, Domótica empresarial, UPS industriales, ANDICOT, Ingeniería Tecnológica, Instalación nacional, Redes de datos"
  },
  services: defaultServices,
  stats: defaultStats,
  brands: defaultBrands
};
