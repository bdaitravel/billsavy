
import React, { useState } from 'react';
import { Expense, Asset, UserProfile } from '../types';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  user: UserProfile;
  onAction: () => void;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('luz')) return '⚡';
  if (cat.includes('seguro')) return '🛡️';
  if (cat.includes('hipoteca') || cat.includes('banc')) return '🏛️';
  if (cat.includes('coche') || cat.includes('auto')) return '🚗';
  if (cat.includes('moto')) return '🏍️';
  if (cat.includes('teléf') || cat.includes('móvil') || cat.includes('telef')) return '📱';
  if (cat.includes('suscr') || cat.includes('netflix')) return '📺';
  if (cat.includes('comunid')) return '👥';
  if (cat.includes('impuest')) return '⚖️';
  if (cat.includes('agua')) return '💧';
  if (cat.includes('gas')) return '🔥';
  return '📄';
};

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, user, onAction }) => {
  const [selectedBadge, setSelectedBadge] = useState<null | number>(null);

  // Gamificación y Score
  const healthScore = Math.min(1000, 400 + (expenses.length * 120) - (expenses.filter(e => e.auditStatus === 'ABUSIVO').length * 50));
  const cityRank = Math.max(1, 100 - Math.floor(healthScore / 10));

  const badges = [
    { icon: '🥇', label: 'Organizado', desc: 'Has registrado tu primer gasto.', active: true },
    { icon: '🛡️', label: 'Vigilante', desc: 'Billy está monitorizando tus contratos.', active: expenses.length > 0 },
    { icon: '🏎️', label: 'Motorizado', desc: 'Tienes tus vehículos bajo control.', active: expenses.some(e => e.category.toLowerCase().includes('coche') || e.category.toLowerCase().includes('moto')) },
    { icon: '⚖️', label: 'Ahorrador', desc: 'Has evitado un cargo abusivo.', active: expenses.some(e => e.auditStatus === 'ABUSIVO') },
    { icon: '🏠', label: 'Casero', desc: 'Tu hogar está optimizado.', active: expenses.some(e => e.category.toLowerCase().includes('luz') || e.category.toLowerCase().includes('hogar')) },
  ];

  const categories = [
    { label: 'Hogar', icon: '🏠' }, { label: 'Coche', icon: '🚗' },
    { label: 'Moto', icon: '🏍️' }, { label: 'Luz/Gas', icon: '⚡' }, 
    { label: 'Telef.', icon: '📱' }, { label: 'Comunid.', icon: '👥' },
    { label: 'Impues.', icon: '⚖️' }, { label: 'Suscr.', icon: '📺' },
  ];

  return (
    <div className="space-y-8 pb-24">
      
      {/* Saludo y Ciudad (Ranking) */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Hola, {user.name.split(' ')[0]}</h2>
          <p className="text-[9px] text-teal-400 font-black uppercase tracking-[0.2em] mt-2">Gestionando en {user.city || 'España'}</p>
        </div>
        <div className="bg-white/5 py-2 px-4 rounded-2xl border border-white/5 text-center">
          <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Ranking Ciudad</p>
          <p className="text-sm font-black text-teal-400 tracking-tighter">TOP {cityRank}%</p>
        </div>
      </div>

      {/* Score Panel - Gamification Focus */}
      <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[240px]">
        <div className="relative z-10">
          <span className="text-[9px] font-black text-teal-400 uppercase tracking-[0.3em] block mb-2">Puntuación BillSavy</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-6xl font-black text-white tracking-tighter">{healthScore}</h3>
            <span className="text-sm font-black text-slate-500 uppercase">Puntos</span>
          </div>
          <div className="mt-4 bg-teal-500/10 border border-teal-500/20 py-2 px-4 rounded-full inline-block">
             <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest">Score subiendo • +{expenses.length * 15} pts</span>
          </div>
        </div>

        {/* Insignias con scroll horizontal para iPhone */}
        <div className="relative z-10 mt-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 flex-nowrap pb-1">
            {badges.map((b, i) => (
              <button key={i} onClick={() => setSelectedBadge(i)}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl border transition-all ${b.active ? 'bg-teal-500/20 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-white/5 border-white/5 opacity-10 grayscale'}`}
              >
                {b.icon}
              </button>
            ))}
          </div>
        </div>
        
        {/* Adorno visual */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Próximas Renovaciones (Urgente) */}
      {expenses.length > 0 && (
        <div className="px-1">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-1">Próximas Renovaciones</h3>
          <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-[2.5rem] flex items-center justify-between shadow-lg">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-xl">📅</div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase">{expenses[0].provider}</p>
                  <p className="text-[8px] text-orange-400 font-bold uppercase tracking-widest mt-1">Vence en 24 días</p>
                </div>
             </div>
             <button className="bg-white/5 p-3 rounded-xl border border-white/5">
               <span className="text-lg">⚡</span>
             </button>
          </div>
        </div>
      )}

      {/* Historial de Gastos */}
      <div className="px-1">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5 ml-1">Mis Contratos</h3>
        {expenses.length === 0 ? (
          <div className="bg-white/2 border border-dashed border-white/10 p-12 rounded-[2.5rem] text-center">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">No hay contratos registrados.<br/>Sube tu primer seguro o factura.</p>
             <button onClick={onAction} className="mt-6 text-teal-400 text-[10px] font-black uppercase underline decoration-2 underline-offset-8">Añadir ahora</button>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((exp) => (
              <div key={exp.id} className="bg-slate-900/80 p-5 rounded-[2.2rem] border border-white/5 flex justify-between items-center active:scale-95 transition-all shadow-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5 ${exp.auditStatus === 'ABUSIVO' ? 'bg-orange-500/10 text-orange-500' : 'bg-teal-500/10 text-teal-400'}`}>
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div className="max-w-[140px]">
                    <p className="text-[11px] font-black text-white uppercase truncate">{exp.provider}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase ${exp.auditStatus === 'ABUSIVO' ? 'bg-orange-500 text-white' : 'bg-teal-500/20 text-teal-400 border border-teal-500/20'}`}>
                        {exp.auditStatus === 'ABUSIVO' ? 'AVISO BILLY' : exp.auditStatus}
                      </span>
                      <span className="text-[7px] text-slate-600 font-bold uppercase">{exp.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{exp.amount}€</p>
                  <p className="text-[7px] text-slate-500 font-bold uppercase mt-1">{exp.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid de Categorías */}
      <div className="px-1">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8 ml-1">Categorías de Gasto</h3>
        <div className="grid grid-cols-4 gap-y-10">
          {categories.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 group" onClick={onAction}>
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-xl transition-all group-active:scale-90 shadow-md">
                 <span>{item.icon}</span>
              </div>
              <span className="text-[8px] font-black uppercase text-slate-500 text-center leading-none tracking-tighter">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 px-1">
        <button onClick={onAction} className="w-full py-8 bg-teal-500 text-slate-950 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-[0_25px_50px_rgba(45,212,191,0.25)] active:scale-95 transition-all">
          Añadir Gasto o Seguro
        </button>
      </div>

      {/* Modal Detalle Insignia */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-6 pointer-events-auto">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl" onClick={() => setSelectedBadge(null)}></div>
          <div className="relative bg-slate-900 border-2 border-teal-500/30 p-10 rounded-[3.5rem] w-full max-w-[320px] text-center animate-pop shadow-2xl">
            <div className="text-7xl mb-6 drop-shadow-2xl">{badges[selectedBadge].icon}</div>
            <h4 className="text-sm font-black text-teal-400 uppercase tracking-widest mb-3">{badges[selectedBadge].label}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-8 italic">"{badges[selectedBadge].desc}"</p>
            <button onClick={() => setSelectedBadge(null)} className="w-full py-5 bg-teal-500 text-slate-950 rounded-[1.5rem] text-[11px] font-black uppercase shadow-2xl active:scale-95 transition-all">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
