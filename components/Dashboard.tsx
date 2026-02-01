
import React, { useState } from 'react';
import { Expense, Asset } from '../types';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

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

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('luz') || cat.includes('electr')) return '⚡';
  if (cat.includes('seguro')) return '🛡️';
  if (cat.includes('hipoteca') || cat.includes('banc')) return '🏛️';
  if (cat.includes('coche') || cat.includes('vehic')) return '🚗';
  if (cat.includes('agua')) return '💧';
  if (cat.includes('gas')) return '🔥';
  return '📄';
};

const Dashboard: React.FC<DashboardProps> = ({ expenses, assets, onAction }) => {
  const [selectedBadge, setSelectedBadge] = useState<null | number>(null);

  const categories = [
    { label: 'Luz', icon: '⚡' }, 
    { label: 'Gas', icon: '🔥' },
    { label: 'Agua', icon: '💧' }, 
    { label: 'Hipoteca', icon: '🏛️' },
    { label: 'Seguros', icon: '🛡️' }, 
    { label: 'Coche', icon: '🚗' },
    { label: 'Hogar', icon: '🏠' },
    { label: 'Otros', icon: '📄' },
  ];

  const badges = [
    { icon: '🥇', label: 'Iniciador', desc: 'Has registrado tu primer gasto en BillSavy.', active: true },
    { icon: '⚖️', label: 'Protegido', desc: 'Has realizado tu primera auditoría legal con Billy.', active: expenses.length > 0 },
    { icon: '🏛️', label: 'Banquero', desc: 'Has auditado un producto bancario o hipoteca.', active: expenses.some(e => e.category.toLowerCase().includes('hipo') || e.category.toLowerCase().includes('banc')) },
    { icon: '🛡️', label: 'Blindado', desc: 'Tus pólizas de seguros están bajo control.', active: expenses.some(e => e.category.toLowerCase().includes('segur')) },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-6 rounded-[2.5rem] flex flex-col justify-between border border-white/10 relative overflow-hidden h-[200px] shadow-xl">
          <div className="relative z-10">
            <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block mb-2">Score de Salud</span>
            <div className="flex items-baseline gap-1">
              <h3 className="text-4xl font-black text-white">840</h3>
              <span className="text-xs text-teal-400 font-bold">/ 1000</span>
            </div>
            <div className="mt-3 bg-white/5 p-2 rounded-xl inline-block border border-white/5">
               <span className="text-[8px] font-black text-white uppercase">Ahorras más que el 85%</span>
            </div>
          </div>
          <div className="flex gap-2 relative mt-4 z-10">
            {badges.map((b, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setSelectedBadge(i); }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-all ${b.active ? 'bg-teal-500/20 border-teal-500/40' : 'bg-white/5 border-white/5 opacity-20 grayscale'}`}
              >
                {b.icon}
              </button>
            ))}
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/10 flex flex-col h-[200px] shadow-xl">
          <div className="mb-4">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ahorro Mensual</span>
            <p className="text-xl font-black text-teal-400 mt-1">+{expenses.length > 0 ? (expenses.length * 12.5).toFixed(0) : '0'}€</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="ahorro" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historial de Auditorías */}
      <div>
        <div className="flex justify-between items-center mb-5 ml-2">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Auditorías Recientes</h3>
          {expenses.length > 0 && <span className="text-[8px] font-black text-teal-400 uppercase">{expenses.length} TOTAL</span>}
        </div>
        
        {expenses.length === 0 ? (
          <div className="bg-white/2 border border-dashed border-white/10 p-10 rounded-[2.5rem] text-center">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-loose">No has subido ninguna factura todavía.<br/>Sube tu Hipoteca o Seguro de Coche.</p>
             <button onClick={onAction} className="mt-4 text-teal-400 text-[10px] font-black uppercase underline decoration-2 underline-offset-4 tracking-widest">Escanear ahora</button>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((exp) => (
              <div key={exp.id} className="bg-slate-900/60 p-5 rounded-[2.2rem] border border-white/5 flex justify-between items-center group active:scale-95 transition-all shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5 ${exp.auditStatus === 'ABUSIVO' ? 'bg-red-500/10 text-red-500' : 'bg-teal-500/10 text-teal-400'}`}>
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">{exp.provider}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase ${exp.auditStatus === 'ABUSIVO' ? 'bg-red-500 text-white' : 'bg-teal-500/20 text-teal-400 border border-teal-500/20'}`}>
                        {exp.auditStatus}
                      </span>
                      <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">{exp.date}</span>
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

      {/* Categorías */}
      <div>
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8 ml-2">Tu Ecosistema</h3>
        <div className="grid grid-cols-4 gap-y-10">
          {categories.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 group" onClick={onAction}>
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-xl transition-all group-active:scale-90 shadow-md">
                 <span>{item.icon}</span>
              </div>
              <span className="text-[8px] font-black uppercase text-slate-500 text-center leading-none tracking-tighter">{item.label}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-3" onClick={onAction}>
            <div className="w-14 h-14 rounded-full bg-teal-500/10 border-2 border-dashed border-teal-500/30 flex items-center justify-center text-2xl text-teal-400 active:scale-90 transition-all">
               <span>＋</span>
            </div>
            <span className="text-[8px] font-black uppercase text-teal-400 tracking-tighter">Añadir</span>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-12">
        <button onClick={onAction} className="w-full py-8 bg-teal-500 text-slate-950 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-[0_25px_50px_rgba(45,212,191,0.25)] active:scale-95 transition-all">
          Auditoría de Documentos
        </button>
      </div>

      {/* Modal de Insignias */}
      {selectedBadge !== null && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-6 pointer-events-auto">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl" onClick={() => setSelectedBadge(null)}></div>
          <div className="relative bg-slate-900 border-2 border-teal-500/30 p-10 rounded-[3.5rem] w-full max-w-[300px] text-center animate-pop">
            <div className="text-6xl mb-6">{badges[selectedBadge].icon}</div>
            <h4 className="text-sm font-black text-teal-400 uppercase tracking-widest mb-3">{badges[selectedBadge].label}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-8 font-medium">"{badges[selectedBadge].desc}"</p>
            <button onClick={() => setSelectedBadge(null)} className="w-full py-5 bg-teal-500 text-slate-950 rounded-[1.5rem] text-[11px] font-black uppercase shadow-2xl">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
