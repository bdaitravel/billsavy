
import React, { useState, useEffect } from 'react';
import { Asset, AssetType, Expense, Category, AIRecommendation, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import PropertyManager from './components/PropertyManager';
import BillUploader from './components/BillUploader';
import Recommendations from './components/Recommendations';
import ConsumerRights from './components/ConsumerRights';
import Login from './components/Login';
import BillyChat from './components/BillyChat';
import Onboarding from './components/Onboarding';
import ConnectCenter from './components/ConnectCenter';
import { getFinancialAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({ 
    name: '', 
    email: '', 
    isLoggedIn: false, 
    tier: 'premium',
    isBankConnected: false,
    isEmailConnected: false
  });
  
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Vivienda Madrid', type: AssetType.HOUSE, detail: 'Calle Mayor 1', status: 'active' },
    { id: '2', name: 'Tesla Model 3', type: AssetType.VEHICLE_CAR, detail: 'B-1234-XY', status: 'warning' }
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activos' | 'subir' | 'ahorro' | 'derechos' | 'conexiones'>('dashboard');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('billsavy_v2_data');
    if (saved) {
      const { savedAssets, savedExpenses, savedUser } = JSON.parse(saved);
      setAssets(savedAssets || assets);
      setExpenses(savedExpenses || []);
      if (savedUser) setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('billsavy_v2_data', JSON.stringify({ savedAssets: assets, savedExpenses: expenses, savedUser: user }));
  }, [assets, expenses, user]);

  const handleLogin = (name: string, email: string) => {
    setUser({ ...user, name, email, isLoggedIn: true });
    setShowOnboarding(true);
  };

  const handleAddAsset = (asset: Asset) => setAssets([...assets, asset]);
  const handleAddExpense = (expense: Expense) => {
    setExpenses([{ ...expense, id: Math.random().toString(36).substr(2, 9) }, ...expenses]);
    setActiveTab('dashboard');
  };

  const fetchAdvice = async () => {
    if (expenses.length === 0 && !user.isBankConnected) return;
    setIsLoadingAdvice(true);
    try {
      const advice = await getFinancialAdvice(expenses, assets);
      setRecommendations(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  if (!user.isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-transparent overflow-hidden relative selection:bg-emerald-100 selection:text-emerald-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={() => setUser({...user, isLoggedIn: false})} 
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth bg-slate-50/30">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 animate-fintech">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && `Pulso Financiero`}
              {activeTab === 'activos' && 'Patrimonio'}
              {activeTab === 'subir' && 'Entrada de Datos'}
              {activeTab === 'ahorro' && 'Motor de Arbitraje'}
              {activeTab === 'derechos' && 'Escudo Legal'}
              {activeTab === 'conexiones' && 'Fuentes de Datos'}
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">
              {activeTab === 'dashboard' && 'Tu IA está analizando 47 variables de mercado.'}
              {activeTab === 'conexiones' && 'Automatiza la entrada de datos al 100%.'}
              {activeTab === 'subir' && 'Sube facturas en PDF o JPG.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!user.isBankConnected && activeTab !== 'conexiones' && (
              <button 
                onClick={() => setActiveTab('conexiones')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                CONECTAR BANCO
              </button>
            )}
            <button 
              onClick={() => setActiveTab('subir')}
              className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Nueva Factura
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto animate-fintech">
          {activeTab === 'dashboard' && <Dashboard expenses={expenses} assets={assets} onSeeAdvice={() => { setActiveTab('ahorro'); fetchAdvice(); }} />}
          {activeTab === 'activos' && <PropertyManager assets={assets} onAdd={handleAddAsset} />}
          {activeTab === 'subir' && <BillUploader assets={assets} onComplete={handleAddExpense} />}
          {activeTab === 'ahorro' && <Recommendations recommendations={recommendations} onRefresh={fetchAdvice} isLoading={isLoadingAdvice} />}
          {activeTab === 'derechos' && <ConsumerRights />}
          {activeTab === 'conexiones' && (
            <ConnectCenter 
              user={user} 
              onConnect={(type) => setUser({...user, [type === 'bank' ? 'isBankConnected' : 'isEmailConnected']: true})} 
            />
          )}
        </div>
      </main>

      <BillyChat expenses={expenses} assets={assets} />
      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
