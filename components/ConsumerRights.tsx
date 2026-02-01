
import React from 'react';

const ConsumerRights: React.FC = () => {
  const tips = [
    { 
      title: "Luz: El Truco del 60%", 
      text: "Casi el 60% de tu factura son peajes e impuestos. Billy analiza si tu potencia es excesiva y te ayuda a bajarla hoy mismo para ahorrar hasta 150€/año.",
      icon: "⚡",
      bg: "bg-teal-500/5 border-teal-500/20"
    },
    { 
      title: "Seguros: El Radar 'Fidelidad'", 
      text: "Las aseguradoras suben el precio por defecto al renovar. Activar el radar de Billy bloquea las subidas automáticas notificando a la compañía.",
      icon: "🛡️",
      bg: "bg-blue-500/5 border-blue-500/20"
    },
    { 
      title: "Móvil: Datos Fantasma", 
      text: "El 85% de los españoles paga por gigas que no gasta. Billy te sugiere el plan exacto para ahorrar unos 15€ al mes sin perder cobertura.",
      icon: "📱",
      bg: "bg-indigo-500/5 border-indigo-500/20"
    },
    { 
      title: "Coche: Gastos Ocultos", 
      text: "Al escanear tu seguro de coche, Billy busca cláusulas de 'asistencia en carretera' duplicadas para que no pagues dos veces por lo mismo.",
      icon: "🚗",
      bg: "bg-orange-500/5 border-orange-500/20"
    }
  ];

  return (
    <div className="min-h-full flex flex-col gap-10 animate-view py-6 pb-48">
      {/* Hero Section */}
      <div className="bg-slate-900 border border-teal-500/30 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
         <div className="relative z-10">
           <h3 className="text-teal-400 font-black text-2xl uppercase tracking-tighter mb-3">Billy SOS Hub</h3>
           <p className="text-slate-300 text-[13px] font-bold uppercase tracking-[0.2em] leading-relaxed">Tu inteligencia defensiva contra las facturas abusivas y renovaciones caras.</p>
         </div>
         <div className="absolute -right-8 -top-8 text-[10rem] opacity-[0.05] rotate-12 select-none">🆘</div>
      </div>

      {/* Masterclass Cards */}
      <div className="flex-1 space-y-8">
         <h3 className="text-slate-600 font-black text-[12px] uppercase tracking-[0.5em] mb-4 ml-8 underline decoration-teal-500/30 underline-offset-8">Educación de Ahorro</h3>
         
         {tips.map((tip, i) => (
           <div key={i} className={`p-10 rounded-[4rem] border ${tip.bg} shadow-xl active:scale-95 transition-all duration-300 flex flex-col gap-5`}>
              <div className="flex items-center gap-6">
                <span className="text-5xl">{tip.icon}</span>
                <p className="text-[16px] font-black text-white uppercase tracking-widest leading-tight">{tip.title}</p>
              </div>
              <p className="text-[15px] text-slate-300 leading-relaxed font-medium italic opacity-90">"{tip.text}"</p>
           </div>
         ))}

         {/* Alerta de Mercado */}
         <div className="bg-red-500/10 p-12 rounded-[4.5rem] border border-red-500/20 mt-12 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-5 h-5 bg-red-500 rounded-full animate-ping"></span>
              <p className="text-[12px] font-black text-red-400 uppercase tracking-[0.5em]">Alerta Crítica</p>
            </div>
            <p className="text-[15px] text-white font-bold leading-relaxed">
              Las tarifas de gas subirán un 12% en toda España el próximo mes. Billy está buscando las mejores tarifas fijas ahora mismo para protegerte.
            </p>
            <div className="absolute -right-6 -bottom-6 text-7xl opacity-5">🔥</div>
         </div>
      </div>

      <div className="pt-24 text-center opacity-40">
         <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.8em]">BILLSAVY OS • SECURE CORE V4</p>
      </div>
    </div>
  );
};

export default ConsumerRights;
