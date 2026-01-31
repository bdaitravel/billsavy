
import React, { useState } from 'react';
import { Asset, AssetType, Expense, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import BillUploader from './components/BillUploader';
import Recommendations from './components/Recommendations';
import ConsumerRights from './components/ConsumerRights';
import Login from './components/Login';
import BillyChat from './components/BillyChat';
import Onboarding from './components/Onboarding';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({ 
    name: '', email: '', isLoggedIn: false, isBankConnected: false, isEmailConnected: false
  });
  
  const [assets] = useState<Asset[]>([
    { id: '1', name: 'Mi Hogar', type: AssetType.HOUSE, status: 'active' },
    { id: '2', name: 'Mi Coche', type: AssetType.VEHICLE, status: 'active' }
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'inicio' | 'ahorro' | 'derechos' | 'escanear'>('inicio');
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (!user.isLoggedIn) return (
    <Login onLogin={(n, e, b, c) => { 
      setUser({...user, name: n, email: e, birthDate: b, city: c, isLoggedIn: true}); 
      setShowOnboarding(true); 
    }} />
  );

  const NavButton = ({ id, icon, label }: { id: any, icon: string, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${activeTab === id ? 'text-teal-400' : 'text-slate-500'}`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      {activeTab === id && <div className="w-1 h-1 bg-teal-400 rounded-full mt-1"></div>}
    </button>
  );

  return (
    <div className="h-screen w-full bg-[#020617] text-white flex flex-col overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Header Superior: Solo Logo y Botón Atrás */}
      <header className="px-6 pb-4 pt-[calc(0.5rem+env(safe-area-inset-top))] flex items-center border-b border-white/5 bg-[#020617]/95 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4 w-full">
          {activeTab === 'escanear' && (
            <button 
              onClick={() => setActiveTab('inicio')}
              className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-teal-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-teal-400 font-black text-sm">B</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[10px] font-black uppercase tracking-widest text-white leading-none">BILLSAVY</h1>
              <p className="text-[7px] font-bold text-teal-400 uppercase tracking-tighter mt-1 opacity-80">
                {activeTab === 'inicio' ? 'Dashboard Global' : activeTab === 'ahorro' ? 'Plan de Ahorro' : 'Defensa Legal'}
              </p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto px-5 pt-4 pb-20">
          {activeTab === 'inicio' && <Dashboard expenses={expenses} assets={assets} onAction={() => setActiveTab('escanear')} />}
          {activeTab === 'escanear' && (
            <div className="h-full flex items-center justify-center py-10">
              <BillUploader 
                assets={assets} 
                onComplete={(exp) => { setExpenses([exp, ...expenses]); setActiveTab('inicio'); }} 
                onCancel={() => setActiveTab('inicio')}
              />
            </div>
          )}
          {activeTab === 'ahorro' && <Recommendations recommendations={[]} isLoading={false} onRefresh={() => {}} />}
          {activeTab === 'derechos' && <ConsumerRights />}
        </div>
      </main>

      {/* Billy Chat Flotante */}
      <div className="fixed bottom-24 right-4 z-[60]">
        <BillyChat expenses={expenses} assets={assets} />
      </div>

      {/* Barra de Navegación Inferior (Standard iOS) */}
      <footer className="bg-[#0f172a]/90 backdrop-blur-2xl border-t border-white/10 px-6 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 flex justify-around items-center z-50">
        <NavButton id="inicio" icon="⚡" label="Inicio" />
        <NavButton id="ahorro" icon="💰" label="Ahorro" />
        <NavButton id="derechos" icon="🛡️" label="Ayuda" />
      </footer custom-nav>

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
