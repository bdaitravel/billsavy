
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
    <div className="space-y-6">
      
      {/* Header Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card: Optimización e Insignias */}
        <div className="bg-white/5 p-5 rounded-[2.5rem] flex flex-col justify-between border border-white/10 relative overflow-hidden h-[180px]">
          <div>
            <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest block mb-1">Score de Optimización</span>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-black text-white">840</h3>
              <span className="text-[10px] text-teal-400 font-bold">PTS</span>
            </div>
            <div className="mt-1">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Percentil en tu ciudad: </span>
               <span className="text-[9px] font-black text-white">Top 15%</span>
            </div>
          </div>
          
          <div className="flex gap-2 relative mt-4">
            {badges.map((b, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedBadge(i)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-all ${b.active ? 'bg-teal-500/20 border-teal-500/40' : 'bg-white/5 border-white/5 opacity-30 grayscale'}`}
              >
                {b.icon}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-1">
               <div className="h-full bg-teal-400 w-[84%]"></div>
            </div>
            <div className="flex justify-between items-center text-[7px] font-bold uppercase">
              <span className="text-slate-500">Nivel 4</span>
              <span className="text-teal-400">Vigilancia: 85%</span>
            </div>
          </div>
        </div>

        {/* Card: Gráfico de Ahorro */}
        <div className="bg-white/5 p-5 rounded-[2.5rem] border border-white/10 flex flex-col h-[180px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Ahorro Mensual</span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                <Bar dataKey="gasto" fill="#1e293b" radius={[2, 2, 0, 0]} barSize={5} />
                <Bar dataKey="ahorro" fill="#2dd4bf" radius={[2, 2, 0, 0]} barSize={5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal de Insignias (Capa superior absoluta) */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedBadge(null)}></div>
          <div className="relative bg-slate-900 border-2 border-teal-500/50 p-8 rounded-[3rem] w-full max-w-[280px] text-center animate-pop">
            <div className="text-5xl mb-4">{badges[selectedBadge].icon}</div>
            <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest mb-2">{badges[selectedBadge].label}</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-6 font-medium">"{badges[selectedBadge].desc}"</p>
            <button onClick={() => setSelectedBadge(null)} className="w-full py-4 bg-teal-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Cerrar</button>
          </div>
        </div>
      )}

      {/* Mosaico de Categorías */}
      <div className="py-4">
        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Categorías Activas</h3>
        <div className="grid grid-cols-4 gap-y-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onAction}>
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg transition-all group-active:scale-90">
                 <span>{item.icon}</span>
              </div>
              <span className="text-[7px] font-black uppercase text-slate-500 text-center leading-none">{item.label}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={onAction}>
            <div className="w-12 h-12 rounded-full bg-teal-500/10 border-2 border-dashed border-teal-500/40 flex items-center justify-center text-xl text-teal-400 group-active:scale-90">
               <span>＋</span>
            </div>
            <span className="text-[7px] font-black uppercase text-teal-400">Añadir</span>
          </div>
        </div>
      </div>

      {/* Renovaciones y Botón Principal */}
      <div className="space-y-4">
        <div className="bg-slate-900/50 p-5 rounded-[2rem] border border-white/5">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-4">Próximos Vencimientos</span>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
               <div className="flex items-center gap-3">
                 <span className="text-sm">🚗</span>
                 <span className="text-[10px] font-bold text-white">Seguro Coche</span>
               </div>
               <span className="text-[9px] font-black text-orange-400">12 MAYO</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onAction}
          className="w-full py-6 bg-teal-500 text-slate-950 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
        >
          Escanear Documento
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
