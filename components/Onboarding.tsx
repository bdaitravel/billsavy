
import React, { useState } from 'react';

const steps = [
  {
    title: "Hola, soy BillSavy",
    desc: "Tu nueva forma de entender y reducir tus facturas de casa y coche.",
    icon: "👋",
    bg: "bg-emerald-50"
  },
  {
    title: "Sube tus facturas",
    desc: "Solo haz una foto. Nuestra IA lee el importe, la compañía y cuándo caduca tu contrato.",
    icon: "📸",
    bg: "bg-blue-50"
  },
  {
    title: "Ahorra con Billy",
    desc: "Billy busca ofertas mejores en tiempo real y te avisa antes de que te renueven el seguro.",
    icon: "🤖",
    bg: "bg-amber-50"
  }
];

const Onboarding: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-white max-w-lg w-full rounded-[3rem] overflow-hidden shadow-2xl animate-fade">
        <div className={`h-48 ${steps[current].bg} flex items-center justify-center transition-colors duration-500`}>
          <span className="text-7xl">{steps[current].icon}</span>
        </div>
        <div className="p-10 text-center">
          <h2 className="text-3xl font-black text-slate-800 mb-4">{steps[current].title}</h2>
          <p className="text-slate-500 leading-relaxed mb-10">{steps[current].desc}</p>
          
          <div className="flex justify-center gap-2 mb-10">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${current === i ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-200'}`}></div>
            ))}
          </div>

          <button 
            onClick={() => current === steps.length - 1 ? onClose() : setCurrent(current + 1)}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
          >
            {current === steps.length - 1 ? '¡Vamos allá!' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
