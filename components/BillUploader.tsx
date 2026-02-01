
import React, { useState, useRef } from 'react';
import { Asset, Category, Expense, AuditStatus } from '../types';
import { analyzeBillImage } from '../services/geminiService';

interface BillUploaderProps {
  assets: Asset[];
  onComplete: (expense: Expense) => void;
  onCancel: () => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ assets, onComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeBillImage(base64String, file.type);
        setAuditResult(result);
      } catch (err) {
        console.error(err);
        alert("Error en el análisis legal. Asegúrate de que el documento es legible.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmExpense = () => {
    if (!auditResult) return;
    onComplete({
      id: Math.random().toString(),
      provider: auditResult.provider,
      amount: auditResult.amount,
      date: auditResult.date,
      category: auditResult.category as Category,
      assetId: assets[0]?.id,
      description: auditResult.summary,
      isRecurring: true,
      source: 'manual',
      auditStatus: auditResult.auditStatus as AuditStatus,
      auditDetail: auditResult.auditDetail
    });
  };

  if (auditResult) {
    const isAbusive = auditResult.auditStatus === 'ABUSIVO';
    return (
      <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-md animate-pop shadow-2xl overflow-y-auto max-h-[80vh]">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-2xl ${isAbusive ? 'bg-red-500/20 text-red-500 shadow-red-500/20' : 'bg-teal-500/20 text-teal-500 shadow-teal-500/20'}`}>
            {isAbusive ? '⚖️' : '✨'}
          </div>
          <h2 className={`text-xl font-black uppercase tracking-tighter ${isAbusive ? 'text-red-500' : 'text-teal-400'}`}>
            VEREDICTO LEGAL: {auditResult.auditStatus}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{auditResult.category}</span>
               <span className="text-lg font-black text-white">{auditResult.amount}€</span>
            </div>
            <p className="text-[11px] font-bold text-white uppercase mb-1">{auditResult.provider}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase">{auditResult.date}</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-teal-500/10">
            <span className="text-[8px] font-black text-teal-400 uppercase block mb-2 tracking-widest">Análisis del Experto:</span>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-4">"{auditResult.auditDetail}"</p>
            
            <div className="h-px bg-white/5 w-full my-4"></div>
            
            <span className="text-[8px] font-black text-orange-400 uppercase block mb-2 tracking-widest">Plan de Acción Sugerido:</span>
            <p className="text-[10px] text-white font-bold leading-relaxed italic">"💡 {auditResult.actionPlan}"</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={confirmExpense}
            className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Guardar en mi Historial
          </button>
          <button 
            onClick={() => { setAuditResult(null); setFile(null); }}
            className="w-full py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest"
          >
            Descartar y Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-md text-center animate-pop relative shadow-2xl">
      <button onClick={onCancel} className="absolute top-6 left-6 text-slate-500 p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">🏛️</div>
      <h3 className="text-xl font-black mb-2 uppercase tracking-tighter">Auditoría Legal 2.0</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed px-4">
        Billy analizará Hipotecas, Seguros y Facturas buscando cláusulas abusivas y precios injustos.
      </p>
      
      <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} ref={fileInputRef} className="hidden" />
      
      {!file ? (
        <button onClick={() => fileInputRef.current?.click()} className="w-full py-16 border-2 border-dashed border-white/10 rounded-[2.5rem] text-[10px] font-black uppercase text-slate-500 bg-white/5 active:scale-95 transition-all">
          Saca foto de tu Factura, Póliza o Hipoteca
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 truncate text-[10px] text-teal-400 font-bold uppercase">
             {file.name}
          </div>
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-5 bg-teal-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl animate-latent"
          >
            {isScanning ? 'Billy está analizando la ley...' : 'Iniciar Auditoría Senior'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BillUploader;
