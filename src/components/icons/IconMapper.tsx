import React from 'react';
import { 
  ShieldCheck, Cpu, Zap, MonitorPlay, Network, Lock, BellRing, Server, 
  Link as LinkIcon, Globe, Fingerprint, Activity 
} from 'lucide-react';

const icons: Record<string, React.ElementType> = {
  ShieldCheck, Lock, Zap, Cpu, Network, LinkIcon, BellRing, MonitorPlay, Server, Globe, Fingerprint, Activity
};

export const IconMapper = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = icons[name] || Cpu;
  return <IconComponent {...props} />;
};
