
import React, { useState } from 'react';

const steps = [
  {
    title: "Toma el Control Autónomo",
    desc: "BillSavy no es una app de gastos. Es tu CFO personal que monitoriza el mercado 24/7 para que tú no tengas que hacerlo.",
    badge: "VISION",
    img: "🚀"
  },
  {
    title: "Arbitraje de Mercado",
    desc: "Nuestra IA no solo lee tus facturas; las enfrenta a las mejores ofertas en tiempo real. Si hay algo mejor, Billy lo encuentra.",
    badge: "PODER",
    img: "⚖️"
  },
  {
    title: "Crecimiento del Patrimonio",
    desc: "Cada euro ahorrado es un euro invertido. Convierte tus gastos domésticos en capital para tu futuro.",
    badge: "RIQUEZA",
    img: "💰"
  }
];

const Onboarding: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/90 backdrop-blur-3xl flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-[4rem] overflow-hidden shadow-2xl animate-fintech grid grid-cols-1 md:grid-cols-2">
        <div className="bg-slate-900 p-12 flex flex-col justify-between text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-emerald-500 text-[10px] font-black rounded-full mb-6 tracking-widest">{steps[current].badge}</span>
            <div className="text-8xl mb-12 drop-shadow-2xl">{steps[current].img}</div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6 leading-tight">{steps[current].title}</h2>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${current === i ? 'w-12 bg-emerald-500' : 'w-4 bg-slate-700'}`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-12 md:p-16 flex flex-col justify-center bg-white">
          <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium">"{steps[current].desc}"</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => current === steps.length - 1 ? onClose() : setCurrent(current + 1)}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl"
            >
              {current === steps.length - 1 ? 'Iniciar Sistema Autónomo' : 'Continuar'}
            </button>
            {current < steps.length - 1 && (
              <button onClick={onClose} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900">Omitir</button>
            )}
          </div>
          
          <p className="mt-12 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">Protocolo de Seguridad BillSavy v3.1 Activado</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
