export interface Service {
  id: number;
  title: string;
  desc: string;
  imgUrl: string;
  icon: string;
}

export interface Brand {
  id: number;
  name: string;
  url: string;
}

export interface Stat {
  id: number;
  value: string;
  label: string;
  icon: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Nuevo' | 'En Proceso' | 'Venta Realizada' | 'Cerrada';
  createdAt: number;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroMediaUrl: string;
  ctaText: string;
  formTitle: string;
  formSubtitle: string;
  whatsappNumber: string;
  address: string;
  mapUrl: string;
  socialUrls: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    author?: string;
    ogImage?: string;
  };
  services: Service[];
  stats: Stat[];
  brands: Brand[];
}
