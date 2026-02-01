
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
    { icon: '🥇', label: 'Maestro', desc: 'Dominando el arte del ahorro. Has empezado a auditar tus facturas con Billy.', active: expenses.length > 0 },
    { icon: '🛡️', label: 'Blindado', desc: 'Tus seguros están bajo vigilancia. Billy te avisará antes de que te cobren la renovación.', active: expenses.some(e => e.category.toLowerCase().includes('segur')) },
    { icon: '🏍️', label: 'Piloto', desc: 'Gastos de motor al mínimo. Billy ha detectado que controlas tus pólizas de vehículo.', active: expenses.some(e => e.category.toLowerCase().includes('moto') || e.category.toLowerCase().includes('coche')) },
    { icon: '🏠', label: 'Patrón', desc: 'Hogar 100% optimizado. Has registrado suministros básicos de tu vivienda.', active: expenses.some(e => e.category.toLowerCase().includes('luz') || e.category.toLowerCase().includes('hogar')) },
  ];

  const categories = [
    { label: 'Hogar', icon: '🏠' }, { label: 'Coche', icon: '🚗' },
    { label: 'Moto', icon: '🏍️' }, { label: 'Luz/Gas', icon: '⚡' }, 
    { label: 'Telef.', icon: '📱' }, { label: 'Seguros', icon: '🛡️' },
    { label: 'Suscr.', icon: '📺' }, { label: 'Otros', icon: '📄' },
  ];

  return (
    <div className="space-y-8 pb-32">
      {/* Perfil e Insignias */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">¡Hola, {user.name.split(' ')[0]}!</h2>
          <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em] mt-2">Nivel Ahorro: TOP {cityRank}%</p>
        </div>
        <div className="flex gap-2">
           {badges.map((b, i) => (
             <button 
              key={i} 
              onClick={() => setSelectedBadge(i)} 
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border transition-all ${b.active ? 'bg-teal-500/20 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)]' : 'bg-white/5 border-white/5 opacity-10 grayscale'}`}
             >
               {b.icon}
             </button>
           ))}
        </div>
      </div>

      {/* Recordatorios de Renovación (URGENTE) */}
      {expenses.length > 0 && (
        <div className="px-1">
          <h3 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4 ml-2">⚠️ Vencimientos Clave</h3>
          <div className="space-y-4">
             {expenses.slice(0, 2).map((exp, i) => (
               <div key={i} className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl animate-pulse">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-2xl">🗓️</div>
                    <div>
                      <p className="text-sm font-black text-white uppercase leading-none">{exp.provider}</p>
                      <p className="text-[10px] text-orange-300 font-bold uppercase mt-2 tracking-widest">{exp.description}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black bg-orange-500/20 px-3 py-1.5 rounded-xl text-orange-400 uppercase">Revisar</div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Stats Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden h-[220px] flex flex-col justify-between">
           <div className="relative z-10">
             <span className="text-[9px] font-black text-teal-400 uppercase tracking-[0.3em] block mb-2">Billy Score</span>
             <h3 className="text-6xl font-black text-white tracking-tighter">{healthScore}</h3>
           </div>
           <div className="relative z-10">
             <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.6)]" style={{ width: `${(healthScore/1000)*100}%` }}></div>
             </div>
           </div>
           <div className="absolute -right-10 -bottom-10 text-[10rem] opacity-[0.03] select-none">💎</div>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl h-[220px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Gasto vs Ahorro</span>
             <div className="flex gap-3 text-[8px] font-black uppercase">
               <span className="text-slate-600">● Gasto</span>
               <span className="text-teal-400">● Ahorro</span>
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

      {/* Grid de Activos */}
      <div className="px-1 pt-4">
        <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 ml-2">Mi Cartera Activa</h3>
        <div className="grid grid-cols-4 gap-y-12">
          {categories.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 group active:scale-90 transition-all cursor-pointer" onClick={onAction}>
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-3xl shadow-xl group-hover:border-teal-500/40">
                 <span>{item.icon}</span>
              </div>
              <span className="text-[9px] font-black uppercase text-slate-500 text-center tracking-tighter leading-none">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historial Auditoría */}
      <div className="px-1 pt-6">
        <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 ml-2">Auditorías Recientes</h3>
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="bg-white/2 border-2 border-dashed border-white/5 p-16 rounded-[4rem] text-center flex flex-col items-center gap-4">
              <span className="text-5xl opacity-20">📂</span>
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] leading-relaxed">No hay facturas.<br/>Sube un PDF para analizar.</p>
            </div>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="bg-slate-900/80 p-6 rounded-[2.5rem] border border-white/5 flex justify-between items-center shadow-2xl active:scale-95 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-white uppercase truncate max-w-[140px]">{exp.provider}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1.5">{exp.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">{exp.amount}€</p>
                  <span className={`text-[8px] font-black px-2.5 py-1 rounded-lg border uppercase mt-2 inline-block ${exp.auditStatus === 'ABUSIVO' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'}`}>
                    {exp.auditStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botón Acción Principal */}
      <div className="px-1 pt-10">
        <button onClick={onAction} className="w-full py-8 bg-teal-500 text-slate-950 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.4em] shadow-[0_30px_60px_rgba(45,212,191,0.3)] active:scale-95 transition-all">
          ESCANEAR DOCUMENTO
        </button>
      </div>

      {/* Modal de Insignia con Explicación */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-8">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedBadge(null)}></div>
           <div className="relative bg-slate-900 border border-teal-500/30 p-12 rounded-[4rem] w-full max-w-[340px] text-center animate-pop shadow-2xl">
              <div className="text-8xl mb-10 drop-shadow-[0_0_30px_rgba(45,212,191,0.4)]">{badges[selectedBadge].icon}</div>
              <h4 className="text-2xl font-black text-teal-400 uppercase tracking-widest mb-4">{badges[selectedBadge].label}</h4>
              <p className="text-[14px] text-slate-300 italic mb-12 leading-relaxed font-medium">"{badges[selectedBadge].desc}"</p>
              <button onClick={() => setSelectedBadge(null)} className="w-full py-6 bg-teal-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Cerrar</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
