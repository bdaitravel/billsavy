
import React, { useState, useRef } from 'react';
import { Asset, Category, Expense } from '../types';
import { analyzeBillImage } from '../services/geminiService';

interface BillUploaderProps {
  assets: Asset[];
  onComplete: (expense: Expense) => void;
  onCancel: () => void;
}

const BillUploader: React.FC<BillUploaderProps> = ({ assets, onComplete, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeBillImage(base64String);
        onComplete({
          id: Math.random().toString(),
          provider: result.provider,
          amount: result.amount,
          date: result.date,
          category: result.category as Category,
          assetId: assets[0]?.id,
          description: result.summary,
          isRecurring: true,
          source: 'manual'
        });
      } catch (err) {
        alert("Error analizando factura.");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] w-full max-w-md text-center animate-pop relative">
      {/* Botón Volver Interno */}
      <button 
        onClick={onCancel}
        className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="w-16 h-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">📸</div>
      <h3 className="text-xl font-black mb-2 uppercase">Subir Documento</h3>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">Saca una foto o sube un PDF para que Billy lo analice.</p>
      
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} ref={fileInputRef} className="hidden" />
      
      {!file ? (
        <button onClick={() => fileInputRef.current?.click()} className="w-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-[10px] font-black uppercase text-slate-400 hover:border-teal-500 transition-all bg-white/2">
          Seleccionar Archivo
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 truncate text-[10px] text-teal-400 font-bold uppercase">
             {file.name}
          </div>
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-teal-500/20"
          >
            {isScanning ? 'Procesando...' : 'Iniciar Análisis IA'}
          </button>
          <button 
            onClick={() => setFile(null)}
            className="text-[8px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Cambiar archivo
          </button>
        </div>
      )}
    </div>
  );
};

export default BillUploader;
