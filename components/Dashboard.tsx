
import React, { useState } from 'react';
import { Expense, Asset, UserProfile } from '../types';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  user: UserProfile;
  onAction: () => void;
}

const data = [
  { mes: 'Ene', gasto: 420, ahorro: 15 },
  { mes: 'Feb', gasto: 380, ahorro: 55 },
  { mes: 'Mar', gasto: 510, ahorro: 30 },
  { mes: 'Abr', gasto: 290, ahorro: 95 },
  { mes: 'May', gasto: 340, ahorro: 110 },
];

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('luz')) return '⚡';
  if (cat.includes('seguro')) return '🛡️';
  if (cat.includes('hipoteca')) return '🏛️';
  if (cat.includes('coche')) return '🚗';
  if (cat.includes('moto')) return '🏍️';
  if (cat.includes('teléf')) return '📱';
  if (cat.includes('suscr')) return '📺';
  return '📄';
};

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, user, onAction }) => {
  const [selectedBadge, setSelectedBadge] = useState<null | number>(null);

  const healthScore = Math.min(1000, 300 + (expenses.length * 120));
  const cityRank = Math.max(1, 100 - Math.floor(healthScore / 11));

  const badges = [
    { icon: '🥇', label: 'Iniciado', desc: 'Tu primera gestión con Billy.', active: expenses.length > 0 },
    { icon: '🛡️', label: 'Vigilante', desc: 'Gestionando tus seguros.', active: expenses.some(e => e.category.toLowerCase().includes('segur')) },
    { icon: '🚗', label: 'Motor', desc: 'Vehículos bajo control.', active: expenses.some(e => e.category.toLowerCase().includes('coche') || e.category.toLowerCase().includes('moto')) },
    { icon: '🏠', label: 'Hogar', desc: 'Casa optimizada.', active: expenses.some(e => e.category.toLowerCase().includes('luz')) },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header Info */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter">¡Hola, {user.name.split(' ')[0]}!</h2>
          <p className="text-[8px] text-teal-400 font-black uppercase tracking-widest mt-1">Ranking {user.city}: TOP {cityRank}%</p>
        </div>
        <div className="flex gap-2">
           {badges.map((b, i) => (
             <div key={i} onClick={() => b.active && setSelectedBadge(i)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border ${b.active ? 'bg-teal-500/20 border-teal-500/40 opacity-100' : 'bg-white/5 border-white/5 opacity-10'}`}>
               {b.icon}
             </div>
           ))}
        </div>
      </div>

      {/* Main Stats Panel */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col justify-between h-[180px]">
           <div>
             <span className="text-[7px] font-black text-teal-400 uppercase tracking-widest block mb-1">Score BillSavy</span>
             <h3 className="text-4xl font-black text-white tracking-tighter">{healthScore}</h3>
           </div>
           <div className="h-1 bg-white/5 rounded-full">
             <div className="h-full bg-teal-500" style={{ width: `${(healthScore/1000)*100}%` }}></div>
           </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-[2.5rem] border border-white/10 shadow-2xl h-[180px] flex flex-col">
           <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-3">Gasto vs Ahorro</span>
           <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                 <Bar dataKey="gasto" fill="#1e293b" radius={[2, 2, 0, 0]} barSize={8} />
                 <Bar dataKey="ahorro" fill="#2dd4bf" radius={[2, 2, 0, 0]} barSize={8} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Próximas Renovaciones */}
      {expenses.length > 0 && (
        <div className="px-1">
          <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-1">Vencimientos Próximos</h3>
          <div className="space-y-3">
             {expenses.slice(0, 2).map((exp, i) => (
               <div key={i} className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <div>
                      <p className="text-[9px] font-black text-white uppercase">{exp.provider}</p>
                      <p className="text-[7px] text-orange-400 font-bold uppercase tracking-widest">Renovar en {exp.description.split(': ')[1]}</p>
                    </div>
                  </div>
                  <div className="text-xs">🔔</div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Mis Documentos */}
      <div className="px-1">
        <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-1">Mis Contratos</h3>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="bg-white/2 border border-dashed border-white/10 p-10 rounded-3xl text-center">
              <p className="text-[8px] font-black text-slate-500 uppercase">Sube tu primer contrato o factura.</p>
            </div>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{getCategoryIcon(exp.category)}</div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase truncate max-w-[120px]">{exp.provider}</p>
                    <p className="text-[7px] text-slate-500 font-bold uppercase">{exp.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{exp.amount}€</p>
                  <p className="text-[6px] text-teal-400 font-black uppercase">{exp.auditStatus}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="px-1 pt-4">
        <button onClick={onAction} className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
          Añadir Documento
        </button>
      </div>

      {/* Modal Badge */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-8">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBadge(null)}></div>
           <div className="relative bg-slate-900 border border-teal-500/30 p-8 rounded-[2.5rem] w-full max-w-[280px] text-center animate-pop">
              <div className="text-6xl mb-4">{badges[selectedBadge].icon}</div>
              <h4 className="text-sm font-black text-teal-400 uppercase mb-2">{badges[selectedBadge].label}</h4>
              <p className="text-[10px] text-slate-300 italic mb-8">"{badges[selectedBadge].desc}"</p>
              <button onClick={() => setSelectedBadge(null)} className="w-full py-4 bg-teal-500 text-slate-950 rounded-xl font-black text-[9px] uppercase">Entendido</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
