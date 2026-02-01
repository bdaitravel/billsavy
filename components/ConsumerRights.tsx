
import React from 'react';

const ConsumerRights: React.FC = () => {
  const tips = [
    { t: "Truco de Potencia", d: "Bajar solo 1kW la potencia contratada de luz te ahorra unos 5€/mes fijos. ¡Pruébalo!" },
    { t: "La Regla de los 15 días", d: "Avisa a tu seguro de coche con 1 mes de antelación para que no te renueven si encuentras algo mejor." },
    { t: "Luz: Horas Valle", d: "Pon la lavadora y lavavajillas de 00h a 08h o fines de semana para pagar la mitad de energía." },
    { t: "Fibra y Móvil", d: "Cada 6 meses llama a tu compañía. Suelen tener ofertas de 'retención' un 30% más baratas." },
    { t: "Seguros de Vida", d: "Si tienes hipoteca, revisa tu seguro de vida. Los bancos suelen cobrar el doble que una aseguradora externa." }
  ];

  return (
    <div className="h-full flex flex-col gap-5 animate-view py-2">
      <div className="bg-teal-500/10 p-6 rounded-[2rem] border border-teal-500/20">
        <h3 className="text-teal-400 font-black text-[9px] uppercase tracking-[0.2em] mb-4">💡 Sabías que...</h3>
        <div className="space-y-4">
          {tips.slice(0, 2).map((c, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] font-black text-white uppercase">{c.t}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-hide">
        <h3 className="text-slate-600 font-black text-[8px] uppercase tracking-[0.3em] mb-4">Guía de Ahorro Billy</h3>
        {tips.slice(2).map((c, i) => (
          <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
             <h4 className="text-[9px] font-black text-teal-400 uppercase mb-1">{c.t}</h4>
             <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-center">
         <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">¿Necesitas ayuda con un gasto?</p>
         <p className="text-[9px] text-white font-black mt-1">hola@billsavy.ai</p>
      </div>
    </div>
  );
};

export default ConsumerRights;
