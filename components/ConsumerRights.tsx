
import React from 'react';

const ConsumerRights: React.FC = () => {
  const tips = [
    { 
      title: "Luz: Potencia Contratada", 
      text: "El 60% de tu factura son costes fijos. Billy analiza tu consumo real para decirte si estás pagando por potencia que no necesitas. Ahorro medio: 120€/año.",
      icon: "⚡",
      bg: "bg-teal-500/5 border-teal-500/20"
    },
    { 
      title: "Seguros: El Engaño del 'Vencimiento'", 
      text: "Tienes derecho legal a cancelar tu seguro hasta 30 días antes de la renovación. Billy te avisará a tiempo para que puedas renegociar con fuerza.",
      icon: "🛡️",
      bg: "bg-blue-500/5 border-blue-500/20"
    },
    { 
      title: "Móvil: La Trampa de los Datos", 
      text: "Pagamos por gigas que caducan. Billy busca tarifas de 'datos acumulables' para que lo que pagues hoy te sirva mañana. No regales tu dinero.",
      icon: "📱",
      bg: "bg-indigo-500/5 border-indigo-500/20"
    },
    { 
      title: "Coche: Reparaciones Justas", 
      text: "Si escaneas una factura de taller, Billy comparará los precios de las piezas con el mercado oficial. Si hay sobrecoste, te daremos el argumento legal para reclamar.",
      icon: "🚗",
      bg: "bg-orange-500/5 border-orange-500/20"
    }
  ];

  return (
    <div className="min-h-full flex flex-col gap-10 animate-view py-6 pb-48">
      {/* Hero Section Inmersivo */}
      <div className="bg-gradient-to-br from-slate-900 to-teal-900/40 border border-teal-500/30 p-12 rounded-[4.5rem] shadow-2xl relative overflow-hidden">
         <div className="relative z-10">
           <span className="text-teal-400 font-black text-[10px] uppercase tracking-[0.5em] block mb-4">Billy Intelligence Hub</span>
           <h3 className="text-white font-black text-3xl uppercase tracking-tighter mb-4 leading-none">Billy SOS</h3>
           <p className="text-slate-300 text-[14px] font-bold uppercase tracking-[0.1em] leading-relaxed max-w-[80%]">Educación financiera avanzada para defender tu bolsillo contra abusos.</p>
         </div>
         <div className="absolute -right-8 -top-8 text-[12rem] opacity-[0.05] rotate-12 select-none">🆘</div>
      </div>

      {/* Grid de Curiosidades de Alto Impacto */}
      <div className="flex-1 space-y-8 px-1">
         <h3 className="text-slate-600 font-black text-[12px] uppercase tracking-[0.6em] mb-6 ml-6 underline decoration-teal-500/30 underline-offset-[12px]">¿Sabías qué?</h3>
         
         {tips.map((tip, i) => (
           <div key={i} className={`p-10 rounded-[4rem] border ${tip.bg} shadow-xl active:scale-95 transition-all duration-500 flex flex-col gap-6`}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-white/5">
                  {tip.icon}
                </div>
                <p className="text-[17px] font-black text-white uppercase tracking-tight leading-none">{tip.title}</p>
              </div>
              <p className="text-[15px] text-slate-300 leading-relaxed font-medium italic opacity-90 border-l-2 border-teal-500/30 pl-6">
                "{tip.text}"
              </p>
           </div>
         ))}

         {/* Alerta de Mercado Dinámica */}
         <div className="bg-red-500/10 p-12 rounded-[4.5rem] border border-red-500/20 mt-16 relative overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-5 mb-6">
              <span className="w-5 h-5 bg-red-500 rounded-full animate-ping"></span>
              <p className="text-[12px] font-black text-red-400 uppercase tracking-[0.5em]">Alerta de Mercado</p>
            </div>
            <p className="text-[16px] text-white font-black leading-relaxed">
              Las tarifas de gas subirán un 12% el próximo trimestre. Billy ya está buscando las mejores opciones de tarifa fija para protegerte de la subida.
            </p>
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-5">🔥</div>
         </div>
      </div>

      <div className="pt-24 text-center opacity-30 pb-10">
         <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.8em]">BILLSAVY OS • DEFENSE CORE V5</p>
      </div>
    </div>
  );
};

export default ConsumerRights;
