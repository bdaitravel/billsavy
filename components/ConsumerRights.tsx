
import React from 'react';

const ConsumerRights: React.FC = () => {
  const curiosidades = [
    { t: "Portabilidad Eléctrica", d: "Sabías que cambiar de compañía de luz no conlleva cortes de suministro y es totalmente gratuito por ley en España." },
    { t: "El 'Olvido' Bancario", d: "Las comisiones por descubierto deben responder a un servicio real. Si te cobran sin avisar, puedes reclamar el importe íntegro." },
    { t: "Derecho de Desistimiento", d: "Tienes 14 días naturales para cancelar cualquier contrato de servicios firmado online o por teléfono sin dar explicaciones." },
    { t: "Permanencias Máximas", d: "En telecomunicaciones, las permanencias no pueden ser superiores a 24 meses y deben ser prorrateables si te vas antes." }
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-view">
      <div className="bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-500/20">
        <h3 className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em] mb-4">¿Sabías que...?</h3>
        <div className="space-y-4">
          {curiosidades.slice(0, 2).map((c, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[9px] font-black text-white uppercase">{c.t}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <h3 className="text-slate-500 font-black text-[9px] uppercase tracking-[0.3em]">Guía Legal BillSavy</h3>
        {curiosidades.slice(2).map((c, i) => (
          <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
             <h4 className="text-[9px] font-black text-emerald-500 uppercase mb-1">{c.t}</h4>
             <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-navy border border-white/5 rounded-2xl text-center">
         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">¿Duda legal urgente?</p>
         <p className="text-[9px] text-white font-black mt-1">legal@billsavy.ai</p>
      </div>
    </div>
  );
};

export default ConsumerRights;
