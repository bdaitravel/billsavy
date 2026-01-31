
import React from 'react';
import { Expense, Asset, Category } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  onSeeAdvice: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, onSeeAdvice }) => {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const upcomingReminders = expenses
    .filter(e => e.expiryDate && new Date(e.expiryDate) > new Date())
    .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());

  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(d => d.value > 0);

  const healthScore = Math.min(100, (expenses.length / (assets.length * 2 || 1)) * 100);
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min">
      
      {/* Score Card - Hero Section */}
      <div className="md:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Tu Salud Financiera</p>
          <h3 className="text-2xl font-black text-slate-800">Score BillSavy</h3>
          <div className="mt-4 flex items-center gap-3">
             <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${healthScore}%` }}></div>
            </div>
            <span className="font-black text-slate-700 text-lg">{healthScore.toFixed(0)}%</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-2">¡Sigue subiendo facturas para mejorar tu precisión de ahorro!</p>
        </div>
        <div className="hidden sm:flex ml-6 w-20 h-20 items-center justify-center bg-emerald-50 rounded-3xl border border-emerald-100">
          <span className="text-4xl">🚀</span>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="md:col-span-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Gasto Total</p>
          <h2 className="text-xl font-black text-slate-900 mt-1">{totalSpent.toFixed(0)}€</h2>
        </div>
        <div className="bg-emerald-600 p-5 rounded-[2rem] shadow-xl shadow-emerald-100 text-white flex flex-col justify-center cursor-pointer hover:scale-105 transition-transform" onClick={onSeeAdvice}>
          <p className="text-[10px] font-bold text-emerald-100 uppercase">Ahorro</p>
          <h2 className="text-xl font-black mt-1">~410€</h2>
        </div>
      </div>

      {/* Categories Bento */}
      <div className="md:col-span-7 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-64 flex flex-col">
        <h3 className="text-sm font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
           <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
           Gastos por Categoría
        </h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} fontSize={9} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={18}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reminders Bento */}
      <div className="md:col-span-5 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-64 overflow-hidden flex flex-col">
        <h3 className="text-sm font-bold text-slate-800 mb-4 px-2 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-amber-400 rounded-full"></div>
          Radar de Renovaciones
        </h3>
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {upcomingReminders.length > 0 ? upcomingReminders.map(rem => (
            <div key={rem.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100 hover:bg-white transition-colors">
              <div>
                <p className="font-bold text-slate-800 text-[11px]">{rem.category}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{rem.provider}</p>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  Math.ceil((new Date(rem.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 15 
                    ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {Math.ceil((new Date(rem.expiryDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
                </span>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
              <span className="text-3xl mb-1">🕶️</span>
              <p className="text-[10px] font-bold uppercase tracking-widest">Sin alertas</p>
            </div>
          )}
        </div>
      </div>

      {/* Billy Status - Compact Info */}
      <div className="md:col-span-12 bg-slate-900 p-5 rounded-[2rem] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-black">B</div>
          <div>
            <p className="text-xs font-bold text-emerald-400">Consejo de Billy:</p>
            <p className="text-sm text-slate-300">"He detectado que el mercado de Seguros de Hogar ha bajado un 15% este mes. ¿Hablamos?"</p>
          </div>
        </div>
        <button onClick={onSeeAdvice} className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap">
          Ver mi plan de ahorro
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
