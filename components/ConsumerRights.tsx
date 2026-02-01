
import React from 'react';

const ConsumerRights: React.FC = () => {
  const facts = [
    { 
      q: "¿Sabías qué?", 
      a: "España es uno de los países con la luz más cara de Europa. El 60% de tu factura son peajes e impuestos que Billy te ayuda a auditar.",
      icon: "⚡",
      color: "border-teal-500/20 bg-teal-500/5"
    },
    { 
      q: "Truco Maestro de Telefonía", 
      a: "El 80% de los usuarios paga por gigas que nunca consume. Billy analiza tu consumo real y te sugiere el plan exacto para ahorrar hasta 15€/mes.",
      icon: "📱",
      color: "border-blue-500/20 bg-blue-500/5"
    },
    { 
      q: "Radar de Seguros", 
      a: "Las aseguradoras suben el precio por 'fidelidad'. Notificar que Billy está auditando tu póliza suele bajar el precio un 10% instantáneamente.",
      icon: "🛡️",
      color: "border-orange-500/20 bg-orange-500/5"
    },
    { 
      q: "Gestión de Agua", 
      a: "Una cisterna con fuga silenciosa puede costar 200€ extra al año. Si Billy detecta un gasto anómalo en tu factura, te avisará al momento.",
      icon: "💧",
      color: "border-indigo-500/20 bg-indigo-500/5"
    }
  ];

  return (
    <div className="min-h-full flex flex-col gap-8 animate-view py-6 pb-40">
      {/* Hero Billy SOS */}
      <div className="bg-gradient-to-br from-teal-500/20 to-slate-900 border border-teal-500/30 p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
         <div className="relative z-10">
           <h3 className="text-teal-400 font-black text-xl uppercase tracking-tighter mb-2">Billy Intelligence Hub</h3>
           <p className="text-slate-300 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed">Educación financiera avanzada para tu hogar y motor.</p>
         </div>
         <div className="absolute -right-4 -top-4 text-7xl opacity-10 animate-pulse">💡</div>
      </div>

      {/* Grid de Curiosidades - Pantalla Completa */}
      <div className="flex-1 space-y-6">
         <h3 className="text-slate-600 font-black text-[11px] uppercase tracking-[0.4em] mb-4 ml-4">Billy Masterclass</h3>
         
         {facts.map((f, i) => (
           <div key={i} className={`p-8 rounded-[3rem] border ${f.color} shadow-lg transition-all active:scale-95 duration-300 flex flex-col gap-4`}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{f.icon}</span>
                <p className="text-[12px] font-black text-white uppercase tracking-widest">{f.q}</p>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed font-medium italic">"{f.a}"</p>
           </div>
         ))}

         {/* Noticia de Mercado */}
         <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/5 shadow-2xl mt-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">Última Hora Mercado</p>
            </div>
            <p className="text-[12px] text-white font-bold leading-relaxed">
              Las nuevas tarifas de luz cambian el próximo trimestre. Billy ya está actualizando sus algoritmos para que no pagues ni un céntimo de más.
            </p>
            <button className="mt-6 text-[9px] font-black text-teal-400 uppercase tracking-widest border-b border-teal-400/30 pb-1">Saber más sobre el cambio</button>
         </div>
      </div>

      <div className="pt-10 text-center opacity-30">
         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">BILLSAVY OS • SECURE CORE • 2025</p>
      </div>
    </div>
  );
};

export default ConsumerRights;
