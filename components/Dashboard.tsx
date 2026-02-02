
import React, { useState } from 'react';
import { Expense, Asset, UserProfile } from '../types';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  user: UserProfile;
  onAction: () => void;
}

const chartData = [
  { mes: 'Ene', gasto: 420, ahorro: 60 },
  { mes: 'Feb', gasto: 380, ahorro: 95 },
  { mes: 'Mar', gasto: 510, ahorro: 50 },
  { mes: 'Abr', gasto: 290, ahorro: 140 },
  { mes: 'May', gasto: 340, ahorro: 170 },
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

  const healthScore = Math.min(1000, 320 + (expenses.length * 150));
  const cityRank = Math.max(1, 100 - Math.floor(healthScore / 11));

  const badges = [
    { icon: '🥇', label: 'Maestro del Gasto', desc: 'Has iniciado tu camino auditando facturas. ¡Sigue así para desbloquear el nivel experto!', active: expenses.length > 0 },
    { icon: '🛡️', label: 'Escudo Legal', desc: 'Billy está vigilando tus seguros. Te avisaremos 30 días antes de que cualquier póliza se renueve automáticamente.', active: expenses.some(e => e.category.toLowerCase().includes('segur')) },
    { icon: '🏎️', label: 'Piloto Eficiente', desc: 'Tus gastos de motor (seguro, taller, combustible) están bajo control absoluto de la IA.', active: expenses.some(e => e.category.toLowerCase().includes('moto') || e.category.toLowerCase().includes('coche')) },
    { icon: '🏠', label: 'Dueño de Casa', desc: 'Suministros del hogar optimizados. Has registrado servicios básicos para auditoría de precios.', active: expenses.some(e => e.category.toLowerCase().includes('luz') || e.category.toLowerCase().includes('hogar')) },
  ];

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-start px-1 pt-2">
        <div className="animate-pop">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">¡Hola, {user.name.split(' ')[0]}!</h2>
          <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.3em] mt-3">Patrimonio Auditado: {assets.length} Activos</p>
        </div>
        <div className="flex gap-2">
           {badges.map((b, i) => (
             <button 
                key={i} 
                onClick={() => setSelectedBadge(i)} 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-500 active:scale-90 ${b.active ? 'bg-teal-500/20 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)]' : 'bg-white/5 border-white/5 opacity-20 grayscale scale-90'}`}
             >
               {b.icon}
             </button>
           ))}
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 ml-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          Alertas de Vencimiento
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {expenses.length > 0 ? (
            expenses.slice(0, 2).map((exp, i) => (
              <div key={i} className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-3xl">🗓️</div>
                   <div>
                     <p className="text-[14px] font-black text-white uppercase leading-none">{exp.provider}</p>
                     <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-2">{exp.description}</p>
                   </div>
                 </div>
                 <div className="bg-orange-500/20 px-4 py-2 rounded-xl text-orange-400 text-[10px] font-black uppercase tracking-tighter">Acción</div>
              </div>
            ))
          ) : (
            <div className="bg-white/2 border border-dashed border-white/10 p-8 rounded-[2.5rem] text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cartera al día • Sin renovaciones próximas</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden h-[220px] flex flex-col justify-between">
           <div className="relative z-10">
             <span className="text-[9px] font-black text-teal-400 uppercase tracking-[0.3em] block mb-2">Billy Score Total</span>
             <h3 className="text-6xl font-black text-white tracking-tighter">{healthScore}</h3>
           </div>
           <div className="relative z-10">
             <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.6)] transition-all duration-1000" style={{ width: `${(healthScore/1000)*100}%` }}></div>
             </div>
           </div>
           <div className="absolute -right-10 -bottom-10 text-[12rem] opacity-[0.03] select-none rotate-12">💎</div>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl h-[220px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Eficiencia Mensual</span>
             <div className="flex gap-4">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-700"></div><span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Gasto</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-500"></div><span className="text-[8px] font-black text-teal-400 uppercase tracking-tighter">Ahorro</span></div>
             </div>
           </div>
           <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ left: -20, right: 10 }}>
                 <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} />
                 <Bar dataKey="gasto" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={10} />
                 <Bar dataKey="ahorro" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={10} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="px-1 pt-12">
        <button onClick={onAction} className="w-full py-9 bg-teal-500 text-slate-950 rounded-[3rem] font-black text-[14px] uppercase tracking-[0.4em] shadow-[0_35px_70px_rgba(45,212,191,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4">
          <span className="text-2xl">📸</span>
          AUDITAR FACTURA
        </button>
      </div>

      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-8">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedBadge(null)}></div>
           <div className="relative bg-slate-900 border border-teal-500/30 p-12 rounded-[4.5rem] w-full max-w-[340px] text-center animate-pop shadow-2xl">
              <div className="text-9xl mb-10 drop-shadow-[0_0_30px_rgba(45,212,191,0.4)]">{badges[selectedBadge].icon}</div>
              <h4 className="text-2xl font-black text-teal-400 uppercase tracking-widest mb-4 leading-tight">{badges[selectedBadge].label}</h4>
              <p className="text-[15px] text-slate-300 leading-relaxed font-medium italic opacity-80 mb-12">"{badges[selectedBadge].desc}"</p>
              <button onClick={() => setSelectedBadge(null)} className="w-full py-6 bg-teal-500 text-slate-950 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Entendido</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
