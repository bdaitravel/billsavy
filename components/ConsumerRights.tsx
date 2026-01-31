
import React, { useState, useEffect } from 'react';
import { ConsumerRight } from '../types';
import { getConsumerRights } from '../services/geminiService';

const ConsumerRights: React.FC = () => {
  const [rights, setRights] = useState<ConsumerRight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConsumerRights().then(res => {
      setRights(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start">
        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h3 className="font-bold text-amber-900">Sabías que...</h3>
          <p className="text-amber-700 text-sm">En España, tienes derecho a desistir de cualquier contrato de servicios (luz, internet) en los primeros 14 días sin penalización. ¡Usa este derecho!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white h-48 rounded-3xl animate-pulse border border-slate-100"></div>
          ))
        ) : rights.map((right, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <h4 className="text-lg font-bold text-slate-800 mb-3">{right.title}</h4>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">{right.description}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" /></svg>
              {right.lawReference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerRights;
