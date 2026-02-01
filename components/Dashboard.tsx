
import React, { useState } from 'react';
import { Expense, Asset, UserProfile } from '../types';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  user: UserProfile;
  onAction: () => void;
}

const chartData = [
  { mes: 'Ene', gasto: 420, ahorro: 50 },
  { mes: 'Feb', gasto: 380, ahorro: 85 },
  { mes: 'Mar', gasto: 510, ahorro: 30 },
  { mes: 'Abr', gasto: 290, ahorro: 110 },
  { mes: 'May', gasto: 340, ahorro: 140 },
];

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('luz')) return '⚡';
  if (cat.includes('seguro')) return '🛡️';
  if (cat.includes('hipoteca')) return '🏛️';
  if (cat.includes('coche') || cat.includes('auto')) return '🚗';
  if (cat.includes('moto')) return '🏍️';
  if (cat.includes('teléf') || cat.includes('móvil') || cat.includes('fibra')) return '📱';
  if (cat.includes('suscr')) return '📺';
  if (cat.includes('comunid')) return '👥';
  if (cat.includes('agua')) return '💧';
  if (cat.includes('gas')) return '🔥';
  return '📄';
};

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, user, onAction }) => {
  const [selectedBadge, setSelectedBadge] = useState<null | number>(null);

  const healthScore = Math.min(1000, 320 + (expenses.length * 150));
  const cityRank = Math.max(1, 100 - Math.floor(healthScore / 11));

  const badges = [
    { icon: '🥇', label: 'Organizado', desc: 'Has registrado tu primer gasto.', active: expenses.length > 0 },
    { icon: '🛡️', label: 'Seguro', desc: 'Billy vigila tus pólizas.', active: expenses.some(e => e.category.toLowerCase().includes('segur')) },
    { icon: '🏎️', label: 'Motor', desc: 'Vehículos optimizados.', active: expenses.some(e => e.category.toLowerCase().includes('moto') || e.category.toLowerCase().includes('coche')) },
    { icon: '🏠', label: 'Casero', desc: 'Hogar bajo control.', active: expenses.some(e => e.category.toLowerCase().includes('luz') || e.category.toLowerCase().includes('hogar')) },
  ];

  const categories = [
    { label: 'Hogar', icon: '🏠' }, { label: 'Coche', icon: '🚗' },
    { label: 'Moto', icon: '🏍️' }, { label: 'Luz/Gas', icon: '⚡' }, 
    { label: 'Telef.', icon: '📱' }, { label: 'Seguros', icon: '🛡️' },
    { label: 'Suscr.', icon: '📺' }, { label: 'Otros', icon: '📄' },
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* Header con Badges */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">¡Hola, {user.name.split(' ')[0]}!</h2>
          <p className="text-[9px] text-teal-400 font-black uppercase tracking-[0.2em] mt-2">Nivel Ahorro: {user.city}</p>
        </div>
        <div className="flex gap-2">
           {badges.map((b, i) => (
             <button key={i} onClick={() => b.active && setSelectedBadge(i)} className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border transition-all ${b.active ? 'bg-teal-500/20 border-teal-500/40 opacity-100 shadow-lg shadow-teal-500/10' : 'bg-white/5 border-white/5 opacity-10 grayscale'}`}>
               {b.icon}
             </button>
           ))}
        </div>
      </div>

      {/* Stats Panel: Score & Gráfica */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-6 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between h-[200px] relative overflow-hidden">
           <div className="relative z-10">
             <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block mb-2">Score BillSavy</span>
             <h3 className="text-5xl font-black text-white tracking-tighter">{healthScore}</h3>
           </div>
           <div className="relative z-10">
             <div className="h-1.5 bg-white/5 rounded-full mb-2">
               <div className="h-full bg-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.4)]" style={{ width: `${(healthScore/1000)*100}%` }}></div>
             </div>
             <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">TOP {cityRank}% de tu zona</p>
           </div>
           <div className="absolute -right-6 -bottom-6 text-7xl opacity-5">💎</div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-[3rem] border border-white/10 shadow-2xl h-[200px] flex flex-col">
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4 text-center">Gasto vs Ahorro</span>
           <div className="flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <Bar dataKey="gasto" fill="#1e293b" radius={[2, 2, 0, 0]} barSize={8} />
                 <Bar dataKey="ahorro" fill="#2dd4bf" radius={[2, 2, 0, 0]} barSize={8} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Renovaciones Próximas (Urgente) */}
      {expenses.length > 0 && (
        <div className="px-1">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-1">Vencimientos Clave</h3>
          <div className="space-y-4">
             {expenses.slice(0, 2).map((exp, i) => (
               <div key={i} className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-[2.2rem] flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-xl">📅</div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase">{exp.provider}</p>
                      <p className="text-[8px] text-orange-400 font-bold uppercase tracking-widest mt-1">Renovar: {exp.description.split(': ')[1]}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs">🔔</div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Grid de Categorías con Iconos */}
      <div className="px-1">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8 ml-1">Gestionar Activos</h3>
        <div className="grid grid-cols-4 gap-y-10">
          {categories.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 group active:scale-90 transition-all" onClick={onAction}>
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-2xl shadow-xl group-hover:border-teal-500/30">
                 <span>{item.icon}</span>
              </div>
              <span className="text-[8px] font-black uppercase text-slate-500 text-center tracking-tighter leading-none">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historial con Iconos de Categoría */}
      <div className="px-1">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5 ml-1">Mis Contratos</h3>
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="bg-white/2 border border-dashed border-white/10 p-12 rounded-[2.5rem] text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-loose">Sube tu primera factura<br/>para empezar a ahorrar.</p>
            </div>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="bg-slate-900/60 p-5 rounded-[2.2rem] border border-white/5 flex justify-between items-center shadow-2xl active:scale-95 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner border border-white/5">
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div className="max-w-[140px]">
                    <p className="text-[12px] font-black text-white uppercase truncate">{exp.provider}</p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">{exp.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-md font-black text-white">{exp.amount}€</p>
                  <span className={`text-[7px] font-black px-2 py-0.5 rounded-md border uppercase mt-1 inline-block ${exp.auditStatus === 'ABUSIVO' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'}`}>
                    {exp.auditStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botón de Acción Principal - Ajustado */}
      <div className="px-1 pt-6">
        <button onClick={onAction} className="w-full py-7 bg-teal-500 text-slate-950 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(45,212,191,0.3)] active:scale-95 transition-all">
          Añadir Gasto o Seguro
        </button>
      </div>

      {/* Modal Badge Detalle */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-10">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedBadge(null)}></div>
           <div className="relative bg-slate-900 border border-teal-500/30 p-10 rounded-[3.5rem] w-full max-w-[300px] text-center animate-pop shadow-2xl">
              <div className="text-7xl mb-6 drop-shadow-2xl">{badges[selectedBadge].icon}</div>
              <h4 className="text-md font-black text-teal-400 uppercase tracking-widest mb-3">{badges[selectedBadge].label}</h4>
              <p className="text-[11px] text-slate-300 italic mb-10 leading-relaxed">"{badges[selectedBadge].desc}"</p>
              <button onClick={() => setSelectedBadge(null)} className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Entendido</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
