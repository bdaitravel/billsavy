
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
import { getFinancialAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({ name: '', email: '', isLoggedIn: false });
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Vivienda Principal', type: AssetType.HOUSE, detail: 'Calle Mayor 1, Madrid' },
    { id: '2', name: 'Coche Familiar', type: AssetType.VEHICLE_CAR, detail: 'Tesla Model 3' }
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activos' | 'subir' | 'ahorro' | 'derechos'>('dashboard');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('billsavy_data');
    if (saved) {
      const { savedAssets, savedExpenses, savedUser } = JSON.parse(saved);
      setAssets(savedAssets || assets);
      setExpenses(savedExpenses || []);
      if (savedUser) setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('billsavy_data', JSON.stringify({ savedAssets: assets, savedExpenses: expenses, savedUser: user }));
  }, [assets, expenses, user]);

  const handleLogin = (name: string, email: string) => {
    setUser({ name, email, isLoggedIn: true });
    setShowOnboarding(true); // Mostrar onboarding solo tras login
  };

  const handleAddAsset = (asset: Asset) => setAssets([...assets, asset]);
  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, { ...expense, id: Math.random().toString(36).substr(2, 9) }]);
    setActiveTab('dashboard');
  };

  const fetchAdvice = async () => {
    if (expenses.length === 0) return;
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

  if (!user.isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => setUser({...user, isLoggedIn: false})} />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4 animate-fade">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && `¡Buenas, ${user.name.split(' ')[0]}!`}
              {activeTab === 'activos' && 'Tus Posesiones'}
              {activeTab === 'subir' && 'Nueva Factura'}
              {activeTab === 'ahorro' && 'Plan de Ahorro'}
              {activeTab === 'derechos' && 'Tus Derechos'}
            </h1>
            <p className="text-slate-400 font-medium text-sm">
              {activeTab === 'dashboard' && 'Aquí tienes tu radar de ahorro actualizado.'}
              {activeTab === 'derechos' && 'Información de la OCU y BOE simplificada.'}
            </p>
          </div>
          {activeTab !== 'subir' && (
            <button 
              onClick={() => setActiveTab('subir')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Escanear Factura
            </button>
          )}
        </header>

        <div className="max-w-6xl mx-auto animate-fade">
          {activeTab === 'dashboard' && <Dashboard expenses={expenses} assets={assets} onSeeAdvice={() => { setActiveTab('ahorro'); fetchAdvice(); }} />}
          {activeTab === 'activos' && <PropertyManager assets={assets} onAdd={handleAddAsset} />}
          {activeTab === 'subir' && <BillUploader assets={assets} onComplete={handleAddExpense} />}
          {activeTab === 'ahorro' && <Recommendations recommendations={recommendations} onRefresh={fetchAdvice} isLoading={isLoadingAdvice} />}
          {activeTab === 'derechos' && <ConsumerRights />}
        </div>
      </main>

      <BillyChat expenses={expenses} assets={assets} />
      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default App;
