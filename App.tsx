
import React, { useState, useEffect } from 'react';
import { Asset, AssetType, Expense, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import BillUploader from './components/BillUploader';
import Recommendations from './components/Recommendations';
import ConsumerRights from './components/ConsumerRights';
import Login from './components/Login';
import BillyChat from './components/BillyChat';
import Onboarding from './components/Onboarding';
import PropertyManager from './components/PropertyManager';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({ 
    name: '', email: '', isLoggedIn: false, isBankConnected: false, isEmailConnected: false
  });
  
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Vivienda Principal', type: AssetType.HOUSE, status: 'active' },
    { id: '2', name: 'Coche Familiar', type: AssetType.VEHICLE, status: 'active' }
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'inicio' | 'cartera' | 'ahorro' | 'ayuda' | 'escanear'>('inicio');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!process.env.API_KEY);

  useEffect(() => {
    // Polling ligero para detectar si se ha añadido una clave
    const interval = setInterval(() => {
      setHasApiKey(!!process.env.API_KEY);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!user.isLoggedIn) return (
    <Login onLogin={(n, e, b, c) => { 
      setUser({...user, name: n, email: e, birthDate: b, city: c, isLoggedIn: true}); 
      setShowOnboarding(true); 
    }} />
  );

  const addAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
  };

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  const NavButton = ({ id, icon, label }: { id: any, icon: string, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center flex-1 py-4 transition-all outline-none ${activeTab === id ? 'text-teal-400' : 'text-slate-500'}`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{label}</span>
      {activeTab === id && <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 shadow-[0_0_10px_rgba(45,212,191,0.6)]"></div>}
    </button>
  );

  return (
    <div className="h-screen w-full bg-[#020617] text-white flex flex-col overflow-hidden font-['Plus_Jakarta_Sans']">
      
      <header className="px-6 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between border-b border-white/5 bg-[#020617]/95 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-teal-400 font-black text-base">B</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[11px] font-black uppercase tracking-widest text-white leading-none">BILLSAVY OS</h1>
            <p className="text-[7px] font-bold text-teal-400 uppercase tracking-tighter mt-1.5">Asset Management Mode</p>
          </div>
        </div>

        {!hasApiKey && (
          <button 
            onClick={handleOpenKey}
            className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[8px] font-black text-teal-400 uppercase tracking-widest animate-pulse"
          >
            Activar Billy AI ⚡
          </button>
        )}
      </header>
      
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto px-5 pt-4 pb-[calc(130px+env(safe-area-inset-bottom))] scrollbar-hide">
          {activeTab === 'inicio' && <Dashboard expenses={expenses} assets={assets} user={user} onAction={() => setActiveTab('escanear')} />}
          {activeTab === 'cartera' && <PropertyManager assets={assets} onAdd={addAsset} />}
          {activeTab === 'escanear' && (
            <div className="h-full flex items-center justify-center py-6">
              <BillUploader 
                assets={assets} 
                onComplete={(exp) => { setExpenses([exp, ...expenses]); setActiveTab('inicio'); }} 
                onCancel={() => setActiveTab('inicio')}
              />
            </div>
          )}
          {activeTab === 'ahorro' && <Recommendations recommendations={[]} isLoading={false} onRefresh={() => {}} userCity={user.city} />}
          {activeTab === 'ayuda' && <ConsumerRights />}
        </div>
      </main>

      <div className="fixed bottom-36 right-6 z-[200]">
        <BillyChat expenses={expenses} assets={assets} />
      </div>

      <footer className="bg-[#0f172a]/95 backdrop-blur-3xl border-t border-white/10 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2 flex justify-around items-center z-[250] shadow-[0_-15px_50px_rgba(0,0,0,0.8)]">
        <NavButton id="inicio" icon="⚡" label="Inicio" />
        <NavButton id="cartera" icon="📁" label="Cartera" />
        <NavButton id="ahorro" icon="📉" label="Ahorro" />
        <NavButton id="ayuda" icon="🛡️" label="Billy SOS" />
      </footer>

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
