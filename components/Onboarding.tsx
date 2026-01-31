
import React, { useState } from 'react';

const Onboarding: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Control Total",
      desc: "Billy analiza tus facturas en segundos. Detecta errores, cobros duplicados y te dice dónde se va tu dinero.",
      icon: "⚡",
      color: "text-emerald-500"
    },
    {
      title: "Ahorro Activo",
      desc: "Comparamos el mercado en tiempo real. Si hay una tarifa de luz o seguro más barata, Billy te avisará.",
      icon: "📉",
      color: "text-blue-600"
    },
    {
      title: "Cero Esfuerzo",
      desc: "Saca una foto o sube un PDF. Sin excels, sin papeles. Bienvenido a BILLSAVY.",
      icon: "💎",
      color: "text-slate-900"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6 animate-chic">
      <div className="w-full max-w-lg space-y-12">
        <div className="text-center space-y-6">
          <div className={`text-6xl ${steps[step].color} transition-all duration-300`}>{steps[step].icon}</div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">{steps[step].title}</h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed px-8">"{steps[step].desc}"</p>
        </div>

        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${step === i ? 'w-8 bg-slate-900' : 'w-2 bg-slate-100'}`}></div>
          ))}
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            {step === steps.length - 1 ? 'Empezar ahora' : 'Siguiente'}
          </button>
          
          <button 
            onClick={onClose} 
            className="w-full text-[9px] text-slate-300 font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
          >
            Saltar Introducción
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
