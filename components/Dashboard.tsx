
import React, { useState } from 'react';
import { Expense, Asset } from '../types';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  onAction: () => void;
}

const data = [
  { mes: 'Ene', gasto: 420, ahorro: 15 },
  { mes: 'Feb', gasto: 380, ahorro: 55 },
  { mes: 'Mar', gasto: 510, ahorro: 30 },
  { mes: 'Abr', gasto: 290, ahorro: 95 },
  { mes: 'May', gasto: 340, ahorro: 110 },
];

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, onAction }) => {
  const [selectedBadge, setSelectedBadge] = useState<null | number>(null);

  const items = [
    { label: 'Luz', icon: '⚡' }, 
    { label: 'Gas', icon: '🔥' },
    { label: 'Agua', icon: '💧' }, 
    { label: 'Tlf.', icon: '📱' },
    { label: 'Seguros', icon: '🛡️' }, 
    { label: 'Coche', icon: '🚗' },
    { label: 'Hogar', icon: '🏠' },
    { label: 'Suscrip.', icon: '📺' },
    { label: 'Bancos', icon: '🏦' },
    { label: 'Impuestos', icon: '🏛️' },
    { label: 'Comunidad', icon: '👥' },
  ];

  const badges = [
    { icon: '🥇', label: 'Consciente', desc: 'Has registrado todos tus gastos básicos.', active: true },
    { icon: '🔍', label: 'Auditor', desc: 'Has analizado más de 10 facturas con Billy.', active: true },
    { icon: '🏎️', label: 'Ruta', desc: 'Control total sobre los gastos de tu vehículo.', active: false },
    { icon: '💡', label: 'Zen', desc: 'Sin alertas de renovación pendientes hoy.', active: false },
  ];

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden py-1 space-y-4 relative">
      
      {/* Header Stat Cards */}
      <div className="grid grid-cols-12 gap-3 min-h-[160px]">
        {/* Left Card: Score, Badges & Ranking */}
        <div className="col-span-6 bg-white/5 p-4 rounded-[2.5rem] flex flex-col justify-between border border-white/10 relative overflow-hidden">
          <div className="z-10 flex justify-between items-start">
            <div>
              <span className="text-[7px] font-black text-teal-400 uppercase tracking-[0.2em] block mb-1">Score de Control</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-black text-white">840</h3>
                <span className="text-[8px] text-teal-400 font-bold">pts</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[6px] font-black text-slate-500 uppercase block leading-tight">Posición en<br/>tu ciudad</span>
              <span className="text-[10px] font-black text-white">#190</span>
            </div>
          </div>
          
          {/* Sección de Insignias Interactiva */}
          <div className="flex gap-2 mt-2 z-10 relative">
            {badges.map((b, i) => (
              <button 
                key={i} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBadge(selectedBadge === i ? null : i);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all transform active:scale-90 ${b.active ? 'bg-teal-500/20 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-white/5 border-white/5 opacity-30 grayscale'}`}
              >
                {b.icon}
              </button>
            ))}
            
            {/* Tooltip informativo de insignia mejorado (MODAL) */}
            {selectedBadge !== null && (
              <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                onClick={() => setSelectedBadge(null)}
              >
                <div className="bg-[#020617] border-2 border-teal-500/50 p-8 rounded-[2.5rem] w-full max-w-[260px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-pop text-center" onClick={e => e.stopPropagation()}>
                  <div className="text-5xl mb-4 drop-shadow-lg">{badges[selectedBadge].icon}</div>
                  <h4 className="text-[11px] font-black text-teal-400 uppercase tracking-[0.2em] mb-3">{badges[selectedBadge].label}</h4>
                  <p className="text-[12px] text-slate-300 leading-relaxed font-medium mb-6">"{badges[selectedBadge].desc}"</p>
                  <button onClick={() => setSelectedBadge(null)} className="w-full py-3 bg-teal-500 text-navy-deep rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-teal-400 transition-colors">Entendido</button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 z-10">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-1">
               <div className="h-full bg-teal-400 w-[84%] shadow-[0_0_8px_#2dd4bf]"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[6px] font-black text-slate-400 uppercase">Savy XP: 2.450</span>
                <span className="text-[5px] text-slate-500 font-bold uppercase tracking-tighter">Puntos por control de facturas</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-teal-400 uppercase tracking-tighter">Vigilancia</span>
                <span className="text-[7px] font-black text-white uppercase">85% Protegido</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Gasto vs Ahorro Chart */}
        <div className="col-span-6 bg-white/5 p-4 rounded-[2.5rem] border border-white/10 flex flex-col relative overflow-hidden">
          <div className="absolute top-4 left-4 flex gap-4 z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest">Gasto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
              <span className="text-[6px] font-black text-teal-400 uppercase tracking-widest">Ahorro</span>
            </div>
          </div>
          <div className="flex-1 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                  contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '8px', color: 'white' }} 
                />
                <Bar dataKey="gasto" fill="#1e293b" radius={[2, 2, 0, 0]} barSize={6} />
                <Bar dataKey="ahorro" fill="#2dd4bf" radius={[2, 2, 0, 0]} barSize={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Mosaico de Círculos Perfecto (11 categorías + 1 añadir = 12 total, 4x3) */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="grid grid-cols-4 gap-x-2 gap-y-6">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={onAction}>
              <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-base transition-all group-hover:scale-110 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 shadow-lg">
                 <span>{item.icon}</span>
              </div>
              <span className="text-[6px] font-black uppercase text-slate-500 group-hover:text-white tracking-tighter text-center leading-none">{item.label}</span>
            </div>
          ))}
          {/* Botón Mosaico Especial (+) Integrado en la cuadrícula */}
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={onAction}>
            <div className="w-11 h-11 rounded-full bg-teal-500/10 border-2 border-dashed border-teal-500/40 flex items-center justify-center text-lg text-teal-400 transition-all group-hover:scale-110 group-hover:bg-teal-500/20 group-hover:border-teal-500">
               <span>＋</span>
            </div>
            <span className="text-[6px] font-black uppercase text-teal-400 tracking-tighter">Añadir</span>
          </div>
        </div>
      </div>

      {/* Renovaciones Section */}
      <div className="flex flex-col gap-3 pb-2">
        <div className="bg-slate-900/50 p-4 rounded-[2rem] border border-white/5">
          <div className="flex justify-between items-center mb-3">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Renovaciones Próximas</span>
             <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-xl border border-white/5">
               <div className="flex items-center gap-2">
                 <span className="text-xs">🚗</span>
                 <span className="text-[9px] font-bold text-white">Seguro Coche</span>
               </div>
               <span className="text-[8px] font-black text-slate-400">12 MAYO</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-xl border border-white/5">
               <div className="flex items-center gap-2">
                 <span className="text-xs">📺</span>
                 <span className="text-[9px] font-bold text-white">Netflix Premium</span>
               </div>
               <span className="text-[8px] font-black text-slate-400">28 MAYO</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onAction}
          className="w-full py-5 bg-teal-500 text-slate-950 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(45,212,191,0.2)] hover:bg-teal-400 transition-all active:scale-95 z-10"
        >
          Analizar Factura o Contrato
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
