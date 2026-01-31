
import React from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  user: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const items = [
    { id: 'dashboard', label: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'activos', label: 'Mis Activos', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5' },
    { id: 'subir', label: 'Escanear', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' },
    { id: 'ahorro', label: 'Plan Ahorro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'derechos', label: 'Tus Derechos', icon: 'M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.605 8.9c5.135 5.407 8.394 12.23 8.394 12.23s-6.823-3.259-12.23-8.394a3.323 3.323 0 001.284-4.613z' },
  ];

  return (
    <aside className="w-24 md:w-72 bg-white border-r border-slate-100 flex flex-col transition-all z-20 shadow-sm">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">B</div>
          <span className="hidden md:block text-2xl font-black text-slate-900 tracking-tight">BillSavy</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl mb-2 transition-all group ${
              activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 font-bold scale-105' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 hidden md:block mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-xs font-bold text-red-500 hover:text-red-600 pt-2 border-t border-slate-200 text-left"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
