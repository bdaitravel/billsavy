
import React, { useState } from 'react';
import { Expense, Asset, UserProfile } from '../types';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  user: UserProfile;
  onAction: () => void;
}

const chartData = [
  { mes: 'Ene', gasto: 420, ahorro: 50 },
  { mes: 'Feb', gasto: 380, ahorro: 90 },
  { mes: 'Mar', gasto: 510, ahorro: 40 },
  { mes: 'Abr', gasto: 290, ahorro: 130 },
  { mes: 'May', gasto: 340, ahorro: 160 },
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
    { icon: '🥇', label: 'Maestro', desc: 'Has empezado a dominar tus facturas.', active: expenses.length > 0 },
    { icon: '🛡️', label: 'Blindado', desc: 'Tus seguros están bajo auditoría constante.', active: expenses.some(e => e.category.toLowerCase().includes('segur')) },
    { icon: '🏎️', label: 'Piloto', desc: 'Gastos de motor optimizados al máximo.', active: expenses.some(e => e.category.toLowerCase().includes('moto') || e.category.toLowerCase().includes('coche')) },
    { icon: '🏠', label: 'Patrón', desc: 'Control total sobre los costes de tu vivienda.', active: expenses.some(e => e.category.toLowerCase().includes('luz') || e.category.toLowerCase().includes('hogar')) },
  ];

  const categories = [
    { label: 'Hogar', icon: '🏠' }, { label: 'Coche', icon: '🚗' },
    { label: 'Moto', icon: '🏍️' }, { label: 'Luz/Gas', icon: '⚡' }, 
    { label: 'Telef.', icon: '📱' }, { label: 'Seguros', icon: '🛡️' },
    { label: 'Suscr.', icon: '📺' }, { label: 'Otros', icon: '📄' },
  ];

  return (
    <div className="space-y-8 pb-32">
      {/* Perfil y Medallas */}
      <div className="flex justify-between items-start px-1">
        <div className="animate-pop">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">¡Hola, {user.name.split(' ')[0]}!</h2>
          <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em] mt-3">Ranking {user.city}: TOP {cityRank}%</p>
        </div>
        <div className="flex gap-1.5">
           {badges.map((b, i) => (
             <button 
                key={i} 
                onClick={() => b.active && setSelectedBadge(i)} 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border transition-all duration-500 ${b.active ? 'bg-teal-500/20 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)]' : 'bg-white/5 border-white/5 opacity-20 grayscale scale-90'}`}
             >
               {b.icon}
             </button>
           ))}
        </div>
      </div>

      {/* Panel de Control Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Score Card */}
        <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden h-[220px] flex flex-col justify-between">
           <div className="relative z-10">
             <span className="text-[9px] font-black text-teal-400 uppercase tracking-[0.3em] block mb-2">Salud Financiera</span>
             <h3 className="text-6xl font-black text-white tracking-tighter">{healthScore}</h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Puntos BillSavy</p>
           </div>
           <div className="relative z-10">
             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.6)] transition-all duration-1000" style={{ width: `${(healthScore/1000)*100}%` }}></div>
             </div>
           </div>
           <div className="absolute -right-10 -bottom-10 text-[10rem] opacity-[0.03] select-none">💎</div>
        </div>
        
        {/* Gráfica de Gasto vs Ahorro */}
        <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/10 shadow-2xl h-[220px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Gasto vs Ahorro</span>
             <div className="flex gap-3">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-700"></div><span className="text-[8px] font-black text-slate-500 uppercase">Gasto</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-500"></div><span className="text-[8px] font-black text-teal-400 uppercase">Ahorro</span></div>
             </div>
           </div>
           <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} dy={10} />
                 <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', fontSize: '10px'}} />
                 <Bar dataKey="gasto" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={10} />
                 <Bar dataKey="ahorro" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={10} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Renovaciones Críticas */}
      {expenses.length > 0 && (
        <div className="px-1">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-5 ml-2">Vencimientos Próximos</h3>
          <div className="grid grid-cols-1 gap-4">
             {expenses.slice(0, 2).map((exp, i) => (
               <div key={i} className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl animate-pulse">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📅</div>
                    <div>
                      <p className="text-[12px] font-black text-white uppercase leading-none">{exp.provider}</p>
                      <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest mt-2">Vence: {exp.description.split(': ')[1]}</p>
                    </div>
                  </div>
                  <div className="bg-orange-500/20 px-4 py-2 rounded-xl text-orange-400 text-[10px] font-black uppercase">¡Ojo!</div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Mis Activos Grid */}
      <div className="px-1">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 ml-2">Gestionar Cartera</h3>
        <div className="grid grid-cols-4 gap-y-10">
          {categories.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 group active:scale-90 transition-all cursor-pointer" onClick={onAction}>
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-3xl shadow-2xl group-hover:border-teal-500/40 transition-colors">
                 <span>{item.icon}</span>
              </div>
              <span className="text-[9px] font-black uppercase text-slate-500 text-center tracking-tighter leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Historial de Contratos */}
      <div className="px-1">
        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 ml-2">Últimos Contratos</h3>
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="bg-white/2 border-2 border-dashed border-white/5 p-16 rounded-[3.5rem] text-center flex flex-col items-center justify-center gap-4">
              <span className="text-4xl opacity-20">📂</span>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] leading-loose">Tu archivo está vacío.<br/>Sube un PDF para activarlo.</p>
            </div>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="bg-slate-900/80 p-6 rounded-[2.5rem] border border-white/5 flex justify-between items-center shadow-2xl active:scale-95 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/5">
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div className="max-w-[150px]">
                    <p className="text-sm font-black text-white uppercase truncate">{exp.provider}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{exp.date}</p>
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

      {/* Botón Flotante de Acción */}
      <div className="fixed bottom-32 left-8 right-8 z-[100]">
        <button onClick={onAction} className="w-full py-7 bg-teal-500 text-slate-950 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-[0_25px_50px_rgba(45,212,191,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3">
          <span>Añadir Documento</span>
          <span className="text-xl">⚡</span>
        </button>
      </div>

      {/* Modal de Detalle de Medalla */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-10">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedBadge(null)}></div>
           <div className="relative bg-slate-900 border border-teal-500/30 p-12 rounded-[4rem] w-full max-w-[320px] text-center animate-pop shadow-2xl">
              <div className="text-8xl mb-8 drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">{badges[selectedBadge].icon}</div>
              <h4 className="text-xl font-black text-teal-400 uppercase tracking-[0.2em] mb-4">{badges[selectedBadge].label}</h4>
              <p className="text-[13px] text-slate-300 italic mb-12 leading-relaxed font-medium">"{badges[selectedBadge].desc}"</p>
              <button onClick={() => setSelectedBadge(null)} className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Entendido</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
