
import React, { useState } from 'react';
import { AIRecommendation } from '../types';

interface RecommendationsProps {
  recommendations: AIRecommendation[];
  onRefresh: () => void;
  isLoading: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, onRefresh, isLoading }) => {
  const facts = [
    { country: "🇩🇪 Alemania", fact: "Las familias revisan seguros cada 6 meses, ahorrando hasta 450€ anuales." },
    { country: "🇯🇵 Japón", fact: "El uso de enchufes inteligentes reduce el consumo vampiro en un 12%." },
    { country: "🇳🇴 Noruega", fact: "La digitalización total de facturas permite detectar un 8% de errores de facturación." }
  ];

  return (
    <div className="h-full flex flex-col gap-5 overflow-hidden animate-fade py-1">
      
      {/* Financial Wisdom (Sabías que...) */}
      <div className="bg-teal-950/20 border border-teal-900/30 p-4 rounded-3xl flex items-center gap-4">
        <div className="w-10 h-10 bg-teal-500/10 rounded-2xl flex items-center justify-center text-xl shadow-inner">💡</div>
        <div className="flex-1">
          <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest">Sabiduría Global: {facts[0].country}</span>
          <p className="text-[10px] text-slate-300 font-medium leading-tight mt-1">{facts[0].fact}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Plan de Ahorro IA</h2>
        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">Billy ha escaneado 42 comercializadoras por ti</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-60">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Billy está comparando el mercado...</p>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, i) => (
            <div key={i} className="bg-white/5 rounded-[2rem] p-5 border border-white/5 group hover:border-teal-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[8px] font-black px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full uppercase border border-teal-500/20">{rec.category}</span>
                <div className="text-right">
                  <p className="text-lg font-black text-teal-400">-{ (rec.currentCost - rec.potentialCost).toFixed(0) }€</p>
                  <p className="text-[7px] text-slate-500 font-black uppercase">Mes</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed mb-5">"{rec.reasoning}"</p>
              <button className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-teal-500 shadow-xl transition-all active:scale-95">
                {rec.action}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white/2 rounded-[2rem] border border-dashed border-white/5">
            <div className="text-4xl mb-4 grayscale opacity-40">📸</div>
            <p className="text-[9px] font-black text-slate-500 uppercase text-center px-12 leading-loose">
              Sube una factura o contrato en la pantalla de inicio para que Billy pueda auditar tus gastos.
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className="w-full py-4 bg-white/5 text-teal-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all"
      >
        Actualizar Comparativa
      </button>
    </div>
  );
};

export default Recommendations;
