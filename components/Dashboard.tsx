
import React, { useState } from 'react';
import { Expense, Asset, UserProfile } from '../types';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  assets: Asset[];
  user: UserProfile;
  onAction: () => void;
}

const data = [
  { mes: 'Ene', gasto: 420 },
  { mes: 'Feb', gasto: 380 },
  { mes: 'Mar', gasto: 510 },
  { mes: 'Abr', gasto: 290 },
  { mes: 'May', gasto: 340 },
];

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('luz')) return '⚡';
  if (cat.includes('seguro')) return '🛡️';
  if (cat.includes('hipoteca')) return '🏛️';
  if (cat.includes('coche') || cat.includes('auto')) return '🚗';
  if (cat.includes('moto')) return '🏍️';
  if (cat.includes('teléf') || cat.includes('móvil')) return '📱';
  if (cat.includes('suscr')) return '📺';
  if (cat.includes('comunid')) return '👥';
  if (cat.includes('agua')) return '💧';
  return '📄';
};

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, user, onAction }) => {
  const [selectedBadge, setSelectedBadge] = useState<null | number>(null);

  const healthScore = Math.min(1000, 300 + (expenses.length * 140));
  const cityRank = Math.max(1, 100 - Math.floor(healthScore / 11));

  const badges = [
    { icon: '🥇', label: 'Empezando', desc: 'Tu primer documento subido.', active: expenses.length > 0 },
    { icon: '🏎️', label: 'Ruedas', desc: 'Gestionando tus vehículos.', active: expenses.some(e => e.category.toLowerCase().includes('coche') || e.category.toLowerCase().includes('moto')) },
    { icon: '🏠', label: 'Casero', desc: 'Hogar bajo control.', active: expenses.some(e => e.category.toLowerCase().includes('luz') || e.category.toLowerCase().includes('hogar')) },
    { icon: '🛡️', label: 'Vigilante', desc: 'Billy vigila tus renovaciones.', active: expenses.length > 2 },
    { icon: '💎', label: 'Ahorrador', desc: 'Has optimizado más de 5 gastos.', active: expenses.length > 5 },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Bienvenida y Ranking */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter">¡Hola, {user.name.split(' ')[0]}!</h2>
          <p className="text-[8px] text-teal-400 font-black uppercase tracking-widest mt-1">Nivel {Math.floor(healthScore/200)} • {user.city}</p>
        </div>
        <div className="bg-white/5 py-1.5 px-3 rounded-xl border border-white/5 text-center">
          <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest">TOP CIUDAD</p>
          <p className="text-xs font-black text-teal-400">#{cityRank}</p>
        </div>
      </div>

      {/* Score y Badges */}
      <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[8px] font-black text-teal-400 uppercase tracking-[0.2em] block mb-1">Tu Score BillSavy</span>
            <h3 className="text-4xl font-black text-white tracking-tighter">{healthScore}</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-nowrap max-w-[150px]">
            {badges.map((b, i) => (
              <button key={i} onClick={() => b.active && setSelectedBadge(i)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all ${b.active ? 'bg-teal-500/20 border-teal-500/40 shadow-lg' : 'bg-white/5 border-white/5 opacity-10 grayscale'}`}
              >
                {b.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: `${(healthScore/1000)*100}%` }}></div>
        </div>
      </div>

      {/* Gráfico de Gasto Mensual */}
      <div className="bg-slate-900 p-5 rounded-[2.5rem] border border-white/10 h-48 shadow-xl">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">Evolución Gastos (€)</p>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <Bar dataKey="gasto" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Renovaciones Urgentes */}
      {expenses.length > 0 && (
        <div className="px-1">
          <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1">Vencimientos próximos</h3>
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-[9px] font-black text-white uppercase">{expenses[0].provider}</p>
                <p className="text-[7px] text-orange-400 font-bold uppercase tracking-widest">Revisar antes de {expenses[0].date.split('/')[1]}/{parseInt(expenses[0].date.split('/')[2])+1}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historial Corto */}
      <div className="px-1">
        <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-1">Mis Documentos</h3>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="bg-white/2 border border-dashed border-white/10 p-8 rounded-3xl text-center">
              <p className="text-[8px] font-black text-slate-500 uppercase">Sin documentos. Saca una foto para empezar.</p>
            </div>
          ) : (
            expenses.slice(0, 3).map((exp) => (
              <div key={exp.id} className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{getCategoryIcon(exp.category)}</div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase truncate max-w-[100px]">{exp.provider}</p>
                    <span className="text-[6px] font-black px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                      {exp.auditStatus}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white">{exp.amount}€</p>
                  <p className="text-[6px] text-slate-600 font-black uppercase">{exp.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botón Acción - Más pequeño y estilizado */}
      <div className="px-1 pt-2">
        <button onClick={onAction} className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
          Escanear Factura o Seguro
        </button>
      </div>

      {/* Modal Insignia */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedBadge(null)}></div>
          <div className="relative bg-slate-900 border border-teal-500/30 p-8 rounded-[2.5rem] w-full max-w-[280px] text-center animate-pop">
            <div className="text-5xl mb-4">{badges[selectedBadge].icon}</div>
            <h4 className="text-xs font-black text-teal-400 uppercase mb-2">{badges[selectedBadge].label}</h4>
            <p className="text-[10px] text-slate-300 italic mb-6">"{badges[selectedBadge].desc}"</p>
            <button onClick={() => setSelectedBadge(null)} className="w-full py-3 bg-teal-500 text-slate-950 rounded-xl text-[9px] font-black uppercase">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
