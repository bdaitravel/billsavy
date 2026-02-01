
import React from 'react';
import { AIRecommendation } from '../types';

interface RecommendationsProps {
  recommendations: AIRecommendation[];
  onRefresh: () => void;
  isLoading: boolean;
  userCity?: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, onRefresh, isLoading, userCity }) => {
  return (
    <div className="h-full flex flex-col gap-6 animate-fade py-1">
      
      {/* City Context Card */}
      <div className="bg-teal-900/10 border border-teal-500/20 p-6 rounded-[2.5rem] relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block mb-2">Monitor {userCity || 'España'}</span>
          <p className="text-sm font-bold text-white leading-tight">En {userCity || 'tu ciudad'} los usuarios ahorran un 22% al auditar sus seguros de coche.</p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">🏙️</div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Plan de Ahorro IA</h2>
        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">Billy ha analizado 120 tarifas este minuto</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-hide">
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
              <button className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                {rec.action}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white/2 rounded-[2.5rem] border border-dashed border-white/10 px-10">
            <div className="text-4xl mb-4 grayscale opacity-40">📥</div>
            <p className="text-[10px] font-black text-slate-500 uppercase text-center leading-loose">
              Sin datos suficientes. Sube facturas en la pestaña de Inicio para generar recomendaciones personalizadas para {userCity || 'tu zona'}.
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={onRefresh}
        className="w-full py-5 bg-white/5 text-teal-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 active:scale-95 transition-all"
      >
        Recalcular Ahorro
      </button>
    </div>
  );
};

export default Recommendations;
