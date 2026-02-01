
import React from 'react';

const ConsumerRights: React.FC = () => {
  const facts = [
    { q: "¿Sabías qué?", a: "España es uno de los países con la luz más cara de Europa por los impuestos adicionales." },
    { q: "Truco Maestro", a: "Llamar a tu compañía de móvil cada 6 meses diciendo que te vas te puede ahorrar hasta 100€ al año." },
    { q: "Ojo con el Agua", a: "Un grifo goteando puede perder hasta 30 litros de agua al día. ¡Repáralo ya!" },
    { q: "Seguros", a: "El seguro de coche suele subir un 5-10% anual aunque no tengas partes. Billy te avisa para que negocies." }
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-view py-2">
      <div className="bg-teal-500/10 p-6 rounded-[2.5rem] border border-teal-500/20">
         <h3 className="text-teal-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">💡 Curiosidades Billy</h3>
         <div className="space-y-5">
           {facts.slice(0, 2).map((f, i) => (
             <div key={i} className="space-y-1">
               <p className="text-[10px] font-black text-white uppercase">{f.q}</p>
               <p className="text-[10px] text-slate-400 leading-relaxed font-medium">"{f.a}"</p>
             </div>
           ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
         <h3 className="text-slate-600 font-black text-[8px] uppercase tracking-[0.3em] mb-2 ml-2">Sabías que...</h3>
         {facts.slice(2).map((f, i) => (
           <div key={i} className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
              <p className="text-[9px] font-black text-teal-400 uppercase mb-2">{f.q}</p>
              <p className="text-[10px] text-slate-300 leading-relaxed font-medium">{f.a}</p>
           </div>
         ))}
         
         <div className="bg-orange-500/5 p-5 rounded-[2rem] border border-orange-500/10">
            <p className="text-[9px] font-black text-orange-400 uppercase mb-2">Noticia del Mes</p>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Las nuevas tarifas de luz cambian el próximo mes. Billy analizará tu factura automáticamente para ver si te afecta.</p>
         </div>
      </div>

      <div className="p-4 text-center">
         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">BILLSAVY INTELLIGENCE • 2025</p>
      </div>
    </div>
  );
};

export default ConsumerRights;
