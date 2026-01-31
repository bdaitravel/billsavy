
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
  const [activeTab, setActiveTab] = useState<'inicio' | 'escanear' | 'ahorro' | 'derechos'>('inicio');
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
      className={`flex flex-col items-center justify-center w-12 h-10 rounded-xl transition-all ${activeTab === id ? 'bg-white/10 text-teal-400 shadow-xl border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[6px] font-black uppercase tracking-widest mt-0.5">{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-full bg-[#020617] text-white flex flex-col overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Header Compacto con Botón de Atrás Dinámico */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          {activeTab !== 'inicio' ? (
            <button 
              onClick={() => setActiveTab('inicio')}
              className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-teal-400 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-teal-400 font-extrabold text-sm mb-0.5">B</span>
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="text-[9px] font-black uppercase tracking-widest text-white leading-none">BILLSAVY</h1>
            <p className="text-[6px] font-bold text-teal-400 uppercase tracking-tighter mt-1 opacity-80">Control Total</p>
          </div>
        </div>
        
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
           <NavButton id="inicio" icon="⚡" label="Inicio" />
           <NavButton id="ahorro" icon="💰" label="Ahorro" />
           <NavButton id="derechos" icon="🛡️" label="Ayuda" />
        </div>
      </header>
      
      {/* Main Container */}
      <main className="flex-1 p-5 overflow-hidden">
        {activeTab === 'inicio' && <Dashboard expenses={expenses} assets={assets} onAction={() => setActiveTab('escanear')} />}
        {activeTab === 'escanear' && (
          <div className="h-full flex items-center justify-center">
            <BillUploader 
              assets={assets} 
              onComplete={(exp) => { setExpenses([exp, ...expenses]); setActiveTab('inicio'); }} 
              onCancel={() => setActiveTab('inicio')}
            />
          </div>
        )}
        {activeTab === 'ahorro' && <Recommendations recommendations={[]} isLoading={false} onRefresh={() => {}} />}
        {activeTab === 'derechos' && <ConsumerRights />}
      </main>

      {/* Billy Chat - Posicionado para no tapar el botón principal */}
      <div className="fixed bottom-24 right-4 z-[60]">
        <BillyChat expenses={expenses} assets={assets} />
      </div>

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
