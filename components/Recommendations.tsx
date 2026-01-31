
import React from 'react';
import { AIRecommendation } from '../types';

interface RecommendationsProps {
  recommendations: AIRecommendation[];
  onRefresh: () => void;
  isLoading: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, onRefresh, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Estudio de Mercado BillSavy</h2>
          <p className="text-slate-500 text-sm">Nuestra IA compara tus gastos con las mejores ofertas vigentes en España.</p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm border border-emerald-100 hover:bg-emerald-100 transition-all disabled:opacity-50 shadow-sm"
        >
          <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? 'Analizando mercado...' : 'Refrescar Análisis'}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
           <div className="flex space-x-3 mb-6">
            <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-slate-600 font-bold text-xl animate-pulse">BillSavy está buscando ahorros para ti...</p>
          <p className="text-slate-400 text-sm mt-2">Buscando mejores precios de Luz, Gas y Seguros</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-lg transition-all border-l-8 border-l-emerald-500">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full uppercase tracking-widest">
                  {rec.category}
                </span>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Ahorro Estimado</p>
                  <p className="text-2xl font-bold text-emerald-600">{(rec.currentCost - rec.potentialCost).toFixed(2)}€/mes</p>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">Propuesta de Optimización</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed italic">"{rec.reasoning}"</p>
              
              <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Tu coste actual</span>
                  <span className="font-bold text-slate-800">{rec.currentCost.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-500 font-medium">Tarifa recomendada</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-600 text-lg">{rec.potentialCost.toFixed(2)}€</span>
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">-{(100 - (rec.potentialCost / rec.currentCost * 100)).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                 <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                  {rec.action}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">BillSavy está listo para analizarte</h3>
          <p className="text-slate-500 mt-4 max-w-md mx-auto leading-relaxed">Sube un par de facturas (Luz, Internet o Seguros) para que la inteligencia de BillSavy pueda encontrarte mejores ofertas.</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
