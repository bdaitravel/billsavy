
import React from 'react';
import { Expense, Asset, Category, FinancialHealth } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  onSeeAdvice: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, onSeeAdvice }) => {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Simulación de Predictive Cash Flow para el gráfico
  const chartData = [
    { month: 'Ene', real: 450, pred: 450 },
    { month: 'Feb', real: 380, pred: 380 },
    { month: 'Mar', real: 410, pred: 410 },
    { month: 'Abr', real: totalSpent > 0 ? totalSpent : 390, pred: 400 },
    { month: 'May', real: null, pred: 420 },
    { month: 'Jun', real: null, pred: 480 },
  ];

  const healthScore = Math.min(100, 65 + (expenses.length * 2));
  const yearlySavings = totalSpent * 0.15; // Estimación 15% ahorro unicornio

  return (
    <div className="space-y-6">
      {/* Top Banner: Financial Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Financial Health Score</p>
          <div className="flex items-end gap-2">
            <h2 className="text-5xl font-black">{healthScore}</h2>
            <span className="text-emerald-400 font-bold mb-2">/100</span>
          </div>
          <div className="mt-6 flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i < healthScore/10 ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
            ))}
          </div>
          <p className="mt-4 text-slate-400 text-xs font-medium">Estás en el top 12% de ahorradores de tu zona.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ahorro Anual Proyectado</p>
          <h2 className="text-4xl font-black text-slate-900">~{yearlySavings.toFixed(0)}€</h2>
          <p className="mt-2 text-emerald-600 font-bold text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
            +22% vs mes anterior
          </p>
          <button onClick={onSeeAdvice} className="mt-6 w-full py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all">
            Optimizar Cartera
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Fugas Detectadas</p>
          <h2 className="text-4xl font-black text-rose-500">2</h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 p-2 rounded-lg">
              <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
              SUSCRIPCIÓN DUPLICADA: NETFLIX
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 p-2 rounded-lg">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              SUBIDA DE TARIFA: ENDESA (+12€)
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart: Predictive Cash Flow */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900">Predictive Cash Flow</h3>
            <p className="text-sm text-slate-400 font-medium">IA detectando picos de gasto futuros.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-bold text-slate-500">Real</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
              <span className="text-xs font-bold text-slate-500">IA Forecast</span>
            </div>
          </div>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8', fontWeight: 600}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                itemStyle={{fontWeight: 800}}
              />
              <Area type="monotone" dataKey="pred" stroke="#e2e8f0" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="real" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorReal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Action: Insurance Arbitrage */}
      <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-100">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl">🛡️</div>
          <div>
            <h4 className="text-xl font-black">Insurance Arbitrage Activo</h4>
            <p className="text-emerald-100 text-sm font-medium">He encontrado un seguro de coche con las mismas coberturas por 142€ menos.</p>
          </div>
        </div>
        <button onClick={onSeeAdvice} className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all whitespace-nowrap shadow-lg">
          Cambiar y Ahorrar con 1-Click
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
